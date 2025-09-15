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

import type { ButtonProps } from '@nuxt/ui'
// How to pass the props from the main item to the next item.
type InternalProps = {} & ButtonProps;

interface Props {
  button: ButtonProps
}

const props = defineProps<Props>()

</script>

<template>
  <UButton v-bind="$attrs">
    <slot />
  </UButton>
</template>
<style scoped></style>
