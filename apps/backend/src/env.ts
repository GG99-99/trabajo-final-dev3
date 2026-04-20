import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const rootEnv  = resolve(__dirname, '../../../.env')
config({ path: rootEnv,   override: false })

// // Primary: apps/backend/.env  (src/ → .. → apps/backend/)
// const localEnv = resolve(__dirname, '../.env')
// // Fallback: monorepo root .env
// const rootEnv  = resolve(__dirname, '../../.env')

// const r1 = config({ path: localEnv,  override: false })
// const r2 = config({ path: rootEnv,   override: false })

// if (!process.env.DATABASE_URL) {
//   console.error('[env] WARNING: DATABASE_URL not loaded. Checked:', localEnv, rootEnv)
//   console.error('[env] r1:', r1.error?.message ?? 'ok', '| r2:', r2.error?.message ?? 'ok')
// }
