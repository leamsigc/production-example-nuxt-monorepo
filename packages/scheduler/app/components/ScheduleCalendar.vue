<script lang="ts" setup>
/**
 *
 *
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/vue3";
import type { CalendarOptions, EventClickArg, EventInput, EventSourceInput } from "@fullcalendar/core";
import type { PostWithAllData } from "#layers/BaseDB/db/schema";
import PostCalendarPreview from "./PostCalendarPreview.vue";
interface Props {
  activeView?: "timeGridWeek" | 'timeGridDay' | "dayGridMonth"
  events: EventInput & {
    extendedProps: {
      post: PostWithAllData
    }
  }[]
}

const props = withDefaults(defineProps<Props>(), {
  activeView: "dayGridMonth",
  events: () => []
});
const { activeView, events } = toRefs(props)

const $emit = defineEmits({
  'date-clicked': (event: DateClickArg) => true,
  'event-clicked': (event: EventClickArg) => true
})

const { locale } = useI18n()

const calendarOptions: CalendarOptions = {
  plugins: [timeGridPlugin, interactionPlugin, dayGridPlugin],
  initialView: activeView.value,
  editable: true,
  nowIndicator: true,
  locale: locale.value,
  expandRows: true,
  validRange: {
    start: new Date(),
  },
  dateClick(arg: DateClickArg) {
    $emit('date-clicked', arg)
  },
  eventClick(arg: EventClickArg) {
    $emit('event-clicked', arg)
  },
  stickyHeaderDates: true,
  headerToolbar: {
    left: "prevYear,prev,today,next,nextYear",
    center: "title",
    right: "timeGridDay,timeGridWeek,dayGridMonth",
  },
  events: events.value,
};
</script>
<template>
  <FullCalendar :options="calendarOptions">
    <template v-slot:eventContent='arg'>
      <PostCalendarPreview :post="arg.event.extendedProps.post" />
    </template>

  </FullCalendar>
</template>

<style></style>
