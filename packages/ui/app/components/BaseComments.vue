<script lang="ts" setup>
/**
 *
 * Comments component for the application
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
const props = defineProps<{
  url: string;
}>();
const target = ref(null)
const targetIsVisible = ref(false)

const { stop } = useIntersectionObserver(
  target,
  ([entry], observerElement) => {
    if (entry?.isIntersecting) {
      targetIsVisible.value = entry?.isIntersecting
      stop()
    }
  },
)

</script>

<template>
  <section class="text-center" ref="target">
    <LazyClientOnly fallback="Loading Comments..." fallback-tag="section">
      <LazyBaseBlueSkyComments :url v-if="targetIsVisible" />
    </LazyClientOnly>
  </section>
</template>
<style scoped></style>
