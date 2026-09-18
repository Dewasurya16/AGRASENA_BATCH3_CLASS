# Perseus Scan: Target Knowledge Graph & Attack Surface Map

**Target:** Web Kelas (Agrasena Batch 3 & 4)  
**Methodology:** Perseus Phase 1 & 2 Reconnaissance  
**Engagement Mode:** `PRODUCTION_SAFE`  
**Date:** 2026-09-19  

---

## 1. Scope & Boundaries
- **In-Scope (Network Reachable):**
  - Next.js Web Application routes (`/`, `/batch-4/**`, `/admin/**`, `/auth/**`)
  - Next.js App Router API Endpoints (`/api/**`)
  - Server Actions (`adminSignIn`, `adminSignOut`, `login`, `signup`, `signOut`)
  - WhatsApp Bot HTTP Gateway (`/api/wa-bot`, `wa-bot/api.js`)
- **Out-of-Scope:**
  - Third-party managed APIs (Supabase Cloud API, Gemini LLM Cloud endpoints)
  - Offline developer scripts (`scripts/**`)

---

## 2. Technology Stack Discovery
- **Language:** TypeScript 5.x / JavaScript (Node.js 20+)
- **Frontend / Framework:** Next.js 16 (App Router), React 19, Vanilla CSS + Tailwind
- **State & Data Store:** Supabase (PostgreSQL), browser LocalStorage / SessionStorage
- **Microservices:** WhatsApp Web Bot Gateway (`wa-bot/`, Baileys/WPPConnect)
- **Infrastructure & Deployment:** Render (`render.yaml`), Vercel, Supabase Cloud

---

## 3. Network-Accessible Entry Points
| Route / Action | Method | Access Level | Auth Mechanism | Notes |
|---|---|---|---|---|
| `/api/zoom-config` | GET | Public | None | Returns meeting schedules & credentials |
| `/api/zoom-config` | POST | Admin | `isRequestAdminAuthenticated` | Updates zoom meeting credentials |
| `/api/materials` | GET | Public | None | Lists modules & downloadable links |
| `/api/materials/upload` | POST | Admin | `isRequestAdminAuthenticated` | Handles PDF upload metadata & storage |
| `/api/discussions` | GET | Public | None | Returns active forum threads |
| `/api/discussions` | POST | Mixed | Rate-limited / Admin auth | Thread creation is public; deletions are admin-only |
| `/api/reports` | GET | Admin | `isRequestAdminAuthenticated` | Lists issues & contact submissions |
| `/api/reports` | POST | Mixed | Rate-limited / Admin auth | Ticket creation is public; status updates are admin-only |
| `/api/wa-bot` | GET / POST | Super Admin | `verifySuperAdminSessionToken` | Triggers bot QR, groups, broadcasts |
| `/api/analytics/track` | POST | Public | Rate-limited IP | Telemetry and visitor logging |
| `/api/ai/*` | POST | Public | Rate-limited | Chat, paper generators, summarizers |
| Server Action `adminSignIn` | POST | Public | Form data (Email & Password) | Issues `prakom_admin_session` cookie |
| Server Action `signup` | POST | Public | Form data | Registers new Supabase user |

---

## 4. Security Patterns & Middleware Analysis
- **Security Headers (`next.config.ts`):**
  - Content-Security-Policy (CSP) configured with explicit script/style/img/connect domains.
  - X-Frame-Options: `SAMEORIGIN`
  - X-Content-Type-Options: `nosniff`
  - Referrer-Policy: `strict-origin-when-cross-origin`
  - Strict-Transport-Security: `max-age=63072000; includeSubDomains; preload`
- **Session Tokens (`src/lib/security.ts`):**
  - HMAC signed tokens: `generateAdminSessionToken()`, `generateSuperAdminSessionToken()`.
  - Stored in `httpOnly`, `sameSite: 'lax'` cookies.
- **Input Sanitization:**
  - `sanitizeInput()` strips HTML tags, script protocols, inline event handlers, and null bytes.
- **Rate Limiting:**
  - In-memory sliding window limiter (`checkRateLimit()`) across mutations and AI endpoints.

---

## 5. Potential Attack Surface Sinks
- **SSRF Sinks:** `src/app/api/ai/summarize-module/route.ts` (remote PDF fetching; hostname filtered, needs redirect restriction).
- **Authentication Fallback Sinks:** Legacy fallback `token === 'true'` in `src/lib/security.ts` and `src/lib/supabase/middleware.ts`.
- **Hardcoded Credential Sinks:** Default admin & superadmin password arrays in `src/app/admin/actions.ts`.
