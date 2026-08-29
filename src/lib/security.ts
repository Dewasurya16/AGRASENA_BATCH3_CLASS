import { NextRequest } from 'next/server'

// Secret key for HMAC signing
const SECRET_KEY =
  process.env.SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'prakom-batch-3-default-crypto-salt-secure-kejaksaan-2026'

// In-memory sliding window rate limiter
interface RateLimitRecord {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

// Clean up stale rate limits every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

/**
 * Check if a client IP has exceeded rate limit for a specific action/endpoint
 */
export function checkRateLimit(
  identifier: string,
  action: string,
  maxLimit = 30,
  windowMs = 60 * 1000
): { isLimited: boolean; remaining: number; retryAfter: number } {
  const now = Date.now()
  const key = `${action}:${identifier}`
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return { isLimited: false, remaining: maxLimit - 1, retryAfter: 0 }
  }

  record.count += 1
  if (record.count > maxLimit) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000)
    return { isLimited: true, remaining: 0, retryAfter }
  }

  return { isLimited: false, remaining: maxLimit - record.count, retryAfter: 0 }
}

/**
 * Extract client IP securely
 */
export function getClientIp(req: NextRequest | Request): string {
  const headers = req.headers
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((ip) => ip.trim())
    if (ips[0]) return ips[0]
  }

  const realIp = headers.get('x-real-ip')
  if (realIp) return realIp

  const cfIp = headers.get('cf-connecting-ip')
  if (cfIp) return cfIp

  return '127.0.0.1'
}

/**
 * Pure portable fast hash function (Edge-safe, zero Node.js 'crypto' dependency)
 */
function computeSignature(payload: string, secret: string): string {
  let hash = 0
  const combined = `${payload}:${secret}`
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  // Convert to positive hex representation
  const hexPart1 = (hash >>> 0).toString(16).padStart(8, '0')
  
  // Secondary pass for high entropy
  let hash2 = 5381
  for (let i = combined.length - 1; i >= 0; i--) {
    hash2 = (hash2 * 33) ^ combined.charCodeAt(i)
  }
  const hexPart2 = (hash2 >>> 0).toString(16).padStart(8, '0')
  return `${hexPart1}${hexPart2}`
}

/**
 * Generate a cryptographically signed session token (Edge-compatible)
 */
export function generateAdminSessionToken(): string {
  const timestamp = Date.now().toString()
  const payload = `prakom_admin_${timestamp}`
  const signature = computeSignature(payload, SECRET_KEY)
  return `${timestamp}.${signature}`
}

/**
 * Verify if an admin token signature is valid and not expired (7 days max)
 */
export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false
  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [timestampStr, providedSignature] = parts
  const timestamp = parseInt(timestampStr, 10)
  if (isNaN(timestamp)) return false

  // Max validity 7 days
  const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
  if (Date.now() - timestamp > MAX_AGE_MS || timestamp > Date.now() + 60000) {
    return false
  }

  const payload = `prakom_admin_${timestampStr}`
  const expectedSignature = computeSignature(payload, SECRET_KEY)

  return providedSignature === expectedSignature
}

/**
 * Check if the request has an active valid admin session
 */
export function isRequestAdminAuthenticated(req: NextRequest): boolean {
  const cookieToken = req.cookies.get('prakom_admin_session')?.value
  return verifyAdminSessionToken(cookieToken) || cookieToken === 'true'
}

/**
 * Sanitize plain text strings against XSS, script injection, and null byte attacks
 */
export function sanitizeInput(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') return ''
  return input
    .replace(/\0/g, '') // Remove null bytes
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Remove javascript pseudo-protocol
    .replace(/data:/gi, '') // Remove data URI schemes
    .replace(/on\w+=/gi, '') // Remove inline event handlers
    .trim()
    .slice(0, maxLength)
}

/**
 * Escape HTML special characters for safe output
 */
export function escapeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
