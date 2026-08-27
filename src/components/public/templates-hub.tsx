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
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

export interface DocumentTemplate {
  id: string
  title: string
  category: "Administrasi & SPT" | "DUPAK & SKP" | "SOP & Keamanan" | "Seminar Akhir"
  format: ".doc Word" | ".xlsx Excel" | ".docx Word"
  description: string
  legalReference: string
  tags: string[]
  contentDoc: string
}

const TEMPLATES_DATA: DocumentTemplate[] = [
  {
    id: "spt-ti",
    title: "Surat Perintah Tugas (SPT) Pemeliharaan & Troubleshooting TIK Satker",
    category: "Administrasi & SPT",
    format: ".doc Word",
    description: "Format surat perintah tugas resmi penugasan Pranata Komputer untuk pemeliharaan server, jaringan lokal, dan basis data di Kejati/Kejari.",
    legalReference: "PermenPAN-RB No. 32/2020 & Standar Tata Naskah Dinas Kejaksaan RI",
    tags: ["Bukti Fisik Sah", "Pemeliharaan", "Kejati/Kejari"],
    contentDoc: `KEJAKSAAN REPUBLIK INDONESIA
KEJAKSAAN TINGGI / KEJAKSAAN NEGERI ........................
Jalan ............................................................................

SURAT PERINTAH TUGAS
NOMOR: PRINT - ...... / L. ... / Dipa / ... / 2026

DASAR:
1. DIPA Kejaksaan Negeri ........................ Tahun Anggaran 2026;
2. Kebutuhan pemeliharaan rutin infrastruktur server, jaringan lokal (LAN), dan basis data perkara demi kelancaran operasional pelayanan publik.

MEMERINTAHKAN:
Kepada:
1. Nama / NIP       : ...........................................................
   Pangkat / Gol.   : ...........................................................
   Jabatan          : Pranata Komputer Ahli Pertama / Terampil
   Satuan Kerja     : ...........................................................

Untuk:
1. Melaksanakan kegiatan pemeliharaan, audit ketersediaan sistem jaringan, dan backup berkala database CMS PTSP & Tilang;
2. Membuat laporan hasil pelaksanaan tugas teknis dan logbook rincian kegiatan;
3. Melaporkan hasil pelaksanaan tugas kepada Pimpinan (Kasi Intel / Kasubagbin / Kajari);
4. Melaksanakan perintah ini dengan penuh rasa tanggung jawab.

Dikeluarkan di : ........................
Pada tanggal   : ........................ 2026

KEPALA KEJAKSAAN NEGERI ........................


( ........................................................... )
Jaksa Utama Pratama / Madya NIP. ....................`
  },
  {
    id: "dupak-spmk",
    title: "Format Formulir DUPAK & SPMK Butir Kegiatan Prakom Keahlian",
    category: "DUPAK & SKP",
    format: ".doc Word",
    description: "Template Daftar Usul Penetapan Angka Kredit dan Surat Pernyataan Melakukan Kegiatan (SPMK) sesuai lampiran resmi Perka BPS.",
    legalReference: "Peraturan Kepala BPS No. 2 Tahun 2021 (Juknis Penilaian AK Prakom)",
    tags: ["Angka Kredit", "DUPAK", "SPMK", "TPAK"],
    contentDoc: `SURAT PERNYATAAN MELAKUKAN KEGIATAN (SPMK)
BIDANG TATA KELOLA DAN SISTEM INFORMASI

Yang bertanda tangan di bawah ini:
Nama                    : ...........................................................
NIP                     : ...........................................................
Pangkat / Gol. Ruang    : ...........................................................
Jabatan                 : Kepala Subbagian Pembinaan / Kasi Intelijen
Unit Kerja              : Kejaksaan Negeri ........................

Menyatakan bahwa:
Nama                    : ...........................................................
NIP                     : ...........................................................
Pangkat / Gol. Ruang    : Penata Muda (III/a) / Penata (III/c)
Jabatan                 : Pranata Komputer Ahli Pertama / Ahli Muda
Unit Kerja              : Kejaksaan Negeri ........................

Telah nyata melakukan kegiatan pelayanan fungsional Pranata Komputer sebagai berikut:
1. Melakukan backup dan replikasi basis data perkara (Volume: 12 Dokumen Log, Angka Kredit: 0.120)
2. Melakukan konfigurasi perangkat jaringan switch & access point satker (Volume: 4 Laporan, Angka Kredit: 0.080)
3. Menyusun dokumentasi teknis SOP Pengelolaan Layanan TIK (Volume: 1 Naskah SOP, Angka Kredit: 0.500)

Demikian pernyataan ini dibuat dengan sebenarnya untuk dipergunakan dalam pengusulan Angka Kredit Jabatan Fungsional Pranata Komputer.

........................, ........................ 2026
Pejabat Penilai Kinerja / Atasan Langsung


( ........................................................... )
NIP. .......................................................`
  },
  {
    id: "sop-server",
    title: "SOP Standar Operasional Prosedur Pengelolaan Ruang Server & Jaringan",
    category: "SOP & Keamanan",
    format: ".doc Word",
    description: "Naskah SOP komprehensif tata tertib ruang data center/server lokal, hak akses user, jadwal backup, dan tanggap darurat insiden siber.",
    legalReference: "Perpres 95/2018 SPBE & Standar Keamanan Siber BSSN",
    tags: ["SOP", "Keamanan Siber", "Data Center"],
    contentDoc: `STANDAR OPERASIONAL PROSEDUR (SOP)
PENGELOLAAN RUANG SERVER DAN KEAMANAN JARINGAN TIK
KEJAKSAAN NEGERI ........................

NOMOR DOKUMEN   : SOP-TIK-001/2026
TANGGAL EFEKTIF : 01 September 2026
DISAHKAN OLEH   : KEPALA KEJAKSAAN NEGERI ........................

1. TUJUAN
Memastikan kelangsungan operasional server, integritas data perkara, dan perlindungan infrastruktur TIK dari ancaman fisik maupun serangan siber.

2. RUANG LINGKUP
Meliputi tata kelola akses fisik ruang server, manajemen pendingin & UPS, jadwal backup database harian, monitoring log jaringan, serta penanganan insiden malware/ransomware.

3. PROSEDUR UTAMA:
A. Akses Fisik:
- Hanya personel Pranata Komputer / Tim TIK yang memiliki izin masuk ke ruang server.
- Setiap tamu vendor/teknisi wajib mengisi Buku Tamu Ruang Server dan didampingi staf TI.

B. Prosedur Pencadangan (Backup):
- Backup basis data otomatis dijalankan setiap hari pukul 23:00 WIB ke media penyimpanan terpisah (NAS/Cloud).
- Uji pemulihan data (Restore Drill) dilakukan minimal 1 (satu) kali setiap 3 bulan.

C. Tanggap Insiden Keamanan (CSIRT):
- Jika terdeteksi anomali/serangan siber, segera isolasi kabel jaringan perangkat terdampak.
- Laporkan insiden ke Tim CSIRT Kejaksaan Agung RI dalam waktu maksimal 1x24 jam.`
  },
  {
    id: "berita-acara-tik",
    title: "Berita Acara Kerusakan & Pemeliharaan Perangkat Keras TIK Satker",
    category: "Administrasi & SPT",
    format: ".doc Word",
    description: "Formulir Berita Acara Pemeriksaan Fisik (BAP) PC, laptop dinas, printer tilang, UPS, switch, atau server untuk dasar pengadaan/perbaikan.",
    legalReference: "Tata Kelola BMN & Pengelolaan Aset TIK Kejaksaan RI",
    tags: ["Berita Acara", "BMN", "Hardware"],
    contentDoc: `BERITA ACARA PEMERIKSAAN KERUSAKAN PERANGKAT TIK
NOMOR: BA - ...... / BMN-TIK / ... / 2026

Pada hari ini ........................ tanggal ........................ bulan ........................ tahun 2026, kami yang bertanda tangan di bawah ini:

1. Nama / NIP       : ...........................................................
   Jabatan          : Pranata Komputer (Tim Pengelola TIK)
2. Nama / NIP       : ...........................................................
   Jabatan          : Pengurus Barang Milik Negara (BMN)

Telah melakukan pemeriksaan fisik dan uji diagnostik terhadap perangkat TIK berikut:
• Jenis Perangkat   : Server / PC Desktop / Switch / UPS
• Merk / Tipe       : ...........................................................
• Nomor Register BMN: ...........................................................
• Lokasi Unit Kerja : Ruang PTSP / Pidum / Pidsus / Pembinaan

HASIL PEMERIKSAAN TEKNIS:
1. Kondisi Fisik    : Rusak Berat / Rusak Ringan pada komponen Power Supply / Motherboard.
2. Analisis Gejala  : Perangkat mengalami mati total akibat lonjakan tegangan listrik dan tidak dapat dilakukan booting OS.
3. Rekomendasi      : Diperlukan penggantian modul Power Supply unit baru atau penghapusan BMN jika biaya perbaikan melebihi nilai ekonomis.

Demikian Berita Acara ini dibuat dengan sebenarnya untuk bahan pertimbangan tindak lanjut Pimpinan.

Tim Pemeriksa TIK                     Pengurus BMN Satker


( .............................. )    ( .............................. )`
  },
  {
    id: "logbook-35hari",
    title: "Format Logbook Catatan Harian Prakom (Sesuai Butir DUPAK)",
    category: "DUPAK & SKP",
    format: ".doc Word",
    description: "Tabel logbook harian pencatatan volume kegiatan, waktu kerja (menit/jam), bukti output, dan paraf atasan langsung.",
    legalReference: "Perka BPS No. 2 Tahun 2021 (Pasal 14: Logbook Bukti Fisik)",
    tags: ["Logbook", "Harian", "Bukti DUPAK"],
    contentDoc: `LOGBOOK / CATATAN HARIAN KEGIATAN PRANATA KOMPUTER
Bulan: ........................ 2026

Nama Pegawai    : ...........................................................
NIP             : ...........................................................
Jabatan         : Pranata Komputer Ahli Pertama
Satuan Kerja    : Kejaksaan Negeri ........................

TABEL LOGBOOK HARIAN:
| No | Hari/Tanggal | Uraian Butir Kegiatan TI | Volume | Output / Dokumen Fisik | Waktu (Menit) | Paraf Atasan |
|---|---|---|---|---|---|---|
| 1 | Senin, 24/08/2026 | Melakukan backup harian database perkara tilang | 1 File | Log_backup_tilang.sql.gz | 45 Menit | [Paraf] |
| 2 | Selasa, 25/08/2026 | Troubleshooting access point ruang sidang online | 1 Laporan | Form_troubleshoot_01.pdf | 60 Menit | [Paraf] |
| 3 | Rabu, 26/08/2026 | Konfigurasi reverse proxy Nginx server CMS | 1 Skrip | default.conf.nginx | 90 Menit | [Paraf] |
| 4 | Kamis, 27/08/2026 | Evaluasi penerapan 6 domain SPBE satker | 1 Dokumen | Laporan_Maturitas_SPBE.docx | 120 Menit | [Paraf] |

Mengetahui,
Atasan Langsung / Pejabat Penilai


( ........................................................... )
NIP. .......................................................`
  },
  {
    id: "makalah-seminar",
    title: "Template Format Naskah Makalah Seminar Akhir Diklat Kejaksaan RI",
    category: "Seminar Akhir",
    format: ".doc Word",
    description: "Format standar penulisan naskah seminar akhir: Halaman Judul, Lembar Pengesahan Widyaiswara & Penguji, Bab I s.d. Bab IV, dan Daftar Pustaka.",
    legalReference: "Pedoman Penulisan Karya Ilmiah Pusdiklat Kejaksaan RI",
    tags: ["Makalah", "Seminar", "Kelulusan Diklat"],
    contentDoc: `PROPOSAL RENCANA AKSI INOVASI TEKNOLOGI INFORMASI
PELATIHAN FUNGSIONAL PRANATA KOMPUTER (BATCH 3)
TAHUN ANGGARAN 2026

JUDUL PROPOSAL INOVASI:
OPTIMALISASI LAYANAN TIK BERBASIS SPBE PADA KEJAKSAAN NEGERI ........................

DISUSUN OLEH:
NAMA PESERTA    : ...........................................................
NIP             : ...........................................................
PANGKAT / GOL   : Penata Muda (III/a)
SATUAN KERJA    : Kejaksaan Negeri ........................

BADAN PENDIDIKAN DAN PELATIHAN KEJAKSAAN REPUBLIK INDONESIA
JAKARTA - 2026

---------------------------------------------------------
LEMBAR PENGESAHAN:
Proposal Rencana Aksi Inovasi ini telah disetujui untuk diseminarkan pada Evaluasi Akhir Pelatihan Fungsional Pranata Komputer Batch 3.

Jakarta, ........................ 2026

Coach / Widyaiswara Pembimbing        Penguji Seminar Akhir


( ................................... ) ( ................................... )
NIP. ................................  NIP. ................................`
  }
]

export function TemplatesHub() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Semua")
  const [previewTemplate, setPreviewTemplate] = React.useState<DocumentTemplate | null>(null)
  const [copied, setCopied] = React.useState(false)

  const categories = ["Semua", "Administrasi & SPT", "DUPAK & SKP", "SOP & Keamanan", "Seminar Akhir"]

  const filteredTemplates = React.useMemo(() => {
    return TEMPLATES_DATA.filter((item) => {
      const matchCategory = selectedCategory === "Semua" || item.category === selectedCategory
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchCategory && matchSearch
    })
  }, [selectedCategory, searchQuery])

  // Download template as Word document (.doc)
  const handleDownload = (template: DocumentTemplate) => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${template.title}</title>
    <style>
      body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; color: #000; }
      h1, h2, h3 { text-align: center; font-weight: bold; }
      pre { font-family: 'Times New Roman', serif; white-space: pre-wrap; font-size: 11pt; }
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
            <span>Pusat Template Dokumen Resmi</span>
          </span>
          <span className="rounded-full bg-[#FFEADA] dark:bg-amber-950/80 px-3 py-1 text-xs font-bold text-[#EA580C] dark:text-amber-300">
            Format .doc & .docx Siap Download
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] dark:text-white tracking-tight leading-tight">
          Pusat Download Template Dokumen TIK & <br className="hidden sm:block" />
          <span className="text-[#0D824B] dark:text-emerald-400">Administrasi Fungsional Kejaksaan</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#52647C] dark:text-slate-400 leading-relaxed max-w-3xl">
          Kumpulan berkas template resmi berstandar Pusdiklat & Perka BPS: Surat Perintah Tugas (SPT), Formulir DUPAK & SPMK, SOP Ruang Server, Berita Acara Kerusakan TIK, dan Format Makalah Seminar. Siap unduh dan edit langsung di Microsoft Word.
        </p>
      </motion.div>

      {/* Filter and Search Bar */}
      <div className="rounded-[28px] bg-white dark:bg-[#12161F] p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9BAE] dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari template SPT, DUPAK, SOP..."
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
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
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
                Berkas siap diedit langsung di Microsoft Word (.doc)
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
