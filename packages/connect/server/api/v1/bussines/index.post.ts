import { businessProfileService } from '#layers/BaseDB/server/services/business-profile.service';
import { checkUserIsLogin } from "#layers/BaseAuth/server/utils/AuthHelpers"
import { createBusinessProfileSchema } from '#layers/BaseDB/server/schemas/business-profile.schema';

export default defineEventHandler(async (event) => {
  const user = await checkUserIsLogin(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const body = await readValidatedBody(event, createBusinessProfileSchema.parse);

  const newBusiness = await businessProfileService.create({
    ...body,
    userId: user.id,
  });

  return newBusiness;
});
