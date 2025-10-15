
export default defineNuxtRouteMiddleware(async (to) => {
  const routeStart = to.path
  const isBlog = routeStart.startsWith('/blogs/');
  const isAppRoute = routeStart.includes('/app');

  let layout = 'default';
  if (isBlog) {
    layout = 'blog-layout';
  } else if (isAppRoute) {
    layout = 'dashboard-layout';
  }

  setPageLayout(layout as any,);
});
