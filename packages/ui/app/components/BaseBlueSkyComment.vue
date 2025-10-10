<script lang="ts" setup>
import type { DisplayThread } from '#layers/BaseUI/shared/BaseBlueSkyTypes';


/**
 *
 * Single comment component.
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
interface Props {
  thread: DisplayThread;
}


const props = defineProps<Props>();
const { thread } = toRefs(props);


const getAvatarUrl = (avatarUrl: string) => {
  return avatarUrl.replace("/img/avatar/", "/img/avatar_thumbnail/")
}

const getAuthorProfileUrl = (did: string) => {
  return `https://bsky.app/profile/${did}`
}

const getPostUrl = (did: string, uri: string) => {
  const postId = uri.split("/").pop()
  return `https://bsky.app/profile/${did}/post/${postId}`
}

const formatFullDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const getAbbreviatedTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays}d`
  if (diffHours > 0) return `${diffHours}h`
  if (diffMinutes > 0) return `${diffMinutes}m`
  return `${diffSeconds}s`
}


</script>

<template>
  <div class="border-b border-primary/10 dark:border-primary/50 pt-4 last:border-b-0"
    :class="{ 'border-l ml-4 pt-1': thread.isReply, 'border-l border-gray-200 pb-10 ': !thread.isReply }">
    <section class="hover:opacity-60 cursor-pointer transition-all">
      <div class="flex items-center gap-3 px-4">
        <UAvatar :src="thread.post.author.avatar ? getAvatarUrl(thread.post.author.avatar) : undefined"
          :alt="thread.post.author.displayName || thread.post.author.handle">
          <template #fallback>
            {{ thread.post.author.displayName || thread.post.author.handle }}
          </template>
        </UAvatar>

        <NuxtLink :href="getAuthorProfileUrl(thread.post.author.did)" class="grid gap-1"
          :title="thread.post.author.handle">
          <p class="text-sm font-medium leading-none">
            {{ thread.post.author.displayName || thread.post.author.handle }}
          </p>
          <p class="text-sm text-muted-foreground">
            @{{ thread.post.author.handle }}
          </p>
        </NuxtLink>
        <NuxtLink :href="getPostUrl(thread.post.author.did, thread.post.uri)" target="_blank" rel="ugc"
          :title="formatFullDate(thread.post.record.createdAt)"
          class="ml-auto text-xs font-light opacity-80 hover:underline">
          {{ getAbbreviatedTime(thread.post.record.createdAt) }}
        </NuxtLink>
      </div>

      <div class="comment-body">
        <a :href="getPostUrl(thread.post.author.did, thread.post.uri)" target="_blank" rel="nofollow noopener"
          class="block px-4">
          <div class="py-1">{{ thread.post.record.text }}</div>
          <div
            class="flex justify-between items-center py-1 text-sm text-muted-foreground dark:text-primary-foreground/50 max-w-xs">
            <div class="flex items-center gap-1">
              <Icon name="lucide:reply" />
              <span>{{ thread.post.replyCount || 0 }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Icon name="lucide:repeat" />
              <span>{{ thread.post.repostCount || 0 }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Icon name="lucide:heart" />
              <span>{{ thread.post.likeCount || 0 }}</span>
            </div>
          </div>
        </a>
      </div>
    </section>
    <BaseBlueSkyComment v-for="reply in thread.replies" :key="reply.post.indexedAt" :thread="reply" />
  </div>
</template>
<style scoped></style>
