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
const props = withDefaults(
  defineProps<{
    streakColor: string
    class?: any
  }>(),
  {
    streakColor: 'rgb(255, 255, 255)'
  }
)

const { streakColor } = toRefs(props)

const wrapperStyle = computed(() => {
  return {
    '--streak-color': streakColor.value
  }
})
</script>

<template>
  <div
    class="sui-tyndall-effect relative flex gap-10 min-h-screen overflow-hidden h-auto w-full justify-start items-center"
    :style="wrapperStyle">
    <div v-motion
      class="streak flex-none mix-blend-overlay overflow-hidden pointer-events-none absolute w-[200%] lg:w-[150%] h-24 lg:h-56 left-[-64vw] top-[48vw] lg:left-[-28vw] lg:top-[32vw] xl:left-[-16vw] xl:top-[21vw]"
      :initial="{ opacity: 0, rotate: '40deg', scaleY: 0.5 }" :enter="{ opacity: 0.8, rotate: '40deg', scaleY: 1 }"
      :duration="2000" />
    <div v-motion
      class="streak flex-none mix-blend-overlay overflow-hidden pointer-events-none absolute w-[200%] lg:w-[150%] h-12 lg:h-24 left-[-60vw] top-[40vw] lg:left-[-32vw] lg:top-[24vw] xl:left-[-12vw] xl:top-[17vw]"
      :initial="{ opacity: 0, rotate: '32deg', scaleY: 0.5 }" :enter="{ opacity: 0.92, rotate: '32deg', scaleY: 1 }"
      :duration="2000" />
    <div v-motion
      class="streak flex-none mix-blend-overlay overflow-hidden pointer-events-none absolute w-[200%] lg:w-[150%] h-20 lg:h-48 left-[-32vw] top-[32vw] lg:left-[-12vw] lg:top-[18vw] xl:left-[-10vw] xl:top-[10vw]"
      :initial="{ opacity: 0, rotate: '24deg', scaleY: 0.5 }" :enter="{ opacity: 1, rotate: '24deg', scaleY: 1 }"
      :duration="2000" />
    <div class="overlay h-56 flex-none absolute left-0 right-0 top-0 z-10 overflow-hidden pointer-events-none" />
    <div v-if="$slots.particles" class="particles-effect flex-none h-screen absolute left-0 top-0 right-0">
      <slot name="particles" />
    </div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.sui-tyndall-effect {
  --streak-color: rgb(0, 225, 255);
}

.theme-dark .sui-tyndall-effect .overlay {

  background: linear-gradient(180deg,
      #000000 0%,
      rgba(0, 0, 0, 0.32) 23%,
      rgba(0, 0, 0, 0.12) 70%,
      rgba(0, 0, 0, 0) 100%);
}

.sui-tyndall-effect .streak {
  background: linear-gradient(90deg,
      var(--streak-color) 16%,
      rgba(255, 255, 255, 0) 100%);
  mask: linear-gradient(180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.5) 35%,
      rgba(0, 0, 0, 0.5) 64%,
      rgba(0, 0, 0, 0) 100%);
}

.sui-tyndall-effect .particles-effect {
  mask: linear-gradient(225deg,
      rgba(0, 0, 0, 0) 30%,
      rgb(0, 0, 0) 36%,
      rgb(0, 0, 0) 63%,
      rgba(0, 0, 0, 0) 76%);
}
</style>
