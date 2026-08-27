'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileCode,
  Download,
  Eye,
  Search,
  FileSpreadsheet,
  FileText,
  Shield,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Sparkles,
  Award,
  Building2,
  BookOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

export interface DocumentTemplate {
  id: string
  title: string
  category: "Administrasi & SPT" | "DUPAK & SKP BPS" | "SOP & Keamanan" | "Seminar Akhir"
  format: ".doc Word" | ".xlsx Excel" | ".docx Word"
  description: string
  legalReference: string
  bpsCode?: string
  tags: string[]
  contentDoc: string
}

export const TEMPLATES_DATA: DocumentTemplate[] = [
  {
    id: "spt-ti",
    title: "Surat Perintah Tugas (SPT) Pemeliharaan & Troubleshooting TIK Satker",
    category: "Administrasi & SPT",
    format: ".doc Word",
    description: "Format surat perintah tugas resmi penugasan Pranata Komputer untuk pemeliharaan server, jaringan lokal, basis data, dan aplikasi perkara di Kejati/Kejari.",
    legalReference: "Pedoman Tata Naskah Dinas Kejaksaan RI & PermenPAN-RB No. 32 Tahun 2020",
    tags: ["Bukti Fisik Sah", "Pemeliharaan", "Kejati/Kejari", "Tata Naskah Kejaksaan"],
    contentDoc: `KEJAKSAAN REPUBLIK INDONESIA
KEJAKSAAN TINGGI / KEJAKSAAN NEGERI ........................
Jalan ............................................................................
Telepon: (......) ............... Faksimile: (......) ...............

SURAT PERINTAH TUGAS
NOMOR: PRINT - ...... / L. ... / Dipa / ... / 2026

KEPALA KEJAKSAAN NEGERI ........................

DASAR:
1. Undang-Undang Nomor 11 Tahun 2021 tentang Perubahan atas Undang-Undang Nomor 16 Tahun 2004 tentang Kejaksaan Republik Indonesia;
2. Peraturan Presiden Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE);
3. Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 32 Tahun 2020 tentang Jabatan Fungsional Pranata Komputer;
4. DIPA Kejaksaan Negeri ........................ Tahun Anggaran 2026;
5. Kebutuhan pemeliharaan berkala, audit infrastruktur server lokal, keamanan jaringan LAN/WAN, dan replikasi basis data perkara CMS & Tilang.

MEMERINTAHKAN:

Kepada:
1. Nama                 : ...........................................................
   NIP / NRP            : ...........................................................
   Pangkat / Gol. Ruang : Penata Muda (III/a) / Penata Muda Tk. I (III/b)
   Jabatan              : Pranata Komputer Ahli Pertama
   Satuan Kerja         : Kejaksaan Negeri ........................

Untuk:
1. Melaksanakan kegiatan pemeliharaan perangkat server, switch jaringan, access point, serta audit integritas basis data perkara pada unit kerja Kejaksaan Negeri ........................;
2. Melakukan langkah mitigasi dan penanganan insiden siber lokal sesuai SOP Keamanan Informasi TIK;
3. Menyusun Laporan Hasil Pelaksanaan Tugas Teknis, Dokumentasi Logbook Harian, dan Berita Acara Pemeriksaan Fisik Perangkat TIK;
4. Melaporkan hasil pelaksanaan tugas kepada Kepala Subbagian Pembinaan / Kasi Intelijen / Kepala Kejaksaan Negeri;
5. Melaksanakan Surat Perintah ini dengan penuh rasa tanggung jawab dan dedikasi.

Dikeluarkan di : ........................
Pada tanggal   : ........................ 2026

KEPALA KEJAKSAAN NEGERI ........................


( ........................................................... )
Jaksa Utama Pratama / Madya NIP. ....................`
  },
  {
    id: "dupak-spmk",
    title: "Surat Pernyataan Melakukan Kegiatan (SPMK) & DUPAK Format Baku BPS",
    category: "DUPAK & SKP BPS",
    format: ".doc Word",
    description: "Format SPMK resmi 5 Sub-Unsur Pranata Komputer Keahlian & Keterampilan sesuai Lampiran Perka BPS No. 2 Tahun 2021.",
    legalReference: "Peraturan Kepala BPS No. 2 Tahun 2021 & PermenPAN-RB No. 1 Tahun 2023",
    bpsCode: "Lampiran I-IV Perka BPS 2/2021",
    tags: ["Perka BPS 2/2021", "SPMK", "DUPAK", "TPAK Kejaksaan"],
    contentDoc: `SURAT PERNYATAAN MELAKUKAN KEGIATAN (SPMK)
JABATAN FUNGSIONAL PRANATA KOMPUTER
(Berdasarkan Peraturan Kepala Badan Pusat Statistik No. 2 Tahun 2021)

Yang bertanda tangan di bawah ini:
Nama                    : ...........................................................
NIP                     : ...........................................................
Pangkat / Gol. Ruang    : ...........................................................
Jabatan                 : Kepala Subbagian Pembinaan / Kasi Intelijen
Unit Kerja              : Kejaksaan Negeri ........................

Menyatakan bahwa:
Nama                    : ...........................................................
NIP                     : ...........................................................
Pangkat / Gol. Ruang    : Penata Muda (III/a) / Penata Muda Tk. I (III/b)
Jabatan                 : Pranata Komputer Ahli Pertama
Unit Kerja              : Kejaksaan Negeri ........................

Telah nyata melakukan kegiatan pelayanan fungsional Pranata Komputer sebagai berikut:

SUB-UNSUR II: INFRASTRUKTUR TEKNOLOGI INFORMASI
1. Butir Kegiatan: Melakukan backup dan replikasi basis data perkara (Kode: II.B.2)
   - Volume / Satuan Hasil : 12 Dokumen Log Backup
   - Angka Kredit Satuan   : 0.010
   - Jumlah Angka Kredit   : 0.120
   - Bukti Fisik Terlampir : Laporan Backup & File Log Database

2. Butir Kegiatan: Melakukan perbaikan/troubleshooting perangkat jaringan satker (Kode: II.A.5)
   - Volume / Satuan Hasil : 6 Laporan Penanganan Jaringan
   - Angka Kredit Satuan   : 0.020
   - Jumlah Angka Kredit   : 0.120
   - Bukti Fisik Terlampir : Form Troubleshooting & Log Switch

SUB-UNSUR III: SISTEM INFORMASI DAN MULTIMEDIA
3. Butir Kegiatan: Menyusun dokumentasi teknis / SOP Layanan TIK (Kode: III.C.1)
   - Volume / Satuan Hasil : 1 Naskah SOP
   - Angka Kredit Satuan   : 0.500
   - Jumlah Angka Kredit   : 0.500
   - Bukti Fisik Terlampir : Dokumen SOP Pengelolaan Ruang Server

TOTAL ANGKA KREDIT YANG DIUSULKAN: 0.740

Demikian Surat Pernyataan ini dibuat dengan sebenarnya untuk dipergunakan dalam pengusulan Angka Kredit Jabatan Fungsional Pranata Komputer.

........................, ........................ 2026
Pejabat Penilai Kinerja / Atasan Langsung


( ........................................................... )
NIP. .......................................................`
  },
  {
    id: "konversi-skp-pak",
    title: "Formulir Konversi Predikat SKP Tahunan ke Angka Kredit Integrasi",
    category: "DUPAK & SKP BPS",
    format: ".doc Word",
    description: "Format konversi nilai kinerja SKP (Sangat Baik / Baik / Butuh Perbaikan) ke Angka Kredit Integrasi sesuai PermenPAN-RB No. 1/2023.",
    legalReference: "PermenPAN-RB No. 1 Tahun 2023 (Pasal 37-39: Konversi SKP)",
    tags: ["PermenPAN-RB 1/2023", "SKP Kinerja", "PAK Integrasi"],
    contentDoc: `PENETAPAN ANGKA KREDIT (PAK) INTEGRASI / KONVERSI SKP
PEGAWAI NEGERI SIPIL JABATAN FUNGSIONAL PRANATA KOMPUTER
KEJAKSAAN REPUBLIK INDONESIA

Nomor: PAK - ...... / C.4 / Prakom / ... / 2026
Masa Penilaian: 01 Januari 2026 s.d. 31 Desember 2026

I. KETERANGAN PERORANGAN:
1. Nama                   : ...........................................................
2. NIP                    : ...........................................................
3. Nomor Seri KARPEG      : ...........................................................
4. Pangkat / Gol. Ruang   : Penata Muda (III/a)
5. Jabatan / Jenjang      : Pranata Komputer Ahli Pertama
6. Unit Kerja             : Kejaksaan Negeri ........................

II. HASIL EVALUASI KINERJA (SKP):
• Predikat Kinerja Tahunan : BAIK (Koefisien: 100%) / SANGAT BAIK (Koefisien: 150%)
• Angka Kredit Tahunan     : 12.5 (Jenjang Pertama: 100% x 12.5 = 12.500)

III. REKAPITULASI PEROLEHAN ANGKA KREDIT:
| No | Uraian Perolehan | AK Lama | AK Penyesuaian SKP | Jumlah AK Total |
|---|---|---|---|---|
| 1 | Angka Kredit Dasar Integrasi | 0.000 | 12.500 | 12.500 |
| 2 | AK Kumulatif Minimal Kenaikan Pangkat (III/a ke III/b) | Target: 50.000 | Capaian: 12.500 | Kekurangan: 37.500 |

Ditetapkan di : ........................
Pada tanggal   : ........................ 2026

Pejabat Penilai Kinerja / Tim Penilai AK Kejaksaan RI


( ........................................................... )
NIP. .......................................................`
  },
  {
    id: "sop-server",
    title: "SOP Standar Operasional Prosedur Pengelolaan Ruang Server & Keamanan Jaringan",
    category: "SOP & Keamanan",
    format: ".doc Word",
    description: "Naskah SOP komprehensif tata tertib ruang data center/server lokal satker Kejaksaan, hak akses user, jadwal backup, dan penanganan insiden siber.",
    legalReference: "Perpres No. 95 Tahun 2018 (SPBE) & Standar Keamanan Informasi BSSN",
    tags: ["SOP", "Keamanan Siber", "Data Center", "SPBE Kejaksaan"],
    contentDoc: `STANDAR OPERASIONAL PROSEDUR (SOP)
PENGELOLAAN RUANG SERVER DAN KEAMANAN JARINGAN TIK
KEJAKSAAN NEGERI ........................

NOMOR DOKUMEN   : SOP-TIK-001/KN.SPG/2026
TANGGAL EFEKTIF : 01 September 2026
DISAHKAN OLEH   : KEPALA KEJAKSAAN NEGERI ........................

1. TUJUAN
Memastikan ketersediaan (availability), keutuhan (integrity), dan kerahasiaan (confidentiality) data perkara serta kehandalan infrastruktur TIK di lingkungan Kejaksaan Negeri.

2. RUANG LINGKUP
Meliputi tata kelola akses fisik ruang server, pemeliharaan suhu pendingin & UPS, jadwal backup basis data otomatis harian, monitoring firewall mikrotik/cisco, dan prosedur tanggap darurat insiden siber.

3. PROSEDUR UTAMA:
A. Tata Tertib & Akses Fisik:
- Ruang server dalam keadaan terkunci 24 jam. Kunci dipegang oleh Tim Pengelola TIK / Pranata Komputer.
- Setiap personel non-TIK atau teknisi pihak ketiga wajib mengisi Formulir Buku Tamu Ruang Server dan didampingi staf TI.

B. Prosedur Pencadangan (Backup) & Pemulihan (Disaster Recovery):
- Backup basis data aplikasi perkara (CMS PTSP & Tilang) otomatis dijalankan setiap hari pukul 23:00 WIB.
- File backup disimpan pada dua media terpisah: Server Lokal (NAS) dan Penyimpanan Cadangan Terisolasi.
- Uji simulasi pemulihan data (Restore Drill) wajib dilakukan minimal 1 kali setiap 3 bulan.

C. Prosedur Tanggap Darurat Insiden Siber (CSIRT Kejaksaan):
- Jika terindikasi serangan ransomware/malware atau akses anomali, segera putuskan koneksi kabel LAN/WiFi perangkat terkait.
- Buat laporan insiden awal dan koordinasikan dengan Tim CSIRT Kejaksaan Agung RI dalam kurun waktu 1x24 jam.`
  },
  {
    id: "berita-acara-tik",
    title: "Berita Acara Pemeriksaan Fisik & Kerusakan Perangkat TIK Satker",
    category: "Administrasi & SPT",
    format: ".doc Word",
    description: "Formulir Berita Acara Pemeriksaan (BAP) kerusakan PC, laptop dinas, printer tilang, UPS, switch, atau server untuk dasar perbaikan/penghapusan BMN.",
    legalReference: "Pedoman Tata Kelola BMN & Pengelolaan Aset TIK Kejaksaan RI",
    tags: ["Berita Acara", "BMN", "Hardware", "Pemeriksaan Fisik"],
    contentDoc: `BERITA ACARA PEMERIKSAAN KERUSAKAN PERANGKAT TIK
NOMOR: BA - ...... / BMN-TIK / ... / 2026

Pada hari ini ........................ tanggal ........................ bulan ........................ tahun 2026, kami yang bertanda tangan di bawah ini:

1. Nama / NIP       : ...........................................................
   Pangkat / Gol.   : Penata Muda (III/a)
   Jabatan          : Pranata Komputer Ahli Pertama (Tim Pengelola TIK)
2. Nama / NIP       : ...........................................................
   Pangkat / Gol.   : ...........................................................
   Jabatan          : Pengurus Barang Milik Negara (BMN)

Telah melakukan pemeriksaan fisik, uji fungsionalitas, dan diagnosa teknis terhadap perangkat TIK milik Kejaksaan Negeri ........................ sebagai berikut:
• Jenis Perangkat   : Server / PC Desktop / Printer / Switch / UPS
• Merk / Tipe       : ...........................................................
• Nomor Register BMN: ...........................................................
• Tahun Perolehan   : ........................
• Lokasi Penempatan : Ruang PTSP / Pidum / Pidsus / Pembinaan

HASIL PEMERIKSAAN TEKNIS:
1. Kondisi Fisik    : Rusak Berat / Rusak Ringan pada komponen Power Supply / Motherboard / Storage SSD.
2. Analisis Gejala  : Perangkat mengalami mati total akibat lonjakan voltase listrik dan tidak dapat dilakukan booting sistem operasi.
3. Rekomendasi      : Diperlukan penggantian modul suku cadang unit baru atau pengusulan penghapusan BMN jika estimasi biaya perbaikan melebihi nilai ekonomis aset.

Demikian Berita Acara ini dibuat dengan sebenarnya dalam 2 (dua) rangkap untuk bahan pertimbangan tindak lanjut Pimpinan.

Tim Pemeriksa TIK                     Pengurus BMN Satker


( .............................. )    ( .............................. )
NIP. ...........................      NIP. ...........................`
  },
  {
    id: "logbook-35hari",
    title: "Format Logbook Catatan Harian Prakom Sesuai Butir DUPAK",
    category: "DUPAK & SKP BPS",
    format: ".doc Word",
    description: "Tabel logbook harian pencatatan volume kegiatan, waktu kerja (menit/jam), kode butir kegiatan BPS, output fisik, dan paraf atasan langsung.",
    legalReference: "Peraturan Kepala BPS No. 2 Tahun 2021 (Pasal 14: Dokumentasi Logbook Bukti Fisik)",
    bpsCode: "Pasal 14 Perka BPS 2/2021",
    tags: ["Logbook", "Harian", "Bukti DUPAK", "Perka BPS"],
    contentDoc: `LOGBOOK / CATATAN HARIAN KEGIATAN PRANATA KOMPUTER
Bulan: ........................ 2026

Nama Pegawai    : ...........................................................
NIP             : ...........................................................
Jabatan         : Pranata Komputer Ahli Pertama
Satuan Kerja    : Kejaksaan Negeri ........................

TABEL LOGBOOK HARIAN:
| No | Hari/Tanggal | Kode Butir BPS | Uraian Butir Kegiatan TI | Volume | Output / Dokumen Fisik | Waktu (Menit) | Paraf Atasan |
|---|---|---|---|---|---|---|---|
| 1 | Senin, 24/08/2026 | II.B.2 | Melakukan backup harian database perkara tilang | 1 File | Log_backup_tilang.sql.gz | 45 Menit | [Paraf] |
| 2 | Selasa, 25/08/2026 | II.A.5 | Troubleshooting access point ruang sidang online | 1 Laporan | Form_troubleshoot_01.pdf | 60 Menit | [Paraf] |
| 3 | Rabu, 26/08/2026 | III.B.1 | Konfigurasi reverse proxy Nginx server CMS | 1 Skrip | default.conf.nginx | 90 Menit | [Paraf] |
| 4 | Kamis, 27/08/2026 | I.A.3 | Evaluasi penerapan 6 domain SPBE satker | 1 Dokumen | Laporan_Maturitas_SPBE.docx | 120 Menit | [Paraf] |

Mengetahui,
Kepala Subbagian Pembinaan / Atasan Langsung


( ........................................................... )
NIP. .......................................................`
  },
  {
    id: "makalah-seminar",
    title: "Template Format Naskah Makalah Seminar Akhir Diklat Kejaksaan RI",
    category: "Seminar Akhir",
    format: ".doc Word",
    description: "Format standar penulisan naskah seminar akhir: Halaman Judul, Lembar Pengesahan Widyaiswara Badiklat & Penguji, Bab I s.d. Bab V, dan Daftar Pustaka.",
    legalReference: "Pedoman Penulisan Karya Ilmiah Pusdiklat Kejaksaan RI",
    tags: ["Makalah", "Seminar", "Kelulusan Diklat", "Pusdiklat Kejaksaan"],
    contentDoc: `PROPOSAL RENCANA AKSI INOVASI TEKNOLOGI INFORMASI
PELATIHAN FUNGSIONAL PRANATA KOMPUTER (BATCH 3)
TAHUN ANGGARAN 2026

JUDUL PROPOSAL INOVASI:
OPTIMALISASI LAYANAN TIK BERBASIS SPBE PADA KEJAKSAAN NEGERI ........................

DISUSUN OLEH:
NAMA PESERTA    : ...........................................................
NIP             : ...........................................................
PANGKAT / GOL   : Penata Muda (III/a)
JABATAN         : Pranata Komputer Ahli Pertama
SATUAN KERJA    : Kejaksaan Negeri ........................

BADAN PENDIDIKAN DAN PELATIHAN KEJAKSAAN REPUBLIK INDONESIA
JAKARTA - 2026

=========================================================
LEMBAR PENGESAHAN:
Proposal Rencana Aksi Inovasi ini telah disetujui untuk diseminarkan pada Evaluasi Akhir Pelatihan Fungsional Pranata Komputer Keahlian Batch 3 Tahun 2026.

Jakarta, ........................ 2026

Menyetujui,

Coach / Widyaiswara Pembimbing        Penguji Seminar Akhir


( ................................... ) ( ................................... )
NIP. ................................  NIP. ................................`
  },
  {
    id: "audit-ti-report",
    title: "Laporan Temuan Audit TI & Tata Kelola SPBE (Kondisi, Kriteria & Risiko)",
    category: "SOP & Keamanan",
    format: ".doc Word",
    description: "Format laporan temuan audit TI baku berbasis ITIL AXELOS memuat analisis Kondisi aktual, Kriteria regulasi, Dampak Risiko, dan Rekomendasi perbaikan.",
    legalReference: "Modul Audit TI Diklat Prakom & Kerangka Kerja ITIL AXELOS",
    tags: ["Audit TI", "ITIL", "Temuan Audit", "SPBE", "Manajemen Risiko"],
    contentDoc: `KEJAKSAAN REPUBLIK INDONESIA
KEJAKSAAN TINGGI / KEJAKSAAN NEGERI ........................
BIDANG PEMBINAAN / PENGELOLAAN DATA & STATISTIK KRIMINAL

LAPORAN TEMUAN AUDIT TATA KELOLA & KEAMANAN SISTEM INFORMASI
Nomor: LAP-AUDIT / ...... / ... / 2026

I. INFORMASI UMUM AUDIT
1. Objek Audit         : Sistem Informasi PTSP & Server Database Perkara Lokal
2. Tanggal Pelaksanaan : ........................ 2026
3. Auditor TI          : ........................................... (Pranata Komputer)
4. Standar Acuan       : Kerangka Kerja ITIL / Standar SPBE Perpres No. 95/2018

II. MATRIKS TEMUAN AUDIT TERSTRUKTUR

A. TEMUAN 1: Mekanisme Backup Database Otomatis Belum Terenkripsi
1. KONDISI (Condition):
   Berdasarkan pemeriksaan fisik dan log server, proses backup database CMS Perkara telah berjalan harian pukul 23:00 WIB, namun file dump .sql disimpan pada partisi lokal tanpa enkripsi dan belum ditransfer otomatis ke off-site cloud storage.

2. KRITERIA (Criteria):
   - Perpres No. 95 Tahun 2018 Pasal 41 tentang Keamanan SPBE.
   - SOP Manajemen Backup Kejaksaan RI: "Penyimpanan data cadangan wajib menerapkan enkripsi AES-256 dan prinsip 3-2-1 backup".

3. RISIKO (Risk):
   Potensi kebocoran data rahasia penanganan perkara jika server lokal mengalami pencurian fisik/ransomware, serta risiko kegagalan pemulihan bencana (Disaster Recovery).

4. REKOMENDASI (Recommendation):
   - Mengonfigurasi skrip cron backup dengan enkripsi GPG simetris otomatis.
   - Menyiapkan storage NAS terisolasi / Object Storage S3 aman di jaringan Intra-Kejaksaan.

III. RENCANA TINDAK LANJUT & TARGET SELESAI
1. PIC Perbaikan  : Pranata Komputer Satker
2. Target Selesai : 14 (empat belas) hari kalender setelah laporan disahkan

Dibuat oleh:
Auditor TI / Pranata Komputer


( ........................................................... )
NIP. .......................................................`
  },
  {
    id: "risk-register-iso31000",
    title: "Formulir Risk Assessment & Risk Register TI (Standar ISO 31000)",
    category: "SOP & Keamanan",
    format: ".doc Word",
    description: "Format penilaian risiko teknologi informasi mencakup identifikasi aset, analisis kemungkinan (likelihood) x dampak (impact), evaluasi selera risiko, dan opsi mitigasi.",
    legalReference: "Modul Manajemen Risiko TI Diklat Prakom & Standar ISO 31000:2018",
    tags: ["ISO 31000", "Risk Register", "Likelihood & Impact", "Mitigasi TI"],
    contentDoc: `KEJAKSAAN REPUBLIK INDONESIA
KEJAKSAAN TINGGI / KEJAKSAAN NEGERI ........................

FORMULIR DAFTAR RISIKO TEKNOLOGI INFORMASI (RISK REGISTER)
TAHUN ANGGARAN 2026
(Berdasarkan Pedoman Tata Kelola Risiko TI Standar ISO 31000)

I. PENETAPAN KONTEKS & IDENTIFIKASI RISIKO
Unit Pemilik Risiko : Subbagian Pembinaan / Urusan Daskrimti
Sistem TIK          : Jaringan LAN, Server PTSP & Aplikasi Pelayanan Tilang

II. TABEL PENILAIAN RISIKO (RISK ASSESSMENT MATRIX)

---------------------------------------------------------------------------------------------------------
No | Aset / Proses TI   | Ancaman & Kerentanan     | Dampak Negatif        | L | I | Skor | Tingkat Risiko
---------------------------------------------------------------------------------------------------------
1  | Server Database    | Serangan Ransomware /    | Layanan perkara lumpuh| 3 | 4 |  12  | TINGGI (High)
   | Perkara            | Port RDP terbuka         | & berkas hilang       |   |   |      |
---------------------------------------------------------------------------------------------------------
2  | Bandwidth Jaringan | Kabel FO terputus /      | Pelayanan publik PTSP | 2 | 3 |  6   | SEDANG (Medium)
   | Internet Kantor    | ISP utama down           | terhambat             |   |   |      |
---------------------------------------------------------------------------------------------------------
3  | Komputer User PTSP | Infeksi Malware USB      | Gangguan cetak kuitansi| 3 | 2 |  6   | SEDANG (Medium)
---------------------------------------------------------------------------------------------------------
* Keterangan: L = Likelihood (1-5) | I = Impact (1-5) | Skor = L x I

III. RENCANA PENANGANAN RISIKO (RISK TREATMENT)

1. Risiko No. 1 (Server Database):
   - Opsi Penanganan : Mitigasi Risiko (Risk Mitigation)
   - Aksi Pengendalian: Menutup port default RDP/SSH, memasang firewall whitelist IP, dan mengaktifkan backup terisolasi immutable.

2. Risiko No. 2 (Jaringan Internet):
   - Opsi Penanganan : Transfer Risiko (Risk Sharing) / Mitigasi
   - Aksi Pengendalian: Berlangganan link backup seluler 4G/5G failover otomatis.

Disahkan di : ........................
Tanggal     : ........................ 2026

Mengetahui,
Kepala Subbagian Pembinaan             Pranata Komputer / Pengelola TI


( ........................................... ) ( ........................................... )
NIP. ........................................  NIP. ........................................`
  }
]

export function TemplatesHub() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Semua")
  const [previewTemplate, setPreviewTemplate] = React.useState<DocumentTemplate | null>(null)
  const [copied, setCopied] = React.useState(false)
  const [customTemplates, setCustomTemplates] = React.useState<DocumentTemplate[]>([])

  const categories = ["Semua", "Administrasi & SPT", "DUPAK & SKP BPS", "SOP & Keamanan", "Seminar Akhir"]

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("custom_prakom_templates")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setCustomTemplates(parsed)
        }
      }
    } catch {
      // Ignore
    }

    const handleStorage = () => {
      try {
        const stored = localStorage.getItem("custom_prakom_templates")
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setCustomTemplates(parsed)
          }
        }
      } catch {
        // Ignore
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const allTemplates = React.useMemo(() => {
    const customIds = new Set(customTemplates.map((t) => t.id))
    const defaults = TEMPLATES_DATA.filter((t) => !customIds.has(t.id))
    return [...customTemplates, ...defaults]
  }, [customTemplates])

  const filteredTemplates = React.useMemo(() => {
    return allTemplates.filter((item) => {
      const matchCategory = selectedCategory === "Semua" || item.category === selectedCategory
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.legalReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchCategory && matchSearch
    })
  }, [allTemplates, selectedCategory, searchQuery])

  // Download template as clean Word document (.doc)
  const handleDownload = (template: DocumentTemplate) => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${template.title}</title>
    <style>
      @page { size: A4; margin: 3cm 2.5cm 2.5cm 3cm; }
      body { font-family: 'Times New Roman', serif; font-size: 11.5pt; line-height: 1.4; color: #000; }
      h1, h2, h3 { text-align: center; font-weight: bold; }
      pre { font-family: 'Times New Roman', serif; white-space: pre-wrap; font-size: 11.5pt; line-height: 1.4; }
    </style></head><body><pre>`
    const footer = `</pre></body></html>`
    const source = header + template.contentDoc + footer
    const blob = new Blob(['\ufeff' + source], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `TEMPLATE_${template.id.toUpperCase()}_KEJAKSAAN.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyContent = () => {
    if (!previewTemplate) return
    navigator.clipboard.writeText(previewTemplate.contentDoc)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[36px] bg-white dark:bg-[#12161F] p-6 sm:p-8 lg:p-10 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-3.5 py-1 text-xs font-black uppercase text-[#0D824B] dark:text-emerald-300 border border-[#A7F3D0] dark:border-emerald-800">
            <Layers className="h-3.5 w-3.5" />
            <span>Format Resmi BPS & Kejaksaan RI</span>
          </span>
          <span className="rounded-full bg-[#FFEADA] dark:bg-amber-950/80 px-3 py-1 text-xs font-bold text-[#EA580C] dark:text-amber-300">
            Standar Perka BPS No. 2/2021 & PermenPAN-RB 1/2023
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] dark:text-white tracking-tight leading-tight">
          Pusat Download Template Dokumen TIK, <br className="hidden sm:block" />
          <span className="text-[#0D824B] dark:text-emerald-400">DUPAK / SKP BPS & Administrasi Satker</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#52647C] dark:text-slate-400 leading-relaxed max-w-3xl">
          Koleksi formulir dan naskah dinas resmi yang telah disesuaikan 100% dengan regulasi <strong>Badan Pusat Statistik (BPS)</strong> selaku Instansi Pembina Jabatan Fungsional Pranata Komputer dan <strong>Tata Naskah Dinas Kejaksaan RI</strong>.
        </p>
      </motion.div>

      {/* Compliance Highlights Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white dark:bg-[#161B26] p-4 border-2 border-slate-200 dark:border-slate-800 flex items-start gap-3 shadow-2xs">
          <Award className="h-5 w-5 text-[#0D824B] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black text-[#131E29] dark:text-white">Perka BPS No. 2 Tahun 2021</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Sesuai Lampiran I-IV Juknis Penilaian Angka Kredit Prakom (SPMK 5 Sub-Unsur & Logbook).</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#161B26] p-4 border-2 border-slate-200 dark:border-slate-800 flex items-start gap-3 shadow-2xs">
          <Building2 className="h-5 w-5 text-[#EA580C] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black text-[#131E29] dark:text-white">Tata Naskah Dinas Kejaksaan</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Format baku kop surat, penomoran PRINT & BA, dan pejabat pengesahan Kejati/Kejari.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#161B26] p-4 border-2 border-slate-200 dark:border-slate-800 flex items-start gap-3 shadow-2xs">
          <BookOpen className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black text-[#131E29] dark:text-white">Standar Pusdiklat Badiklat</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Format naskah proposal seminar rencana aksi inovasi siap diuji di hadapan Widyaiswara.</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-[28px] bg-white dark:bg-[#12161F] p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9BAE] dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari template SPT, DUPAK BPS, SOP..."
              className="h-11 w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E2433] pl-10 pr-4 text-xs font-medium text-[#18181B] dark:text-white placeholder-[#9AA8BA] dark:placeholder-slate-400 focus:border-[#0D824B] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0D824B] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="flex flex-col justify-between rounded-[28px] bg-white dark:bg-[#161B26] p-5.5 border-2 border-slate-200 dark:border-slate-800 hover:border-[#0D824B] dark:hover:border-emerald-500 shadow-sm transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#E6F7ED] dark:bg-emerald-950/80 px-3 py-0.5 text-xs font-bold text-[#0D824B] dark:text-emerald-300 border border-[#A7F3D0] dark:border-emerald-800">
                  {template.category}
                </span>
                <span className="font-mono text-[11px] font-bold text-[#EA580C] dark:text-amber-400 bg-[#FFF9F5] dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-[#FFEADA] dark:border-slate-700">
                  {template.format}
                </span>
              </div>

              <h3 className="font-black text-base text-[#131E29] dark:text-white line-clamp-2 leading-snug">
                {template.title}
              </h3>

              <p className="text-xs text-[#6B7C93] dark:text-slate-400 line-clamp-2 leading-relaxed">
                {template.description}
              </p>

              <div className="pt-1">
                <span className="text-[10px] text-slate-500 font-mono block truncate">
                  ⚖️ Dasar: {template.legalReference}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 gap-2">
              <button
                type="button"
                onClick={() => setPreviewTemplate(template)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#0D824B] dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                <span>Lihat Format</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload(template)}
                className="flex items-center gap-1.5 bg-[#0D824B] hover:bg-[#0B6B3E] text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Unduh Word</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <Modal
          isOpen={Boolean(previewTemplate)}
          onClose={() => setPreviewTemplate(null)}
          title={previewTemplate.title}
          description={`${previewTemplate.category} • Format: ${previewTemplate.format}`}
          className="max-w-4xl"
        >
          <div className="space-y-4 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>⚖️ Dasar Regulasi: {previewTemplate.legalReference}</span>
              <button
                type="button"
                onClick={handleCopyContent}
                className="flex items-center gap-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-white px-3 py-1 rounded-xl font-bold border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Tersalin!" : "Salin Teks"}</span>
              </button>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D28] p-4 sm:p-6 overflow-y-auto max-h-[55vh] shadow-inner">
              <pre className="font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {previewTemplate.contentDoc}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500 font-mono">
                Format resmi BPS & Kejaksaan RI — Siap diedit di Microsoft Word (.doc)
              </span>
              <button
                type="button"
                onClick={() => handleDownload(previewTemplate)}
                className="flex items-center gap-2 bg-[#0D824B] hover:bg-[#0B6B3E] text-white px-5 py-2 rounded-2xl text-xs font-black shadow-md transition cursor-pointer w-full sm:w-auto justify-center"
              >
                <Download className="h-4 w-4" />
                <span>Unduh File ({previewTemplate.format})</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}
