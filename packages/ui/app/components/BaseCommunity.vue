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
interface Props {
  icon?: string;
  url?: string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: "lucide:discord",
  url: "https://discord.com/",
  label: "Join our Discord",
});

const { icon, url, label } = toRefs(props);
</script>
<template>
  <section id="community" class="mx-auto py-12" v-motion-fade-visible-once :delay="200" :duration="1200">
    <div class="container  mx-auto">
      <div class="lg:w-[60%] mx-auto">
        <UCard class="bg-background shadow-none text-center flex flex-col items-center justify-center border-0">
          <template #header>
            <h2 class="text-4xl md:text-5xl font-bold">
              <slot name="title">
                Ready to join this
                <span class="gradient-text"> Community? </span>
              </slot>
            </h2>
          </template>
          <div class="lg:w-[80%] text-xl text-muted-foreground">
            <slot name="content">
              Join our vibrant Discord community! Connect, share, and grow with
              like-minded enthusiasts. Click to dive in! 🚀
            </slot>
          </div>

          <template #footer>
            <UButton :to="url" target="_blank" :aria-label="label" :title="label" :icon="icon">
              {{ label }}
            </UButton>
          </template>
        </UCard>
      </div>
    </div>
  </section>
</template>
