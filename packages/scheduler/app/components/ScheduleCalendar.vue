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
import type { CalendarOptions, EventClickArg, EventSourceInput } from "@fullcalendar/core";

interface Props {
  activeView?: "timeGridWeek" | 'timeGridDay' | "dayGridMonth"
  events: EventSourceInput
}

const { activeView, events } = withDefaults(defineProps<Props>(), {
  activeView: "dayGridMonth",
  events: () => []
});

const $emit = defineEmits({
  'date-clicked': (event: DateClickArg) => true,
  'event-clicked': (event: EventClickArg) => true
})

const { locale } = useI18n()

const calendarOptions: CalendarOptions = {
  plugins: [timeGridPlugin, interactionPlugin, dayGridPlugin],
  initialView: activeView,
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
  events,
};
</script>
<template>
  <FullCalendar :options="calendarOptions" />
</template>

<style></style>
