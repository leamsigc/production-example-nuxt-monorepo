import type { BusinessProfile } from "#layers/BaseDB/db/schema";
import { useBusinessManager } from "../pages/app/business/composables/useBusinessManager"

export default defineNuxtRouteMiddleware(async (to) => {

  const isUserNavigatingToTheApp = to.path.startsWith('/app')
  const isUserSettingUpFirstBusiness = to.path.startsWith('/app/business/initial')

  const { data } = await useFetch<PaginatedResponse<BusinessProfile>>('/api/v1/business');
  const { businesses } = useBusinessManager();


  if (data.value) {
    businesses.value = data.value;
  }

  if (isUserNavigatingToTheApp && !isUserSettingUpFirstBusiness && !businesses.value.data?.length) {
    return navigateTo('/app/business/initial');
  }

})
