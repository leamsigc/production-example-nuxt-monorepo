<script lang="ts" setup>
import type { BusinessProfile } from '#layers/BaseDB/db/schema';


const props = defineProps<{
  business: BusinessProfile;
}>();

const emit = defineEmits(['edit', 'delete']);
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
    <div>
      <h3 class="text-lg font-semibold">{{ business.name }}</h3>
      <p class="text-gray-600 text-sm">{{ business.description }}</p>
      <p class="text-gray-500 text-xs">Status: {{ business.isActive }}</p>
    </div>
    <div class="mt-4 flex justify-end space-x-2">
      <BaseButton :button="{ size: 'sm', variant: 'outline' }" @click="emit('edit', business.id)">Edit</BaseButton>
      <BaseButton :button="{ size: 'sm', variant: 'solid' }" @click="emit('delete', business.id)">Delete
      </BaseButton>
    </div>
  </div>
</template>
