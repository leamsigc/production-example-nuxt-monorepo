<script lang="ts" setup>
/**
 *
 * Render the content from nuxt content folder
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
const route = useRoute()


const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection("content").path(route.path).first()
})

useHead(page.value?.head || {})
useSeoMeta(page.value?.seo || {})
defineOgImageComponent('BlogOgImage', {
  title: `${page.value?.title.replace("NuxtZzle starterkit |", "").slice(0, 50)}...`,
  description: `${page.value?.description.slice(0, 200)}...`,
  headline: '👋 Hello from LEAMSIGC',
})
</script>

<template>
  <article>
    <ContentRenderer v-if="page" :value="page" />
    <NotFoundView v-else />
  </article>
</template>
<style scoped></style>
