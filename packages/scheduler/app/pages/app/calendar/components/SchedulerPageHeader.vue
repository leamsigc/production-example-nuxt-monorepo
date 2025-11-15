<!--  Translation file -->
<i18n src="../calendar.json"></i18n>

<script lang="ts" setup>
import NewPostModal from '../../posts/components/NewPostModal.vue'
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



interface Emits {
  createNewPost: []
}
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
      <UButton color="neutral" variant="ghost" to="/app/posts">
        <Icon name="lucide:layout-dashboard" class="mr-2 h-4 w-4" />
        {{ t('buttons.dashboard') }}
      </UButton>
      <UButton color="neutral" variant="ghost" to="/app/calendar/weeks">
        <Icon name="lucide:calendar-days" class="mr-2 h-4 w-4" />
        {{ t('buttons.week') }}
      </UButton>
      <UButton color="neutral" variant="ghost" to="/app/calendar/month">
        <Icon name="lucide:calendar" class="mr-2 h-4 w-4" />
        {{ t('buttons.month') }}
      </UButton>

      <NewPostModal />
    </div>
  </div>
</template>
