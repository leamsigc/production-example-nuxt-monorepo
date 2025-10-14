<script lang="ts" setup>
/**
 *
 * Component Description: Dashboard sidebar with navigation menu using Nuxt UI components
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */

import type { NavigationMenuItem } from '@nuxt/ui'
import menu from './Menu.json'

const { locale } = useI18n()



interface Props {
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

const menuItems = computed(() => menu[locale.value]?.menu || {})

const navigationItems = computed<NavigationMenuItem[][]>(() => {
  const menuData = menuItems.value

  return [
    // Main Navigation Items
    [
      // General Section
      {
        label: menuData.general,
        type: 'label' as const
      },
      {
        label: menuData.dashboard,
        icon: 'i-lucide-house',
        to: '/app'
      },
      {
        label: menuData.tasks,
        icon: 'i-lucide-check-square',
        to: '/app/tasks'
      },
      {
        label: menuData.apps,
        icon: 'i-lucide-grid-3x-3',
        to: '/app/apps'
      },
      {
        label: menuData.chats,
        icon: 'i-lucide-message-circle',
        to: '/app/chats'
      },
      {
        label: menuData.users,
        icon: 'i-lucide-users',
        to: '/app/users'
      },
      // Profile
      {
        label: menuData.profile,
        icon: 'i-lucide-user',
        to: '/app/profile'
      }
    ],
    // Secondary Navigation Items
    [
      // Pages Section
      {
        label: menuData.pages,
        type: 'label' as const
      },
      {
        label: menuData.login,
        icon: 'i-lucide-log-in',
        to: '/login'
      },
      {
        label: menuData.register,
        icon: 'i-lucide-user-plus',
        to: '/register'
      },
      {
        label: menuData['404'],
        icon: 'i-lucide-file-x',
        to: '/404'
      },
      {
        label: menuData['500'],
        icon: 'i-lucide-alert-triangle',
        to: '/500'
      },
      // Settings
      {
        label: menuData.settings,
        icon: 'i-lucide-settings',
        to: '/app/settings'
      },
      // Help Center
      {
        label: menuData.helpCenter,
        icon: 'i-lucide-life-buoy',
        to: '/help'
      }
    ]
  ]
})
</script>

<template>
  <div>
    <!-- Main Navigation Menu -->
    <UNavigationMenu :items="navigationItems[0]" orientation="vertical" :collapsed="collapsed"
      class="data-[orientation=vertical]:space-y-1" />

    <!-- Secondary Navigation Menu -->
    <UNavigationMenu :items="navigationItems[1]" orientation="vertical" :collapsed="collapsed" class="mt-auto" />
  </div>
</template>
<style scoped></style>
