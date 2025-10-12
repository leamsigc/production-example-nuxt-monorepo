import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  nitro: {
    experimental: {
      openAPI: true,
    }
  },

  extends: [
    '@local-monorepo/ui',
    '@local-monorepo/db',
    '@local-monorepo/auth',
    '@local-monorepo/email',
    '@local-monorepo/content'
  ],

  modules: ['@nuxtjs/seo']
})