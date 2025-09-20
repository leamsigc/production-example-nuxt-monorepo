import { defineConfig } from 'drizzle-kit'
import { tursoConfig } from './turso.config'

export default defineConfig({
  dialect: 'turso',
  schema: './db/schema.ts',
  out: './db/migrations',
  dbCredentials: {
    url: tursoConfig.url,
    authToken: tursoConfig.authToken
  }
})
