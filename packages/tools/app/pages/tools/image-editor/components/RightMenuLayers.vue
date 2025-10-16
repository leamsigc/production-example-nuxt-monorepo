<script lang="ts" setup>
/**
 *
 * Canvas Editor - Layers Panel
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */

import { useFabricJs } from '../composables/useFabricJs'

const { getLayers, selectLayer, deleteLayer, toggleLayerVisibility, canvas } = useFabricJs()
// Reactive layers list
const layers = ref([...getLayers()])

// Update layers when canvas changes
const updateLayers = () => {
  layers.value = [...getLayers()]

}

// Watch for canvas changes
onMounted(() => {
  // Initial load
  updateLayers()

  // Listen to canvas events to update layers
  if (canvas.value) {
    canvas.value.on('object:added', updateLayers)
    canvas.value.on('object:removed', updateLayers)
    canvas.value.on('selection:created', updateLayers)
    canvas.value.on('selection:updated', updateLayers)
    canvas.value.on('selection:cleared', updateLayers)
  }
})

onUnmounted(() => {
  // Remove event listeners
  if (canvas.value) {
    canvas.value.off('object:added', updateLayers)
    canvas.value.off('object:removed', updateLayers)
    canvas.value.off('selection:created', updateLayers)
    canvas.value.off('selection:updated', updateLayers)
    canvas.value.off('selection:cleared', updateLayers)
  }
})

// Computed property for reversed layers (to show top layer first)
const reversedLayers = computed(() => [...layers.value].reverse())

// Get active layer for highlighting
const activeLayer = computed(() => canvas.value?.getActiveObject())

// Handle layer selection
const handleLayerClick = (layer: any) => {
  selectLayer(layer)
}

// Handle layer deletion
const handleDeleteLayer = async (layer: any) => {
  deleteLayer(layer)
  await nextTick()
  updateLayers()
}

// Handle visibility toggle
const handleToggleVisibility = (layer: any) => {
  const currentVisibility = layer.visible !== false
  toggleLayerVisibility(layer, !currentVisibility)
  updateLayers()
}




// Get layer type display name
const getLayerType = (layer: any) => {
  if (layer.type === 'image') return 'Image'
  if (layer.type === 'i-text') return 'Text'
  if (layer.type === 'rect') return 'Rectangle'
  if (layer.type === 'circle') return 'Circle'
  if (layer.type === 'triangle') return 'Triangle'
  if (layer.type === 'path') return 'Drawing'
  return layer.type || 'Object'
}

// Get layer icon component
const getLayerIcon = (layer: any) => {
  if (layer.type === 'image') return "radix-icons:image"
  if (layer.type === 'text') return "radix-icons:text"
  if (layer.type === 'i-text') return "radix-icons:text"
  if (layer.type === 'rect') return "radix-icons:square"
  if (layer.type === 'circle') return "radix-icons:circle"
  if (layer.type === 'triangle') return "radix-icons:triangle-up"
  if (layer.type === 'path') return "radix-icons:pencil-1"
  return "radix-icons:layers"
}
const moveLayerUp = (layer: any) => {
  if (!layer) return
  // canvas.value?.bringObjectForward(layer as any)
  layer.canvas?.bringObjectForward(layer as any)
  updateLayers()

}
const moveLayerDown = (layer: any) => {
  if (!layer) return
  layer.canvas?.sendObjectBackwards(layer as any)
  updateLayers()
}

</script>

<template>
  <UCard class="layers-panel bg-transparent border-0" :ui="{ body: 'border-0' }" variant="soft">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Layers</h3>
        <UButton @click="updateLayers" size="sm" variant="outline">
          Refresh
        </UButton>
      </div>
    </template>

    <div class="layers-list max-h-96 overflow-y-auto">
      <div v-for="(layer, index) in reversedLayers" :key="`layer-${index}`"
        class="layer-item flex items-center justify-between p-2 border-b border-gray-200/10 hover:bg-gray-50 dark:hover:bg-gray-800  cursor-pointer"
        :class="{ 'bg-blue-100': layer === activeLayer }" draggable="true" @click="handleLayerClick(layer)">
        <div class="layer-info flex items-center flex-1">
          <!-- Up and Down Arrows -->
          <section class="flex items-center gap-2">
            <Icon name="radix-icons:arrow-up" class="cursor-pointer mr-2 text-gray-400 h-4 w-4 select-none"
              @click.stop="moveLayerUp(layer)" />
            <Icon name="radix-icons:arrow-down" class="cursor-pointer mr-2 text-gray-400 h-4 w-4 select-none"
              @click.stop="moveLayerDown(layer)" />
          </section>
          <!-- Visibility Toggle -->
          <UButton @click.stop="handleToggleVisibility(layer)" variant="link" size="sm" class="visibility-btn mr-2  p-0"
            :class="{ 'text-gray-300': !layer.visible }">
            <Icon name="radix-icons:eye-open" v-if="layer.visible !== false" class="h-4 w-4" />
            <Icon name="radix-icons:eye-closed" v-else class="h-4 w-4" />
          </UButton>

          <!-- Layer Type Icon -->
          <div class="layer-icon mr-2">
            <Icon :name="getLayerIcon(layer)" class="h-4 w-4" />
          </div>

          <!-- Layer Name/Type -->
          <div class="layer-details flex-1">
            <div class="layer-name text-sm font-medium">
              {{ getLayerType(layer) }}
            </div>
            <div class="layer-type text-xs text-gray-500">
              {{ getLayerType(layer) }}
            </div>
          </div>
        </div>

        <!-- Delete Button -->
        <UButton @click.stop="handleDeleteLayer(layer)" variant="ghost" size="sm"
          class="delete-btn grid place-items-center text-red-500 hover:text-red-700 h-8 w-8 p-0 cursor-pointer"
          title="Delete Layer">
          <Icon name="radix-icons:trash" class="h-4 w-4" />
        </UButton>
      </div>
    </div>

    <div v-if="reversedLayers.length === 0" class="no-layers text-center py-8 text-gray-500">
      No layers yet. Add some content to get started!
    </div>
  </UCard>
</template>
<style scoped></style>
