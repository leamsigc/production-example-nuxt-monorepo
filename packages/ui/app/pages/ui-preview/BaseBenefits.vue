<script lang="ts" setup>
/**
 *
 * Component Description:Individual preview page for BaseBenefits component
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
  items: [
    {
      icon: 'lucide:target',
      title: 'Targeted Content',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A odio velit cum aliquam. Natus consectetur dolores.'
    }
  ]
};
</script>

<template>
  <PreviewShell component-name="BaseBenefits">
    <BaseBenefits v-bind="sampleProps" />
  </PreviewShell>
</template>

<style scoped></style>
