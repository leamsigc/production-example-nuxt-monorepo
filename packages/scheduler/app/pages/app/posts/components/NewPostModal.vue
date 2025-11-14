<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, watch } from 'vue';
import { usePostManager } from '../composables/UsePostManager';
import { useAssetManager } from '../../composables/useAssetManager';
import type { PostCreateBase, Asset } from '#layers/BaseDB/db/schema';

// Dynamically import preview components
const FacebookPreview = defineAsyncComponent(() => import('./FacebookPreview.vue'));
const InstagramPreview = defineAsyncComponent(() => import('./InstagramPreview.vue'));
const TwitterPreview = defineAsyncComponent(() => import('./TwitterPreview.vue'));
const GooglePreview = defineAsyncComponent(() => import('./GooglePreview.vue'));
const EmailPasswordPreview = defineAsyncComponent(() => import('./EmailPasswordPreview.vue'));
const LinkedinPreview = defineAsyncComponent(() => import('./LinkedinPreview.vue'));
const TiktokPreview = defineAsyncComponent(() => import('./TiktokPreview.vue'));
const ThreadsPreview = defineAsyncComponent(() => import('./ThreadsPreview.vue'));
const YoutubePreview = defineAsyncComponent(() => import('./YoutubePreview.vue'));
const PinterestPreview = defineAsyncComponent(() => import('./PinterestPreview.vue'));
const MastodonPreview = defineAsyncComponent(() => import('./MastodonPreview.vue'));
const BlueskyPreview = defineAsyncComponent(() => import('./BlueskyPreview.vue'));
const DefaultPreview = defineAsyncComponent(() => import('./DefaultPreview.vue'));
/**
 *
 * New Post modal
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
const { t } = useI18n();
const { createPost } = usePostManager();
const { getAllSocialMediaAccounts, pagesList } = useSocialMediaManager();
const { getAssetsByIds } = useAssetManager();

const isOpen = ref(false);
const postToCreate = ref<PostCreateBase>({
  content: '',
  businessId: '',
  scheduledAt: new Date(),
  mediaAssets: [],
  targetPlatforms: [],
  status: 'draft',
  comment: []
});

const postMediaAssets = ref<Asset[]>([]);
const postHasError = ref(false);

const explicitPreviewPlatform = ref('default');
const previewsMap = {
  facebook: FacebookPreview,
  instagram: InstagramPreview,
  twitter: TwitterPreview,
  google: GooglePreview,
  'email-password': EmailPasswordPreview,
  linkedin: LinkedinPreview,
  tiktok: TiktokPreview,
  threads: ThreadsPreview,
  youtube: YoutubePreview,
  pinterest: PinterestPreview,
  mastodon: MastodonPreview,
  bluesky: BlueskyPreview,
};

onMounted(async () => {
  await getAllSocialMediaAccounts();
});

watch(() => postToCreate.value.mediaAssets, async (newAssetIds) => {
  if (newAssetIds && newAssetIds.length > 0) {
    postMediaAssets.value = await getAssetsByIds(newAssetIds);
  } else {
    postMediaAssets.value = [];
  }
}, { immediate: true });

const currentPreviewPlatform = computed(() => {
  if (explicitPreviewPlatform.value !== 'default') {
    return explicitPreviewPlatform.value;
  }
  return 'default';
});

const formatPostContent = (content: string, platform: string): string => {
  // Example: Twitter character limit
  if (platform === 'twitter' && content.length > 280) {
    return content.substring(0, 277) + '...';
  }
  // Add other platform-specific formatting rules here
  return content;
};

const previewComponent = computed(() => {
  const component = previewsMap[currentPreviewPlatform.value as keyof typeof previewsMap];
  return component || DefaultPreview;
});

const previewSelectOptions = computed(() => {
  const options = [{ label: 'Default Preview', value: 'default' }];

  Object.keys(previewsMap).forEach(platform => {
    options.push({ label: platform, value: platform });
  });
  return options;
});


const tabs = [{
  label: 'Editor',
  description: "Edit your post here",
  icon: 'i-heroicons-pencil-square',
  slot: "editor" as const,
}, {
  label: 'Media',
  description: "Add media to your post",
  icon: 'i-heroicons-photo',
  slot: "media" as const
}];

function toggleSocialAccount(id: string) {
  const find = postToCreate.value.targetPlatforms.find((platform) => platform === id);
  if (find) {
    postToCreate.value.targetPlatforms = postToCreate.value.targetPlatforms.filter((platform) => platform !== id);
  } else {
    postToCreate.value.targetPlatforms.push(id);
  }
}

function addComment() {
  postToCreate.value.comment.push('');
}

function removeComment(index: number) {
  postToCreate.value.comment.splice(index, 1);
}

const handleCreatePost = async () => {
  if (!postToCreate.value.content.trim() && postToCreate.value.targetPlatforms.length === 0) {
    postHasError.value = true;
    return;
  }
  postHasError.value = false;
  console.log(postToCreate.value);


  // await createPost(postToCreate.value)
  isOpen.value = false;
}
const ResetToBase = () => {
  postToCreate.value.content = '';
  postToCreate.value = {
    content: '',
    businessId: '',
    scheduledAt: new Date(),
    mediaAssets: [],
    targetPlatforms: [],
    status: 'draft',
    comment: []
  }
}
</script>

<template>
  <UModal v-model:open="isOpen" scrollable :ui="{ content: 'min-w-6xl', }" @after:enter="ResetToBase">
    <UButton label="Open New Post Modal" />
    <template #content>
      <section class="min-w-4xl">
        <UCard>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white flex">

              <div class="flex items-center gap-2 ml-5">
                <!-- Social Accounts Selection -->
                <div class="flex -space-x-1">
                  <section v-for="account in pagesList" :key="account.id">
                    <UAvatar :src="account.entityDetail.details.picture" :alt="account.accountName" size="sm"
                      class="cursor-pointer ring-2 ring-white dark:ring-gray-900"
                      :class="{ 'border border-primary': postToCreate.targetPlatforms.includes(account.id) }"
                      @click="toggleSocialAccount(account.id)" v-if="postToCreate.targetPlatforms.includes(account.id)">
                      <UBadge v-if="postToCreate.targetPlatforms.includes(account.id)" color="neutral" variant="soft"
                        :leading-icon="`logos:${account.platform}`" size="xs" class="mt-2">
                      </UBadge>
                    </UAvatar>

                  </section>
                </div>
                <UPopover>
                  <UButton icon="i-heroicons-plus" size="sm" color="neutral" variant="solid" />

                  <template #content>
                    <UCard>
                      <section class="grid grid-cols-2 gap-2">
                        <div v-for="account in pagesList" :key="account.id" class="flex flex-col items-center">
                          <template v-if="!postToCreate.targetPlatforms.includes(account.id)">
                            <UAvatar :src="account.entityDetail.details.picture" :alt="account.accountName" size="3xl"
                              class="cursor-pointer ring-2 ring-white dark:ring-gray-900"
                              :class="{ 'border border-primary': postToCreate.targetPlatforms.includes(account.id) }"
                              @click="toggleSocialAccount(account.id)" />
                            <p class="mt-2 text-sm font-medium">{{ account.accountName }}</p>
                          </template>
                        </div>

                      </section>
                      <UEmpty title="No more accounts"
                        v-if="pagesList.length === postToCreate.targetPlatforms.length" />
                    </UCard>

                  </template>
                </UPopover>
              </div>

            </h3>
            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isOpen = false" />
          </div>

          <div class="flex flex-col lg:flex-row h-full">
            <!-- Left Side: Editor and Comments -->
            <div class="flex-1 p-4 border-r border-gray-200 dark:border-gray-800">
              <UTabs :items="tabs" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">

                <template #editor>
                  <div class="py-3">
                    <UTextarea v-model="postToCreate.content" placeholder="Start writing your post..." :rows="8"
                      class="w-full" />

                    <div v-if="postHasError" class="mt-2 text-red-500 text-sm">
                      Your post should have at least one character or one image.
                    </div>

                    <div class="mt-4 flex gap-2">
                      <UButton icon="i-heroicons-photo" variant="ghost">
                        Insert Media
                      </UButton>
                      <UButton icon="i-heroicons-paint-brush" variant="ghost">
                        Design Media
                      </UButton>
                      <UButton icon="i-heroicons-sparkles" variant="ghost">
                        AI Image
                      </UButton>
                    </div>

                    <div class="mt-4">
                      <h4 class="text-sm font-semibold mb-2">Comments</h4>
                      <div v-for="(comment, index) in postToCreate.comment" :key="index"
                        class="flex items-center gap-2 mb-2">
                        <UTextarea v-model="postToCreate.comment[index]" :placeholder="`Comment ${index + 1}`" :rows="2"
                          class="flex-1" />
                        <UButton v-if="postToCreate.comment.length > 0" icon="i-heroicons-trash-20-solid" color="error"
                          variant="ghost" @click="removeComment(index)" />
                      </div>
                      <UButton icon="i-heroicons-plus-circle-20-solid" variant="ghost" @click="addComment">
                        Add another comment
                      </UButton>
                    </div>
                  </div>
                </template>
                <template #media>
                  <p>Media Library Content Here</p>
                </template>

              </UTabs>
            </div>

            <!-- Right Side: Preview -->
            <div class="flex-1 p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-semibold">Preview</h4>
                <USelect v-model="explicitPreviewPlatform" :items="previewSelectOptions" class="w-40" />
              </div>
              <component :is="previewComponent"
                :post="{ ...postToCreate, content: formatPostContent(postToCreate.content, currentPreviewPlatform), mediaAssets: postMediaAssets }"
                :platform="currentPreviewPlatform" />
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="secondary" variant="outline" @click="isOpen = false">
                Save as draft
              </UButton>
              <UButton color="primary" variant="outline" @click="handleCreatePost">
                Post now
              </UButton>
              <UButton color="warning" variant="ghost" @click="handleCreatePost">
                Schedule
              </UButton>
            </div>
          </template>
        </UCard>
      </section>
    </template>

  </UModal>
</template>

<style scoped></style>
