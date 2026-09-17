# Multi-Batch Support (Agrasena Batch 3 & Agrasena Batch 4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghadirkan portal kelas mandiri untuk Agrasena Batch 4 (jadwal 35 hari, modul 120 JP, dan link Zoom terpisah) di dalam satu web aplikasi dengan switcher di Layar Intro dan routing sub-page khusus.

**Architecture:** Menggunakan dedicated sub-routes (`/batch-4`, `/batch-4/schedules`, `/batch-4/materials`) dengan modul data terisolasi di `src/data/batch4/`. Pemilihan angkatan dilakukan di Layar Intro (`IntroScreen`), disimpan di `localStorage`, dan didukung oleh Navbar yang mendeteksi rute aktif.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Supabase SSR.

**Spec:** [docs/superpowers/specs/2026-09-17-multi-batch-agrasena-batch4-design.md](file:///d:/pROJEK/Web%20Kelas/docs/superpowers/specs/2026-09-17-multi-batch-agrasena-batch4-design.md)

## Global Constraints
- Keduanya menyandang nama kehormatan **Agrasena**: **Agrasena Batch 3** dan **Agrasena Batch 4**.
- Data Batch 3 yang sedang aktif (`/`, `/schedules`, `/materials`) tidak boleh terganggu atau mengalami perubahan data.
- Switcher angkatan utama diletakkan di **Layar Intro (`IntroScreen`)**, dengan indikator badge pendukung di navbar.
- Harus menyertakan data default lengkap untuk Batch 4 sehingga halaman tidak pernah kosong meskipun Supabase offline.

---

### Task 1: Data Layer & Konfigurasi Mandiri Agrasena Batch 4

**Files:**
- Create: `src/data/batch4/zoom-config.ts`
- Create: `src/data/batch4/schedules-data.ts`
- Create: `src/data/batch4/materials-data.ts`

**Interfaces:**
- Produces: `BATCH4_ZOOM_CONFIG`, `DEFAULT_BATCH4_SCHEDULES`, `DEFAULT_BATCH4_MATERIALS`

- [ ] **Step 1: Buat konfigurasi Zoom khusus Batch 4 di `src/data/batch4/zoom-config.ts`**
  - Tautan Zoom Meeting, Meeting ID, Passcode, dan panduan presensi resmi Batch 4.
- [ ] **Step 2: Buat dataset jadwal 35 hari di `src/data/batch4/schedules-data.ts`**
  - Roadmap 35 hari lengkap (Tahap 1 MOOC, Tahap 2 TMO, Tahap 3 Klasikal) terstruktur sesuai interface `ScheduleRecord`.
- [ ] **Step 3: Buat dataset materi 120 JP di `src/data/batch4/materials-data.ts`**
  - Dataset modul pembelajaran, bahan tayang, dan PDF untuk Batch 4.
- [ ] **Step 4: Commit perubahan Task 1 ke git**

---

### Task 2: Integrasi Switcher Angkatan pada Layar Intro (`IntroScreen`)

**Files:**
- Modify: `src/components/public/intro-screen.tsx`

**Interfaces:**
- Consumes: LocalStorage `prakom_user_batch`
- Produces: Persistent user batch selection and smart redirection to `/batch-4` or `/`

- [ ] **Step 1: Tambahkan state `selectedBatch: "batch-3" | "batch-4"` di `IntroScreen`**
  - Baca nilai default dari `localStorage.getItem("prakom_user_batch") || "batch-3"`.
- [ ] **Step 2: Tambahkan UI Selector Angkatan pada form identitas peserta**
  - Dua kartu pilihan elegan:
    - 🟢 **Agrasena Batch 3** (Kelas Berjalan)
    - 🟣 **Agrasena Batch 4** (Kelas Tambahan Baru)
- [ ] **Step 3: Tangani penyimpanan dan pengalihan saat tombol "Mulai Belajar" diklik**
  - Simpan `prakom_user_batch` ke `localStorage`.
  - Jika memilih `batch-4` dan URL saat ini bukan `/batch-4`, alihkan ke `/batch-4`.
  - Jika memilih `batch-3` dan URL saat ini di `/batch-4`, alihkan ke `/`.
- [ ] **Step 4: Sediakan tombol ganti angkatan pada tampilan "recognized user" (profil tersimpan)**
- [ ] **Step 5: Commit perubahan Task 2 ke git**

---

### Task 3: Navbar Batch Awareness & Sub-Navigation (`ModernNavbar`)

**Files:**
- Modify: `src/components/public/modern-navbar.tsx`

**Interfaces:**
- Consumes: `usePathname()` from Next.js
- Produces: Context-aware branding and navigation links for Batch 3 vs Batch 4

- [ ] **Step 1: Tambahkan deteksi rute Batch 4 di `ModernNavbar`**
  - `const isBatch4 = pathname.startsWith("/batch-4")`.
- [ ] **Step 2: Sesuaikan Brand Logo & Teks**
  - Jika `isBatch4`: Tampilkan badge **"Agrasena Batch 4"** dengan aksen Royal Violet/Indigo.
  - Jika bukan: Tampilkan badge **"Agrasena Batch 3"** dengan aksen Emerald Green.
- [ ] **Step 3: Sesuaikan Primary Nav Links secara kontekstual**
  - Jika `isBatch4`:
    - Overview ➔ `/batch-4`
    - Roadmap ➔ `/batch-4/schedules`
    - Materi PDF ➔ `/batch-4/materials`
  - Jika bukan: Tetap mengarah ke `/`, `/schedules`, `/materials`.
- [ ] **Step 4: Tambahkan badge switcher angkatan mini di sebelah kontrol tema**
  - Tombol switcher praktis `[ B3 | B4 ]` untuk berpindah cepat atau memanggil IntroScreen.
- [ ] **Step 5: Commit perubahan Task 3 ke git**

---

### Task 4: Halaman Dashboard Utama Agrasena Batch 4

**Files:**
- Create: `src/app/batch-4/page.tsx`
- Create: `src/components/public/batch4/live-session-banner-batch4.tsx` (atau adapter konfigurasi)

**Interfaces:**
- Produces: Dedicated Batch 4 homepage with Zoom launcher, schedules reminder, and roadmap overview.

- [ ] **Step 1: Buat banner live zoom khusus Batch 4 dengan link Zoom mandiri**
  - Menampilkan Meeting ID, Passcode, dan tombol "🚀 Masuk Ruang Zoom Batch 4".
- [ ] **Step 2: Susun halaman `src/app/batch-4/page.tsx`**
  - Hero banner bertema Agrasena Batch 4 (aksen Royal Violet / Deep Indigo).
  - Roadmap status bar, AI Companion Card dengan sapaan khusus peserta Batch 4.
  - Quick links ke materi, jadwal, dan generator laporan lab.
- [ ] **Step 3: Commit perubahan Task 4 ke git**

---

### Task 5: Halaman Jadwal & Roadmap 35 Hari Batch 4

**Files:**
- Create: `src/app/batch-4/schedules/page.tsx`

**Interfaces:**
- Consumes: `DEFAULT_BATCH4_SCHEDULES` from `src/data/batch4/schedules-data.ts`
- Produces: 35-day interactive roadmap for Batch 4.

- [ ] **Step 1: Buat halaman `src/app/batch-4/schedules/page.tsx`**
  - Mengambil data dari Supabase (filter `batch = 'batch-4'`) dengan fallback ke `DEFAULT_BATCH4_SCHEDULES`.
  - Menggunakan komponen `SchedulesList` dan `LiveSessionBanner` versi Batch 4.
- [ ] **Step 2: Commit perubahan Task 5 ke git**

---

### Task 6: Halaman Pustaka Modul 120 JP Batch 4

**Files:**
- Create: `src/app/batch-4/materials/page.tsx`

**Interfaces:**
- Consumes: `DEFAULT_BATCH4_MATERIALS` from `src/data/batch4/materials-data.ts`
- Produces: 120 JP Materials library for Batch 4.

- [ ] **Step 1: Buat halaman `src/app/batch-4/materials/page.tsx`**
  - Mengambil data dari Supabase (filter `batch = 'batch-4'`) dengan fallback ke `DEFAULT_BATCH4_MATERIALS`.
  - Menggunakan komponen `ResourceHub` dengan katalog modul kurikulum Batch 4.
- [ ] **Step 2: Commit perubahan Task 6 ke git**

---

### Task 7: Integrasi Paper Generator Autofill Batch 4

**Files:**
- Modify: `src/components/public/paper-generator-hub.tsx`

**Interfaces:**
- Consumes: LocalStorage `prakom_user_batch` or URL query param

- [ ] **Step 1: Deteksi apakah pengguna aktif adalah peserta Batch 4**
  - Jika aktif di Batch 4, default isian `batchName` otomatis disetel ke `"BATCH 02 ANGKATAN 06 / BATCH 4"`.
- [ ] **Step 2: Commit perubahan Task 7 ke git**

---

### Task 8: Verifikasi Menyeluruh & Testing

- [ ] **Step 1: Jalankan `cmd /c npx tsc --noEmit` untuk memastikan 0 error tipe TypeScript**
- [ ] **Step 2: Uji rendering halaman `/batch-4`, `/batch-4/schedules`, `/batch-4/materials`**
- [ ] **Step 3: Uji fungsionalitas switcher angkatan di Layar Intro dan Navbar**
- [ ] **Step 4: Push perubahan ke remote repository GitHub**
