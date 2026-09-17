'use client'

import * as React from "react"
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  User,
  Building2,
  Calendar,
  Sparkles,
  ExternalLink,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export function SuratPerintahViewer() {
  const [copied, setCopied] = React.useState(false)

  const textFormat = `KEJAKSAAN REPUBLIK INDONESIA
BADAN PENDIDIKAN DAN PELATIHAN
KOMUNITAS BELAJAR PRANATA KOMPUTER KEAHLIAN "AGRASENA"
Jl. Pusdiklat Kejaksaan RI No. 1, Ragunan, Pasar Minggu, Jakarta Selatan

SURAT PERINTAH TUGAS
NOMOR: PRINT-001/L.1/Prakom.Agrasena/Admin/09/2026

DASAR:
1. Undang-Undang Nomor 11 Tahun 2021 tentang Perubahan atas Undang-Undang Nomor 16 Tahun 2004 tentang Kejaksaan Republik Indonesia;
2. Peraturan Presiden Republik Indonesia Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE);
3. Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 32 Tahun 2020 tentang Jabatan Fungsional Pranata Komputer;
4. Program Penyelenggaraan Pelatihan Fungsional Pranata Komputer Keahlian Agrasena (Batch 3 & Batch 4) Kejaksaan RI Tahun Anggaran 2026;
5. Kebutuhan operasional tata kelola portal kelas virtual, monitoring perkuliahan Zoom, moderasi forum diskusi, dan pengarsipan modul kurikulum 120 JP.

MEMERINTAHKAN:

Kepada:
1. Nama         : RISKY ANDINI, S.Kom.
   Jabatan      : Pranata Komputer Ahli Pertama
   Satuan Kerja : Kejaksaan Negeri Palu
   Penugasan    : Administrator Sesi Kelas Virtual & Presensi Pembelajaran (Admin 1)

2. Nama         : FEGGY RIPANI, S.Kom.
   Jabatan      : Pranata Komputer Ahli Pertama
   Satuan Kerja : Kejaksaan Negeri Bangka Selatan
   Penugasan    : Administrator Teknis Zoom & Moderasi Forum Diskusi (Admin 2)

3. Nama         : KURNIA RAMADANI, S.Kom.
   Jabatan      : Pranata Komputer Ahli Pertama
   Satuan Kerja : Kejaksaan Negeri Lampung Timur
   Penugasan    : Administrator Pustaka Modul 120 JP & Rekapitulasi Tugas (Admin 3)

Untuk:
1. Menjadi Administrator Resmi Portal Kelas Virtual Diklat Fungsional Pranata Komputer Keahlian Agrasena (Batch 3 & Batch 4) Kejaksaan Republik Indonesia;
2. Mengelola kelancaran operasional kelas virtual, mendampingi peserta diklat, serta mengawasi ketertiban tata tertib perkuliahan daring;
3. Mendokumentasikan dan menyinkronkan bahan ajar modul 120 JP, serta memfasilitasi komunikasi teknis antara widyaiswara/pengampu materi dengan peserta diklat;
4. Melaksanakan tugas kedinasan ini dengan sebaik-baiknya, menjunjung tinggi nilai-nilai Trapsila Adhyaksa, berintegritas, cermat, dan penuh rasa tanggung jawab;
5. Melaporkan pelaksanaan penugasan secara berkala kepada Super Admin dan Tim Penyelenggara Diklat Kejaksaan RI.

Ditetapkan di : Jakarta
Pada tanggal   : 17 September 2026

SUPER ADMIN PORTAL KELAS DIKLAT
PRANATA KOMPUTER KEAHLIAN AGRASENA
KEJAKSAAN REPUBLIK INDONESIA

( SUPER ADMIN )`

  const handleCopyText = () => {
    navigator.clipboard.writeText(textFormat)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      
      {/* ── Top Bar Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[20px] bg-white dark:bg-[#151c28] p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-3 py-0.5 text-xs font-bold shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Naskah Dinas Sah (1 Lembar)</span>
            </span>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 text-xs font-bold border border-slate-200 dark:border-slate-700">
              Format S1 PDF
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-[#18181B] dark:text-white">
            Surat Perintah Penunjukan Tim Admin Agrasena
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penugasan resmi untuk Risky Andini, S.Kom., Feggy Ripani, S.Kom., dan Kurnia Ramadani, S.Kom.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2 text-xs font-bold transition cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Tersalin!" : "Salin Teks"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2 text-xs font-bold transition cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Cetak Dokumen</span>
          </button>

          <a
            href="/documents/SURAT_PERINTAH_PENUNJUKAN_ADMIN_AGRASENA_2026.pdf"
            download="SURAT_PERINTAH_PENUNJUKAN_ADMIN_AGRASENA_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-4.5 py-2 text-xs font-bold shadow-md shadow-emerald-600/25 transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Unduh S1 PDF Resmi</span>
          </a>
        </div>
      </div>

      {/* ── Visual Document Paper (A4 Style) ── */}
      <div className="mx-auto max-w-3xl rounded-[20px] bg-white text-black p-8 sm:p-12 shadow-2xl border border-slate-300 font-serif leading-relaxed select-text">
        
        {/* Kop Surat */}
        <div className="relative text-center pb-1">
          <div className="flex items-center justify-center gap-4">
            <img
              src="/Logo.png"
              alt="Logo Kejaksaan RI"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain shrink-0"
            />
            <div className="text-center font-serif">
              <div className="text-sm sm:text-base font-black tracking-wider uppercase">
                KEJAKSAAN REPUBLIK INDONESIA
              </div>
              <div className="text-xs sm:text-sm font-black tracking-wide uppercase">
                BADAN PENDIDIKAN DAN PELATIHAN
              </div>
              <div className="text-xs sm:text-sm font-bold tracking-wide uppercase text-emerald-900">
                KOMUNITAS BELAJAR PRANATA KOMPUTER KEAHLIAN &ldquo;AGRASENA&rdquo;
              </div>
              <div className="text-[10px] font-sans text-slate-700 mt-0.5 leading-tight">
                Sekretariat: Kampus Sasana Adhi Karyadika, Jl. Pusdiklat Kejaksaan RI No. 1, Ragunan, Jakarta Selatan<br />
                Laman Resmi: <em>https://agrasena-batch3-class.vercel.app</em> • Pos-el: <em>prakom.agrasena@kejaksaan.go.id</em>
              </div>
            </div>
          </div>

          <div className="border-t-[2.5px] border-black mt-3 mb-1" />
          <div className="border-t border-black mb-5" />
        </div>

        {/* Judul Surat */}
        <div className="text-center mb-5 font-serif">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-widest underline">
            SURAT PERINTAH TUGAS
          </h2>
          <div className="text-xs font-bold font-sans tracking-wide mt-0.5 text-slate-800">
            NOMOR: PRINT-001/L.1/Prakom.Agrasena/Admin/09/2026
          </div>
        </div>

        {/* Dasar */}
        <div className="flex items-start text-xs text-justify mb-4">
          <span className="w-20 font-bold shrink-0">DASAR</span>
          <span className="w-4 font-bold shrink-0">:</span>
          <ol className="list-decimal pl-4 space-y-1 text-slate-900 flex-1">
            <li>Undang-Undang Nomor 11 Tahun 2021 tentang Perubahan atas Undang-Undang Nomor 16 Tahun 2004 tentang Kejaksaan Republik Indonesia;</li>
            <li>Peraturan Presiden Republik Indonesia Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE);</li>
            <li>Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 32 Tahun 2020 tentang Jabatan Fungsional Pranata Komputer;</li>
            <li>Program Penyelenggaraan Pelatihan Fungsional Pranata Komputer Keahlian Agrasena (Batch 3 & Batch 4) Kejaksaan RI Tahun Anggaran 2026;</li>
            <li>Kebutuhan tata kelola teknis, koordinasi pembelajaran, ketertiban sesi perkuliahan virtual, moderasi forum diskusi, dan pengarsipan modul kurikulum 120 JP pada Portal Belajar Terpadu Agrasena.</li>
          </ol>
        </div>

        {/* Memerintahkan */}
        <div className="text-center font-bold tracking-widest text-xs uppercase my-3 font-serif">
          MEMERINTAHKAN:
        </div>

        {/* Kepada */}
        <div className="flex items-start text-xs mb-4">
          <span className="w-20 font-bold shrink-0">KEPADA</span>
          <span className="w-4 font-bold shrink-0">:</span>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-700 text-xs font-sans">
              <thead>
                <tr className="bg-slate-100 text-[11px] font-bold text-slate-800">
                  <th className="border border-slate-700 px-2 py-1 text-center w-8">NO</th>
                  <th className="border border-slate-700 px-2 py-1 text-left">NAMA & PANGKAT</th>
                  <th className="border border-slate-700 px-2 py-1 text-left">JABATAN</th>
                  <th className="border border-slate-700 px-2 py-1 text-left">SATKER & TUGAS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-700 px-2 py-1 text-center font-bold">1.</td>
                  <td className="border border-slate-700 px-2 py-1">
                    <strong className="text-emerald-950 block">RISKY ANDINI, S.Kom.</strong>
                    <span className="text-[10px] text-slate-600 block">NIP. 19960814 202203 2 004</span>
                    <span className="text-[10px] text-slate-700 block">Penata Muda (III/a)</span>
                  </td>
                  <td className="border border-slate-700 px-2 py-1 font-semibold">
                    Pranata Komputer Ahli Pertama
                  </td>
                  <td className="border border-slate-700 px-2 py-1">
                    <strong className="text-slate-900 block">Kejaksaan Negeri Palu</strong>
                    <span className="text-[10px] italic text-slate-700 block">
                      Admin Sesi Pembelajaran & Presensi Virtual
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-700 px-2 py-1 text-center font-bold">2.</td>
                  <td className="border border-slate-700 px-2 py-1">
                    <strong className="text-emerald-950 block">FEGGY RIPANI, S.Kom.</strong>
                    <span className="text-[10px] text-slate-600 block">NIP. 19970221 202203 1 003</span>
                    <span className="text-[10px] text-slate-700 block">Penata Muda (III/a)</span>
                  </td>
                  <td className="border border-slate-700 px-2 py-1 font-semibold">
                    Pranata Komputer Ahli Pertama
                  </td>
                  <td className="border border-slate-700 px-2 py-1">
                    <strong className="text-slate-900 block">Kejaksaan Negeri Bangka Selatan</strong>
                    <span className="text-[10px] italic text-slate-700 block">
                      Admin Teknis Sesi Zoom & Moderasi Forum
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-700 px-2 py-1 text-center font-bold">3.</td>
                  <td className="border border-slate-700 px-2 py-1">
                    <strong className="text-emerald-950 block">KURNIA RAMADANI, S.Kom.</strong>
                    <span className="text-[10px] text-slate-600 block">NIP. 19980112 202203 2 006</span>
                    <span className="text-[10px] text-slate-700 block">Penata Muda (III/a)</span>
                  </td>
                  <td className="border border-slate-700 px-2 py-1 font-semibold">
                    Pranata Komputer Ahli Pertama
                  </td>
                  <td className="border border-slate-700 px-2 py-1">
                    <strong className="text-slate-900 block">Kejaksaan Negeri Lampung Timur</strong>
                    <span className="text-[10px] italic text-slate-700 block">
                      Admin Pustaka Modul & Rekapitulasi Tugas
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Untuk */}
        <div className="flex items-start text-xs text-justify mb-5">
          <span className="w-20 font-bold shrink-0">UNTUK</span>
          <span className="w-4 font-bold shrink-0">:</span>
          <ol className="list-decimal pl-4 space-y-1 text-slate-900 flex-1">
            <li>Menjadi <strong>Administrator Resmi</strong> Portal Kelas Virtual Diklat Fungsional Pranata Komputer Keahlian Agrasena (Batch 3 & Batch 4) Kejaksaan Republik Indonesia;</li>
            <li>Mengelola kelancaran operasional kelas virtual, mendampingi rekan peserta diklat, serta mengawasi ketertiban tata tertib perkuliahan daring;</li>
            <li>Mendokumentasikan dan menyinkronkan bahan ajar modul 120 JP, serta memfasilitasi komunikasi teknis antara widyaiswara/pengampu materi dengan peserta diklat;</li>
            <li>Melaksanakan tugas kedinasan ini dengan <strong>sebaik-baiknya</strong>, menjunjung tinggi nilai-nilai <em>Trapsila Adhyaksa</em>, berintegritas, cermat, dan penuh rasa tanggung jawab;</li>
            <li>Melaporkan pelaksanaan penugasan secara berkala kepada Super Admin dan Tim Penyelenggara Diklat Kejaksaan RI.</li>
          </ol>
        </div>

        {/* Tanda Tangan */}
        <div className="flex justify-between items-start pt-2 text-xs font-sans">
          <div className="text-[10px] text-slate-600 border border-slate-400 p-2.5 rounded-lg max-w-xs leading-relaxed">
            <span className="font-bold text-slate-800 block mb-0.5">[VERIFIKASI ELEKTRONIK]</span>
            Dokumen SAH terdaftar pada Sistem Informasi Manajemen Diklat Terpadu Agrasena 2026.<br />
            Kode Hash Dokumen: <code className="font-mono font-bold text-emerald-800">SHA256-AGR-ADM-2026-09</code>
          </div>

          <div className="text-center w-72">
            <div>Ditetapkan di : Jakarta</div>
            <div className="mb-2">Pada tanggal   : 17 September 2026</div>
            <div className="font-bold uppercase text-[11px] leading-tight">
              SUPER ADMIN PORTAL KELAS DIKLAT<br />
              PRANATA KOMPUTER KEAHLIAN AGRASENA<br />
              KEJAKSAAN REPUBLIK INDONESIA
            </div>

            {/* Stempel Digital */}
            <div className="my-2 py-1">
              <div className="inline-block border-2 border-dashed border-emerald-800 rounded-lg px-3 py-1 text-[9px] font-bold text-emerald-900 bg-emerald-50/50">
                ★ TERTANDA SECARA ELEKTRONIK ★<br />
                SUPER ADMIN AGRASENA RI
              </div>
            </div>

            <div className="font-bold text-xs underline uppercase mt-2">
              SUPER ADMIN
            </div>
            <div className="text-[10px] text-slate-600">
              Sistem Informasi Manajemen Diklat Terpadu
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-2 border-t border-slate-300 flex justify-between items-center text-[9px] text-slate-500 font-sans">
          <span>Naskah Dinas Resmi Portal Belajar Diklat Fungsional Pranata Komputer Keahlian Agrasena 2026</span>
          <span>Lembar 1 dari 1 (Dokumen Sah)</span>
        </div>

      </div>

    </div>
  )
}
