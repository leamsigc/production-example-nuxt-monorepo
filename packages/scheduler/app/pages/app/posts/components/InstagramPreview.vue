<script lang="ts" setup>
/**
 *
 * Instagram Preview Component
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
import type { PostCreateBase, Asset } from '#layers/BaseDB/db/schema';

const props = defineProps<{
  post: PostCreateBase & { mediaAssets: Asset[] };
}>();
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-md mx-auto">
    <div class="flex items-center mb-3">
      <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="User" size="md" />
      <div class="ml-3">
        <p class="font-semibold text-gray-900 dark:text-white">User Name</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Just now</p>
      </div>
    </div>
    <p class="text-gray-800 dark:text-gray-200 mb-3">{{ props.post.content }}</p>
    <div v-if="props.post.mediaAssets && props.post.mediaAssets.length > 0" class="grid grid-cols-1 gap-2 mb-3">
      <img v-for="asset in props.post.mediaAssets" :key="asset.id" :src="asset.url" alt="Post media"
        class="rounded-lg w-full" />
    </div>
    <div v-if="props.post.content.length > 0 || (props.post.mediaAssets && props.post.mediaAssets.length > 0)"
      class="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-around text-gray-500 dark:text-gray-400 text-sm">
      <span>Like</span>
      <span>Comment</span>
      <span>Share</span>
    </div>
    <div v-if="props.post.comment && props.post.comment.length > 0"
      class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
      <p class="font-semibold text-gray-900 dark:text-white mb-2">Comments:</p>
      <div v-for="(comment, index) in props.post.comment" :key="index"
        class="text-gray-800 dark:text-gray-200 text-sm mb-1">
        {{ comment }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
