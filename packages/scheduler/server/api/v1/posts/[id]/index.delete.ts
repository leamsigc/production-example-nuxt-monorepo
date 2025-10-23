
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

    // Delete post
    const result = await postService.delete(postId, session.user.id)

    if (!result.success) {
      if (result.code === 'NOT_FOUND') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Post not found'
        })
      }

      throw createError({
        statusCode: 500,
        statusMessage: result.error || 'Failed to delete post'
      })
    }

    return {
      success: true,
      message: 'Post deleted successfully'
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
