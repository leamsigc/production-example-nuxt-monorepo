<!--  Translation file -->
<i18n src="../connect.json"></i18n>
<script lang="ts" setup>
import { pageList } from '#build/ui';
import type { FacebookPage } from '#layers/BaseConnect/utils/FacebookPages';
import { useConnectionManager } from '../composables/useConnectionManager';

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
  tags: string[];
}
const { getPagesForIntegration, HandleConnectToFacebook, facebookPages } = useConnectionManager();

const modalStatus = ref(false);
const toggleModal = () => {
  modalStatus.value = !modalStatus.value;
};

const props = defineProps<Props>();

const items = [
  [
    {
      label: 'Pages',
      icon: 'i-heroicons-viewfinder-circle',
      onSelect: async () => {
        console.log("Get all pages for the current user", props.name);

        //Get all pages for the integration
        await getPagesForIntegration(props.name);
        toggleModal();
      },
    },
    {
      label: 'Reconnect',
      icon: 'i-heroicons-arrow-path',
      onSelect: () => {
        // Handle reconnect action
        console.log('Reconnect onSelected');
      },
    }, {
      label: 'Disconnect',
      icon: 'i-heroicons-link-slash',
      onSelect: () => {
        // Handle disconnect action
        console.log('Disconnect onSelected');
      },
    }, {
      label: 'Edit',
      icon: 'i-heroicons-pencil',
      onSelect: () => {
        // Handle edit action
        console.log('Edit clicked');
      },
    }]
];

const HandleConnectTo = async (page: unknown) => {
  if (props.name === 'facebook')
    await HandleConnectToFacebook(page as FacebookPage);

  toggleModal();
};
</script>

<template>
  <UPageCard :ui="{ body: 'flex-col', root: 'size-56' }">
    <section class="relative flex flex-col items-center justify-center p-4">
      <UAvatar :src="props.image" class="w-12 h-12 border border-primary relative" />
      <div v-if="props.icon" class="">
        <UAvatar :icon="props.icon" size="2xl" class="bg-white dark:bg-gray-900" />
      </div>
      <section class="text-center">
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
  <UModal v-model:open="modalStatus" title="Select a page"
    description="Here you can select a specific page to connect to base on the current connection" class="md:min-w-4xl">

    <template #body>
      <section class="grid grid-cols-3 gap-2">
        <UPageCard
          :ui="{ body: 'sm:p-0 p-0', root: 'sm:p-0 p-0 cursor-pointer', wrapper: 'p-0', container: 'p-0 sm:p-0' }"
          v-for="page in facebookPages" :key="page.id" @click="HandleConnectTo(page)">
          <section class="relative flex flex-col items-center justify-center p-4">
            <UAvatar :src="page.picture.data.url" class="size-20 border border-primary relative" />
            <section class="text-center">
              <h3 class="text-lg font-semibold">{{ page.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Id: {{ page.id }}</p>
            </section>
          </section>
        </UPageCard>
      </section>
    </template>
  </UModal>
</template>
<style scoped></style>
