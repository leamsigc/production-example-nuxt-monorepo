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

const { getAllConnections, allConnections } = useConnectionManager();
const { data } = await useFetch<SocialMediaAccount[]>('/api/v1/social-accounts');

if (data.value) {
  getAllConnections(data.value);
}

const { t } = useI18n();

useHead({
  title: t('seo_title_all'),
  meta: [
    { name: 'description', content: t('seo_description_all') }
  ]
})
</script>

<template>
  <div class="container mx-auto py-6 space-y-6">
    <BasePageHeader :title="t('title')" :description="t('description')" />
    <div class="grid grid-cols-4 gap-5">
      <ConnectAddAccount />
      <ConnectIntegrationCard v-for="connection in allConnections" :name="connection.accountName" :key="connection.id"
        image="https://avatars.githubusercontent.com/u/739984?v=4" icon="logos:twitter" time="2 days ago" connected />
    </div>
  </div>
</template>
<style scoped></style>
