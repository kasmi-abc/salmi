export function logError(scope: string, error: unknown, extra?: Record<string, unknown>) {
  const msg = error instanceof Error ? error.message : String(error)
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${scope}]`, msg, extra || "")
  } else {
    // In production, plug Sentry here
    console.error(JSON.stringify({ scope, msg, extra, time: new Date().toISOString() }))
  }
}
