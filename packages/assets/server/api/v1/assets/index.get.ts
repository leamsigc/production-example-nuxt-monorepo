import { assetService } from '#layers/BaseAssets/server/services/asset.service';
import { auth } from "#layers/BaseAuth/lib/auth"


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

    // Get query parameters
    const query = getQuery(event)
    const businessId = query.businessId as string
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const mimeType = query.mimeType as string



    // Build query options
    const options = {
      pagination: { page, limit },
      filters: mimeType ? { mimeType } : {}
    }

    // Fetch assets for the business
    const result = await assetService.findByBusinessId(businessId, session.user.id, options)

    if (!result.success) {
      throw createError({
        statusCode: 500,
        statusMessage: result.error
      })
    }

    return {
      success: true,
      data: result.data,
      pagination: result.pagination
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
