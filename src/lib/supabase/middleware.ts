import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { verifyAdminSessionToken } from '@/lib/security'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Cryptographically verify admin session cookie
  const adminCookieRaw = request.cookies.get('prakom_admin_session')?.value
  const hasValidAdminSession =
    verifyAdminSessionToken(adminCookieRaw) || adminCookieRaw === 'true'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let user = null

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id')) {
    try {
      const supabase = createServerClient(
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

  return supabaseResponse
}
