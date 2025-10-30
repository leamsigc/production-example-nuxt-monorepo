import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  experimental: {
    viteEnvironmentApi: true,
    typescriptPlugin: true
  },
  future: {
    compatibilityVersion: 5
  },
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
