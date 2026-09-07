import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySuperAdminSessionToken } from "@/lib/security"
import { createClient } from "@/lib/supabase/server"

// URL default bot: bisa diset di .env.local via WA_BOT_URL atau fallback ke http://localhost:5000
const getBotBaseUrl = () => {
  return (process.env.WA_BOT_URL || "http://localhost:5000").replace(/\/$/, "")
}

const getBotSecret = () => {
  return process.env.BOT_SECRET_KEY || "agrasena_prakom_super_secret_bot_key_2026"
}

/**
 * Validasi otorisasi admin (hanya admin/super admin yang boleh memanggil API ini)
 */
async function verifyAdminAuth() {
  const cookieStore = await cookies()
  const isSuper = verifySuperAdminSessionToken(cookieStore.get("prakom_super_admin")?.value)
  const isAdmin = cookieStore.get("prakom_admin_auth")?.value === "authenticated"
  return isSuper || isAdmin
}

export async function GET(request: NextRequest) {
  const isAuth = await verifyAdminAuth()
  if (!isAuth) {
    return NextResponse.json({ error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action") || "status"
  const botUrl = getBotBaseUrl()
  const botSecret = getBotSecret()

  try {
    // 1. Ambil QR Code
    if (action === "qr") {
      const res = await fetch(`${botUrl}/qr`, {
        headers: { Authorization: `Bearer ${botSecret}` },
        cache: "no-store",
      })
      if (!res.ok) {
        return NextResponse.json({
          connected: false,
          error: "Bot tidak merespons endpoint /qr",
          qrImage: null,
        })
      }
      const data = await res.json()
      return NextResponse.json(data)
    }

    // 2. Ambil Daftar Grup
    if (action === "groups") {
      const res = await fetch(`${botUrl}/api/groups`, {
        headers: { Authorization: `Bearer ${botSecret}` },
        cache: "no-store",
      })
      if (!res.ok) {
        return NextResponse.json({ groups: [] })
      }
      const data = await res.json()
      return NextResponse.json(data)
    }

    // 3. Status Bot Default
    let botData: any = null
    let isOnline = false

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3500)
      const res = await fetch(`${botUrl}/status`, {
        headers: { Authorization: `Bearer ${botSecret}` },
        cache: "no-store",
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (res.ok) {
        botData = await res.json()
        isOnline = true
      }
    } catch {
      // Bot service is down / unreachable
    }

    // Ambil konfigurasi cadangan dari Supabase jika bot offline
    let dbConfig = null
    try {
      const supabase = await createClient()
      const { data } = await supabase.from("wa_bot_config").select("value").eq("key", "general_settings").single()
      dbConfig = data?.value || null
    } catch {
      // Ignore
    }

    return NextResponse.json({
      online: isOnline,
      botUrl,
      status: botData || {
        connected: false,
        message: "Layanan server bot WhatsApp sedang offline atau URL bot belum terjangkau.",
      },
      config: dbConfig,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menghubungi bot WhatsApp" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const isAuth = await verifyAdminAuth()
  if (!isAuth) {
    return NextResponse.json({ error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 401 })
  }

  const botUrl = getBotBaseUrl()
  const botSecret = getBotSecret()

  try {
    const body = await request.json()
    const { action } = body

    // 1. Simpan Target Group JID / Konfigurasi ke Supabase & Bot
    if (action === "save_config") {
      const { targetGroupJid } = body
      if (!targetGroupJid) {
        return NextResponse.json({ error: "Target Group JID wajib diisi." }, { status: 400 })
      }

      // Simpan ke Supabase
      try {
        const supabase = await createClient()
        await supabase.from("wa_bot_config").upsert({
          key: "general_settings",
          value: { target_group_jid: targetGroupJid },
          updated_at: new Date().toISOString(),
        })
      } catch (e: any) {
        console.warn("[API wa-bot] Warning upsert Supabase:", e.message)
      }

      // Notifikasi ke server bot jika online
      try {
        await fetch(`${botUrl}/api/config`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${botSecret}`,
          },
          body: JSON.stringify({ targetGroupJid }),
        })
      } catch {}

      return NextResponse.json({ success: true, message: "Target Group WhatsApp berhasil diperbarui!" })
    }

    // 2. Kirim Pesan Siaran Kustom
    if (action === "send") {
      const { message, to } = body
      if (!message) {
        return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 })
      }

      const res = await fetch(`${botUrl}/api/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${botSecret}`,
        },
        body: JSON.stringify({ message, to }),
      })

      const result = await res.json()
      if (!res.ok) {
        return NextResponse.json({ error: result.error || "Gagal mengirim pesan via bot." }, { status: res.status })
      }
      return NextResponse.json({ success: true, ...result })
    }

    // 3. Trigger Notifikasi Jadwal Hari Ini
    if (action === "trigger_schedule") {
      const res = await fetch(`${botUrl}/api/trigger/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${botSecret}`,
        },
        body: JSON.stringify({ target: body.target }),
      })
      const result = await res.json()
      if (!res.ok) {
        return NextResponse.json({ error: result.error || "Gagal memicu pengingat jadwal." }, { status: res.status })
      }
      return NextResponse.json(result)
    }

    // 4. Trigger Pengingat Tugas Mandiri
    if (action === "trigger_task") {
      const res = await fetch(`${botUrl}/api/trigger/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${botSecret}`,
        },
        body: JSON.stringify({ target: body.target }),
      })
      const result = await res.json()
      if (!res.ok) {
        return NextResponse.json({ error: result.error || "Gagal memicu pengingat tugas." }, { status: res.status })
      }
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Aksi tidak dikenal." }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal berkomunikasi dengan server bot WhatsApp." },
      { status: 500 }
    )
  }
}
