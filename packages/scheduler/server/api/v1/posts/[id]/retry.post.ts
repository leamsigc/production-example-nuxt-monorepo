/**
 * POST /api/v1/posts/[id]/retry - Retry a failed post
 * 
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 */

import { postService } from '~~/server/services/post.service'
import { QueueUtils } from '~~/server/utils/queueManager'

export default defineEventHandler(async (event) => {
  try {
    // Get user from session
    const session = await getUserSession(event)
    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Get post ID from route params
    const postId = getRouterParam(event, 'id')
    if (!postId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Post ID is required'
      })
    }

    // Get request body for specific platform post retry (optional)
    const body = await readBody(event).catch(() => ({}))
    const platformPostId = body.platformPostId

    // Verify post exists and belongs to user
    const postResult = await postService.findById(postId, session.user.id, true)
    if (!postResult.success) {
      throw createError({
        statusCode: postResult.code === 'NOT_FOUND' ? 404 : 500,
        statusMessage: postResult.error || 'Failed to find post'
      })
    }

    const post = postResult.data!

    // Check if post has failed attempts to retry
    const hasFailedAttempts = post.status === 'failed' || 
      post.platformPosts?.some(p => p.status === 'failed')

    if (!hasFailedAttempts) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Post does not have any failed publishing attempts to retry'
      })
    }

    let jobId: string

    if (platformPostId) {
      // Retry specific platform post
      const platformPost = post.platformPosts?.find(p => p.id === platformPostId)
      if (!platformPost) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Platform post not found'
        })
      }

      if (platformPost.status !== 'failed') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Platform post is not in failed state'
        })
      }

      jobId = await QueueUtils.retryFailedPost(
        postId, 
        platformPostId, 
        platformPost.errorMessage || 'Unknown error'
      )
    } else {
      // Retry entire post using the service method
      const retryResult = await postService.retryFailedPost(postId, session.user.id)
      if (!retryResult.success) {
        throw createError({
          statusCode: 400,
          statusMessage: retryResult.error || 'Failed to retry post'
        })
      }

      // Schedule for immediate retry
      jobId = await QueueUtils.publishPostNow(postId)
    }

    return {
      success: true,
      data: {
        postId,
        platformPostId,
        jobId,
        message: platformPostId 
          ? 'Platform post scheduled for retry' 
          : 'Post scheduled for retry'
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})