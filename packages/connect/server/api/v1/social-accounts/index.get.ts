import { socialMediaAccountService } from '#layers/BaseDB/server/services/social-media-account.service';
import { type SocialMediaAccount } from '#layers/BaseDB/db/schema';
import { H3Error } from 'h3';

defineRouteMeta({
  openAPI: {
    tags: ['Connection'],
    operationId: 'getSocialMediaAccounts',
    summary: 'Get Social Media Accounts',
    description: 'Get social media connections for the current user',
  },
});
export default defineEventHandler(async (event) => {
  try {
    // Get user from session (assuming auth middleware sets this)
    const user = await checkUserIsLogin(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Get query parameters for filtering
    const query = getQuery(event)
    const businessId = query.businessId as string | undefined
    const platform = query.platform as string | undefined
    const isActive = query.isActive ? query.isActive === 'true' : undefined

    // Get social media accounts with filters
    const accounts = await socialMediaAccountService.getAccounts({
      userId: user.id,
      businessId,
      platform: platform as any,
      isActive
    })

    return accounts;
  } catch (error) {
    console.error('Error fetching social media accounts:', error)

    if (error instanceof H3Error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch social media accounts'
    })
  }
})
