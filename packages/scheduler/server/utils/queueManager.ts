/**
 * Queue Management System for Scheduled Posts
 *
 * Handles background job processing for scheduled posts with retry mechanisms
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 */

import type { PlatformPost, Post } from "#layers/BaseDB/db/schema"
import { postService } from "#layers/BaseDB/server/services/post.service"
import { socialMediaAccountService } from "#layers/BaseDB/server/services/social-media-account.service"
import type { PostContent } from "#layers/BaseDB/server/services/types"

export interface QueueJob {
  id: string
  type: 'publish_post' | 'retry_failed_post'
  postId: string
  platformPostId?: string
  scheduledAt: Date
  attempts: number
  maxAttempts: number
  lastError?: string
  createdAt: Date
  updatedAt: Date
}

export interface QueueStats {
  pending: number
  processing: number
  completed: number
  failed: number
  totalJobs: number
}

export interface ProcessingResult {
  success: boolean
  jobId: string
  postId: string
  platformPostId?: string
  error?: string
  shouldRetry: boolean
}

/**
 * In-memory queue manager (in production, use Redis or similar)
 */
class QueueManager {
  private jobs: Map<string, QueueJob> = new Map()
  private processing: Set<string> = new Set()
  private isRunning: boolean = false
  private processingInterval?: NodeJS.Timeout
  private readonly PROCESSING_INTERVAL_MS = 30000 // 30 seconds
  private readonly MAX_CONCURRENT_JOBS = 5

  /**
   * Start the queue processor
   */
  start(): void {
    if (this.isRunning) return

    this.isRunning = true
    this.processingInterval = setInterval(() => {
      this.processQueue()
    }, this.PROCESSING_INTERVAL_MS)

    console.log('Queue manager started')
  }

  /**
   * Stop the queue processor
   */
  stop(): void {
    if (!this.isRunning) return

    this.isRunning = false
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = undefined
    }

    console.log('Queue manager stopped')
  }

  /**
   * Add a job to the queue
   */
  addJob(job: Omit<QueueJob, 'id' | 'createdAt' | 'updatedAt'>): string {
    const jobId = crypto.randomUUID()
    const now = new Date()

    const queueJob: QueueJob = {
      ...job,
      id: jobId,
      createdAt: now,
      updatedAt: now
    }

    this.jobs.set(jobId, queueJob)
    console.log(`Job ${jobId} added to queue for post ${job.postId}`)

    return jobId
  }

  /**
   * Schedule a post for publishing
   */
  schedulePost(postId: string, scheduledAt: Date): string {
    return this.addJob({
      type: 'publish_post',
      postId,
      scheduledAt,
      attempts: 0,
      maxAttempts: 3
    })
  }

  /**
   * Schedule a retry for a failed post
   */
  scheduleRetry(postId: string, platformPostId: string, lastError: string): string {
    return this.addJob({
      type: 'retry_failed_post',
      postId,
      platformPostId,
      scheduledAt: new Date(Date.now() + 5 * 60 * 1000), // Retry in 5 minutes
      attempts: 0,
      maxAttempts: 2,
      lastError
    })
  }

  /**
   * Get jobs ready for processing
   */
  private getReadyJobs(): QueueJob[] {
    const now = new Date()
    const readyJobs: QueueJob[] = []

    for (const job of this.jobs.values()) {
      if (
        job.scheduledAt <= now &&
        !this.processing.has(job.id) &&
        job.attempts < job.maxAttempts
      ) {
        readyJobs.push(job)
      }
    }

    return readyJobs.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
  }

  /**
   * Process the queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing.size >= this.MAX_CONCURRENT_JOBS) {
      return
    }

    const readyJobs = this.getReadyJobs()
    const availableSlots = this.MAX_CONCURRENT_JOBS - this.processing.size
    const jobsToProcess = readyJobs.slice(0, availableSlots)

    for (const job of jobsToProcess) {
      this.processJob(job).catch(error => {
        console.error(`Error processing job ${job.id}:`, error)
      })
    }
  }

  /**
   * Process a single job
   */
  private async processJob(job: QueueJob): Promise<void> {
    this.processing.add(job.id)
    job.attempts++
    job.updatedAt = new Date()

    console.log(`Processing job ${job.id} (attempt ${job.attempts}/${job.maxAttempts})`)

    try {
      let result: ProcessingResult

      switch (job.type) {
        case 'publish_post':
          result = await this.processPublishJob(job)
          break
        case 'retry_failed_post':
          result = await this.processRetryJob(job)
          break
        default:
          throw new Error(`Unknown job type: ${(job as any).type}`)
      }

      await this.handleJobResult(job, result)
    } catch (error: any) {
      console.error(`Job ${job.id} failed:`, error)
      await this.handleJobFailure(job, error.message)
    } finally {
      this.processing.delete(job.id)
    }
  }

  /**
   * Process a publish job
   */
  private async processPublishJob(job: QueueJob): Promise<ProcessingResult> {
    // Get the post
    const postResult = await postService.findById(job.postId, '', true)
    if (!postResult.success || !postResult.data) {
      return {
        success: false,
        jobId: job.id,
        postId: job.postId,
        error: 'Post not found',
        shouldRetry: false
      }
    }

    const post = postResult.data
    const platformPosts = post.platformPosts || []

    // Update post status to publishing
    await postService.updateStatus(job.postId, post.userId, 'published')

    let allSuccessful = true
    let hasRetryableFailures = false

    // Process each platform post
    for (const platformPost of platformPosts) {
      if (platformPost.status !== 'pending') continue

      try {
        const publishResult = await this.publishToPlatform(post, platformPost)

        if (publishResult.success) {
          await postService.updatePlatformPost(platformPost.id, {
            status: 'published',
            platformPostId: publishResult.platformPostId,
            publishedAt: new Date()
          })
        } else {
          await postService.updatePlatformPost(platformPost.id, {
            status: 'failed',
            errorMessage: publishResult.error
          })

          allSuccessful = false
          if (publishResult.retryable) {
            hasRetryableFailures = true
          }
        }
      } catch (error: any) {
        await postService.updatePlatformPost(platformPost.id, {
          status: 'failed',
          errorMessage: error.message
        })
        allSuccessful = false
        hasRetryableFailures = true
      }
    }

    // Update overall post status
    if (allSuccessful) {
      await postService.updateStatus(job.postId, post.userId, 'published')
    } else {
      await postService.updateStatus(job.postId, post.userId, 'failed')
    }

    return {
      success: allSuccessful,
      jobId: job.id,
      postId: job.postId,
      error: allSuccessful ? undefined : 'Some platforms failed to publish',
      shouldRetry: hasRetryableFailures
    }
  }

  /**
   * Process a retry job
   */
  private async processRetryJob(job: QueueJob): Promise<ProcessingResult> {
    if (!job.platformPostId) {
      return {
        success: false,
        jobId: job.id,
        postId: job.postId,
        error: 'Platform post ID not provided for retry',
        shouldRetry: false
      }
    }

    // Get the post and platform post
    const postResult = await postService.findById(job.postId, '', true)
    if (!postResult.success || !postResult.data) {
      return {
        success: false,
        jobId: job.id,
        postId: job.postId,
        error: 'Post not found',
        shouldRetry: false
      }
    }

    const post = postResult.data
    const platformPost = post.platformPosts?.find(p => p.id === job.platformPostId)

    if (!platformPost || platformPost.status !== 'failed') {
      return {
        success: false,
        jobId: job.id,
        postId: job.postId,
        error: 'Platform post not found or not in failed state',
        shouldRetry: false
      }
    }

    try {
      const publishResult = await this.publishToPlatform(post, platformPost)

      if (publishResult.success) {
        await postService.updatePlatformPost(platformPost.id, {
          status: 'published',
          platformPostId: publishResult.platformPostId,
          errorMessage: null,
          publishedAt: new Date()
        })

        // Check if all platform posts are now successful
        const updatedPostResult = await postService.findById(job.postId, '', true)
        if (updatedPostResult.success && updatedPostResult.data) {
          const allPlatformPosts = updatedPostResult.data.platformPosts || []
          const allSuccessful = allPlatformPosts.every(p => p.status === 'published')

          if (allSuccessful) {
            await postService.updateStatus(job.postId, post.userId, 'published')
          }
        }

        return {
          success: true,
          jobId: job.id,
          postId: job.postId,
          platformPostId: publishResult.platformPostId,
          shouldRetry: false
        }
      } else {
        await postService.updatePlatformPost(platformPost.id, {
          errorMessage: publishResult.error
        })

        return {
          success: false,
          jobId: job.id,
          postId: job.postId,
          error: publishResult.error,
          shouldRetry: publishResult.retryable || false
        }
      }
    } catch (error: any) {
      await postService.updatePlatformPost(platformPost.id, {
        errorMessage: error.message
      })

      return {
        success: false,
        jobId: job.id,
        postId: job.postId,
        error: error.message,
        shouldRetry: true
      }
    }
  }

  /**
   * Publish to a specific platform
   */
  private async publishToPlatform(post: Post, platformPost: PlatformPost) {
    // Get the social media account
    const account = await socialMediaAccountService.getAccountById(platformPost.socialAccountId)
    if (!account) {
      throw new Error('Social media account not found')
    }

    // Prepare content
    const content: PostContent = {
      text: post.content,
      mediaUrls: post.mediaAssets ? JSON.parse(post.mediaAssets) : undefined,
      scheduledAt: post.scheduledAt || undefined
    }

    // Validate and format content for the platform
    const validation = validateContentForPlatform(account.platform, content)
    if (!validation.isValid) {
      throw new Error(`Content validation failed: ${validation.errors.join(', ')}`)
    }

    const formattedContent = formatContentForPlatform(account.platform, content, {
      truncateText: true,
      addEllipsis: true,
      preserveHashtags: true,
      preserveMentions: true,
      optimizeForEngagement: true
    })

    // Publish to platform
    return await PublishingService.publishToAccount(account, formattedContent)
  }

  /**
   * Handle job result
   */
  private async handleJobResult(job: QueueJob, result: ProcessingResult): Promise<void> {
    if (result.success) {
      console.log(`Job ${job.id} completed successfully`)
      this.jobs.delete(job.id)
    } else {
      console.log(`Job ${job.id} failed: ${result.error}`)

      if (job.attempts >= job.maxAttempts) {
        console.log(`Job ${job.id} exceeded max attempts, removing from queue`)
        this.jobs.delete(job.id)
      } else if (result.shouldRetry) {
        // Schedule retry with exponential backoff
        const retryDelay = Math.pow(2, job.attempts) * 60 * 1000 // 1min, 2min, 4min, etc.
        job.scheduledAt = new Date(Date.now() + retryDelay)
        job.lastError = result.error
        console.log(`Job ${job.id} scheduled for retry in ${retryDelay / 1000} seconds`)
      } else {
        console.log(`Job ${job.id} failed permanently, removing from queue`)
        this.jobs.delete(job.id)
      }
    }
  }

  /**
   * Handle job failure
   */
  private async handleJobFailure(job: QueueJob, error: string): Promise<void> {
    job.lastError = error

    if (job.attempts >= job.maxAttempts) {
      console.log(`Job ${job.id} exceeded max attempts after error, removing from queue`)
      this.jobs.delete(job.id)
    } else {
      // Schedule retry with exponential backoff
      const retryDelay = Math.pow(2, job.attempts) * 60 * 1000
      job.scheduledAt = new Date(Date.now() + retryDelay)
      console.log(`Job ${job.id} scheduled for retry after error in ${retryDelay / 1000} seconds`)
    }
  }

  /**
   * Get queue statistics
   */
  getStats(): QueueStats {
    const jobs = Array.from(this.jobs.values())
    const now = new Date()

    return {
      pending: jobs.filter(j => j.scheduledAt > now && j.attempts < j.maxAttempts).length,
      processing: this.processing.size,
      completed: 0, // Completed jobs are removed from memory
      failed: jobs.filter(j => j.attempts >= j.maxAttempts).length,
      totalJobs: jobs.length
    }
  }

  /**
   * Get all jobs (for debugging)
   */
  getAllJobs(): QueueJob[] {
    return Array.from(this.jobs.values())
  }

  /**
   * Remove a job from the queue
   */
  removeJob(jobId: string): boolean {
    return this.jobs.delete(jobId)
  }

  /**
   * Clear all jobs
   */
  clearQueue(): void {
    this.jobs.clear()
    this.processing.clear()
  }

  /**
   * Process scheduled posts immediately (for testing or manual trigger)
   */
  async processScheduledPosts(): Promise<void> {
    const scheduledPostsResult = await postService.findScheduledPosts()

    if (!scheduledPostsResult.success || !scheduledPostsResult.data) {
      return
    }

    for (const post of scheduledPostsResult.data) {
      if (post.scheduledAt && post.scheduledAt <= new Date()) {
        this.schedulePost(post.id, post.scheduledAt)
      }
    }

    // Process immediately
    await this.processQueue()
  }
}

// Export singleton instance
export const queueManager = new QueueManager()

// Auto-start the queue manager
if (process.env.NODE_ENV !== 'test') {
  queueManager.start()
}

/**
 * Utility functions for queue management
 */
export class QueueUtils {
  /**
   * Schedule a post for immediate publishing
   */
  static async publishPostNow(postId: string): Promise<string> {
    return queueManager.schedulePost(postId, new Date())
  }

  /**
   * Schedule a post for future publishing
   */
  static async schedulePostForLater(postId: string, scheduledAt: Date): Promise<string> {
    return queueManager.schedulePost(postId, scheduledAt)
  }

  /**
   * Retry a failed post
   */
  static async retryFailedPost(postId: string, platformPostId: string, error: string): Promise<string> {
    return queueManager.scheduleRetry(postId, platformPostId, error)
  }

  /**
   * Get queue statistics
   */
  static getQueueStats(): QueueStats {
    return queueManager.getStats()
  }

  /**
   * Process all scheduled posts
   */
  static async processScheduledPosts(): Promise<void> {
    return queueManager.processScheduledPosts()
  }
}
