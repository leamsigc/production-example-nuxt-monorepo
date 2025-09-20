import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  $meta: {
    name: 'BaseDB',
  },
  devtools: { enabled: true },
  nitro: {
    experimental: {
      openAPI: true,
    }
  },
})
