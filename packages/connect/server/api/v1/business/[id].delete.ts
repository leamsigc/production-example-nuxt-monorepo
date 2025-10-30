import { businessProfileService } from '#layers/BaseDB/server/services/business-profile.service';
import { checkUserIsLogin } from "#layers/BaseAuth/server/utils/AuthHelpers"

export default defineEventHandler(async (event) => {
  const user = await checkUserIsLogin(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Business ID is required'
    });
  }

  const deletedBusiness = await businessProfileService.delete(id, user.id);

  if (!deletedBusiness) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Business not found or user not authorized to delete it'
    });
  }

  return { message: 'Business deleted successfully' };
});
