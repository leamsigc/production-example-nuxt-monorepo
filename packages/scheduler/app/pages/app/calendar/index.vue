<!--  Translation file -->
<i18n src="./calendar.json"></i18n>
<script lang="ts" setup>
import type { DateClickArg } from '@fullcalendar/interaction/index.js';
import SchedulerPageHeader from './components/SchedulerPageHeader.vue';
import type { EventClickArg } from '@fullcalendar/core/index.js';

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
const { t } = useI18n()
useHead({
  title: t('seo_title_all'),
  meta: [
    { name: 'description', content: t('seo_description_all') }
  ]
})
const toast = useToast()
const date = useDateFormat(useNow(), "YYYY-MM-DD");
const events = [
  {
    title: "Attend Data Protection Act Webinar",
    date: date.value,
    url: "https://ui-thing.behonbaker.com/",
  },
  {
    title: "Travel to Kingston for Manager's Meeting",
    date: date.value,
  },
  {
    title: "Vacation in Montego Bay",
    allDay: true,
    color: "green",
    date: `${useDateFormat("2025-09-31", "YYYY-MM-DD").value}`,
    end: `${useDateFormat("2025-11-31", "YYYY-MM-DD").value}`,
  },
]

const HandleDateClicked = (event: DateClickArg) => {
  toast.add({
    title: 'Date Clicked',
    description: ` Date clicked: ${event.dateStr}`,
    color: 'success'
  })
}
const HandleEventClicked = (event: EventClickArg) => {
  toast.add({
    title: 'Date Clicked',
    description: ` Date clicked: ${event.event.title}`,
    color: 'success'
  })
}
</script>
<template>
  <div class="container mx-auto py-6 space-y-6">
    <SchedulerPageHeader />
    <ScheduleCalendar :events="events" @date-clicked="HandleDateClicked" @event-clicked="HandleEventClicked" />
  </div>
</template>

<style></style>
