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
</script>

<template>
  <div class="overflow-hidden relative z-10 pt-40 pb-24 md:pt-56 md:pb-48 -mt-[94px] hero--b"
    v-motion-fade-visible-once>
    <div class="absolute inset-0 z-0">
      <div
        class="absolute inset-0 bg-[radial-gradient(72.55%_72.55%_at_50%_97.31%,rgba(79,247,209,0.23)_0%,#121B22_100%)]" />
      <div class="absolute inset-0 bg-gradient-to-tr from-[#121B22] via-[#121B22] to-primary/50 mix-blend-difference" />
      <div
        class="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]" />
    </div>
    <div class="px-6 relative z-10">
      <div class="text-center relative z-10 max-w-3xl mx-auto">
        <h1 class="text-white text-3xl lg:text-4xl xl:text-6xl font-semibold leading-snug text-balance">
          <slot name="title" mdc-unwrap="p"> Blog </slot>
        </h1>
      </div>
    </div>
  </div>
</template>
<style scoped>
.hero--b {
  clip-path: polygon(0% 99%, 0 0, 100% 0, 100% 99%, 75% 94%, 58% 93%, 40% 93%, 15% 96%);
}
</style>
