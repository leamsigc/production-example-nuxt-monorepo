<!--  Translation file -->
<i18n src="./register.json"></i18n>

<script lang="ts" setup>
import UserRegister from './components/UserRegister.vue';
/**
 * Component Description: Registration page with premium design and social authentication
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test
 * @todo [✔] Update the typescript
 */

const { t } = useI18n()

// Page meta with translations
useHead({
  title: t('title'),
  meta: [
    { name: 'description', content: t('description') }
  ]
})
</script>

<template>
  <div class="min-h-screen grid place-content-center ">
    <UserRegister />
  </div>
</template>

<style scoped></style>
