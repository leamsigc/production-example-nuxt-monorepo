<script lang="ts" setup>
/**
 *
 * Component Description:Individual preview page for BaseFeatures component
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */

// Sample props for the component
const sampleProps = {
  list: [
    { icon: "i-lucide-tablet-smartphone", title: "Cross-Platform", description: "Works on all platforms." }
  ]
};
</script>

<template>
  <PreviewShell component-name="BaseFeatures">
    <BaseFeatures v-bind="sampleProps" />
  </PreviewShell>
</template>

<style scoped></style>
