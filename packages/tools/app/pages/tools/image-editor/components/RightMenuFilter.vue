<script lang="ts" setup>
/**
 * Right Menu Filter Component
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */

import { useFabricJs } from '../composables/useFabricJs';
import { ref } from 'vue';

const { applyImageAdjustment, applyPresetFilter, editor } = useFabricJs();

// Reactive values for adjustment filters (arrays for slider compatibility)
const brightness = ref(0);
const contrast = ref(0);
const saturation = ref(0);
const hue = ref(0);
const blur = ref(0);

// Preset filters available
const presetFilters = [
  'Original',
  'Grayscale',
  'Sepia',
  'Negative',
  'Contrast',
  'Brightness',
  'dramatic',
  'nature',
];

// Check if active object is an image
const isActiveImage = () => {
  if (!editor.value) return false;
  const activeObject = editor.value?.activeLayer.value;
  return activeObject && activeObject.type === 'image';
};

// Apply adjustment filter
const applyAdjustment = (
  type: 'Brightness' | 'Contrast' | 'Saturation' | 'Hue' | 'Blur',
  value: number,
) => {
  if (isActiveImage()) {
    applyImageAdjustment(type, value);
  }
};

// Apply preset filter
const applyPreset = (preset: string) => {
  if (isActiveImage()) {
    applyPresetFilter(preset);
  }
};
</script>

<template>
  <section class="p-4 space-y-6">
    <h3 class="text-lg font-semibold mb-4">Filter Editor</h3>

    <!-- Adjustment Filters -->
    <div class="space-y-4">
      <h4 class="text-sm font-medium text-muted-foreground">Adjustments</h4>

      <div class="space-y-3">
        <div>
          <label class="text-sm font-medium">Brightness</label>
          <USlider v-model="brightness" :min="-1" :max="1" :step="0.01" class="mt-2"
            @update:model-value="applyAdjustment('Brightness', brightness)" />
          <div class="text-xs text-muted-foreground mt-1">{{ brightness.toFixed(2) }}</div>
        </div>

        <div>
          <label class="text-sm font-medium">Contrast</label>
          <USlider v-model="contrast" :min="-1" :max="1" :step="0.01" class="mt-2"
            @update:model-value="applyAdjustment('Contrast', contrast)" />
          <div class="text-xs text-muted-foreground mt-1">{{ contrast.toFixed(2) }}</div>
        </div>

        <div>
          <label class="text-sm font-medium">Saturation</label>
          <USlider v-model="saturation" :min="-1" :max="1" :step="0.01" class="mt-2"
            @update:model-value="applyAdjustment('Saturation', saturation)" />
          <div class="text-xs text-muted-foreground mt-1">{{ saturation.toFixed(2) }}</div>
        </div>

        <div>
          <label class="text-sm font-medium">Hue</label>
          <USlider v-model="hue" :min="-1" :max="1" :step="0.01" class="mt-2"
            @update:model-value="applyAdjustment('Hue', hue)" />
          <div class="text-xs text-muted-foreground mt-1">{{ hue.toFixed(2) }}</div>
        </div>

        <div>
          <label class="text-sm font-medium">Blur</label>
          <USlider v-model="blur" :min="0" :max="1" :step="0.01" class="mt-2"
            @update:model-value="applyAdjustment('Blur', blur)" />
          <div class="text-xs text-muted-foreground mt-1">{{ blur.toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- Preset Filters -->
    <div class="space-y-4">
      <h4 class="text-sm font-medium text-muted-foreground">Presets</h4>
      <div class="grid grid-cols-2 gap-2">
        <UButton v-for="preset in presetFilters" :key="preset" variant="outline" size="sm" :disabled="!isActiveImage()"
          class="text-xs" @click="applyPreset(preset)">
          {{ preset }}
        </UButton>
      </div>
    </div>

    <!-- Status Message -->
    <div v-if="!isActiveImage()" class="text-xs text-muted-foreground bg-muted p-2 rounded">
      Select an image layer to apply filters
    </div>
  </section>
</template>

<style scoped>
/* Additional styles if needed */
</style>
