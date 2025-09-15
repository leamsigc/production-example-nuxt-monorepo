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
  $meta: {
    name: 'BaseUI',
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/scripts",
    "@nuxt/test-utils",
  ],
  /*
    Nuxt UI RELATED CONFIGS
   */
  css: [
    join(currentDir, './app/assets/css/main.css')
  ],
  ui: {
    fonts: true,
    colorMode: true,
    content: true,
    mdc: true
  }

})
