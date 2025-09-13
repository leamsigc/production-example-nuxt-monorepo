import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    experimental: {
      openAPI: true,
    }
  },
  extends: ['@local-monorepo/ui'],
  modules: ["@nuxtjs/seo", '@nuxt/content'],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            // Default theme (same as single string)
            default: 'github-light',
            // Theme used if `html.dark`
            dark: 'monokai',
            // Theme used if `html.sepia`
            sepia: 'monokai'
          }
        }
      }
    }
  },

})
