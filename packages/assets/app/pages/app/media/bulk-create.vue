<script lang="ts" setup>
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

import type { StepperItem } from '@nuxt/ui'

const items = [
  {
    slot: 'template' as const,
    title: 'Image template',
    description: 'Select an image template to use as a base',
    icon: 'i-lucide-image'
  }, {
    slot: 'data' as const,
    title: 'Data',
    description: 'Add data to your image',
    icon: 'i-lucide-edit'
  }, {
    slot: 'map' as const,
    title: 'Map data',
    description: 'Map the data to the image template',
    icon: 'i-lucide-map'
  }, {
    slot: 'preview' as const,
    title: 'Preview',
    description: 'Preview the final result',
    icon: 'i-lucide-eye'
  }, {
    slot: 'create' as const,
    title: 'Create',
    description: 'Create the images base on the provided data',
    icon: 'i-lucide-plus'
  }
] satisfies StepperItem[]


const cards = ref([
  {
    title: 'Icons',
    description: 'Nuxt UI integrates with Nuxt Icon to access over 200,000+ icons from Iconify.',
    icon: 'i-lucide-smile',
    to: '/docs/getting-started/integrations/icons'
  },
  {
    title: 'Fonts',
    description: 'Nuxt UI integrates with Nuxt Fonts to provide plug-and-play font optimization.',
    icon: 'i-lucide-a-large-small',
    to: '/docs/getting-started/integrations/fonts'
  },
  {
    title: 'Color Mode',
    description: 'Nuxt UI integrates with Nuxt Color Mode to switch between light and dark.',
    icon: 'i-lucide-sun-moon',
    to: '/docs/getting-started/integrations/color-mode'
  }
])
</script>
<template>
  <section class="container mx-auto py-6 space-y-6">

    <UStepper :items="items" class="w-full" orientation="vertical">
      <template #template>
        <UPageGrid>
          <UPageCard v-for="(card, index) in cards" :key="index" v-bind="card" />
        </UPageGrid>
      </template>

      <template #data>
        <UFileUpload color="neutral" highlight label="Drop your CSV file here" description="CSV (max. 2MB)"
          accept='text/csv' class="w-96 min-h-48" />
      </template>

      <template #map>
        <UPageCard title="Tailwind CSS"
          description="Nuxt UI integrates with latest Tailwind CSS v4, bringing significant improvements."
          icon="i-simple-icons-tailwindcss" orientation="horizontal" spotlight spotlight-color="primary">
          <img src="https://ui.nuxt.com/_ipx/_/tailwindcss-v4.svg" alt="Tailwind CSS" class="w-full" />
        </UPageCard>
      </template>
    </UStepper>
  </section>
</template>

<style scoped></style>
