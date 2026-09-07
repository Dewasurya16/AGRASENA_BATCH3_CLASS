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
      const timeoutId = setTimeout(() => controller.abort(), 2000)
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
      // Bot service is down / unreachable on localhost (e.g. running in Vercel Cloud)
    }

    // Ambil konfigurasi & status runtime dari Supabase
    let dbConfig: any = null
    let dbStatus: any = null
    try {
      const supabase = await createClient()
      const { data: cfgData } = await supabase
        .from("wa_bot_config")
        .select("value")
        .eq("key", "general_settings")
        .single()
      dbConfig = cfgData?.value || null

      const { data: stData } = await supabase
        .from("wa_bot_config")
        .select("value")
        .eq("key", "bot_runtime_status")
        .single()
      dbStatus = stData?.value || null
    } catch {
      // Ignore
    }

    // Cloud Bridge: Jika Vercel tidak bisa reach localhost:5000, gunakan data status dari Supabase
    if (!isOnline && dbStatus) {
      const lastSeenTime = dbStatus.last_seen ? new Date(dbStatus.last_seen).getTime() : 0
      // Jika bot aktif dalam 5 menit terakhir
      const isRecentlyActive = Date.now() - lastSeenTime < 5 * 60 * 1000

      if (dbStatus.connected && isRecentlyActive) {
        isOnline = true
        botData = {
          connected: true,
          phoneNumber: dbStatus.phone_number,
          pushName: dbStatus.push_name,
          targetGroupJid: dbConfig?.target_group_jid || dbStatus.target_group_jid || "",
          connectedAt: dbStatus.last_seen,
          engine: "Baileys (Worker PM2 via Cloud Supabase Bridge)",
          cloudBridge: true,
        }
      } else if (dbStatus.phone_number) {
        botData = {
          connected: false,
          phoneNumber: dbStatus.phone_number,
          pushName: dbStatus.push_name,
          message: "Worker bot di laptop offline. Pastikan PM2 tetap aktif di laptop.",
        }
      }
    }

    return NextResponse.json({
      online: isOnline,
      botUrl,
      status: botData || {
        connected: false,
        message: "Layanan bot WhatsApp sedang offline. Jalankan PM2 di laptop Anda.",
      },
      config: dbConfig,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menghubungi bot WhatsApp" }, { status: 500 })
  }
}

/**
 * Helper: Antrekan Aksi ke Supabase agar dieksekusi oleh Worker Bot Lokal di Laptop
 */
async function queueActionToSupabase(action: { type: string; [key: string]: any }) {
  try {
    const supabase = await createClient()
    const { data: qData } = await supabase
      .from("wa_bot_config")
      .select("value")
      .eq("key", "pending_actions")
      .single()

    const queue = Array.isArray(qData?.value) ? qData.value : []
    queue.push({
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      ...action,
      created_at: new Date().toISOString(),
      status: "pending",
    })

    await supabase.from("wa_bot_config").upsert(
      {
        key: "pending_actions",
        value: queue.slice(-30),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    )
    return true
  } catch (e: any) {
    console.error("[Cloud Bridge Error]", e.message)
    return false
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
        const { data: currentCfg } = await supabase
          .from("wa_bot_config")
          .select("value")
          .eq("key", "general_settings")
          .single()

        const val = currentCfg?.value || {}
        val.target_group_jid = targetGroupJid

        await supabase.from("wa_bot_config").upsert(
          {
            key: "general_settings",
            value: val,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        )
      } catch (e: any) {
        console.warn("[API wa-bot] Warning upsert Supabase:", e.message)
      }

      // Notifikasi ke server bot lokal jika online
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

      // 1. Coba kirim via HTTP lokal
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000)
        const res = await fetch(`${botUrl}/api/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${botSecret}`,
          },
          body: JSON.stringify({ message, to }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        if (res.ok) {
          const result = await res.json()
          return NextResponse.json({ success: true, ...result })
        }
      } catch {}

      // 2. Fallback: Antrekan via Supabase Cloud Bridge untuk diproses worker lokal
      const queued = await queueActionToSupabase({ type: "send", message, to })
      if (queued) {
        return NextResponse.json({
          success: true,
          message: "Pesan siaran berhasil dikirimkan ke antrean WhatsApp melalui Cloud Bridge!",
        })
      }

      return NextResponse.json({ error: "Gagal mengirim pesan via bot WhatsApp." }, { status: 500 })
    }

    // 3. Trigger Notifikasi Jadwal Hari Ini
    if (action === "trigger_schedule") {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000)
        const res = await fetch(`${botUrl}/api/trigger/schedule`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${botSecret}`,
          },
          body: JSON.stringify({ target: body.target }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        if (res.ok) {
          const result = await res.json()
          return NextResponse.json(result)
        }
      } catch {}

      const queued = await queueActionToSupabase({ type: "trigger_schedule", target: body.target })
      if (queued) {
        return NextResponse.json({
          success: true,
          message: "Perintah notifikasi jadwal berhasil diteruskan ke Bot WhatsApp!",
        })
      }
      return NextResponse.json({ error: "Gagal memicu pengingat jadwal." }, { status: 500 })
    }

    // 4. Trigger Pengingat Tugas Mandiri
    if (action === "trigger_task") {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000)
        const res = await fetch(`${botUrl}/api/trigger/task`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${botSecret}`,
          },
          body: JSON.stringify({ target: body.target }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        if (res.ok) {
          const result = await res.json()
          return NextResponse.json(result)
        }
      } catch {}

      const queued = await queueActionToSupabase({ type: "trigger_task", target: body.target })
      if (queued) {
        return NextResponse.json({
          success: true,
          message: "Perintah pengingat tugas berhasil diteruskan ke Bot WhatsApp!",
        })
      }
      return NextResponse.json({ error: "Gagal memicu pengingat tugas." }, { status: 500 })
    }

    return NextResponse.json({ error: "Aksi tidak dikenal." }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal berkomunikasi dengan server bot WhatsApp." },
      { status: 500 }
    )
  }
}
