import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

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
