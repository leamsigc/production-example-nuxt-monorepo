<script lang="ts" setup>
/**
 *
 * Not found view
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */

interface Props {
  statusCode?: number
  fatal?: boolean
  unhandled?: boolean
  statusMessage?: string
  message?: string
  data?: unknown
  cause?: unknown
}
const props = withDefaults(
  defineProps<Props>(),
  {
    statusCode: 404,
    fatal: false,
    unhandled: false,
    statusMessage: '',
    message: 'We can\'t find this page',
    data: undefined,
    cause: undefined
  }
)

const title = computed(() => {
  if (!props.message)
    return 'Error'
  return props.message
})

useSeoMeta({ title })
</script>

<template>
  <UError :error="{
    statusCode: props.statusCode,
    fatal: props.fatal,
    unhandled: props.unhandled,
    statusMessage: title,
    message: props.message,
    data: props.data,
    cause: props.cause
  }" />
</template>
