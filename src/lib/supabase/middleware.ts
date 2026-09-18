import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { verifyAdminSessionToken } from '@/lib/security'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Cryptographically verify admin session cookie
  const adminCookieRaw = request.cookies.get('prakom_admin_session')?.value
  const hasValidAdminSession = Boolean(verifyAdminSessionToken(adminCookieRaw))

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let user = null
  let supabase: any = null

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id')) {
    try {
      supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
              supabaseResponse = NextResponse.next({
                request,
              })
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              )
            },
          },
        }
      )

      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch {
      // Ignore
    }
  }

  const isAuthenticated = Boolean(user || hasValidAdminSession)

  // Redirect legacy /dashboard routes to unified /admin/dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  // Protect /admin routes (except /admin/login)
  if (
    !isAuthenticated &&
    request.nextUrl.pathname.startsWith('/admin') &&
    request.nextUrl.pathname !== '/admin/login'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If user is already authenticated and visits /admin/login, redirect to /admin/dashboard
  if (isAuthenticated && request.nextUrl.pathname === '/admin/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  // =========================================================================
  // MAINTENANCE MODE ENFORCEMENT & REALTIME CHECK
  // =========================================================================
  const isMaintenanceRoute = request.nextUrl.pathname === '/maintenance'
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isExemptApiRoute =
    request.nextUrl.pathname.startsWith('/api/maintenance') ||
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/api/admin')

  let isMaintenanceActive = false

  // Query realtime maintenance status from Supabase (never rely on stale 30-day cookie)
  if (supabase && !isAdminRoute && !isExemptApiRoute) {
    try {
      const { data: maintRecord } = await supabase
        .from('wa_bot_config')
        .select('value')
        .eq('key', 'maintenance_config')
        .maybeSingle()

      if (maintRecord && maintRecord.value) {
        const val = typeof maintRecord.value === 'string' ? JSON.parse(maintRecord.value) : maintRecord.value
        isMaintenanceActive = Boolean(val.enabled)
      }
    } catch {
      // Ignore fallback
    }
  }

  // Explicit Admin Bypass handling (only active if admin explicitly requests it via ?bypass=1 or bypass cookie)
  const wantsBypass = request.nextUrl.searchParams.get('bypass') === '1'
  const wantsResetBypass = request.nextUrl.searchParams.get('bypass') === '0'
  const hasBypassCookie = !wantsResetBypass && request.cookies.get('admin_maint_bypass')?.value === '1'
  const hasAdminBypass = hasValidAdminSession && (wantsBypass || hasBypassCookie)

  if (wantsResetBypass) {
    supabaseResponse.cookies.delete('admin_maint_bypass')
  } else if (wantsBypass && hasValidAdminSession) {
    supabaseResponse.cookies.set('admin_maint_bypass', '1', {
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
    })
  }

  // If maintenance is active
  if (isMaintenanceActive) {
    if (!hasAdminBypass && !isAdminRoute && !isExemptApiRoute && !isMaintenanceRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/maintenance'
      return NextResponse.redirect(url)
    }
  } else if (isMaintenanceRoute) {
    // If maintenance is inactive and user visits /maintenance without preview, redirect to home
    const isPreview =
      request.nextUrl.searchParams.get('preview') === 'true' ||
      request.nextUrl.searchParams.get('preview') === '1'
    if (!isPreview) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
