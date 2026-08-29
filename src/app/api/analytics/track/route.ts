import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, sanitizeInput } from '@/lib/security'

export const dynamic = 'force-dynamic'

function parseUserAgent(ua: string) {
  const uaLower = (ua || '').toLowerCase()

  // 1. Detect Device (Media Akses)
  let device = 'Desktop'
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(uaLower)) {
    device = 'Tablet'
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    )
  ) {
    device = 'Mobile'
  } else if (/bot|crawler|spider|crawling|googlebot/i.test(uaLower)) {
    device = 'Bot'
  }

  // 2. Detect Operating System (OS)
  let os = 'Unknown OS'
  if (/windows nt 10.0/i.test(ua)) os = 'Windows 10/11'
  else if (/windows nt 6.3/i.test(ua)) os = 'Windows 8.1'
  else if (/windows nt 6.2/i.test(ua)) os = 'Windows 8'
  else if (/windows nt 6.1/i.test(ua)) os = 'Windows 7'
  else if (/windows/i.test(ua)) os = 'Windows'
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS'
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/linux/i.test(ua)) os = 'Linux'
  else if (/cros/i.test(ua)) os = 'Chrome OS'

  // 3. Detect Browser
  let browser = 'Unknown Browser'
  if (/edg/i.test(ua)) browser = 'Edge'
  else if (/opr|opera/i.test(ua)) browser = 'Opera'
  else if (/samsungbrowser/i.test(ua)) browser = 'Samsung Internet'
  else if (/ucbrowser/i.test(ua)) browser = 'UC Browser'
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome'
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox'
  else if (/safari/i.test(ua)) browser = 'Safari'

  return { device, os, browser }
}

function extractClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((ip) => ip.trim())
    if (ips[0]) return ips[0]
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp

  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp

  const vercelIp = request.headers.get('x-vercel-forwarded-for')
  if (vercelIp) return vercelIp

  const clientIp = request.headers.get('x-client-ip')
  if (clientIp) return clientIp

  return '127.0.0.1'
}

export async function POST(request: NextRequest) {
  try {
    const rawIp = extractClientIp(request)
    const ip = rawIp === '::1' ? '127.0.0.1' : rawIp
    
    // Rate limit: Max 60 analytics hits per minute per IP to prevent spam
    const rateLimit = checkRateLimit(ip, 'analytics_track', 60, 60 * 1000)
    if (rateLimit.isLimited) {
      return NextResponse.json({ success: false, error: 'Rate limited' }, { status: 429 })
    }

    const userAgent = request.headers.get('user-agent') || ''
    const { device, os, browser } = parseUserAgent(userAgent)

    let bodyData: any = {}
    try {
      bodyData = await request.json()
    } catch {
      // Body might be empty
    }

    const path = sanitizeInput(bodyData.path || request.nextUrl.searchParams.get('path') || '/', 255)
    const referrer = sanitizeInput(bodyData.referrer || request.headers.get('referer') || 'Direct', 500)
    const screen = sanitizeInput(bodyData.screen || '', 50)
    const language = sanitizeInput(bodyData.language || request.headers.get('accept-language')?.slice(0, 10) || '', 50)

    const host = request.headers.get('host') || ''
    const isLocalhostIp =
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip === 'localhost' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.16.') ||
      ip.startsWith('172.17.') ||
      ip.startsWith('172.18.') ||
      ip.startsWith('172.19.') ||
      ip.startsWith('172.20.') ||
      ip.startsWith('172.21.') ||
      ip.startsWith('172.22.') ||
      ip.startsWith('172.23.') ||
      ip.startsWith('172.24.') ||
      ip.startsWith('172.25.') ||
      ip.startsWith('172.26.') ||
      ip.startsWith('172.27.') ||
      ip.startsWith('172.28.') ||
      ip.startsWith('172.29.') ||
      ip.startsWith('172.30.') ||
      ip.startsWith('172.31.')

    const isLocalHostHeader =
      host.includes('localhost') ||
      host.includes('127.0.0.1') ||
      host.includes('0.0.0.0')

    // Only record real production traffic from deployed site (ignore localhost / local IP dev)
    if (process.env.NODE_ENV === 'development' || isLocalhostIp || isLocalHostHeader) {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'Akses dari localhost / IP lokal dilewati dan tidak disimpan ke visitor_logs.',
        data: { ip, device, os, browser, path },
      })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id')) {
      try {
        const supabase = await createClient()
        await supabase.from('visitor_logs').insert({
          ip,
          user_agent: userAgent.slice(0, 1000),
          device,
          os,
          browser,
          path,
          referrer,
          screen,
          language,
        })
      } catch (err) {
        // Table might not exist yet or connection failed - return 200 gracefully
        console.warn('[Analytics Tracker] Warning inserting visitor_logs:', err)
      }
    }

    return NextResponse.json({
      success: true,
      data: { ip, device, os, browser, path },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to log visit' },
      { status: 200 }
    )
  }
}
