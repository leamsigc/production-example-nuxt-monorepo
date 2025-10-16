<script lang="ts" setup>
/**
 *
 * Component Description:Individual preview page for BaseButton component
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */

// Sample props for the component
const sampleProps = { button: { label: 'Click me', variant: 'solid' } };
</script>

<template>
  <PreviewShell component-name="BaseButton">
    <BaseButton v-bind="sampleProps" />
  </PreviewShell>
</template>

<style scoped></style>
