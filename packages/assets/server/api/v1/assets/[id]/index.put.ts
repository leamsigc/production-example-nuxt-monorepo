import { assetService } from '~~/server/services/asset.service'
import { auth } from '~~/lib/auth'

export default defineEventHandler(async (event) => {
  try {
    // Get authenticated user
    const headers = getHeaders(event)
    const session = await auth.api.getSession({
      headers: new Headers(headers as Record<string, string>)
    })

    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Get asset ID from route parameters
    const assetId = getRouterParam(event, 'id')
    
    if (!assetId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Asset ID is required'
      })
    }

    // Get request body
    const body = await readBody(event)

    // For now, we only support updating metadata
    // In a full implementation, you might support updating other fields
    if (!body.metadata) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Metadata is required for asset updates'
      })
    }

    // Update asset metadata
    const result = await assetService.updateMetadata(assetId, session.user.id, body.metadata)

    if (!result.success) {
      if (result.code === 'NOT_FOUND') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Asset not found'
        })
      }
      
      throw createError({
        statusCode: 400,
        statusMessage: result.error
      })
    }

    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})