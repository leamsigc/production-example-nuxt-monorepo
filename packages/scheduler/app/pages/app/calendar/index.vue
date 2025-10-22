<script lang="ts" setup>
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
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/vue3";
import type { CalendarOptions } from "@fullcalendar/core";

const toast = useToast()
const date = useDateFormat(useNow(), "YYYY-MM-DD");
const calendarOptions: CalendarOptions = {
  plugins: [timeGridPlugin, interactionPlugin, dayGridPlugin],
  initialView: "timeGridWeek",
  editable: true,
  nowIndicator: true,
  dateClick(arg) {
    const date = useDateFormat(arg.date, "dddd, MMMM D, YYYY h:mm A")
    toast.add({
      title: "Date clicked",
      description: date.value,
      color: "info",
    });
  },
  eventClick(arg) {
    toast.add({
      title: "Event clicked",
      description: `${arg.event.title}`,
      color: "info",
    });
  },
  stickyHeaderDates: true,
  headerToolbar: {
    left: "prevYear,prev,today,next,nextYear",
    center: "title",
    right: "timeGridDay,timeGridWeek,dayGridMonth",
  },
  events: [
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
  ],
};
</script>
<template>
  <FullCalendar :options="calendarOptions" />
</template>

<style></style>
