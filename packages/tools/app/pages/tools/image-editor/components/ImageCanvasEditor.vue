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
const { run, addImageLayer } = useFabricJs();
const canvas = useTemplateRef('canvas');

const files = ref<File>();

const route = useRoute();

run(canvas);

onMounted(async () => {
  const imageId = route.query.imageId as string;
  console.log("image id ", imageId);

  if (imageId) {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/assets/serve/${imageId}.png`);
      if (response.ok) {
        const blob = await response.blob();
        const file = new File([blob], `${imageId}.png`, { type: 'image/png' });
        onFileDrop(file);
      }
    } catch (error) {
      console.error('Failed to load image from query param:', error);
    }
  }
});

const onFileDrop = async (f: File | File[] | null | undefined) => {
  if (files.value) return;
  const isArray = Array.isArray(f);
  if (!canvas.value || !f || isArray) return;
  const file = f;
  if (!file) return; // Ensure file is not undefined

  files.value = file; // Update the files ref
  addImageLayer(file);
};
</script>

<template>
  <canvas ref="canvas" class="w-screen h-screen absolute inset-0 bg-background/10" :class="{ 'opacity-0': !files }" />
  <section v-show="!files" class="w-full h-full absolute inset-0 bg-background/10 grid place-content-center">
    <!-- Step 1 Select Image -->
    <UFileUpload @update:model-value="onFileDrop" color="error" variant="area" label="Drop your image here"
      description="SVG, PNG, JPG or GIF (max. 2MB)" class="w-96 min-h-48 " />
  </section>
</template>
<style scoped></style>
