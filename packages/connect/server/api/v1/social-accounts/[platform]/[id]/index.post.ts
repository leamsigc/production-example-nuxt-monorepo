import { socialMediaAccountService, type CreateSocialMediaAccountData, type SocialMediaPlatform } from '#layers/BaseDB/server/services/social-media-account.service';
import { H3Error, readBody } from 'h3';

interface ConnectSocialMediaAccountBody {
  id: string;
  name: string;
  access_token: string;
  platformId: SocialMediaPlatform;
  businessId: string;
  // All other fields from FacebookPage are now optional and will be stored in 'details'
  [key: string]: unknown;
}

defineRouteMeta({
  openAPI: {
    tags: ['Connection'],
    operationId: 'connectSocialMediaAccount',
    summary: 'Connect Social Media Account',
    description: 'Connects a social media account (e.g., Facebook Page) to a business.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'The ID of the social media page/account.' },
              name: { type: 'string', description: 'The name of the social media page/account.' },
              access_token: { type: 'string', description: 'The access token for the social media page/account.' },
              platformId: { type: 'string', description: 'The platform identifier (e.g., facebook).' },
              businessId: { type: 'string', description: 'The ID of the business to connect to.' },
              // Generic details object for platform-specific data
              details: {
                type: 'object',
                description: 'Optional platform-specific details (e.g., Facebook page category, tasks).',
                additionalProperties: true,
              },
            },
            required: ['id', 'name', 'access_token', 'platformId', 'businessId'],
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Social media account connected successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                platform: { type: 'string' },
                accountName: { type: 'string' },
                isActive: { type: 'boolean' },
              },
            },
          },
        },
      },
      '400': { description: 'Bad Request - Missing or invalid parameters.' },
      '401': { description: 'Unauthorized - User not logged in.' },
      '409': { description: 'Conflict - Account already connected and active.' },
      '500': { description: 'Internal Server Error.' },
    },
  },
});

export default defineEventHandler(async (event) => {
  try {
    const user = await checkUserIsLogin(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }

    const { platform, id } = event.context.params as { platform: SocialMediaPlatform; id: string };
    const body = await readBody<ConnectSocialMediaAccountBody>(event);

    if (!body || !body.id || !body.name || !body.access_token || !body.platformId || !body.businessId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing or invalid required page information in request body.',
      });
    }

    if (platform !== body.platformId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Platform mismatch between URL and request body.',
      });
    }

    // Check if an integration with the same accountId and platform already exists for this user
    const existingAccount = await socialMediaAccountService.getAccountByPlatformAndAccountId(
      user.id,
      platform,
      body.id
    );

    // Extract details that are not part of the core SocialMediaAccount schema
    const { id: bodyId, name, access_token, platformId, businessId, ...details } = body;

    if (existingAccount) {
      if (existingAccount.isActive) {
        // Account is already connected and active
        throw createError({
          statusCode: 409,
          statusMessage: 'Social media account already connected and active.',
        });
      } else {
        // Account exists but is inactive, update it
        const updatedAccount = await socialMediaAccountService.updateAccount(existingAccount.id, {
          accessToken: body.access_token,
          accountName: body.name,
          isActive: true,
          details: details, // Store full page details in the new 'details' column
        });

        if (!updatedAccount) {
          throw createError({
            statusCode: 500,
            statusMessage: 'Failed to reactivate social media account.',
          });
        }
        return updatedAccount;
      }
    }

    // Create a new social media account
    const newAccountData: CreateSocialMediaAccountData = {
      userId: user.id,
      businessId: body.businessId,
      platform: platform,
      accountId: body.id,
      accountName: body.name,
      accessToken: body.access_token,
      details: details, // Store full page details in the new 'details' column
    };

    const newAccount = await socialMediaAccountService.createAccount(newAccountData);

    if (!newAccount) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to connect social media account.',
      });
    }

    return newAccount;
  } catch (error) {
    console.error('Error connecting social media account:', error);

    if (error instanceof H3Error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to connect social media account.',
    });
  }
});
