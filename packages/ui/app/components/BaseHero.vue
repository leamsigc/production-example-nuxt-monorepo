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
interface Action {
  label: string
  href: string
  icon: string
  variant?: string
  target?: string
}

interface Props {
  badge: {
    label: string
    content: string
  }
  heroImage?: {
    light: string
    dark: string
    alt?: string
  }
  actions: Action[]
  showHeroImage?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  badge: () => ({ label: 'New', content: 'Design is out' }),
  heroImage: () => ({
    light: 'img/hero-image-light.jpg',
    dark: 'img/hero-image-dark.jpg',
    alt: 'The best social media scheduler for small businesses'
  }),
  actions: () => [
    {
      label: 'Get started',
      href: '/',
      icon: 'mdi:arrow-right'
    },
    {
      label: 'Case studies',
      href: '/docs',
      icon: '',
      variant: 'outline'
    }
  ],
  showHeroImage: true
})

const { badge, heroImage, showHeroImage } = toRefs(props)
const mode = useColorMode()
</script>

<template>
  <BaseTyndallEffect :streak-color="mode.value === 'light' ? '#000000' : '#ffffff'">
    <section class="container mx-auto">
      <div class="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div class="text-center space-y-8">
          <UBadge variant="outline" class="text-sm py-2">
            <span class="mr-2 text-primary">
              <UBadge>{{ badge.label }}</UBadge>
            </span>
            <span> {{ badge.content }} </span>
          </UBadge>

          <div class="max-w-screen-md mx-auto text-center text-5xl md:text-6xl font-bold">
            <h1>
              <slot name="title">
                Free your time to focus on your business
                <span class="gradient-text">Schedule your social media</span>
                post automatically!
              </slot>
            </h1>
          </div>

          <p class="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            <slot name="description">
              We help you to schedule your social media posts automatically and
              make your life easier.
            </slot>
          </p>

          <div class="space-y-4 md:space-y-0 md:space-x-4">
            <slot name="actions">
              <UButton v-for="action in actions" :key="action.label" class="w-5/6 md:w-1/4 font-bold group/arrow"
                :variant="action.variant" as-child :prefetch="false">
                <NuxtLink :href="action.href" :target="action.target || ''" :aria-label="action.label">
                  {{ action.label }}
                  <Icon v-if="action.icon" :name="action.icon"
                    class="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
                </NuxtLink>
              </UButton>
            </slot>
          </div>
        </div>

        <div v-if="heroImage && showHeroImage" class="relative group mt-14">
          <!-- gradient shadow -->
          <div
            class="absolute -top-6 right-12 w-[90%] h-12 lg:h-[80%] bg-primary/50 blur-3xl rounded-full img-shadow-animation" />

          <NuxtPicture
            class="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-t-primary/30 img-border-animation"
            :src="mode.value == 'light' ? heroImage.light : heroImage.dark" :alt="heroImage.alt" width="1300"
            height="900" loading="lazy" />

          <!-- gradient effect img -->
          <div
            class="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg" />
        </div>
      </div>
    </section>
  </BaseTyndallEffect>
</template>

<style scoped lang="scss">
.img-shadow-animation {
  animation-name: img-shadow-animation;
  animation-iteration-count: infinite;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-direction: alternate;
}

.img-border-animation {
  animation-name: img-border-animation;
  animation-iteration-count: infinite;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-direction: alternate;
}

@keyframes img-shadow-animation {
  from {
    opacity: 0.5;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0px);
  }
}

@keyframes img-border-animation {
  from {
    @apply border-t-primary/10;
  }

  to {
    @apply border-t-primary/60;
  }
}
</style>
