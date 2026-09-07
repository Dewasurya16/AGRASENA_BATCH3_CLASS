-- =========================================================================
-- SKEMA TABEL BOT WHATSAPP NOTIFIKASI & PENGINGAT (AGRASENA BATCH 3)
-- Eksekusi skrip ini di SQL Editor dashboard Supabase Anda.
-- =========================================================================

-- 1. Tabel Konfigurasi Bot WhatsApp
CREATE TABLE IF NOT EXISTS public.wa_bot_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index untuk pencarian key konfigurasi cepat
CREATE INDEX IF NOT EXISTS idx_wa_bot_config_key ON public.wa_bot_config(key);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.wa_bot_config ENABLE ROW LEVEL SECURITY;

-- Policy: Publik hanya bisa membaca jika diizinkan, admin punya akses penuh
CREATE POLICY "Allow anon read wa_bot_config"
  ON public.wa_bot_config
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow service_role full access wa_bot_config"
  ON public.wa_bot_config
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Isi konfigurasi default
INSERT INTO public.wa_bot_config (key, value, description)
VALUES 
  (
    'general_settings',
    jsonb_build_object(
      'target_group_jid', '',
      'bot_name', 'Agrasena Bot Pengingat',
      'schedule_reminder_enabled', true,
      'schedule_reminder_time', '07:00',
      'task_reminder_enabled', true,
      'task_reminder_time', '16:00',
      'auto_reply_enabled', true
    ),
    'Pengaturan umum bot WhatsApp, target grup JID, dan jadwal notifikasi harian.'
  ),
  (
    'bot_runtime_status',
    jsonb_build_object(
      'connected', false,
      'phone_number', null,
      'push_name', null,
      'last_seen', null,
      'last_broadcast', null
    ),
    'Status operasional bot real-time yang dilaporkan oleh worker engine.'
  )
ON CONFLICT (key) DO NOTHING;

-- 2. Tabel Penyimpanan Sesi Baileys (Cloud Ephemeral Session Sync)
-- Digunakan agar bot tidak perlu scan QR ulang jika hosting di Render/Koyeb restart
CREATE TABLE IF NOT EXISTS public.wa_bot_session (
  session_id TEXT NOT NULL,
  key_id TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (session_id, key_id)
);

CREATE INDEX IF NOT EXISTS idx_wa_bot_session_session_id ON public.wa_bot_session(session_id);

ALTER TABLE public.wa_bot_session ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access wa_bot_session"
  ON public.wa_bot_session
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Selesai
COMMENT ON TABLE public.wa_bot_config IS 'Menyimpan konfigurasi target grup dan preferensi notifikasi Bot WhatsApp Diklat.';
COMMENT ON TABLE public.wa_bot_session IS 'Menyimpan token sesi WhatsApp Web terenkripsi untuk auto-reconnect di cloud hosting.';
