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
import DefaultPreview from './components/DefaultPreview.vue';
import type { PostWithAllData } from '#layers/BaseDB/db/posts/posts';
import type { Asset } from '#layers/BaseDB/db/schema';

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

// Helper to get platform icon and name
const getPlatformInfo = (post: PostWithAllData) => {
  const platformName = post.platformPosts?.[0]?.platformPostId || 'default'; // Assuming platformPostId stores the platform name
  const iconMap: Record<string, string> = {
    facebook: 'i-simple-icons-facebook',
    instagram: 'i-simple-icons-instagram',
    twitter: 'i-simple-icons-twitter',
    google: 'i-simple-icons-google',
    'email-password': 'i-heroicons-envelope', // Example icon for email-password
    linkedin: 'i-simple-icons-linkedin',
    tiktok: 'i-simple-icons-tiktok',
    threads: 'i-simple-icons-threads',
    youtube: 'i-simple-icons-youtube',
    pinterest: 'i-simple-icons-pinterest',
    mastodon: 'i-simple-icons-mastodon',
    bluesky: 'i-simple-icons-bluesky',
    default: 'i-heroicons-globe-alt', // Default icon
  };
  const displayNameMap: Record<string, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
    google: 'Google My Business',
    'email-password': 'Email/Password',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok',
    threads: 'Threads',
    youtube: 'YouTube',
    pinterest: 'Pinterest',
    mastodon: 'Mastodon',
    bluesky: 'Bluesky',
    default: 'Default',
  };

  return {
    icon: iconMap[platformName] || iconMap.default,
    name: displayNameMap[platformName] || displayNameMap.default,
    platformKey: platformName as keyof typeof iconMap, // Cast to the correct type
  };
};
</script>

<template>
  <div class="container mx-auto py-6 space-y-6">
    <BasePageHeader :title="t('title')" :description="t('description')">
      <template #actions>
        <NewPostModal />
      </template>
    </BasePageHeader>
    <!-- List of all posts -->
    <div class="grid grid-cols-1 md:grid-cols-4  gap-2 mt-3">
      <BaseShinyCard v-for="post in postList" :key="post.id" :show-bg="false">
        <UCard :ui="{ header: 'p-0 sm:p-2', footer: 'p-0 sm:p-2', body: 'p-0 sm:p-0 h-full', root: 'p-1' }"
          class="bg-muted/50 dark:bg-card hover:bg-background dark:hover:bg-background transition-all delay-75 group/number h-full relative">
          <template #header>
            <div class="flex items-center gap-2 p-2">
              <template v-for="platform in post.platformPosts" :key="platform.id">
                <UIcon :name="`logos:${platform.platformPostId || 'facebook'}`" class="w-5 h-5" />
                <span class="font-semibold">{{ platform.status }}</span>
              </template>
            </div>
          </template>
          <DefaultPreview :post-content="post.content" :media-assets="post.assets" platform="default" :post="{
            businessId: post.businessId,
            scheduledAt: post.scheduledAt || new Date(),
            status: post.status,
            targetPlatforms: post.targetPlatforms ? JSON.parse(post.targetPlatforms) : [],
            comment: [],
            content: post.content,
            mediaAssets: post.mediaAssets ? JSON.parse(post.mediaAssets) : [],
          }" />
        </UCard>
      </BaseShinyCard>
    </div>

  </div>
</template>
<style scoped></style>
