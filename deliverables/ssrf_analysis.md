# Perseus Audit: SSRF & Cryptographic Analysis

**Target:** Web Kelas (Agrasena)  
**Assessor:** Perseus Security Suite (Audit Phase)  
**Date:** 2026-09-19  

---

## Finding SSRF-01: Bypassable SSRF Filter via HTTP 302 Redirect
- **Vulnerability Type:** CWE-918 (Server-Side Request Forgery)
- **Severity:** MEDIUM (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N - 5.3)
- **Status:** VERIFIED TRUE POSITIVE

### Technical Details
In `src/app/api/ai/summarize-module/route.ts`:
```typescript
async function extractTextFromPdf(pdfUrl: string): Promise<string> {
  // Line 17-41: Hostname checks against private IP strings (localhost, 127.0.0.1, 10.x, 192.168.x)
  ...
  const res = await fetch(pdfUrl, {
    headers: { "User-Agent": "Mozilla/5.0..." },
    cache: "no-store",
    // Missing redirect: 'manual' or redirect: 'error'
  })
}
```
`fetch` in Node.js / Next.js follows HTTP redirects by default. An attacker hosting a public endpoint `https://evil-attacker.com/doc.pdf` can respond with an HTTP 302 redirect header:
`Location: http://127.0.0.1:5000/status` (or AWS/Cloud metadata `http://169.254.169.254/latest/meta-data/`).
Because the hostname check was only performed on the initial URL, `fetch` follows the redirect to internal services.

### Remediation
Set `redirect: 'error'` in the `fetch` options:
```typescript
const res = await fetch(pdfUrl, {
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  cache: "no-store",
  redirect: "error", // Prevent SSRF redirect bypass
})
```

---

## Finding CRYPTO-01: Public Fallback Secret in HMAC Session Signing
- **Vulnerability Type:** CWE-321 (Use of Hard-coded Cryptographic Key)
- **Severity:** MEDIUM (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N - 6.5)
- **Status:** VERIFIED TRUE POSITIVE

### Technical Details
In `src/lib/security.ts`:
```typescript
const SECRET_KEY =
  process.env.SESSION_SECRET ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'prakom-batch-3-default-crypto-salt-secure-kejaksaan-2026'
```
`NEXT_PUBLIC_SUPABASE_ANON_KEY` is bundled directly into the browser client and is public by definition. If `SESSION_SECRET` is not set in `.env.local`, anyone can use the public anon key or the repository default salt to generate valid administrator session tokens.

### Remediation
Ensure `SESSION_SECRET` or `ADMIN_SECRET` is strictly required on server environments without falling back to `NEXT_PUBLIC_*` public variables.
