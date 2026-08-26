# Blueprint & Skema Database: Web Kelas (Class Backup & Resource Hub)

Dokumen ini berisi seluruh skema SQL untuk Supabase PostgreSQL, konfigurasi Supabase Storage Bucket `class-materials`, serta aturan keamanan Row Level Security (RLS).

---

## 1. Skema SQL PostgreSQL (Supabase)

Salin dan jalankan script SQL ini pada **Supabase SQL Editor**:

```sql
-- ==========================================
-- 1. ENUMS
-- ==========================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE day_name AS ENUM ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==========================================
-- 2. PROFILES TABLE (Sinkronisasi Auth Supabase)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'student'::user_role NOT NULL,
  phone_number TEXT
);

-- ==========================================
-- 3. SCHEDULES TABLE (Jadwal Perkuliahan)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  subject_name TEXT NOT NULL,
  day day_name NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  lecturer TEXT NOT NULL,
  room TEXT NOT NULL,
  meeting_link TEXT,
  color TEXT DEFAULT 'indigo'
);

-- ==========================================
-- 4. MATERIALS TABLE (Resource Hub & PDF Backup)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  week_number INT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT,
  file_type TEXT DEFAULT 'application/pdf',
  description TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ==========================================
-- 5. TASKS TABLE (Penugasan & Live Countdown)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  status task_status DEFAULT 'todo'::task_status NOT NULL,
  submission_link TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ==========================================
-- 6. ANNOUNCEMENTS TABLE (Pengumuman Mendesak)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT false NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  author TEXT DEFAULT 'Ketua Kelas' NOT NULL
);

-- ==========================================
-- 7. SHOWCASES TABLE (Galeri Proyek Terbaik)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.showcases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  student_names TEXT NOT NULL,
  description TEXT,
  preview_image_url TEXT,
  project_url TEXT,
  file_url TEXT
);

-- ==========================================
-- 8. SUPABASE STORAGE BUCKET: class-materials
-- ==========================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('class-materials', 'class-materials', true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcases ENABLE ROW LEVEL SECURITY;

-- Policy: Publik dapat membaca data jadwal, materi, tugas, pengumuman, showcase
CREATE POLICY "Public read schedules" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Public read materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Public read tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public read showcases" ON public.showcases FOR SELECT USING (true);

-- Policy: Admin / Authenticated User dapat mengelola seluruh data
CREATE POLICY "Admin manage schedules" ON public.schedules FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage materials" ON public.materials FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage tasks" ON public.tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage announcements" ON public.announcements FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage showcases" ON public.showcases FOR ALL TO authenticated USING (true);

-- Policy: Storage Objects (class-materials)
CREATE POLICY "Public read class-materials storage" ON storage.objects 
FOR SELECT USING (bucket_id = 'class-materials');

CREATE POLICY "Authenticated admin upload storage" ON storage.objects 
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'class-materials');

CREATE POLICY "Authenticated admin delete storage" ON storage.objects 
FOR DELETE TO authenticated USING (bucket_id = 'class-materials');
```
