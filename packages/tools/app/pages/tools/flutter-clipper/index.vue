<!--  Translation file -->
<i18n src="./flutterClipper.json"></i18n>

<script lang="ts" setup>
/**
 *
 * Clipper editor for flutter applications
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
import FlutterClipperEditor from './components/FlutterClipperEditor.vue'
const { t } = useI18n();

useHead({
  title: t('title'),
  meta: [
    { name: 'description', content: t('description') }
  ]
});

const menuItems = [
  {
    icon: 'lucide:plus',
    translationKey: t('menu.main.new'),
    action: () => {
      console.log('New action triggered');

    },
  },
  {
    icon: 'lucide:copy',
    translationKey: t('menu.main.copy'),
    action: () => {
      console.log('Copy action triggered');

    },
  },
];
</script>

<template>
  <section class="min-h-screen min-w-full relative">
    <BaseSecondaryMenu :menu="menuItems" />
    <section class="p-12 mt-12">
      <FlutterClipperEditor />
    </section>
  </section>
</template>
<style scoped></style>
