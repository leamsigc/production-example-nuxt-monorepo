<script lang="ts" setup>
import type { Asset } from '#layers/BaseDB/db/schema'

/**
 *
 * Component Description:Desc
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
const { assets, fetUserAssets } = useAssetManagement()
await fetUserAssets()
const $emit = defineEmits({
  select: (asset: Asset[]) => true,
  deselect: (asset: Asset[]) => true
})

const selected = defineModel<Asset[]>('selected', {
  type: Array,
  default: () => [],
})
const HandleSelect = (asset: Asset) => {
  if (selected.value.includes(asset)) {
    selected.value = selected.value.filter(item => item.id !== asset.id)
    $emit('deselect', selected.value)

  } else {
    selected.value.push(asset)
    $emit('select', selected.value)
  }
}

const showUploader = ref(false)
</script>

<template>
  <section class="mt-5">
    <!-- Upload button -->
    <UButton size="sm" class="glass-button hover-scale-105 shrink-0" @click="showUploader = !showUploader">
      {{ showUploader ? '' : 'Upload' }}
      <Icon :name="showUploader ? 'lucide:x' : 'lucide:upload'" class="w-4 h-4" />
    </UButton>
    <section v-if="showUploader" class="mt-5">
      <MediaUploader :business-id="''" :with-padding="false" />
    </section>

    <div class="grid grid-cols-2 sm:grid-cols-2  gap-2 mt-3">
      <BaseShinyCard v-for="asset in assets" :key="asset.id" :show-bg="false" @click="HandleSelect(asset)">
        <UCard :ui="{ header: 'p-0 sm:p-2', footer: 'p-0 sm:p-2', body: 'p-0 sm:p-0 h-full', root: 'p-1' }"
          class="bg-muted/50 dark:bg-card hover:bg-background dark:hover:bg-background transition-all delay-75 group/number h-full relative">
          <!-- Selected overlay -->
          <section class="text-muted-foreground">
            <div
              class="absolute inset-0 bg-primary-950/95  rounded-lg  transition-opacity duration-500 z-50 grid place-content-center font-black"
              v-if="selected.find(item => item.id === asset.id)">
              Selected
            </div>
            <img :src="asset.url" :alt="asset.originalName"
              class="w-full h-full object-cover rounded-lg shadow-md aspect-square" />
          </section>
        </UCard>
      </BaseShinyCard>
    </div>
  </section>
</template>
<style scoped></style>
