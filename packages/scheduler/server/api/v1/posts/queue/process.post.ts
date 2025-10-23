/**
 * POST /api/v1/posts/queue/process - Manually trigger queue processing
 * 
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 */

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

    // Check if user has admin role (optional security check)
    if (session.user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required'
      })
    }

    // Process scheduled posts
    await QueueUtils.processScheduledPosts()

    return {
      success: true,
      data: {
        message: 'Queue processing triggered successfully',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process queue'
    })
  }
})