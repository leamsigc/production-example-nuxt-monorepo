import { z } from 'zod'
import { auth } from '#layers/BaseAuth/lib/auth'
import type { SocialMediaPlatform } from '#layers/BaseDB/server/services/social-media-account.service'

const connectSchema = z.object({
  platform: z.enum(['facebook', 'instagram', 'twitter', 'tiktok', 'google', 'github', 'discord', 'apple', 'microsoft', 'linkedin', 'threads', 'youtube', 'pinterest', 'mastodon', 'bluesky']),
  businessId: z.string().optional(),
  redirectUrl: z.string().url().optional(),
  linkToExisting: z.boolean().optional().default(false)
})

export default defineEventHandler(async (event) => {
  try {
    // Get user from session
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

    // Parse and validate request body
    const body = await readBody(event)
    const { platform, businessId, redirectUrl, linkToExisting } = connectSchema.parse(body)

    // Build callback URL with business context
    const baseUrl = getRequestURL(event).origin
    const callbackUrl = redirectUrl || `${baseUrl}/app/social-accounts/callback?platform=${platform}${businessId ? `&businessId=${businessId}` : ''}`

    let authResponse

    if (linkToExisting) {
      // Link account to existing authenticated user
      authResponse = await linkAccount(platform as SocialMediaPlatform, callbackUrl)
    } else {
      // Start OAuth flow for new connection
      authResponse = await getAuthUrl(platform as SocialMediaPlatform, callbackUrl)
    }

    // Extract authorization URL from Better Auth response
    const authUrl = authResponse
    console.log(authUrl);


    if (!authUrl) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to generate authorization URL for ${platform}`
      })
    }

    return {
      success: true,
      data: {
        authUrl,
        platform,
        businessId,
        callbackUrl
      }
    }
  } catch (error) {
    console.error('Error initiating social media connection:', error)

    // Check if it's already a Nuxt error with statusCode
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Check if it's a Zod validation error
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request data',
        data: (error as any).errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to initiate social media connection'
    })
  }
})
