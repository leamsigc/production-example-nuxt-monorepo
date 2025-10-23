/**
 * GET /api/v1/posts/queue/status - Get queue status and statistics
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

    // Get queue statistics
    const stats = QueueUtils.getQueueStats()

    return {
      success: true,
      data: {
        queue: stats,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get queue status'
    })
  }
})