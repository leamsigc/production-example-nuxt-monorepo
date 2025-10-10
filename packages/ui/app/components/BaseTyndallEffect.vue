<script lang="ts" setup>
/**
 *
 * Component Description:A dynamic Tyndall effect component with customizable streak colors and particle slots, compatible with Tailwind CSS v4.
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [x] Update the typescript.
 * @property {string} streakColor - The color of the streaks.
 * @property {Array<Object>} streakPositions - An array of objects defining the position, rotation, opacity, scale, and duration for each streak.
 */
const props = withDefaults(
  defineProps<{
    streakColor?: string,
    class?: any,
    streakPositions?: {
      left: string,
      top: string,
      rotate: string,
      opacity: number,
      scaleY: number,
      duration: number
    }[]
  }>(),
  {
    streakColor: 'rgb(255, 255, 255)',
    streakPositions: () => [
      { left: '-10vw', top: '18vw', rotate: '50deg', opacity: 0.8, scaleY: 2, duration: 2000 },
      { left: '-15vw', top: '10vw', rotate: '55deg', opacity: 0.92, scaleY: 1, duration: 2000 },
      { left: '-18vw', top: '20vw', rotate: '40deg', opacity: 0.8, scaleY: 1, duration: 2000 },
      { left: '-15vw', top: '10vw', rotate: '45deg', opacity: 0.6, scaleY: 1, duration: 2000 },
      { left: '-15vw', top: '2vw', rotate: '35deg', opacity: 0.8, scaleY: 1, duration: 2000 },
    ]
  }
)

</script>

<template>
  <div
    class="sui-tyndall-effect relative flex gap-10 min-h-screen overflow-hidden h-auto w-full justify-start items-center">
    <div v-for="(streak, index) in props.streakPositions" :key="index"
      class="streak flex-none mix-blend-overlay overflow-hidden pointer-events-none absolute w-[200%] lg:w-[150%] h-24 lg:h-56"
      :style="{ left: streak.left, top: streak.top }" v-motion
      :initial="{ opacity: 0, rotate: streak.rotate, scaleY: 0.5 }"
      :enter="{ opacity: streak.opacity, rotate: streak.rotate, scaleY: streak.scaleY }" :duration="streak.duration" />
    <div class="overlay h-56 flex-none absolute left-0 right-0 top-0 z-10 overflow-hidden pointer-events-none">
    </div>
    <div class="particles-effect flex-none h-screen absolute left-0 top-0 right-0" v-if="$slots.particles">
      <slot name="particles" />
    </div>
    <slot />
  </div>
</template>



<style scoped lang="scss">
.sui-tyndall-effect {
  --streak-color: rgba(2, 21, 12, 0.945);
}

.dark .sui-tyndall-effect {
  --streak-color: var(--ui-bg-muted);
}

.dark .sui-tyndall-effect .overlay {

  background: linear-gradient(180deg,
      hsla(0, 0%, 0%, 0.137) 0%,
      hsla(0, 0%, 0%, 0.32) 23%,
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
