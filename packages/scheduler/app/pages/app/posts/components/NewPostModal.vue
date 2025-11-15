<!--  Translation file -->
<i18n src="../posts.json"></i18n>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, watch } from 'vue';
import { usePlatformConfiguration, type PlatformConfig, type SocialMediaPlatformConfigurations } from '../composables/usePlatformConfiguration';
import type { PostCreateBase, Asset } from '#layers/BaseDB/db/schema';
import { usePostManager } from '../composables/UsePostManager';

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

interface TargetPlatform {
  accountId: string;
  platformType: keyof SocialMediaPlatformConfigurations;
}

interface PostCreateBaseExtended extends Omit<PostCreateBase, 'targetPlatforms'> {
  targetPlatforms: TargetPlatform[];
  tags?: string[];
  categories?: string[];
  privacySetting?: 'public' | 'private' | 'unlisted';
  isShort?: boolean;
  isStory?: boolean;
  hasSound?: boolean;
}

const { t } = useI18n();
const toast = useToast();
const { createPost } = usePostManager();
const { getAllSocialMediaAccounts, pagesList } = useSocialMediaManager();
const { getAssetsByIds } = useAssetManager();
const { platformConfigurations, validatePostForPlatform } = usePlatformConfiguration();

const isOpen = ref(false);
const postToCreate = ref<PostCreateBaseExtended>({
  content: '',
  businessId: '',
  scheduledAt: new Date(),
  mediaAssets: [],
  targetPlatforms: [],
  status: 'draft',
  comment: []
});
const activeBusinessId = useState<string>('business:id');
const postMediaAssets = ref<Asset[]>([]);
const postHasError = ref(false);
const validationErrors = ref<{ platform: string; message: string }[]>([]);

const explicitPreviewPlatform = ref<keyof typeof previewsMap | 'default'>('default');
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
  default: DefaultPreview,
};

onMounted(async () => {
  await getAllSocialMediaAccounts();
});


function addComment() {
  postToCreate.value.comment.push('');
}

function removeComment(index: number) {
  postToCreate.value.comment.splice(index, 1);
}

const currentPreviewPlatform = computed(() => {
  if (explicitPreviewPlatform.value !== 'default') {
    return explicitPreviewPlatform.value;
  }
  return 'default';
});

const formatPostContent = (content: string, platformType: keyof typeof previewsMap | 'default'): string => {
  if (platformType === 'default') return content;
  const config = platformConfigurations[platformType];
  if (config && content.length > config.maxPostLength) {
    return content.substring(0, config.maxPostLength - 3) + '...';
  }
  return content;
};

const previewComponent = computed(() => {
  const component = previewsMap[currentPreviewPlatform.value as keyof typeof previewsMap];
  return component || DefaultPreview;
});

const previewSelectOptions = computed(() => {
  const options = [{ label: t('newPostModal.defaultPreview'), value: 'default' }];

  (Object.keys(previewsMap) as Array<keyof typeof previewsMap>).forEach(platform => {
    options.push({ label: platform, value: platform });
  });
  return options;
});

const tabs = [{
  label: t('newPostModal.editorTab'),
  description: t('newPostModal.editorDescription'),
  icon: 'i-heroicons-pencil-square',
  slot: "editor" as const,
}, {
  label: t('newPostModal.mediaTab'),
  description: t('newPostModal.mediaDescription'),
  icon: 'i-heroicons-photo',
  slot: "media" as const
}];

function toggleSocialAccount(accountId: string) {
  const existingIndex = postToCreate.value.targetPlatforms.findIndex(
    (target) => target.accountId === accountId
  );

  if (existingIndex !== -1) {
    postToCreate.value.targetPlatforms.splice(existingIndex, 1);
  } else {
    const account = pagesList.value.find((page) => page.id === accountId);
    if (account) {
      postToCreate.value.targetPlatforms.push({
        accountId: account.id,
        platformType: account.platform as keyof SocialMediaPlatformConfigurations,
      });
    }
  }
}

const handleCreatePost = async (status: 'draft' | 'scheduled' | 'published' | 'failed') => {
  validationErrors.value = [];
  postHasError.value = false;

  if (!postToCreate.value.content.trim() && postToCreate.value.mediaAssets.length === 0) {
    postHasError.value = true;
    toast.add({ title: t('validation.emptyPost'), icon: 'i-heroicons-exclamation-triangle', color: 'error' });
    return;
  }

  if (postToCreate.value.targetPlatforms.length === 0) {
    postHasError.value = true;
    toast.add({ title: t('validation.noPlatformSelected'), icon: 'i-heroicons-exclamation-triangle', color: 'error' });
    return;
  }

  let firstInvalidPlatform: TargetPlatform | null = null;

  for (const targetPlatform of postToCreate.value.targetPlatforms) {
    const { isValid, message } = validatePostForPlatform(postToCreate.value, postMediaAssets.value, targetPlatform.platformType);
    if (!isValid) {
      validationErrors.value.push({ platform: targetPlatform.platformType, message: message || t('validation.unknownError') });
      if (!firstInvalidPlatform) {
        firstInvalidPlatform = targetPlatform;
      }
    }
  }

  if (validationErrors.value.length > 0) {
    postHasError.value = true;
    if (firstInvalidPlatform) {
      explicitPreviewPlatform.value = firstInvalidPlatform.platformType;
      toast.add({
        title: t('validation.postInvalidForPlatform', { platform: firstInvalidPlatform.platformType }),
        description: validationErrors.value.join('\n'),
        icon: 'i-heroicons-exclamation-triangle',
        color: 'error',
      });
    }
    return;
  }

  console.log(postToCreate.value);
  await createPost({
    ...postToCreate.value,
    status: status,
    targetPlatforms: postToCreate.value.targetPlatforms.map(platform => platform.accountId),
    businessId: activeBusinessId.value,
    mediaAssets: postMediaAssets.value.map(asset => asset.id)
  });
  isOpen.value = false;
}

const ResetToBase = () => {
  postToCreate.value = {
    content: '',
    businessId: '',
    scheduledAt: new Date(),
    mediaAssets: [],
    targetPlatforms: [],
    status: 'draft',
    comment: []
  }
  postMediaAssets.value = [];
  postHasError.value = false;
  validationErrors.value = [];
  explicitPreviewPlatform.value = 'default';
}

const HandleAssetsSelected = (assets: Asset[]) => {
  // postMediaAssets.value = assets;
  postToCreate.value.mediaAssets = assets.map(asset => asset.id);
}

const haveAtLeastOneAccountSelected = computed(() => {
  return postToCreate.value.targetPlatforms.length == 0;
})
</script>

<template>
  <UModal v-model:open="isOpen" :ui="{ content: 'min-w-6xl overflow-y-auto', }" @after:enter="ResetToBase"
    :dismissible="false">
    <UButton color="neutral" variant="solid">
      <Icon name="lucide:edit" class="mr-2 h-4 w-4" />
      {{ t('buttons.schedule_post') }}
    </UButton>
    <template #content>
      <section class="min-w-4xl">
        <UCard>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white flex">

              <div class="flex items-center gap-2 ml-5">
                <!-- Social Accounts Selection -->
                <div class="flex -space-x-1">
                  <section v-for="target in postToCreate.targetPlatforms" :key="target.accountId">
                    <template v-if="pagesList.find(p => p.id === target.accountId)">
                      <UAvatar :src="pagesList.find(p => p.id === target.accountId)?.entityDetail?.details?.picture"
                        :alt="pagesList.find(p => p.id === target.accountId)?.accountName" size="sm"
                        class="cursor-pointer ring-2 ring-white dark:ring-gray-900"
                        :class="{ 'border border-primary': postToCreate.targetPlatforms.some(t => t.accountId === target.accountId) }"
                        @click="toggleSocialAccount(target.accountId)">
                        <UBadge color="neutral" variant="soft" :leading-icon="`logos:${target.platformType}`" size="xs"
                          class="mt-2">
                        </UBadge>
                      </UAvatar>
                    </template>
                  </section>
                </div>
                <UPopover>
                  <UButton icon="i-heroicons-plus" size="sm" color="neutral" variant="solid" />

                  <template #content>
                    <UCard>
                      <section class="grid grid-cols-2 gap-2">
                        <div v-for="account in pagesList" :key="account.id" class="flex flex-col items-center">
                          <template
                            v-if="!postToCreate.targetPlatforms.some(target => target.accountId === account.id)">
                            <UAvatar :src="account.entityDetail.details.picture" :alt="account.accountName" size="3xl"
                              class="cursor-pointer ring-2 ring-white dark:ring-gray-900"
                              :class="{ 'border border-primary': postToCreate.targetPlatforms.some(target => target.accountId === account.id) }"
                              @click="toggleSocialAccount(account.id)" />
                            <p class="mt-2 text-sm font-medium">{{ account.accountName }}</p>
                          </template>
                        </div>
                      </section>
                      <UEmpty :title="t('newPostModal.noMoreAccounts')"
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
                    <UTextarea v-model="postToCreate.content" :placeholder="t('newPostModal.postPlaceholder')" :rows="8"
                      class="w-full" />

                    <div v-if="postHasError" class="mt-2 text-red-500 text-sm">
                      {{ t('validation.emptyPostOrNoPlatform') }}
                    </div>

                    <div class="mt-4 flex gap-2">
                      <UButton icon="i-heroicons-photo" variant="ghost">
                        {{ t('newPostModal.insertMedia') }}
                      </UButton>
                      <UButton icon="i-heroicons-paint-brush" variant="ghost">
                        {{ t('newPostModal.designMedia') }}
                      </UButton>
                      <UButton icon="i-heroicons-sparkles" variant="ghost">
                        {{ t('newPostModal.aiImage') }}
                      </UButton>
                    </div>

                    <div class="mt-4">
                      <h4 class="text-sm font-semibold mb-2">{{ t('newPostModal.commentsTitle') }}</h4>
                      <div v-for="(comment, index) in postToCreate.comment" :key="index"
                        class="flex items-center gap-2 mb-2">
                        <UTextarea v-model="postToCreate.comment[index]"
                          :placeholder="t('newPostModal.commentPlaceholder', { index: index + 1 })" :rows="8"
                          class="flex-1" />
                        <UButton v-if="postToCreate.comment.length > 0" icon="i-heroicons-trash-20-solid" color="error"
                          variant="ghost" @click="removeComment(index)" />
                      </div>
                      <UButton icon="i-heroicons-plus-circle-20-solid" variant="ghost" @click="addComment">
                        {{ t('newPostModal.addComment') }}
                      </UButton>
                    </div>
                  </div>
                </template>
                <template #media>
                  <p>{{ t('newPostModal.mediaLibraryContent') }}</p>
                  <MediaGalleryForUser v-model:selected="postMediaAssets" />
                </template>

              </UTabs>
            </div>

            <!-- Right Side: Preview -->
            <div class="flex-1 p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-semibold">{{ t('newPostModal.previewTitle') }}</h4>
                <USelect v-model="explicitPreviewPlatform" :items="previewSelectOptions" class="w-40" />
              </div>
              <component :is="previewComponent"
                :postContent="formatPostContent(postToCreate.content, currentPreviewPlatform)"
                :mediaAssets="postMediaAssets" :platform="currentPreviewPlatform"
                :post="postToCreate as unknown as PostCreateBase" />
              <div v-if="validationErrors.length > 0"
                class="mt-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
                <p class="font-semibold">{{ t('validation.previewErrors') }}</p>
                <ul>
                  <li v-for="(error, index) in validationErrors" :key="index">
                    {{ t('validation.platformError', { platform: error.platform, message: error.message }) }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton :disabled="haveAtLeastOneAccountSelected" color="secondary" variant="outline"
                @click="handleCreatePost('draft')">
                {{ t('newPostModal.saveDraft') }}
              </UButton>
              <UButton color="primary" variant="outline" @click="handleCreatePost('published')"
                :disabled="haveAtLeastOneAccountSelected">
                {{ t('newPostModal.postNow') }}
              </UButton>
              <UButton color="warning" variant="ghost" @click="handleCreatePost('scheduled')"
                :disabled="haveAtLeastOneAccountSelected">
                {{ t('newPostModal.schedule') }}
              </UButton>
            </div>
          </template>
        </UCard>
      </section>
    </template>

  </UModal>
</template>

<style scoped></style>
