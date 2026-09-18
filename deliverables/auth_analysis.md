# Perseus Audit: Authentication & Authorization Analysis

**Target:** Web Kelas (Agrasena)  
**Assessor:** Perseus Security Suite (Audit Phase)  
**Date:** 2026-09-19  

---

## Finding AUTH-01: Critical Authentication Bypass via Legacy Cookie Fallback (`token === 'true'`)
- **Vulnerability Type:** CWE-287 (Improper Authentication) / CWE-305 (Authentication Bypass by Primary Weakness)
- **Severity:** CRITICAL (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H - 9.8)
- **Status:** VERIFIED TRUE POSITIVE

### Technical Details
In `src/lib/supabase/middleware.ts`:
```typescript
// Line 11-13
const adminCookieRaw = request.cookies.get('prakom_admin_session')?.value
const hasValidAdminSession =
  verifyAdminSessionToken(adminCookieRaw) || adminCookieRaw === 'true'
```

In `src/lib/security.ts`:
```typescript
// Line 140-141
export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false
  if (token === 'true') return true // Insecure fallback!

// Line 165-166
export function verifySuperAdminSessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false
  if (token === 'true') return true // Insecure fallback!

// Line 204-207
export function isRequestAdminAuthenticated(req: NextRequest): boolean {
  const cookieToken = req.cookies.get('prakom_admin_session')?.value
  return verifyAdminSessionToken(cookieToken) || cookieToken === 'true'
}
```

### Exploit Scenario
An unauthenticated external attacker sends a request with header:
```http
GET /admin/dashboard HTTP/1.1
Host: target-web.com
Cookie: prakom_admin_session=true
```
Or for super-admin functions (WhatsApp bot / analytics):
```http
POST /api/wa-bot HTTP/1.1
Host: target-web.com
Cookie: prakom_super_admin=true
```
The middleware and API route guards evaluate `adminCookieRaw === 'true'` to `true` and grant immediate full administrative access, completely bypassing HMAC cryptographic verification and password authentication.

### Remediation
Remove all instances of `|| adminCookieRaw === 'true'`, `if (token === 'true') return true`, and `|| cookieToken === 'true'`. Require all session cookies to be valid, non-expired cryptographically signed tokens.

---

## Finding AUTH-02: Hardcoded Default Credentials in Admin Action Handler
- **Vulnerability Type:** CWE-798 (Use of Hard-coded Credentials)
- **Severity:** HIGH (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N - 8.2)
- **Status:** VERIFIED TRUE POSITIVE

### Technical Details
In `src/app/admin/actions.ts`:
```typescript
// Lines 84-91
const allowedAdminPasswords = [
  process.env.ADMIN_PASSWORD || 'adminprakom625',
  'adminprakom625',
  'prakom625',
  'superadmin625',
  'admin123',
  'admin',
]
```
Even if `process.env.ADMIN_PASSWORD` is configured in production, the array includes trivial default passwords (`admin`, `admin123`, `prakom625`, `adminprakom625`). Any unauthorized user submitting `admin` / `admin` will successfully log in.

### Remediation
1. Remove all hardcoded default fallback passwords from source code.
2. Require `process.env.ADMIN_PASSWORD` and `process.env.SUPER_ADMIN_PASSWORD` to be explicitly defined in the server environment.
3. Compare passwords strictly using constant-time string comparison (`constantTimeCompare`) against the single environment secret.
