import type { PlatformPost, Post } from '#layers/BaseDB/db/schema'
import type {
  PaginatedResponse,
  QueryOptions,
  ServiceResponse
} from './types'
import { and, eq, gte, lte, sql } from 'drizzle-orm'
import { platformPosts, posts } from '#layers/BaseDB/db/schema'
import { useDrizzle } from '#layers/BaseDB/server/utils/drizzle'
import {
  ValidationError
} from './types'

export interface CreatePostData {
  businessId: string
  content: string
  mediaAssets?: string[]
  scheduledAt?: Date
  targetPlatforms: string[] // Array of social account IDs
}

export interface UpdatePostData {
  content?: string
  mediaAssets?: string[]
  scheduledAt?: Date
  targetPlatforms?: string[]
  status?: 'draft' | 'scheduled' | 'published' | 'failed'
}

export interface PostWithPlatforms extends Post {
  platformPosts?: PlatformPost[]
}

export interface CreatePlatformPostData {
  postId: string
  socialAccountId: string
  platformPostId?: string
  status?: 'pending' | 'published' | 'failed'
  errorMessage?: string
}

export class PostService {
  private db = useDrizzle()

  async create(userId: string, data: CreatePostData): Promise<ServiceResponse<Post>> {
    try {
      this.validateCreateData(data)

      const id = crypto.randomUUID()
      const now = new Date()

      // Determine initial status
      let status: 'draft' | 'scheduled' = 'draft'
      if (data.scheduledAt && data.scheduledAt > now) {
        status = 'scheduled'
      }

      const [post] = await this.db.insert(posts).values({
        id,
        userId,
        businessId: data.businessId,
        content: data.content,
        mediaAssets: data.mediaAssets ? JSON.stringify(data.mediaAssets) : null,
        scheduledAt: data.scheduledAt,
        targetPlatforms: JSON.stringify(data.targetPlatforms),
        status,
        createdAt: now,
        updatedAt: now
      }).returning()

      // Create platform post entries
      if (data.targetPlatforms.length > 0) {
        const platformPostData = data.targetPlatforms.map(accountId => ({
          id: crypto.randomUUID(),
          postId: id,
          socialAccountId: accountId,
          status: 'pending' as const,
          createdAt: now
        }))

        await this.db.insert(platformPosts).values(platformPostData)
      }

      return { success: true, data: post }
    } catch (error) {
      if (error instanceof ValidationError) {
        return { success: false, error: error.message, code: error.code }
      }
      return { success: false, error: 'Failed to create post' }
    }
  }

  async findById(id: string, userId: string, includePlatforms: boolean = false): Promise<ServiceResponse<PostWithPlatforms>> {
    try {
      const [post] = await this.db
        .select()
        .from(posts)
        .where(and(eq(posts.id, id), eq(posts.userId, userId)))
        .limit(1)

      if (!post) {
        return { success: false, error: 'Post not found', code: 'NOT_FOUND' }
      }

      const result: PostWithPlatforms = post

      if (includePlatforms) {
        const platforms = await this.db
          .select()
          .from(platformPosts)
          .where(eq(platformPosts.postId, id))

        result.platformPosts = platforms
      }

      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: 'Failed to fetch post' }
    }
  }

  async findByBusinessId(businessId: string, userId: string, options: QueryOptions = {}): Promise<PaginatedResponse<PostWithPlatforms>> {
    try {
      const { pagination = { page: 1, limit: 10 }, filters = {} } = options
      const offset = ((pagination.page || 1) - 1) * (pagination.limit || 10)

      let whereConditions = and(
        eq(posts.businessId, businessId),
        eq(posts.userId, userId)
      )

      // Apply status filter if provided
      if (filters.status) {
        whereConditions = and(whereConditions, eq(posts.status, filters.status))
      }

      // Apply date range filters
      if (filters.startDate) {
        whereConditions = and(whereConditions, gte(posts.createdAt, new Date(filters.startDate)))
      }
      if (filters.endDate) {
        whereConditions = and(whereConditions, lte(posts.createdAt, new Date(filters.endDate)))
      }

      const postList = await this.db
        .select()
        .from(posts)
        .where(whereConditions)
        .limit(pagination.limit || 10)
        .offset(offset)
        .orderBy(sql`${posts.createdAt} DESC`)

      // Get platform posts for each post
      const postsWithPlatforms: PostWithPlatforms[] = []
      for (const post of postList) {
        const platforms = await this.db
          .select()
          .from(platformPosts)
          .where(eq(platformPosts.postId, post.id))

        postsWithPlatforms.push({
          ...post,
          platformPosts: platforms
        })
      }

      // Get total count for pagination
      const result = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .where(whereConditions)

      const count = result[0]?.count || 0


      return {
        success: true,
        data: postsWithPlatforms,
        pagination: {
          page: pagination.page || 1,
          limit: pagination.limit || 10,
          total: count,
          totalPages: Math.ceil(count / (pagination.limit || 10))
        }
      }
    } catch (error) {
      return { success: false, error: 'Failed to fetch posts' }
    }
  }

  async findScheduledPosts(beforeDate?: Date): Promise<ServiceResponse<Post[]>> {
    try {
      const cutoffDate = beforeDate || new Date()

      const scheduledPosts = await this.db
        .select()
        .from(posts)
        .where(and(
          eq(posts.status, 'scheduled'),
          lte(posts.scheduledAt, cutoffDate)
        ))
        .orderBy(posts.scheduledAt)

      return { success: true, data: scheduledPosts }
    } catch (error) {
      return { success: false, error: 'Failed to fetch scheduled posts' }
    }
  }

  async update(id: string, userId: string, data: UpdatePostData): Promise<ServiceResponse<Post>> {
    try {
      // Check if post exists and belongs to user
      const existingResult = await this.findById(id, userId)
      if (!existingResult.success) {
        return existingResult
      }

      const updateData: any = {
        ...data,
        updatedAt: new Date()
      }

      // Handle JSON fields
      if (data.mediaAssets !== undefined) {
        updateData.mediaAssets = data.mediaAssets ? JSON.stringify(data.mediaAssets) : null
      }
      if (data.targetPlatforms !== undefined) {
        updateData.targetPlatforms = JSON.stringify(data.targetPlatforms)
      }

      const [updated] = await this.db
        .update(posts)
        .set(updateData)
        .where(and(eq(posts.id, id), eq(posts.userId, userId)))
        .returning()

      // Update platform posts if target platforms changed
      if (data.targetPlatforms) {
        // Remove existing platform posts
        await this.db
          .delete(platformPosts)
          .where(eq(platformPosts.postId, id))

        // Create new platform posts
        if (data.targetPlatforms.length > 0) {
          const platformPostData = data.targetPlatforms.map(accountId => ({
            id: crypto.randomUUID(),
            postId: id,
            socialAccountId: accountId,
            status: 'pending' as const,
            createdAt: new Date()
          }))

          await this.db.insert(platformPosts).values(platformPostData)
        }
      }

      return { success: true, data: updated }
    } catch (error) {
      return { success: false, error: 'Failed to update post' }
    }
  }

  async updateStatus(id: string, userId: string, status: 'draft' | 'scheduled' | 'published' | 'failed'): Promise<ServiceResponse<Post>> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date()
      }

      if (status === 'published') {
        updateData.publishedAt = new Date()
      }

      const [updated] = await this.db
        .update(posts)
        .set(updateData)
        .where(and(eq(posts.id, id), eq(posts.userId, userId)))
        .returning()

      if (!updated) {
        return { success: false, error: 'Post not found', code: 'NOT_FOUND' }
      }

      return { success: true, data: updated }
    } catch (error) {
      return { success: false, error: 'Failed to update post status' }
    }
  }

  async delete(id: string, userId: string): Promise<ServiceResponse<void>> {
    try {
      // Check if post exists and belongs to user
      const existingResult = await this.findById(id, userId)
      if (!existingResult.success) {
        return { success: false, error: existingResult.error, code: existingResult.code }
      }

      // Delete platform posts first (cascade should handle this, but being explicit)
      await this.db
        .delete(platformPosts)
        .where(eq(platformPosts.postId, id))

      // Delete the post
      await this.db
        .delete(posts)
        .where(and(eq(posts.id, id), eq(posts.userId, userId)))

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete post' }
    }
  }

  // Platform post management
  async updatePlatformPost(id: string, data: Partial<CreatePlatformPostData>): Promise<ServiceResponse<PlatformPost>> {
    try {
      const [updated] = await this.db
        .update(platformPosts)
        .set({
          ...data,
          publishedAt: data.status === 'published' ? new Date() : undefined
        })
        .where(eq(platformPosts.id, id))
        .returning()

      if (!updated) {
        return { success: false, error: 'Platform post not found', code: 'NOT_FOUND' }
      }

      return { success: true, data: updated }
    } catch (error) {
      return { success: false, error: 'Failed to update platform post' }
    }
  }

  async getPlatformPostsByPost(postId: string): Promise<ServiceResponse<PlatformPost[]>> {
    try {
      const platforms = await this.db
        .select()
        .from(platformPosts)
        .where(eq(platformPosts.postId, postId))

      return { success: true, data: platforms }
    } catch (error) {
      return { success: false, error: 'Failed to fetch platform posts' }
    }
  }

  async retryFailedPost(id: string, userId: string): Promise<ServiceResponse<PostWithPlatforms>> {
    try {
      // Get the post with platform posts
      const postResult = await this.findById(id, userId, true)
      if (!postResult.success) {
        return postResult
      }

      const post = postResult.data!

      // Check if post can be retried
      if (post.status !== 'failed' && !post.platformPosts?.some(p => p.status === 'failed')) {
        return {
          success: false,
          error: 'Post does not have any failed publishing attempts to retry',
          code: 'INVALID_STATUS'
        }
      }

      // Reset post status if it was failed
      if (post.status === 'failed') {
        const updateResult = await this.updateStatus(id, userId, 'scheduled')
        if (!updateResult.success) {
          return { success: false, error: updateResult.error }
        }
      }

      // Reset failed platform posts to pending
      if (post.platformPosts) {
        for (const platformPost of post.platformPosts) {
          if (platformPost.status === 'failed') {
            await this.updatePlatformPost(platformPost.id, {
              status: 'pending',
              errorMessage: undefined
            })
          }
        }
      }

      // Return updated post
      return await this.findById(id, userId, true)
    } catch (error) {
      return { success: false, error: 'Failed to retry post' }
    }
  }

  async getPostStats(businessId: string, userId: string, filters: { startDate?: string; endDate?: string } = {}): Promise<ServiceResponse<any>> {
    try {
      // Get all posts for the business
      const postsResult = await this.findByBusinessId(businessId, userId, {
        pagination: { page: 1, limit: 1000 }, // Get all posts for stats
        filters
      })

      if (!postsResult.success) {
        return { success: false, error: postsResult.error }
      }

      const posts = postsResult.data || []

      // Calculate statistics
      const stats = {
        total: posts.length,
        byStatus: {
          draft: posts.filter(p => p.status === 'draft').length,
          scheduled: posts.filter(p => p.status === 'scheduled').length,
          published: posts.filter(p => p.status === 'published').length,
          failed: posts.filter(p => p.status === 'failed').length
        },
        platformStats: {} as Record<string, { total: number; published: number; failed: number }>,
        recentActivity: {
          publishedToday: 0,
          scheduledNext7Days: 0,
          failedLast24Hours: 0
        },
        engagement: {
          totalPlatformPosts: 0,
          successfulPosts: 0,
          failedPosts: 0,
          successRate: 0
        }
      }

      // Calculate date ranges for recent activity
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      // Process each post for detailed statistics
      for (const post of posts) {
        // Recent activity calculations
        if (post.publishedAt && post.publishedAt >= today) {
          stats.recentActivity.publishedToday++
        }

        if (post.status === 'scheduled' && post.scheduledAt && post.scheduledAt <= next7Days) {
          stats.recentActivity.scheduledNext7Days++
        }

        if (post.status === 'failed' && post.updatedAt >= last24Hours) {
          stats.recentActivity.failedLast24Hours++
        }

        // Platform statistics
        if (post.platformPosts) {
          for (const platformPost of post.platformPosts) {
            stats.engagement.totalPlatformPosts++

            if (platformPost.status === 'published') {
              stats.engagement.successfulPosts++
            } else if (platformPost.status === 'failed') {
              stats.engagement.failedPosts++
            }

            // Group by social account (platform)
            const accountId = platformPost.socialAccountId
            if (!stats.platformStats[accountId]) {
              stats.platformStats[accountId] = { total: 0, published: 0, failed: 0 }
            }

            stats.platformStats[accountId].total++
            if (platformPost.status === 'published') {
              stats.platformStats[accountId].published++
            } else if (platformPost.status === 'failed') {
              stats.platformStats[accountId].failed++
            }
          }
        }
      }

      // Calculate success rate
      if (stats.engagement.totalPlatformPosts > 0) {
        stats.engagement.successRate = Math.round(
          (stats.engagement.successfulPosts / stats.engagement.totalPlatformPosts) * 100
        )
      }

      return { success: true, data: stats }
    } catch (error) {
      return { success: false, error: 'Failed to calculate post statistics' }
    }
  }

  private validateCreateData(data: CreatePostData): void {
    if (!data.businessId || data.businessId.trim().length === 0) {
      throw new ValidationError('Business ID is required', 'businessId')
    }

    if (!data.content || data.content.trim().length === 0) {
      throw new ValidationError('Post content is required', 'content')
    }

    if (data.content.length > 2000) {
      throw new ValidationError('Post content must be less than 2000 characters', 'content')
    }

    if (!data.targetPlatforms || data.targetPlatforms.length === 0) {
      throw new ValidationError('At least one target platform is required', 'targetPlatforms')
    }

    if (data.scheduledAt && data.scheduledAt <= new Date()) {
      throw new ValidationError('Scheduled time must be in the future', 'scheduledAt')
    }
  }
}

export const postService = new PostService()
