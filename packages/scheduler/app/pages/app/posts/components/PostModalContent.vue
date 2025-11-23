<!--  Translation file -->
<i18n src="../posts.json"></i18n>

<script lang="ts" setup>
/**
 *
 * Component Description: This component encapsulates the main content and logic for creating or updating a social media post.
 * It handles post content, media assets, platform selection, previews, and validation.
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *>
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
import { ref, computed, defineAsyncComponent, watch, onMounted } from 'vue';
import { usePlatformConfiguration, type PlatformConfig, type SocialMediaPlatformConfigurations } from '../composables/usePlatformConfiguration';
import type { PostCreateBase, Asset, Post, PostWithAllData } from '#layers/BaseDB/db/schema';
import { useSocialMediaManager } from '#imports';
import { useAssetManager } from '#imports';
import dayjs from 'dayjs';

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
import { CalendarDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

interface TargetPlatform {
  accountId: string;
  platformType: keyof SocialMediaPlatformConfigurations;
}

interface PostForm extends Omit<PostCreateBase, 'targetPlatforms' | 'mediaAssets'> { // Removed 'comment' from Omit
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  targetPlatforms: TargetPlatform[];
  comment: string[]; // PostCreateBase already defines this as string[]
  mediaAssets: string[];
  tags?: string[];
  categories?: string[];
  privacySetting?: 'public' | 'private' | 'unlisted';
  isShort?: boolean;
  isStory?: boolean;
  hasSound?: boolean;
}

const props = defineProps<{
  initialPost?: PostWithAllData;
}>();

const emit = defineEmits(['save', 'update', 'close']);

const { t } = useI18n();
const toast = useToast();
const { getAllSocialMediaAccounts, pagesList } = useSocialMediaManager();
const { getAssetsByIds } = useAssetManager();
const { platformConfigurations, validatePostForPlatform } = usePlatformConfiguration();

const postForm = ref<PostForm>({
  content: '',
  businessId: '',
  scheduledAt: new Date(),
  mediaAssets: [],
  targetPlatforms: [],
  status: 'draft',
  comment: []
});
const now = new Date();
const selectedDate = shallowRef(
  new CalendarDate(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  )
)
const isDateUnavailable = (date: DateValue) => {
  // Check if the selected date is in the past
  return dayjs(date.toString()).isBefore(dayjs().add(-1, 'day'));
}
const selectedTime = ref(dayjs(postForm.value.scheduledAt).format('HH:mm'));

watch([selectedDate, selectedTime], () => {
  postForm.value.scheduledAt = dayjs(`${selectedDate.value}T${selectedTime.value}`).toDate();
});

const formattedScheduledAt = computed(() =>
  dayjs(postForm.value.scheduledAt).format('DD/MM/YYYY HH:mm')
);
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
  if (props.initialPost) {
    const platformPosts = props.initialPost.platformPosts;

    if (platformPosts && platformPosts.length > 0) {
      const firstPlatformPost = platformPosts[0];
      explicitPreviewPlatform.value = firstPlatformPost?.platformPostId as keyof typeof previewsMap || 'default';
    }
    console.log("#####", platformPosts);

    const processedTargetPlatforms: TargetPlatform[] = platformPosts.map(p => ({
      accountId: p.socialAccountId,
      platformType: p.platformPostId as keyof SocialMediaPlatformConfigurations,
    }));
    const initialCommentsRaw = (props.initialPost as { comment?: string | string[] }).comment;
    const processedComments: string[] = Array.isArray(initialCommentsRaw)
      ? initialCommentsRaw
      : (initialCommentsRaw ? [initialCommentsRaw] : []);

    const initialMediaAssetsRaw = JSON.parse(props.initialPost.mediaAssets as string);
    const processedMediaAssetsIds: string[] = Array.isArray(initialMediaAssetsRaw)
      ? initialMediaAssetsRaw
      : (initialMediaAssetsRaw ? [initialMediaAssetsRaw] : []);

    postForm.value = {
      ...props.initialPost,
      targetPlatforms: processedTargetPlatforms,
      mediaAssets: processedMediaAssetsIds,
      comment: processedComments,
    } as PostForm;

    const scheduleAt = dayjs(postForm.value.scheduledAt).toDate();
    selectedTime.value = dayjs(postForm.value.scheduledAt).format('HH:mm');


    selectedDate.value = new CalendarDate(
      scheduleAt.getFullYear(),
      scheduleAt.getMonth() + 1,
      scheduleAt.getDate()
    );

    if (processedMediaAssetsIds.length > 0) {
      postMediaAssets.value = await getAssetsByIds(processedMediaAssetsIds);
    }
  }
});

function addComment() {
  postForm.value.comment.push('');
}

function removeComment(index: number) {
  postForm.value.comment.splice(index, 1);
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
  const existingIndex = postForm.value.targetPlatforms.findIndex(
    (target) => target.accountId === accountId
  );

  if (existingIndex !== -1) {
    postForm.value.targetPlatforms.splice(existingIndex, 1);
  } else {
    const account = pagesList.value.find((page) => page.id === accountId);
    const platform = account?.platform as keyof SocialMediaPlatformConfigurations || 'default';
    explicitPreviewPlatform.value = platform;
    if (account) {
      postForm.value.targetPlatforms.push({
        accountId: account.id,
        platformType: account.platform as keyof SocialMediaPlatformConfigurations,
      });
    }
  }
}

const handleSavePost = async (status: 'draft' | 'scheduled' | 'published' | 'failed') => {
  validationErrors.value = [];
  postHasError.value = false;

  if (!postForm.value.content.trim() && postForm.value.mediaAssets.length === 0) {
    postHasError.value = true;
    toast.add({ title: t('validation.emptyPost'), icon: 'i-heroicons-exclamation-triangle', color: 'error' });
    return;
  }

  if (postForm.value.targetPlatforms.length === 0) {
    postHasError.value = true;
    toast.add({ title: t('validation.noPlatformSelected'), icon: 'i-heroicons-exclamation-triangle', color: 'error' });
    return;
  }

  let firstInvalidPlatform: TargetPlatform | null = null;

  for (const targetPlatform of postForm.value.targetPlatforms) {
    const { isValid, message } = validatePostForPlatform(postForm.value, postMediaAssets.value, targetPlatform.platformType);
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
        description: validationErrors.value.map(e => e.message).join('\n'),
        icon: 'i-heroicons-exclamation-triangle',
        color: 'error',
      });
    }
    return;
  }

  if (status === 'scheduled' && dayjs(postForm.value.scheduledAt).isBefore(dayjs())) {
    postHasError.value = true;
    toast.add({ title: t('validation.pastScheduledTime'), icon: 'i-heroicons-exclamation-triangle', color: 'error' });
    return;
  }

  const postData = {
    ...postForm.value,
    status: status,
    targetPlatforms: postForm.value.targetPlatforms.map(platform => platform.accountId),
    businessId: activeBusinessId.value,
    mediaAssets: postMediaAssets.value.map(asset => asset.id)
  };

  if (props.initialPost) {
    emit('update', postData);
  } else {
    emit('save', postData);
  }
}

const ResetToBase = () => {
  postForm.value = {
    content: '',
    businessId: '',
    scheduledAt: new Date(),
    mediaAssets: [],
    targetPlatforms: [],
    status: 'draft',
    comment: []
  }
  selectedDate.value = new CalendarDate(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );
  selectedTime.value = dayjs(postForm.value.scheduledAt).format('HH:mm');
  postMediaAssets.value = [];
  postHasError.value = false;
  validationErrors.value = [];
  explicitPreviewPlatform.value = 'default';
}

const HandleAssetsSelected = (assets: Asset[]) => {
  postMediaAssets.value = assets;
  postForm.value.mediaAssets = assets.map(asset => asset.id);
}

const haveAtLeastOneAccountSelected = computed(() => {
  return postForm.value.targetPlatforms.length === 0;
})
const setScheduleDateAt = (date: Date) => {

  postForm.value.scheduledAt = date;
  selectedDate.value = new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  selectedTime.value = dayjs(postForm.value.scheduledAt).format('HH:mm');
}

defineExpose({
  ResetToBase,
  setScheduleDateAt
});
</script>

<template>
  <section class="min-w-4xl">
    <UCard>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white flex">
          <div class="flex items-center gap-2 ml-5">
            <!-- Social Accounts Selection -->
            <div class="flex -space-x-1">
              <section v-for="target in postForm.targetPlatforms" :key="target.accountId">
                <template v-if="pagesList.find(p => p.id === target.accountId)">
                  <UAvatar :src="pagesList.find(p => p.id === target.accountId)?.entityDetail?.details?.picture"
                    :alt="pagesList.find(p => p.id === target.accountId)?.accountName" size="sm"
                    class="cursor-pointer ring-2 ring-white dark:ring-gray-900"
                    :class="{ 'border border-primary': postForm.targetPlatforms.some(t => t.accountId === target.accountId) }"
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
                    <div v-for="account in pagesList" :key="account.id" class="flex flex-col items-center"
                      @click="toggleSocialAccount(account.id)">
                      <template v-if="!postForm.targetPlatforms.some(target => target.accountId === account.id)">
                        <UAvatar :src="account.entityDetail.details.picture" :alt="account.accountName" size="3xl"
                          class="cursor-pointer ring-2 ring-white dark:ring-gray-900"
                          :class="{ 'border border-primary': postForm.targetPlatforms.some(target => target.accountId === account.id) }" />
                        <p class="mt-2 text-sm font-medium">{{ account.accountName }}</p>
                      </template>
                    </div>
                  </section>
                  <UEmpty :title="t('newPostModal.noMoreAccounts')"
                    v-if="pagesList.length === postForm.targetPlatforms.length" />
                </UCard>

              </template>
            </UPopover>
          </div>

        </h3>
        <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
          @click="emit('close')" />
      </div>

      <div class="flex flex-col lg:flex-row h-full">
        <!-- Left Side: Editor and Comments -->
        <div class="flex-1 p-4 border-r border-gray-200 dark:border-gray-800">
          <UTabs :items="tabs" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">

            <template #editor>
              <div class="py-3">
                <UTextarea v-model="postForm.content" :placeholder="t('newPostModal.postPlaceholder')" :rows="8"
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
                  <div v-for="(comment, index) in postForm.comment" :key="index" class="flex items-center gap-2 mb-2">
                    <UTextarea v-model="postForm.comment[index]"
                      :placeholder="t('newPostModal.commentPlaceholder', { index: index + 1 })" :rows="8"
                      class="flex-1" />
                    <UButton v-if="postForm.comment.length > 0" icon="i-heroicons-trash-20-solid" color="error"
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
          <component :is="previewComponent" :postContent="formatPostContent(postForm.content, currentPreviewPlatform)"
            :mediaAssets="postMediaAssets" :platform="currentPreviewPlatform"
            :post="postForm as unknown as PostCreateBase" />
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-800 pt-4 flex justify-center">
        <UPopover>
          <UButton icon="i-heroicons-calendar" variant="ghost">
            <span class="text-sm cursor-pointer hover:text-primary">
              {{ formattedScheduledAt }}
            </span>
          </UButton>
          <template #content>
            <div class="p-4 space-y-4">
              <UCalendar v-model="selectedDate" :is-date-unavailable="isDateUnavailable" />
              <UInput v-model="selectedTime" type="time" />
            </div>
          </template>
        </UPopover>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton :disabled="haveAtLeastOneAccountSelected" color="secondary" variant="outline"
            @click="handleSavePost('draft')">
            {{ t('newPostModal.saveDraft') }}
          </UButton>
          <UButton color="primary" variant="outline" @click="handleSavePost('published')"
            :disabled="haveAtLeastOneAccountSelected">
            {{ t('newPostModal.postNow') }}
          </UButton>
          <UButton color="warning" variant="ghost" @click="handleSavePost('scheduled')"
            :disabled="haveAtLeastOneAccountSelected">
            {{ t('newPostModal.schedule') }}
          </UButton>
        </div>
      </template>
    </UCard>
  </section>
</template>
<style scoped></style>
