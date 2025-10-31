<!--  Translation file -->
<i18n src="./connect.json"></i18n>
<script lang="ts" setup>
/**
 *
 * Connection page
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
import ConnectIntegrationCard from './components/ConnectIntegrationCard.vue';
import ConnectAddAccount from './components/ConnectAddAccount.vue';
import { useConnectionManager } from './composables/useConnectionManager';
import type { SocialMediaAccount } from '#layers/BaseDB/db/schema';
import { listAccounts } from '#layers/BaseAuth/lib/auth-client';

const { getAllConnections } = useConnectionManager();

const { t } = useI18n();

useHead({
  title: t('seo_title_all'),
  meta: [
    { name: 'description', content: t('seo_description_all') }
  ]
})
const accounts = await listAccounts();

</script>

<template>
  <div class="container mx-auto py-6 space-y-6">
    <BasePageHeader :title="t('title')" :description="t('description')" />

    <div class="grid grid-cols-5 gap-2">
      <ConnectAddAccount />
      <ConnectIntegrationCard v-for="connection in accounts.data" :name="connection.providerId" :key="connection.id"
        image="https://avatars.githubusercontent.com/u/739984?v=4" :icon="`logos:${connection.providerId}`"
        :tags="connection.scopes" :time="connection.createdAt.toLocaleDateString()" connected />
    </div>
  </div>
</template>
<style scoped></style>
