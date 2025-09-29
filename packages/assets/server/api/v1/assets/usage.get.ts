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

    // Get query parameters
    const query = getQuery(event)
    const businessId = query.businessId as string

    let result

    if (businessId) {
      // Get storage usage for specific business
      result = await assetService.getStorageUsageByBusiness(businessId, session.user.id)
    } else {
      // Get total storage usage for user
      result = await assetService.getStorageUsage(session.user.id)
    }

    if (!result.success) {
      throw createError({
        statusCode: 500,
        statusMessage: result.error
      })
    }

    // Convert bytes to more readable format
    const formatBytes = (bytes: number) => {
      if (bytes === 0) return { value: 0, unit: 'B' }
      
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return {
        value: parseFloat((bytes / Math.pow(k, i)).toFixed(2)),
        unit: sizes[i]
      }
    }

    const formattedSize = formatBytes(result.data?.totalSize || 0)

    return {
      success: true,
      data: {
        totalSize: result.data?.totalSize || 0,
        count: result.data?.count || 0,
        formatted: {
          size: `${formattedSize.value} ${formattedSize.unit}`,
          count: `${result.data?.count || 0} file${(result.data?.count || 0) !== 1 ? 's' : ''}`
        }
      }
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