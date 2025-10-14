<i18n src="../layouts/dashboard/Menu.json"></i18n>
<script lang="ts" setup>
/**
 *
 * Component Description: User navigation dropdown for the dashboard header.
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *>
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
const { t } = useI18n();

const isOpen = ref(false);

interface UserNavItem {
  label: string;
  slot?: string;
  disabled?: boolean;
  icon?: string;
  to?: string;
  click?: () => void;
}

const items: UserNavItem[][] = [
  [
    {
      label: 'satnaing',
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: t('userNav.upgradeToPro'),
      icon: 'i-heroicons-sparkles',
      to: '/app/upgrade'
    },
    {
      label: t('userNav.account'),
      icon: 'i-heroicons-user',
      to: '/app/user/profile'
    },
    {
      label: t('userNav.billing'),
      icon: 'i-heroicons-credit-card',
      to: '/app/billing'
    },
    {
      label: t('userNav.notifications'),
      icon: 'i-heroicons-bell',
      to: '/app/notifications'
    }
  ],
  [
    {
      label: t('userNav.signOut'),
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: () => {
        // Handle sign out
      }
    }
  ]
];

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <div class="relative">
    <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" size="sm" class="cursor-pointer"
      @click="toggleDropdown" />

    <div v-if="isOpen"
      class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
          <p class="font-medium">satnaing</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">satnaingdev@gmail.com</p>
        </div>
        <div v-for="(section, sectionIndex) in items" :key="sectionIndex">
          <div v-for="(item, itemIndex) in section" :key="itemIndex">
            <NuxtLink v-if="item.to" :to="item.to"
              class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <UIcon v-if="item.icon" :name="item.icon" class="w-4 h-4 mr-2" />
              <span>{{ item.label }}</span>
            </NuxtLink>
            <button v-else-if="item.click" @click="item.click"
              class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <UIcon v-if="item.icon" :name="item.icon" class="w-4 h-4 mr-2" />
              <span>{{ item.label }}</span>
            </button>
            <div v-else-if="item.slot === 'account'"
              class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
              <div class="text-left">
                <p>Signed in as</p>
                <p class="truncate font-medium">{{ item.label }}</p>
                <p class="truncate text-xs text-gray-500 dark:text-gray-400">satnaingdev@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
