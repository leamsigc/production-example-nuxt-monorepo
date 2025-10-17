<script lang="ts" setup>
import { useFabricJs } from '../composables/useFabricJs';

/**
 *
 * Canvas Editor
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
const { triggerRemoveBackground, addImageLayer } = useFabricJs();
const { status, result } = useImageTransformer();
const handleRemoveImage = () => {
  triggerRemoveBackground();
}

watch(result, () => {
  const file = result.value[0];
  if (!file) return;
  addImageLayer(file);
})
</script>

<template>
  <section class="grid grid-cols-2 max-w-full gap-2 p-2">
    <UPageCard variant="subtle" class="cursor-pointer" title="Remove background"
      description="Remove the background from the image and leave only the image content." icon="i-heroicons-photo"
      @click="handleRemoveImage">
      <UProgress animation="swing" v-if="status == 'loading' || status == 'processing'" />
    </UPageCard>
    <UPageCard variant="subtle" class="cursor-pointer" title="Generate" description="Generate an image with AI."
      icon="i-heroicons-sparkles" />
  </section>
</template>
<style scoped></style>
