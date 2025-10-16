<script lang="ts" setup>
/**
 *
 * Component Description:Individual preview page for BaseFaq component
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
    { label: "What is this?", content: "This is a sample FAQ component." },
    { label: "How does it work?", content: "It works by displaying questions and answers in an accordion format." }
  ]
};
</script>

<template>
  <PreviewShell component-name="BaseFaq">
    <BaseFaq v-bind="sampleProps" />
  </PreviewShell>
</template>

<style scoped></style>
