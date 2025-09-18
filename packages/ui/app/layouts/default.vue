<script lang="ts" setup>
/**
 *
 * Default layout for the application
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Dev docs',
    to: '/docs/',
    active: route.path.startsWith('/docs')
  },
  {
    label: 'Platform',
    to: '/platform',
    active: true,
    children: [
      {
        label: 'Facebook',
        description: 'Grow your Facebook audiance with use of AI',
        to: '/platform/facebook',
        icon: 'i-lucide-facebook'
      },
      {
        label: 'Twitter',
        description: 'Grow your Twitter audience with use of AI',
        to: '/platform/twitter',
        icon: 'i-lucide-twitter'
      },
      {
        label: 'Instagram',
        description: 'Grow your Instagram audience with use of AI',
        to: '/platform/instagram',
        icon: 'i-lucide-instagram'
      },
      {
        label: 'Google My Business',
        description: 'Grow your Google My Business audience with use of AI',
        to: '/platform/google-my-business',
        icon: 'i-lucide-house'
      },
      {
        label: 'Linkedin',
        description: 'Grow your Linkedin audience with use of AI',
        to: '/platform/linkedin',
        icon: 'i-lucide-linkedin'
      },
      {
        label: 'Pinterest',
        description: 'Grow your Pinterest audience with use of AI',
        to: '/platform/pinterest',
        icon: 'i-lucide-pinterest'
      }
    ]
  },
  {
    label: 'Tools',
    to: '/tools',
    active: route.path.startsWith('/tools')
  },
  {
    label: 'Playground',
    to: '/playground',
    active: route.path.startsWith('/playground')
  }

])

</script>

<template>
  <main class="">

    <UHeader>
      <template #left>
        <UTooltip text="Home" :kbds="['meta', 'H']">
          <UButton color="neutral" variant="ghost" to="/" icon="fxemoji:flaginhole" aria-label="Home">
            SocialMagic
          </UButton>
        </UTooltip>
      </template>
      <UNavigationMenu :items="items"
        class="data-[orientation=horizontal]:border-b border-default data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48"
        highlight highlight-color="primary" />


      <template #right>
        <UColorModeButton />

        <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
          <UButton color="primary" variant="ghost" to="https://github.com/leamsigc/production-example-nuxt-monorepo"
            target="_blank" icon="i-simple-icons-github" aria-label="GitHub" />
        </UTooltip>
      </template>
    </UHeader>
    <slot />
  </main>
</template>

<style scoped></style>
