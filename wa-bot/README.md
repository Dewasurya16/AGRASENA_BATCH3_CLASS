# 🤖 Bot WhatsApp Pengingat & Notifikasi Diklat Agrasena Batch 3
**Pusdiklat Kejaksaan RI x Pusdiklat BPS RI — Tahun 2026**

Bot WhatsApp otomatis ini bertugas mengirimkan **rekap jadwal harian**, **peringatan tenggat waktu tugas mandiri**, **siaran pengumuman penting**, dan **merespons perintah peserta di grup**.

---

## ✨ Fitur Utama

1. **Pengingat Jadwal Pembelajaran Otomatis (Setiap 07:00 WIB)**:
   - Membaca jadwal sesi hari ini dari tabel `schedules` di Supabase.
   - Mengirim rincian mata diklat, widyaiswara, jam pelaksanaan, dan tautan Zoom langsung ke grup kelas WhatsApp.
2. **Peringatan Deadline Tugas Mandiri (Setiap 16:00 WIB)**:
   - Membaca tugas aktif dari tabel `tasks` di Supabase.
   - Mengingatkan peserta yang belum mengunggah laporan tugas.
3. **Respon Cepat Chat Grup / DM**:
   - `!jadwal` : Menampilkan jadwal perkuliahan hari ini & besok.
   - `!tugas` : Menampilkan daftar tugas mandiri yang aktif.
   - `!link` : Menampilkan tautan resmi portal kelas, Zoom, & pustaka modul.
   - `!id` : Mengetahui ID/JID grup WhatsApp ini secara otomatis.
   - `!help` : Menampilkan menu panduan bot.
4. **Terintegrasi dengan Dashboard Website**:
   - Status bot (Online/Offline) dan QR Code pairing dapat dipantau langsung melalui panel Admin di website: `/admin/dashboard`.
   - Tombol kirim siaran khusus ke grup via API.

---

## 🚀 Panduan 1: Menjalankan Bot di Laptop/PC Lokal (Gratis & Cepat)

Jika Anda ingin menjalankan bot langsung dari laptop atau komputer admin:

1. Buka terminal di folder project ini:
   ```bash
   cd "wa-bot"
   ```
2. Salin template konfigurasi:
   ```bash
   copy .env.example .env
   ```
3. Edit file `.env` dan masukkan kredensial Supabase Anda (`SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`).
4. Install dependencies:
   ```bash
   npm install
   ```
5. Jalankan bot:
   ```bash
   npm start
   ```
6. **Scan QR Code**:
   - Di terminal akan muncul QR Code ASCII.
   - Buka WhatsApp di HP Anda $\rightarrow$ **Perangkat Tertaut (Linked Devices)** $\rightarrow$ **Tautkan Perangkat** $\rightarrow$ Scan QR code tersebut.
7. Masukkan bot ke grup WhatsApp kelas Anda, lalu ketik `!id` di grup tersebut. Salin ID yang muncul (contoh: `120363294829104829@g.us`) ke dalam variabel `TARGET_GROUP_JID` di file `.env` atau simpan melalui panel dashboard web.

---

## ☁️ Panduan 2: Hosting Gratis 24/7 di Cloud (Render.com / Koyeb)

Agar bot aktif terus menerus 24 jam sehari tanpa perlu laptop menyala:

### Langkah di Render.com (100% Free Tier):
1. Buat akun gratis di **[https://render.com](https://render.com)**.
2. Klik tombol **New +** di dashboard Render $\rightarrow$ pilih **Web Service**.
3. Hubungkan repository GitHub Anda: `Dewasurya16/AGRASENA_BATCH3_CLASS`.
4. Isi konfigurasi layanan:
   - **Name**: `agrasena-wa-bot`
   - **Region**: Singapore (paling dekat & cepat)
   - **Root Directory**: `wa-bot`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` ($0/bulan)
5. Klik **Advanced** $\rightarrow$ **Add Environment Variable**:
   - `SUPABASE_URL` = (URL Supabase website Anda)
   - `SUPABASE_SERVICE_ROLE_KEY` = (Service role key Supabase)
   - `BOT_SECRET_KEY` = (Kunci rahasia pilihan Anda, samakan dengan yang di web)
   - `TIMEZONE` = `Asia/Jakarta`
   - `TARGET_GROUP_JID` = (ID grup WhatsApp Anda)
6. Klik **Create Web Service**.
7. Tunggu build selesai (sekitar 1-2 menit).
8. Buka tab **Logs** di Render $\rightarrow$ Scan QR code yang tampil di log, atau buka URL render Anda di browser (misal `https://agrasena-wa-bot.onrender.com/qr`) untuk melihat gambar QR code-nya!
9. Selesai! Bot WhatsApp Anda kini aktif 24 jam nonstop di cloud.

---

## 🛡️ Keamanan & Privasi
- Menggunakan library resmi Baileys tanpa browser headless berat.
- Komunikasi dengan website Next.js diproteksi menggunakan token `BOT_SECRET_KEY`.
- Nomor WhatsApp yang digunakan tetap memegang kendali penuh atas akun Anda.
