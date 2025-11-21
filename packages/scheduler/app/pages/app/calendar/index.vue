<!--  Translation file -->
<i18n src="./calendar.json"></i18n>
<script lang="ts" setup>
import type { DateClickArg } from '@fullcalendar/interaction/index.js';
import SchedulerPageHeader from './components/SchedulerPageHeader.vue';
import type { EventClickArg } from '@fullcalendar/core/index.js';
import { usePostManager } from '../posts/composables/UsePostManager';
import UpdatePostModal from '../posts/components/UpdatePostModal.vue';
import type { Post } from '#layers/BaseDB/db/schema';

/**
 *
 * Component Description:Individual preview page for BaseBannerPromo component
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */


const activeBusinessId = useState<string>('business:id');

const { getPosts, postList } = usePostManager();
await getPosts(activeBusinessId.value);

const { t } = useI18n()
useHead({
  title: t('seo_title_month'),
  meta: [
    { name: 'description', content: t('seo_description_month') }
  ]
})
const toast = useToast()
const events = postList.value.map(post => {
  return {
    post,
    id: post.id,
    title: post.content.slice(0, 50),
    date: post.scheduledAt,
    extendedProps: {
      post
    }
  }
})

const HandleDateClicked = (event: DateClickArg) => {
  toast.add({
    title: 'Date Clicked',
    description: ` Date clicked: ${event.dateStr}`,
    color: 'success'
  })
}

const updatePostModalRef = ref<InstanceType<typeof UpdatePostModal> | null>(null);

const HandleEventClicked = (event: EventClickArg) => {
  toast.add({
    title: 'event Clicked',
    description: ` Date clicked: ${event.event.title}`,
    color: 'success'
  })

  if (event.event.extendedProps?.post) {
    updatePostModalRef.value?.openModal(event.event.extendedProps.post);
  }
}
</script>
<template>
  <div class="container mx-auto py-6 space-y-6">
    <SchedulerPageHeader />
    <ScheduleCalendar :events="events" @date-clicked="HandleDateClicked" @event-clicked="HandleEventClicked" />
    <UpdatePostModal ref="updatePostModalRef" />
  </div>
</template>

<style></style>
