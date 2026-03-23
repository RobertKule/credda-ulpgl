import { db } from './db'

export async function safeQuery<T>(
  fn: () => Promise<T>,
  fallback: T,
  label = 'query'
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`timeout: ${label}`)), 8000)
  )
  try {
    return await Promise.race([fn(), timeout])
  } catch (err: any) {
    console.error(`[DB SAFE] ${label}:`, err.message)
    return fallback
  }
}
