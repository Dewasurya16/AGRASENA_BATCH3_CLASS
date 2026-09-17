# Spesifikasi Desain: Multi-Batch Support (Agrasena Batch 3 & Agrasena Batch 4)
**Pelatihan Fungsional Pranata Komputer Tingkat Keahlian — Kejaksaan RI**
**Tanggal:** 2026-09-17  
**Status:** Draf Tervalidasi (Approved Intent)

---

## 1. Latar Belakang & Tujuan (Context & Objectives)

### 1.1 Latar Belakang
Platform Web Kelas sebelumnya didedikasikan untuk peserta **Agrasena Batch 3** (Pelatihan Fungsional Pranata Komputer Keahlian Kejaksaan RI Tahun 2026). Saat ini terdapat penambahan angkatan baru, yaitu **Agrasena Batch 4**, yang memerlukan akses ke portal kelas mandiri dengan jadwal perkuliahan 35 hari, pustaka modul 120 JP, dan tautan pertemuan Zoom yang terpisah, namun tetap berada dalam satu kesatuan web aplikasi (*single unified codebase*).

### 1.2 Tujuan Utama (Goals)
1. **Pemisahan Konten**: Menyediakan jadwal 35 hari, modul 120 JP, dan tautan Zoom yang mandiri khusus untuk Agrasena Batch 4 tanpa mengganggu atau mencampuri data Batch 3 yang sedang aktif berjalan.
2. **Dedicated Sub-Routes**: Menyediakan rute URL khusus `/batch-4`, `/batch-4/schedules`, dan `/batch-4/materials` sehingga tautan kelas Batch 4 dapat langsung dibagikan ke grup WhatsApp/Telegram peserta Batch 4.
3. **Pemilihan Angkatan di Layar Intro**: Meletakkan switcher pilihan angkatan langsung pada **Layar Intro Sambutan & Profil Peserta** saat pertama kali membuka web, sehingga peserta langsung diarahkan ke kelasnya masing-masing.
4. **Identitas Visual Khas**: Keduanya sama-sama menyandang nama kehormatan **Agrasena** dengan pembeda aksen visual:
   - **Agrasena Batch 3**: Aksen Forest Emerald & Deep Cyan (`#0D3830`, `#007aff`).
   - **Agrasena Batch 4**: Aksen Royal Indigo & Electric Violet (`#6366f1`, `#8b5cf6`).
5. **Shared Productivity Tools**: Mempertahankan alat bantu bersama (seperti AI Paper Generator 4 BAB, Template DUPAK/SPMK, Persiapan Ujian, dan Forum Diskusi) agar dapat dinikmati oleh kedua angkatan.

---

## 2. Arsitektur Rute & Antarmuka (Routing & UI Architecture)

### 2.1 Struktur Rute URL
| Rute URL | Peruntukan | Deskripsi |
|---|---|---|
| `/` | Agrasena Batch 3 | Dashboard Utama, Live Zoom Banner Batch 3, Milestone Roadmap 35 Hari |
| `/schedules` | Agrasena Batch 3 | Roadmap & Jadwal Lengkap 35 Hari Batch 3 |
| `/materials` | Agrasena Batch 3 | Pustaka Modul 120 JP & Slide PDF Batch 3 |
| `/batch-4` | Agrasena Batch 4 | Dashboard Utama, Live Zoom Banner Batch 4, Milestone Roadmap Batch 4 |
| `/batch-4/schedules` | Agrasena Batch 4 | Roadmap & Jadwal Lengkap 35 Hari Khusus Batch 4 |
| `/batch-4/materials` | Agrasena Batch 4 | Pustaka Modul 120 JP Khusus Batch 4 |
| `/paper-generator` | Kedua Batch | Generator Laporan Lab Prakom 4 BAB (otomatis autofill angkatan sesuai sesi aktif) |
| `/templates`, `/exam-prep` | Kedua Batch | Repositori Template Bukti Fisik BPS & Panduan Ujian Evaluasi |

### 2.2 Alur Pengalaman Pengguna (User Flow)
1. **Peserta Membuka Web**:
   - Muncul Layar Sambutan Animasi (`IntroScreen`).
   - Peserta mengisi Nama, NIP, Satuan Kerja, dan memilih opsi **Angkatan Diklat**:
     - `[ 🟢 Agrasena Batch 3 ]`
     - `[ 🟣 Agrasena Batch 4 ]`
   - Pilihan tersimpan di `localStorage` (`prakom_user_batch = "batch-3" | "batch-4"`).
2. **Pengalihan Otomatis**:
   - Jika peserta memilih **Agrasena Batch 4**, setelah menekan tombol "Mulai Belajar", peramban langsung mengarahkan ke `/batch-4`.
   - Jika memilih **Agrasena Batch 3**, peramban mengarahkan ke dashboard utama `/`.
3. **Akses Tautan Langsung**:
   - Tautan `https://domain/batch-4` dapat langsung disebar di grup WhatsApp Batch 4. Peserta yang membuka tautan ini langsung berada di ruang kelas Batch 4.

---

## 3. Desain Data Layer & Isolasi Konten

### 3.1 Struktur Direktori Data Mandiri
Dibuat direktori khusus `src/data/batch4/` untuk memisahkan dataset default Batch 4:
```
src/data/batch4/
├── zoom-config.ts       # Link Zoom Meeting, Meeting ID, Passcode, & SOP Presensi Batch 4
├── schedules-data.ts    # Dataset 35 Hari Roadmap & Sesi Perkuliahan Batch 4
└── materials-data.ts    # Dataset 24 Modul 120 JP Kurikulum Batch 4
```

### 3.2 Strategi Pengambilan Data (Data Fetching & Fallback)
1. **Database Supabase**:
   - Pada query SSR (`schedules`, `materials`, `announcements`), sistem mengecek filter kolom `batch`:
     - Batch 3: `.eq('batch', 'batch-3')` atau data default eksisting.
     - Batch 4: `.eq('batch', 'batch-4')`.
2. **High-Fidelity Local Fallback**:
   - Jika Supabase belum diisi jadwal/materi Batch 4 atau dalam mode offline, halaman `/batch-4/*` secara otomatis menggunakan dataset lengkap dari `src/data/batch4/`. Sistem dijamin **tidak akan pernah kosong atau menampilkan halaman error**.

---

## 4. Komponen Antarmuka yang Dimodifikasi & Dibuat

### 4.1 Modifikasi Komponen Eksisting
1. **`src/components/public/intro-screen.tsx`**:
   - Penambahan selector tombol angkatan `[ Agrasena Batch 3 | Agrasena Batch 4 ]`.
   - Penyimpanan state profil `batch` ke `localStorage`.
   - Pengalihan rute cerdas saat klik *Masuk Kelas*.
2. **`src/components/public/modern-navbar.tsx`**:
   - Deteksi rute aktif (`pathname.startsWith('/batch-4')`).
   - Penyesuaian label brand: *"Agrasena Batch 3"* vs *"Agrasena Batch 4"*.
   - Penyesuaian link navigasi aktif (Overview, Roadmap, Materi) agar tetap berada di ruang angkatan yang sesuai.
   - Badge kecil switcher angkatan untuk beralih ruang kelas dengan cepat jika diperlukan.
3. **`src/components/public/paper-generator-hub.tsx`**:
   - Deteksi otomatis angkatan aktif sehingga isian form *Batch / Angkatan* otomatis terisi `"BATCH 4 / ANGKATAN 06"` jika dibuka dari konteks Batch 4.

### 4.2 Pembuatan Halaman Baru
1. **`src/app/batch-4/page.tsx`**: Dashboard overview Agrasena Batch 4 dengan Hero Banner, Live Zoom Banner, AI Companion Card, dan Quick Access.
2. **`src/app/batch-4/schedules/page.tsx`**: Roadmap & Timeline 35 Hari Agrasena Batch 4.
3. **`src/app/batch-4/materials/page.tsx`**: Pustaka Modul 120 JP & Materi PDF Agrasena Batch 4.

---

## 5. Rencana Pengujian & Verifikasi (Verification Plan)
1. **TypeScript Type Safety**: Menjalankan `npx tsc --noEmit` untuk memastikan 0 type errors pada seluruh halaman baru dan modifikasi komponen.
2. **Verifikasi Layar Intro**: Menguji pemilihan angkatan pada modal intro screen dan memastikan pengalihan ke `/batch-4` atau `/` berjalan mulus.
3. **Verifikasi Isolasi Konten**:
   - Memastikan `/schedules` hanya memuat jadwal Batch 3.
   - Memastikan `/batch-4/schedules` hanya memuat jadwal Batch 4.
   - Memastikan tautan Zoom pada Live Session Banner di Batch 4 sesuai dengan konfigurasi Zoom Batch 4.
4. **Verifikasi Responsif & Tema**: Menguji tampilan di layar smartphone dan desktop dengan tema gelap (*dark mode*) dan terang (*light mode*).
