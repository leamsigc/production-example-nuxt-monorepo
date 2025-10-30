<!--  Translation file -->
<i18n src="../connect.json"></i18n>
<script lang="ts" setup>
/**
 *
 * Integration card
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */

interface Props {
  name: string;
  image: string;
  connected: boolean;
  time: string;
  icon?: string; // Optional icon for the integration, e.g., 'i-simple-icons-linkedin'
}

const props = defineProps<Props>();

const items = [
  [{
    label: 'Reconnect',
    icon: 'i-heroicons-arrow-path',
    click: () => {
      // Handle reconnect action
      console.log('Reconnect clicked');
    },
  }, {
    label: 'Disconnect',
    icon: 'i-heroicons-link-slash',
    click: () => {
      // Handle disconnect action
      console.log('Disconnect clicked');
    },
  }, {
    label: 'Edit',
    icon: 'i-heroicons-pencil',
    click: () => {
      // Handle edit action
      console.log('Edit clicked');
    },
  }]
];
</script>

<template>
  <UPageCard :ui="{ body: 'flex-col' }">
    <section class="relative flex flex-col items-center justify-center p-4">
      <UAvatar :src="props.image" class="w-24 h-24 border-4 border-primary relative" />
      <div v-if="props.icon" class="absolute bottom-16 right-16">
        <UAvatar :icon="props.icon" size="md" class="bg-white dark:bg-gray-900" />
      </div>
      <section class="text-center mt-4">
        <h3 class="text-lg font-semibold">{{ props.name }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Added: {{ props.time }}</p>
        <UBadge v-if="props.connected" color="success" variant="subtle" class="mt-2">Connected</UBadge>
        <UBadge v-else color="error" variant="subtle" class="mt-2">Disconnected</UBadge>
      </section>
      <div class="absolute top-2 right-2">
        <UDropdownMenu :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
        </UDropdownMenu>
      </div>
    </section>
  </UPageCard>
</template>
<style scoped></style>
