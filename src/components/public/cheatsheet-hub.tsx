'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileCode2,
  Search,
  Copy,
  Check,
  Download,
  Terminal,
  Database,
  Shield,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  BookOpen,
  Cpu,
  Server,
  FolderOpen,
  Filter,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"

interface CheatSheetItem {
  id: string
  category: string
  title: string
  description: string
  tags: string[]
  codeOrContent: string
  language?: string
  importantNote?: string
}

const CHEATSHEET_DATABASE: CheatSheetItem[] = [
  // 1. SPBE & Regulasi Kejaksaan
  {
    id: "spbe-1",
    category: "SPBE & Tata Kelola",
    title: "6 Domain Arsitektur SPBE Nasional (Perpres 95/2018)",
    description: "Kerangka dasar arsitektur Sistem Pemerintahan Berbasis Elektronik yang wajib diintegrasikan dalam unit kerja Kejaksaan RI.",
    tags: ["SPBE", "Perpres 95/2018", "Tata Kelola", "Regulasi"],
    codeOrContent: `1. Domain Tata Kelola SPBE:
   • Kebijakan internal, kelembagaan, dan proses bisnis terpadu.
2. Domain Layanan SPBE:
   • Layanan Administrasi Pemerintahan (G2G, G2E) & Layanan Publik (G2C, G2B).
3. Domain Aplikasi SPBE:
   • Aplikasi Umum (Berbagi Pakai) & Aplikasi Khusus Satker (Case Tracking System, CMS Kejaksaan).
4. Domain Data dan Informasi:
   • Satu Data Indonesia (SDI), Interoperabilitas Data, Kamus Data, dan Master Data.
5. Domain Infrastruktur SPBE:
   • Pusat Data Nasional (PDN), Jaringan Intra Pemerintah (JIP), Server Satker.
6. Domain Keamanan SPBE:
   • Standar ISO 27001, CSIRT (Computer Security Incident Response Team), Enkripsi.`,
    language: "markdown",
    importantNote: "Wajib dihafal untuk Uji Kompetensi MOOC & Penilaian Indeks SPBE Satker."
  },
  {
    id: "spbe-2",
    category: "SPBE & Tata Kelola",
    title: "Tingkat Kematangan Indeks SPBE (Skala 1 - 5)",
    description: "Tingkatan maturitas penerapan SPBE pada instansi pemerintah menurut PermenPAN-RB No. 59/2020.",
    tags: ["Indeks SPBE", "Maturitas", "PermenPAN-RB"],
    codeOrContent: `Tingkat 1 • Rintisan (Initial) : Proses belum terstandar, ad-hoc, tanpa dokumentasi resmi.
Tingkat 2 • Terkelola (Managed) : Telah ada SOP dan kebijakan teknis tingkat unit kerja.
Tingkat 3 • Terstandardisasi (Defined) : Kebijakan dan arsitektur berlaku menyeluruh di instansi.
Tingkat 4 • Terpadu & Terukur (Integrated) : Sistem saling terintegrasi (Interoperabilitas API) & kinerja terukur.
Tingkat 5 • Optimum (Optimized) : Menggunakan AI/otomasi, adaptif terhadap inovasi dan perbaikan berkelanjutan.`,
    language: "text",
    importantNote: "Target minimal instansi Kejaksaan RI adalah predikat Baik (Indeks ≥ 2.60) s.d. Sangat Baik."
  },

  // 2. Database & SQL Query Tuning
  {
    id: "db-1",
    category: "Database & SQL Tuning",
    title: "Skrip Otomasi Backup Database PostgreSQL / SQLite dengan Kompresi",
    description: "Skrip Bash shell untuk backup otomatis berkala database sistem informasi perkara dan log satker.",
    tags: ["PostgreSQL", "SQLite", "Backup", "Bash", "Linux"],
    codeOrContent: `#!/bin/bash
# ==========================================
# AUTO BACKUP POSTGRESQL SATKER KEJAKSAAN RI
# ==========================================
BACKUP_DIR="/var/backups/db_prakom"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="db_kejaksaan_satker"
DB_USER="postgres"

mkdir -p "$BACKUP_DIR"

# 1. Jalankan dump database & kompresi gzip
pg_dump -U "$DB_USER" -h localhost "$DB_NAME" | gzip > "$BACKUP_DIR/backup_\${DB_NAME}_\${TIMESTAMP}.sql.gz"

# 2. Hapus file backup yang berumur lebih dari 30 hari (Retention Policy)
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +30 -delete

echo "[OK] Backup database $DB_NAME selesai pada $TIMESTAMP"`,
    language: "bash",
    importantNote: "Simpan file ini di /usr/local/bin/db_backup.sh dan berikan izin eksekusi: chmod +x"
  },
  {
    id: "db-2",
    category: "Database & SQL Tuning",
    title: "Query Optimasi & Pembuatan Index B-Tree untuk Database Terdistribusi",
    description: "Template query DDL untuk mempercepat performa query pencarian NIP, nomor perkara, dan log kehadiran.",
    tags: ["SQL", "PostgreSQL", "MySQL", "Indexing", "Performance"],
    codeOrContent: `-- 1. Membuat B-Tree Index untuk kolom pencarian berfrekuensi tinggi
CREATE INDEX CONCURRENTLY idx_pegawai_nip ON pegawai(nip);
CREATE INDEX idx_perkara_tgl_registrasi ON data_perkara(tanggal_registrasi DESC);

-- 2. Analisis performa query sebelum & sesudah indexing (Execution Plan)
EXPLAIN ANALYZE
SELECT p.nama, p.nip, COUNT(d.id) AS total_dupak
FROM pegawai p
LEFT JOIN dupak_log d ON p.id = d.pegawai_id
WHERE p.satker_id = 625 AND p.status = 'AKTIF'
GROUP BY p.nama, p.nip
ORDER BY total_dupak DESC;`,
    language: "sql",
    importantNote: "Gunakan CONCURRENTLY di PostgreSQL agar proses indexing tidak mengunci (lock) tabel produksi."
  },

  // 3. Linux Server & Otomasi Skrip
  {
    id: "linux-1",
    category: "Linux Server & Infrastruktur",
    title: "Konfigurasi Cron Job Penjadwalan Otomatis Linux Server",
    description: "Template format konfigurasi crontab Linux untuk penjadwalan backup database, sync data, dan log rotate.",
    tags: ["Linux", "Cron", "Server", "SysAdmin", "Ubuntu"],
    codeOrContent: `# Format Waktu: Menit Jam Tanggal Bulan Hari-dalam-pekan Command
# ┌───────────── menit (0 - 59)
# │ ┌───────────── jam (0 - 23)
# │ │ ┌───────────── tanggal (1 - 31)
# │ │ │ ┌───────────── bulan (1 - 12)
# │ │ │ │ ┌───────────── hari (0 - 6, 0 = Minggu)
# * * * * * perintah_dijalankan

# 1. Backup Database setiap hari pukul 02:00 WIB
0 2 * * * /usr/local/bin/db_backup.sh >> /var/log/cron_db_backup.log 2>&1

# 2. Sinkronisasi log ke cloud storage setiap 6 jam
0 */6 * * * /usr/local/bin/sync_cloud.sh

# 3. Membersihkan file temporary setiap hari Minggu pukul 23:00 WIB
0 23 * * 0 rm -rf /tmp/prakom_temp/*`,
    language: "bash",
    importantNote: "Edit crontab dengan perintah: crontab -e"
  },
  {
    id: "linux-2",
    category: "Linux Server & Infrastruktur",
    title: "Konfigurasi Reverse Proxy Nginx + Header Keamanan (Security Hardening)",
    description: "Konfigurasi server block Nginx untuk mengamankan portal aplikasi web satker dari serangan XSS dan Clickjacking.",
    tags: ["Nginx", "Reverse Proxy", "Security", "HTTPS"],
    codeOrContent: `server {
    listen 80;
    server_name portal-prakom.kejaksaan.go.id;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name portal-prakom.kejaksaan.go.id;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/portal-prakom.kejaksaan.go.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/portal-prakom.kejaksaan.go.id/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`,
    language: "nginx",
    importantNote: "Uji konfigurasi sebelum reload: nginx -t && systemctl reload nginx"
  },

  // 4. Keamanan Siber & CSIRT
  {
    id: "sec-1",
    category: "Keamanan Siber & CSIRT",
    title: "SOP Penanganan Insiden Siber (CSIRT Kejaksaan RI)",
    description: "Tahapan standar respon insiden keamanan informasi (Ransomware, Defacement, Data Leak).",
    tags: ["CSIRT", "Cybersecurity", "SOP", "Insiden"],
    codeOrContent: `1. Identifikasi (Preparation & Detection):
   • Deteksi anomali traffic, log login mencurigakan, atau laporan error sistem.
2. Penahanan (Containment):
   • Isolasi server/komputer yang terinfeksi dari jaringan lokal (cabut kabel LAN / putus WiFi).
   • JANGAN matikan paksa (power off) agar bukti memory volatile (RAM) tidak hilang.
3. Pembasmian (Eradication):
   • Analisis malware, patch vulnerability, update firewall rules, dan revoke credentials.
4. Pemulihan (Recovery):
   • Restore data dari backup terisolasi (Cold Backup), verifikasi integritas, dan nyalakan ulang sistem.
5. Evaluasi (Lessons Learned):
   • Penyusunan Laporan Insiden Resmi CSIRT dan penguatan perimeter keamanan.`,
    language: "markdown",
    importantNote: "Laporkan segera ke CSIRT Kejaksaan RI jika terjadi indikasi insiden siber kritis."
  },

  // 5. Angka Kredit & DUPAK
  {
    id: "ak-1",
    category: "Angka Kredit & DUPAK",
    title: "Ringkasan Target Minimal Angka Kredit & Rumus Konversi SKP (PermenPAN-RB 32/2020)",
    description: "Rumus perhitungan angka kredit tahunan dan koefisien perolehan berdasarkan predikat evaluasi kinerja pegawai.",
    tags: ["Angka Kredit", "DUPAK", "PermenPAN-RB 32/2020", "SKP"],
    codeOrContent: `JENJANG JABATAN PRAKOM KEAHLIAN:
1. Pranata Komputer Ahli Pertama (Gol. III/a - III/b)
   • Target Minimal : 12.5 AK / tahun
   • Predikat Sangat Baik (125%) : 15.625 AK
   • Predikat Baik (100%)       : 12.500 AK
   • Predikat Cukup (75%)       : 9.375 AK

2. Pranata Komputer Ahli Muda (Gol. III/c - III/d)
   • Target Minimal : 25.0 AK / tahun
   • Predikat Sangat Baik (125%) : 31.250 AK
   • Predikat Baik (100%)       : 25.000 AK
   • Predikat Cukup (75%)       : 18.750 AK

3. Pranata Komputer Ahli Madya (Gol. IV/a - IV/c)
   • Target Minimal : 37.5 AK / tahun

4. Pranata Komputer Ahli Utama (Gol. IV/d - IV/e)
   • Target Minimal : 50.0 AK / tahun

BUKTI FISIK SAH WAJIB:
[1] Surat Perintah Tugas (SPT) resmi pimpinan
[2] Laporan Pelaksanaan Kegiatan / Notula Teknis
[3] Dokumentasi / Screenshot / Source Code / Logbook
[4] Lembar Pengesahan / Verifikasi Atasan Langsung`,
    language: "text",
    importantNote: "Mulai tahun 2023, pengumpulan AK disesuaikan dengan integrasi sistem e-Kinerja BKN."
  }
]

export function CheatsheetHub() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("Semua")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const categories = [
    "Semua",
    "SPBE & Tata Kelola",
    "Database & SQL Tuning",
    "Linux Server & Infrastruktur",
    "Keamanan Siber & CSIRT",
    "Angka Kredit & DUPAK"
  ]

  const filteredItems = CHEATSHEET_DATABASE.filter((item) => {
    const matchCategory = selectedCategory === "Semua" || item.category === selectedCategory
    const q = searchQuery.toLowerCase().trim()
    const matchQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      item.codeOrContent.toLowerCase().includes(q)
    return matchCategory && matchQuery
  })

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  const handleDownload = (item: CheatSheetItem) => {
    const blob = new Blob([item.codeOrContent], { type: "text/plain;charset=utf-8" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `CheatSheet_${item.title.slice(0, 30).replace(/\s+/g, "_")}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[36px] bg-white dark:bg-[#12161F] p-6 sm:p-8 lg:p-10 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-3.5 py-1 text-xs font-black uppercase text-[#0D824B] dark:text-emerald-300 border border-[#A7F3D0] dark:border-emerald-800">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Pustaka Ringkasan Belajar 120 JP</span>
              </span>
              <span className="rounded-full bg-[#D7F3FE] dark:bg-sky-950/80 px-3 py-1 text-xs font-bold text-[#0369A1] dark:text-sky-300">
                Akses Instan Tanpa Login
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] dark:text-white tracking-tight leading-tight">
              Quick Cheat Sheet & <br className="hidden sm:block" />
              <span className="text-[#0D824B] dark:text-emerald-400">Ringkasan Konsep Diklat Prakom</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#52647C] dark:text-slate-400 leading-relaxed">
              Kumpulan rumus cepat, konsep arsitektur SPBE, template query SQL tuning, skrip otomasi backup Linux, SOP respon insiden CSIRT, dan pedoman Angka Kredit Prakom yang siap disalin dan diunduh.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <Link
              href="/materials"
              className="flex items-center gap-2 rounded-full bg-[#18181B] dark:bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-black text-white hover:bg-slate-800 dark:hover:bg-emerald-500 shadow-md transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>Modul PDF Lengkap</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. Search & Category Filters */}
      <div className="rounded-[28px] bg-white dark:bg-[#12161F] p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9BAE] dark:text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari cheat sheet (contoh: SPBE, backup, cron, index, angka kredit, csirt)..."
            className="h-11 w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E2433] pl-10 pr-4 text-xs font-medium text-[#18181B] dark:text-white placeholder-[#9AA8BA] dark:placeholder-slate-400 focus:border-[#18181B] dark:focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#18181B] dark:bg-emerald-600 text-white shadow-xs"
                  : "bg-[#F4F6FA] dark:bg-[#1E2433] border border-slate-200 dark:border-slate-700 text-[#52647C] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-[#18181B] dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Cheat Sheet Items Grid */}
      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <div className="rounded-[32px] bg-white dark:bg-[#12161F] p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <FileCode2 className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="font-bold text-base text-[#18181B] dark:text-white">Cheat Sheet Tidak Ditemukan</h4>
            <p className="text-xs text-[#6B7C93] dark:text-slate-400 max-w-md mx-auto">
              Tidak ada ringkasan materi untuk kata kunci "{searchQuery}". Coba kata kunci lain atau reset filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("Semua")
              }}
              className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 text-xs font-bold cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="rounded-[32px] bg-white dark:bg-[#161B26] border-2 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4"
            >
              {/* Item Header */}
              <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#0D824B] dark:text-emerald-300 border border-[#A7F3D0] dark:border-emerald-800">
                      {item.category}
                    </span>
                    {item.tags.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-base sm:text-xl font-black text-[#18181B] dark:text-white">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#52647C] dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.codeOrContent)}
                    className="flex items-center gap-1.5 rounded-xl bg-white dark:bg-[#1E2433] px-3.5 py-2 text-xs font-bold text-[#18181B] dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#0D824B] dark:text-emerald-400" />
                        <span className="text-[#0D824B] dark:text-emerald-400 font-black">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                        <span>Salin Teks</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(item)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#F4F6FA] dark:bg-[#1E2433] px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                    title="Unduh file teks"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Unduh</span>
                  </button>
                </div>
              </div>

              {/* Code / Content Box */}
              <div className="px-6 sm:px-7 pb-6 space-y-3">
                <div className="rounded-2xl bg-[#0E131F] p-4 sm:p-5 text-slate-200 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                  <pre className="whitespace-pre-wrap leading-relaxed">{item.codeOrContent}</pre>
                </div>

                {item.importantNote && (
                  <div className="flex items-center gap-2 rounded-xl bg-[#FFF9F5] dark:bg-amber-950/40 p-3 border border-[#FFD280] dark:border-amber-900/60 text-xs font-bold text-[#EA580C] dark:text-amber-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#EA580C] dark:text-amber-400" />
                    <span>Catatan: {item.importantNote}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
