
export default defineNuxtRouteMiddleware(async (to) => {
  const routeStart = to.path
  const isBlog = routeStart.startsWith('/blogs/');

  let layout = 'default';
  if (isBlog) {
    layout = 'blog-layout';
  }

  setPageLayout(layout as any);
});
