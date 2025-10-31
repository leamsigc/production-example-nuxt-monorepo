<!--  Translation file -->
<i18n src="../connect.json"></i18n>
<script lang="ts" setup>
import { useConnectionManager } from '../composables/useConnectionManager';

/**
 *
 * The connection modal here
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */

const { connectionList, setConnectionList, HandleConnectTo } = useConnectionManager();

setConnectionList();
const { t } = useI18n();
</script>

<template>
  <UModal>
    <UButton color="primary" variant="outline" class="grid place-content-center py-8 shadow cursor-pointer size-56">
      <section class="flex flex-col items-center gap-2 border-2 border-primary  rounded-full p-4 mb-2 w-24 h-24">
        <Icon name="lucide:plus" size="80" class="" />
      </section>
      <h3 class=" text-center">{{ t('states.add_connection') }}</h3>

    </UButton>

    <template #content>
      <section class="grid grid-cols-3 gap-4 p-6">
        <UButton color="neutral" variant="soft" v-for="connection in connectionList" :key="connection.name"
          @click="HandleConnectTo(connection)" class="p-4   rounded grid place-content-center text-center">
          <Icon :name="connection.icon" size="48" class="w-20" />
          <h3>{{ connection.name }}</h3>
        </UButton>
        <UButton color="neutral" variant="soft" class="p-4  rounded grid place-content-center text-center" disabled>
          <h3>{{ t('states.coming_soon') }}</h3>
        </UButton>
      </section>
    </template>
  </UModal>
</template>
<style scoped></style>
