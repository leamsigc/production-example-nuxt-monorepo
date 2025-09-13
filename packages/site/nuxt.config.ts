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
    '@local-monorepo/ai-tools',
    '@local-monorepo/assets',
    '@local-monorepo/auth',
    '@local-monorepo/bulk-scheduler',
    '@local-monorepo/email',
    '@local-monorepo/scheduler',
    '@local-monorepo/ui'
  ],

  modules: ['@nuxtjs/seo']
})