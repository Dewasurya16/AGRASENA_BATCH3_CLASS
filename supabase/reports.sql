-- =========================================================================
-- SQL MIGRATION: Tabel Laporan Kendala & Kotak Saran Peserta (reports)
-- Web Kelas - Diklat Prakom Batch 3 Kejaksaan RI X Agrasena
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    satker TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Kendala Teknis Web & Lainnya',
    message TEXT NOT NULL,
    contact TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'resolved'
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing untuk pencarian cepat & agregasi filter status dashboard
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_category ON public.reports(category);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policy 1: Izinkan peserta umum mengirim laporan tanpa login (INSERT)
CREATE POLICY "Allow public insert to reports"
ON public.reports
FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

-- Policy 2: Izinkan pembacaan laporan untuk admin dan publik (SELECT)
CREATE POLICY "Allow select from reports"
ON public.reports
FOR SELECT
TO public, anon, authenticated
USING (true);

-- Policy 3: Izinkan pembaruan status laporan (UPDATE)
CREATE POLICY "Allow update to reports"
ON public.reports
FOR UPDATE
TO public, anon, authenticated
USING (true);

-- Policy 4: Izinkan penghapusan laporan (DELETE)
CREATE POLICY "Allow delete from reports"
ON public.reports
FOR DELETE
TO public, anon, authenticated
USING (true);
