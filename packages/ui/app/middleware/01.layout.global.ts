
export default defineNuxtRouteMiddleware(async (to) => {
  const routeStart = to.path
  const isBlog = routeStart.startsWith('/blogs/');
  const isAppRoute = routeStart.includes('/app');
  const isTools = routeStart.includes('/tools');
  const isUserSettingUpFirstBusiness = to.path.startsWith('/app/business/initial');

  let layout = 'default';
  if (isBlog) {
    layout = 'blog-layout';
  } else if (isAppRoute && !isUserSettingUpFirstBusiness) {
    layout = 'dashboard-layout';
  } else if (isTools) {
    layout = 'tools-layout';
  } else if (isUserSettingUpFirstBusiness) {
    layout = 'business-layout';
  } else {
    layout = 'default';
  }

  setPageLayout(layout as any,);
});
