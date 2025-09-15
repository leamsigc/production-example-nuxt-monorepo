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
  <div class="relative flex h-screen items-center">
    <div
      class="absolute h-screen w-full bg-[radial-gradient(theme(colors.border)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
    <div class="container relative z-[1] flex flex-col items-center justify-center text-center">
      <p class="mb-5 font-bold tracking-tight text-primary">
        {{ statusCode }} error
      </p>
      <h1 class="text-4xl font-bold tracking-tight lg:text-5xl">
        {{ title }}
      </h1>
      <BaseButton class="mt-5" @click="clearError({ redirect: '/' })">
        Take me home
      </BaseButton>
    </div>
  </div>
</template>
