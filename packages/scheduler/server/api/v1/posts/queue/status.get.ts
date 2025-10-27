/**
 * GET /api/v1/posts/queue/status - Get queue status and statistics
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 */

import { checkUserIsLogin } from "#layers/BaseAuth/server/utils/AuthHelpers"


export default defineEventHandler(async (event) => {
  try {
    // Get user from session
    const user = await checkUserIsLogin(event)

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
