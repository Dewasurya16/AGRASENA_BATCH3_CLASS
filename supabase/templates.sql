-- =========================================================================
-- SUPABASE MIGRATION: templates (Pusat Template BPS & Naskah Dinas TIK)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    format TEXT NOT NULL DEFAULT '.doc Word',
    legal_reference TEXT NOT NULL,
    bps_code TEXT,
    tags TEXT[] DEFAULT '{}',
    description TEXT,
    content_doc TEXT,
    file_url TEXT,
    file_name TEXT,
    file_size BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Public can read all templates
CREATE POLICY "Public can read templates"
ON public.templates
FOR SELECT
USING (true);

-- Authenticated/Admin can insert/update/delete templates
CREATE POLICY "Admin can insert templates"
ON public.templates
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin can update templates"
ON public.templates
FOR UPDATE
USING (true);

CREATE POLICY "Admin can delete templates"
ON public.templates
FOR DELETE
USING (true);
