-- =========================================================================
-- SQL MIGRATION: Tabel Statistik & Log Pengunjung (visitor_logs)
-- Web Kelas - Diklat Prakom Batch 3 Kejaksaan RI X Agrasena
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.visitor_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip TEXT NOT NULL DEFAULT '127.0.0.1',
    user_agent TEXT,
    device TEXT DEFAULT 'Desktop',      -- 'Desktop', 'Mobile', 'Tablet', 'Bot'
    os TEXT DEFAULT 'Unknown OS',        -- 'Windows 11', 'macOS', 'Android', 'iOS', 'Linux'
    browser TEXT DEFAULT 'Unknown',      -- 'Chrome', 'Safari', 'Edge', 'Firefox'
    path TEXT DEFAULT '/',               -- Halaman yang diakses
    referrer TEXT DEFAULT 'Direct',      -- Sumber rujukan / asal klik
    screen TEXT,                         -- Resolusi layar (misal: 1920x1080)
    language TEXT DEFAULT 'id',          -- Bahasa browser
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing untuk pencarian cepat & agregasi dashboard
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON public.visitor_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_ip ON public.visitor_logs(ip);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_device ON public.visitor_logs(device);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_path ON public.visitor_logs(path);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- Policy 1: Izinkan siapapun (anon / public) untuk mencatat kunjungan (INSERT)
CREATE POLICY "Allow public insert to visitor_logs"
ON public.visitor_logs
FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

-- Policy 2: Izinkan pembacaan log untuk dashboard (SELECT)
CREATE POLICY "Allow select from visitor_logs"
ON public.visitor_logs
FOR SELECT
TO public, anon, authenticated
USING (true);

-- Policy 3: Izinkan penghapusan log oleh admin/authenticated (DELETE)
CREATE POLICY "Allow delete from visitor_logs"
ON public.visitor_logs
FOR DELETE
TO public, anon, authenticated
USING (true);
