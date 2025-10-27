/**
 * PUT /api/v1/posts/[id] - Update a specific post
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 */

import { checkUserIsLogin } from "#layers/BaseAuth/server/utils/AuthHelpers"
import { postService, type UpdatePostData } from "#layers/BaseDB/server/services/post.service"


export default defineEventHandler(async (event) => {
  try {
    // Get user from session
    const user = await checkUserIsLogin(event)

    // Get post ID from route params
    const postId = getRouterParam(event, 'id')
    if (!postId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Post ID is required'
      })
    }

    // Get request body
    const body = await readBody(event)

    // Prepare update data
    const updateData: UpdatePostData = {}

    if (body.content !== undefined) {
      updateData.content = body.content
    }

    if (body.mediaAssets !== undefined) {
      updateData.mediaAssets = body.mediaAssets
    }

    if (body.targetPlatforms !== undefined) {
      if (!Array.isArray(body.targetPlatforms)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Target platforms must be an array'
        })
      }
      updateData.targetPlatforms = body.targetPlatforms
    }

    if (body.status !== undefined) {
      const validStatuses = ['draft', 'scheduled', 'published', 'failed']
      if (!validStatuses.includes(body.status)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid status value'
        })
      }
      updateData.status = body.status
    }

    // Handle scheduled date
    if (body.scheduledAt !== undefined) {
      if (body.scheduledAt === null) {
        updateData.scheduledAt = undefined
      } else {
        const scheduledDate = new Date(body.scheduledAt)
        if (isNaN(scheduledDate.getTime())) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid scheduled date format'
          })
        }
        updateData.scheduledAt = scheduledDate
      }
    }

    // Update post
    const result = await postService.update(postId, user.id, updateData)

    if (!result.success) {
      if (result.code === 'NOT_FOUND') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Post not found'
        })
      }

      throw createError({
        statusCode: 400,
        statusMessage: result.error || 'Failed to update post'
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
