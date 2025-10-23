/**
 * POST /api/v1/posts/[id]/publish - Publish a post immediately
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

    // Verify post exists and belongs to user
    const postResult = await postService.findById(postId, session.user.id)
    if (!postResult.success) {
      throw createError({
        statusCode: postResult.code === 'NOT_FOUND' ? 404 : 500,
        statusMessage: postResult.error || 'Failed to find post'
      })
    }

    const post = postResult.data!

    // Check if post can be published
    if (post.status === 'published') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Post is already published'
      })
    }

    // Update post status to scheduled for immediate publishing
    const updateResult = await postService.updateStatus(postId, session.user.id, 'scheduled')
    if (!updateResult.success) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update post status'
      })
    }

    // Schedule for immediate publishing
    const jobId = await QueueUtils.publishPostNow(postId)

    return {
      success: true,
      data: {
        postId,
        jobId,
        message: 'Post scheduled for immediate publishing'
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