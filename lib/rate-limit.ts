// Simple in-memory sliding window rate limiter
// For production scale, replace with Upstash Redis
const buckets = new Map<string, number[]>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const arr = buckets.get(key) || []
  const valid = arr.filter(t => now - t < windowMs)
  if (valid.length >= limit) return false
  valid.push(now)
  buckets.set(key, valid)
  // cleanup
  if (buckets.size > 2000) {
    const cutoff = now - windowMs
    buckets.forEach((v, k) => {
      const filtered = v.filter(t => t > cutoff)
      if (filtered.length === 0) buckets.delete(k)
      else buckets.set(k, filtered)
    })
  }
  return true
}

export function getClientIp(headersObj: Headers): string {
  return headersObj.get("x-forwarded-for")?.split(",")[0]?.trim() || headersObj.get("x-real-ip") || "unknown"
}
