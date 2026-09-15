// Centralized env validation - fails fast at startup if missing
const required = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'] as const
for (const key of required) {
  if (!process.env[key]) {
    // In dev, warn; in production, throw to prevent silent boot
    if (process.env.NODE_ENV === 'production') throw new Error(`Missing env: ${key}`)
    else console.warn(`[env] Missing ${key}`)
  }
}
if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
  throw new Error('NEXTAUTH_SECRET must be >= 32 chars - generate with: openssl rand -base64 32')
}
export const env = process.env
