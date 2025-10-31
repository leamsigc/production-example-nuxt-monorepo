import { socialMediaAccountService } from '#layers/BaseDB/server/services/social-media-account.service';
import { SchedulerPost, type SchedulerPluginConstructor } from '#layers/BaseScheduler/server/services/SchedulerPost.service';
import { FacebookPlugin } from '#layers/BaseScheduler/server/services/plugins/facebook.plugin';
import { checkUserIsLogin } from '#layers/BaseAuth/server/utils/AuthHelpers';
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
    const platform = query.platformId as string;
    console.log(platform);


    // Get social media accounts with filters
    const account = await socialMediaAccountService.getAccountsForPlatform(
      platform,
      user.id
    )
    const matcher: Record<string, SchedulerPluginConstructor> = {
      facebook: FacebookPlugin,
    }
    if (!matcher[platform] || !account) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid platform'
      })
    }

    const scheduler = new SchedulerPost({
      accounts: [account]
    });
    scheduler.use(matcher[platform]);




    return await scheduler.pages(account.accessToken) as unknown as any;
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
