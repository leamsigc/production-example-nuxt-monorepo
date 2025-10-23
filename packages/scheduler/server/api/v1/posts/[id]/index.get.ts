/**
 * GET /api/v1/posts/[id] - Get a specific post by ID
 * 
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 */

import { postService } from '~~/server/services/post.service'

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

    // Get query parameters
    const query = getQuery(event)
    const includePlatforms = query.includePlatforms === 'true'

    // Get post
    const result = await postService.findById(postId, session.user.id, includePlatforms)

    if (!result.success) {
      if (result.code === 'NOT_FOUND') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Post not found'
        })
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: result.error || 'Failed to fetch post'
      })
    }

    return {
      success: true,
      data: result.data
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