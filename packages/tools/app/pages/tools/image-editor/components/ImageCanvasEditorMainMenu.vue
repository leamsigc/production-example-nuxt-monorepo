<!--  Translation file -->
<i18n src="../ImageEditor.json"></i18n>

<script lang="ts" setup>
import { useFabricJs } from '../composables/useFabricJs';

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
const { newEditor, downloadCanvasImage } = useFabricJs();
const { t } = useI18n();
const menu = [
  {
    icon: 'lucide:plus',
    translationKey: 'menu.main.new',
    action: () => { },
  },
  {
    icon: 'lucide:folder',
    translationKey: 'menu.main.save',
    action: () => {
      downloadCanvasImage();
    },
  },
  {
    icon: 'lucide:download',
    translationKey: 'menu.main.export',
    action: () => { },
  },
  {
    icon: 'lucide:circle-arrow-left',
    action: () => { },
  },
  {
    icon: 'lucide:circle-arrow-right',
    action: () => { },
  },
];
</script>

<template>
  <!-- Top Menu  -->
  <header
    class="fixed top-10 left-6 z-40 backdrop-blur-md bg-background/20 border border-background-foreground/10 rounded-2xl shadow-2xl">
    <section class="flex items-center px-4 py-3 gap-4">
      <section class="flex items-center gap-2 ">
        <NuxtLink to="/">
          <UButton variant="link">Magic Social</UButton>
        </NuxtLink>
        <UButton v-for="(item, index) in menu" :key="`${item.icon}-${index}`" size="sm" color="neutral" variant="link"
          @click="item.action">
          <Icon :name="item.icon" class="w-5 h-5" />
          <span v-if="item.translationKey">{{ t(item.translationKey) }}</span>
        </UButton>
      </section>
    </section>
  </header>
</template>
<style scoped></style>
