import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    experimental: {
      openAPI: true,
    }
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/scripts",
    "@nuxt/test-utils",
  ],
})
