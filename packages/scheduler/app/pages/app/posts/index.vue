<!--  Translation file -->
<i18n src="./posts.json"></i18n>

<script lang="ts" setup>
/**
 *
 * Post previews
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
import { usePostManager } from './composables/UsePostManager';
import NewPostModal from './components/NewPostModal.vue';
const activeBusinessId = useState<string>('business:id');

const { getPosts, postList } = usePostManager();
getPosts(activeBusinessId.value);

const { t } = useI18n();
useHead({
  title: t('seo_title_all'),
  meta: [
    { name: 'description', content: t('seo_description_all') }
  ]
});
</script>

<template>
  <div class="container mx-auto py-6 space-y-6">
    <BasePageHeader :title="t('title')" :description="t('description')">
      <template #actions>
        <NewPostModal />
      </template>
    </BasePageHeader>
    <!-- List of all posts -->
    {{ postList }}
  </div>
</template>
<style scoped></style>
