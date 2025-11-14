<script lang="ts" setup>
/**
 *
 * Twitter Preview Component
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
const props = defineProps<{
  postContent: string;
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
    <p class="text-gray-800 dark:text-gray-200 mb-3">{{ postContent }}</p>
    <div v-if="postContent.length > 0"
      class="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-around text-gray-500 dark:text-gray-400 text-sm">
      <span>Like</span>
      <span>Retweet</span>
      <span>Comment</span>
    </div>
  </div>
</template>

<style scoped></style>
