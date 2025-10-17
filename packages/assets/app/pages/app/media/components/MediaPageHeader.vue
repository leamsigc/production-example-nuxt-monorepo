<!--  Translation file -->
<i18n src="../index.json"></i18n>

<script lang="ts" setup>
/**
 * Component Description: Asset Page Header with Navigation and Actions
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test
 * @todo [✔] Update the typescript
 */

interface Props {
  selectedAssetsCount: number
  showUploader?: boolean
}

interface Emits {
  deleteSelected: []
  uploadAssets: []
}

const props = withDefaults(defineProps<Props>(), {
  selectedAssetsCount: 0,
  showUploader: true
})
const emit = defineEmits<Emits>()
const { t } = useI18n()
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="mb-4">
      <div class="flex items-center gap-2">
        <UButton variant="ghost" size="sm" as-child>
          <NuxtLink to="/app">
            <Icon name="lucide:arrow-left" size="32" />
          </NuxtLink>
        </UButton>
        <div>
          <h1 class="text-3xl font-bold">
            <slot name="title">
              {{ t('title') }}
            </slot>
          </h1>
          <p class="text-muted-foreground">
            <slot name="description">
              {{ t('description') }}
            </slot>
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <UButton v-if="selectedAssetsCount > 0" color="error" variant="solid" @click="emit('deleteSelected')">
        <Icon name="lucide:trash-2" class="mr-2 h-4 w-4" />
        {{ t('buttons.delete_selected', { count: selectedAssetsCount }) }}
      </UButton>

      <UButton @click="emit('uploadAssets')" v-if="showUploader">
        <Icon name="lucide:upload" class="mr-2 h-4 w-4" />
        {{ t('buttons.upload_assets') }}
      </UButton>
    </div>
  </div>
</template>
