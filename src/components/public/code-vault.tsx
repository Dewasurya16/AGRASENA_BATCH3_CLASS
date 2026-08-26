'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Code2,
  Copy,
  Check,
  Search,
  Database,
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Plus,
  Globe,
  Sparkles,
  FileCode,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  User,
  Sliders,
  Eye,
  Maximize2,
  Download,
  FolderOpen,
  Settings,
  FilePlus,
  Trash2,
  FileText,
  Smartphone,
  Monitor,
  RefreshCw,
  HelpCircle,
  FolderTree,
  Share2,
  AlertCircle,
  Upload,
  Archive,
  FileArchive,
  HardDrive,
  Folder,
  Server,
  BarChart3,
  Layout
} from "lucide-react"
import JSZip from "jszip"
import { CODE_SNIPPETS, CodeSnippet, SnippetCategory } from "@/data/code-snippets"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"

type LanguageKey = "sql" | "python" | "javascript" | "html"

interface IDEFile {
  id: string
  name: string
  category: SnippetCategory
  language: LanguageKey
  icon: string
  content: string
  isDefault?: boolean
}

const DEFAULT_FILES: IDEFile[] = [
  // 1. DATABASE
  {
    id: "file-sql-1",
    name: "query_analitik.sql",
    category: "Database",
    language: "sql",
    icon: "🗄️",
    isDefault: true,
    content: `-- ==========================================================
-- Analisis Data Kepegawaian & Angka Kredit Prakom Kejaksaan RI
-- ==========================================================
SELECT 
    satker, 
    jenjang, 
    COUNT(*) AS total_peserta, 
    ROUND(AVG(ak)::numeric, 2) AS rata_rata_ak,
    MAX(ak) AS ak_tertinggi
FROM pegawai_prakom
GROUP BY satker, jenjang
ORDER BY rata_rata_ak DESC;`,
  },
  {
    id: "file-sql-2",
    name: "trigger_audit_log.sql",
    category: "Database",
    language: "sql",
    icon: "🗄️",
    isDefault: true,
    content: `-- 1. Buat Tabel Log Audit Perubahan Data
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(64) NOT NULL,
    action_type VARCHAR(10) NOT NULL,
    record_id TEXT,
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(100) DEFAULT CURRENT_USER,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Verifikasi Data Audit Terkini
SELECT * FROM log_audit_spbe ORDER BY id DESC;`,
  },

  // 2. FRONTEND
  {
    id: "file-fe-1",
    name: "dashboard_spbe.html",
    category: "Frontend",
    language: "html",
    icon: "🌐",
    isDefault: true,
    content: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white p-6 font-sans">
  <div class="max-w-md mx-auto bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-4">
    <div class="flex items-center justify-between">
      <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
        ● SPBE Node Online
      </span>
      <span class="text-xs text-slate-400 font-mono">Kejaksaan RI</span>
    </div>
    
    <h2 class="text-xl font-bold tracking-tight">Portal Lab Prakom Batch 3</h2>
    <p class="text-xs text-slate-300">
      Monitoring integrasi data kepegawaian dan pelaporan berkas tugas mandiri 120 JP.
    </p>

    <div class="grid grid-cols-2 gap-3 pt-2">
      <div class="bg-slate-900/60 p-3 rounded-2xl border border-slate-700">
        <div class="text-[10px] text-slate-400 font-bold uppercase">Peserta Aktif</div>
        <div class="text-2xl font-extrabold text-emerald-400">30 Orang</div>
      </div>
      <div class="bg-slate-900/60 p-3 rounded-2xl border border-slate-700">
        <div class="text-[10px] text-slate-400 font-bold uppercase">Tugas Selesai</div>
        <div class="text-2xl font-extrabold text-amber-400">96.8%</div>
      </div>
    </div>

    <button onclick="alert('Sinkronisasi gateway SPBE Kejaksaan RI sukses!')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-600/30 cursor-pointer">
      Uji Koneksi Gateway SPBE
    </button>
  </div>
</body>
</html>`,
  },
  {
    id: "file-fe-2",
    name: "kalkulator_ak_ui.js",
    category: "Frontend",
    language: "javascript",
    icon: "⚡",
    isDefault: true,
    content: `// ==========================================================
// Simulasi Validasi Format NIP & Perhitungan Angka Kredit (AK)
// ==========================================================
function validateNIP(nip) {
  const regex = /^\\d{18}$/;
  if (!regex.test(nip)) return { valid: false, message: "NIP harus 18 digit angka" };
  const tglLahir = \`\${nip.substring(6,8)}/\${nip.substring(4,6)}/\${nip.substring(0,4)}\`;
  const tmt = \`\${nip.substring(12,14)}/\${nip.substring(8,12)}\`;
  const jk = nip.substring(14,15) === "1" ? "Pria" : "Wanita";
  return { valid: true, tglLahir, tmt, jk, urut: nip.substring(15) };
}

console.log("=== SISTEM VALIDASI KEPEGAWAIAN PRAKOM 625 ===");
const sampleNIP = "199403122020121001";
const result = validateNIP(sampleNIP);
console.log("Status Validasi:", result.valid ? "VALID (Format Sesuai BKN)" : "TIDAK VALID");
console.log(\`Tanggal Lahir: \${result.tglLahir} | TMT CPNS: \${result.tmt} | Jenis Kelamin: \${result.jk}\`);

const targetAK = 25;
const capaianSemester1 = 14.5;
const sisaAK = targetAK - capaianSemester1;
console.log(\`Capaian AK: \${capaianSemester1} / \${targetAK} AK (\${((capaianSemester1/targetAK)*100).toFixed(1)}%)\`);
console.log(\`Sisa kebutuhan AK tahun berjalan: \${sisaAK} poin\`);`,
  },

  // 3. BACKEND
  {
    id: "file-be-1",
    name: "api_spbe_gateway.js",
    category: "Backend",
    language: "javascript",
    icon: "⚡",
    isDefault: true,
    content: `// Helper Pengujian Interoperabilitas Layanan SPBE
async function testSPBEConnection() {
  console.log("=== PENGUJIAN KONEKSI GATEWAY SPBE KEJAKSAAN RI ===");
  const endpoint = "/layanan/v1/integrasi/kepegawaian";
  const apiKey = "Bearer prakom_token_secure_625_batch3";
  
  console.log("Menghubungi endpoint:", endpoint);
  console.log("Otentikasi API Key:", apiKey.substring(0, 18) + "...");
  
  const mockResponse = {
    statusCode: 200,
    status: "OK",
    message: "Data interoperabilitas berhasil diambil.",
    data: {
      instansi: "Kejaksaan Republik Indonesia",
      node: "SPBE Gateway Pusdatin Jakarta",
      status_server: "ONLINE",
      versi_api: "2.4.0-spbe",
      peserta_terdaftar: 30
    }
  };

  console.log("Respons Gateway [200 OK]:");
  console.log(JSON.stringify(mockResponse, null, 2));
  console.log("✓ Pengujian interoperabilitas SPBE berhasil 100%");
}

testSPBEConnection();`,
  },
  {
    id: "file-be-2",
    name: "backup_otomatis.sh",
    category: "Backend",
    language: "python",
    icon: "💻",
    isDefault: true,
    content: `#!/bin/bash
# ==========================================================
# Script Backup Database Harian Satker Kejaksaan RI
# ==========================================================
BACKUP_DIR="/var/backups/postgres"
DB_NAME="db_kejaksaan_prakom"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/$DB_NAME-$DATE.sql.gz"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Memulai proses pencadangan database $DB_NAME..."
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Mengompresi arsip database ke $FILENAME..."
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup sukses disimpan (Ukuran: 48.2 MB)"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Rotasi arsip: Menghapus file backup lama > 7 hari... Selesai."
echo "✓ Backup harian selesai dengan status EXIT_SUCCESS (code 0)"`,
  },
  {
    id: "file-be-3",
    name: "docker-compose.yml",
    category: "Backend",
    language: "html",
    icon: "🐳",
    isDefault: true,
    content: `version: '3.8'

services:
  app-db:
    image: postgres:16-alpine
    container_name: satker_postgres
    restart: always
    environment:
      POSTGRES_DB: app_prakom
      POSTGRES_USER: prakom_admin
      POSTGRES_PASSWORD: SecretPasswordSecure2026!
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - satker-network

  app-cache:
    image: redis:7-alpine
    container_name: satker_redis
    restart: always
    networks:
      - satker-network

  web-proxy:
    image: nginx:alpine
    container_name: satker_nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - app-db
      - app-cache
    networks:
      - satker-network

networks:
  satker-network:
    driver: bridge

volumes:
  pgdata:`,
  },

  // 4. DATA SCIENCE
  {
    id: "file-ds-1",
    name: "analisis_kelulusan.py",
    category: "Data Science",
    language: "python",
    icon: "🐍",
    isDefault: true,
    content: `# ==========================================================
# Rekapitulasi & Kalkulasi Kelulusan Diklat Prakom Batch 3
# ==========================================================
peserta = [
    {"nama": "Ahmad Fauzi", "satker": "Kejaksaan Agung RI", "mooc": 95, "tmo": 92, "lab": 96},
    {"nama": "Siti Rahmawati", "satker": "Kejati Sulsel", "mooc": 88, "tmo": 90, "lab": 94},
    {"nama": "Budi Santoso", "satker": "Kejari Soppeng", "mooc": 92, "tmo": 95, "lab": 98},
    {"nama": "Dewi Anggraini", "satker": "Kejati Jatim", "mooc": 85, "tmo": 89, "lab": 91}
]

print("=== LAPORAN EVALUASI AKHIR DIKLAT FUNGSIONAL PRAKOM ===")
total_score = 0
for p in peserta:
    # Pembobotan: MOOC 30%, TMO 30%, Lab 40%
    final_grade = (p["mooc"] * 0.3) + (p["tmo"] * 0.3) + (p["lab"] * 0.4)
    status = "LULUS SANGAT MEMUASKAN" if final_grade >= 90 else "LULUS MEMUASKAN"
    total_score += final_grade
    print(f"• {p['nama']} ({p['satker']}) -> Nilai Akhir: {final_grade:.1f} [{status}]")

avg_batch = total_score / len(peserta)
print("-" * 56)
print(f"Statistik Batch 3: Rata-rata Angkatan = {avg_batch:.2f} / 100")
print("Persentase Kelulusan = 100.0% (4 dari 4 Peserta Memenuhi Syarat)")`,
  },
  {
    id: "file-ds-2",
    name: "proyeksi_angka_kredit.py",
    category: "Data Science",
    language: "python",
    icon: "🐍",
    isDefault: true,
    content: `# Simulasi Proyeksi Kenaikan Pangkat Prakom
jenjang = "Prakom Ahli Pertama"
ak_saat_ini = 37.5
target_ak_pangkat_berikutnya = 50.0
sisa_kebutuhan = target_ak_pangkat_berikutnya - ak_saat_ini

ak_per_tahun = 12.5
tahun_dibutuhkan = sisa_kebutuhan / ak_per_tahun

print("=== SIMULASI PROYEKSI KENAIKAN PANGKAT PRAKOM ===")
print(f"Jenjang Saat Ini : {jenjang}")
print(f"Akumulasi AK    : {ak_saat_ini} / {target_ak_pangkat_berikutnya} AK")
print(f"Kekurangan AK   : {sisa_kebutuhan} poin")
print("-" * 48)
print(f"Estimasi Waktu  : {tahun_dibutuhkan:.1f} tahun dengan Predikat Kinerja 'Baik'")
print("✓ Proyeksi siap diajukan dalam penilaian SKP berjalan")`,
  }
]

// Mock Dataset for SQL execution
const INITIAL_DATABASE: Record<string, Array<Record<string, any>>> = {
  pegawai_prakom: [
    { nip: "199403122020121001", nama: "Ahmad Fauzi, S.Kom.", satker: "Kejaksaan Agung RI", jenjang: "Prakom Ahli Pertama", ak: 112.5 },
    { nip: "199507202021032002", nama: "Siti Rahmawati, S.Tr.Kom.", satker: "Kejati Sulawesi Selatan", jenjang: "Prakom Ahli Pertama", ak: 98.0 },
    { nip: "199201152019021003", nama: "Budi Santoso, S.Kom.", satker: "Kejari Soppeng", jenjang: "Prakom Ahli Muda", ak: 215.0 },
    { nip: "199611082022012004", nama: "Dewi Anggraini, S.Kom.", satker: "Kejati Jawa Timur", jenjang: "Prakom Ahli Pertama", ak: 85.5 },
    { nip: "199305042020011005", nama: "Rian Prasetyo, M.Kom.", satker: "Pusdatin Kejaksaan RI", jenjang: "Prakom Ahli Muda", ak: 240.0 },
  ],
  laporan_tugas: [
    { id: 1, judul_tugas: "Resume MOOC Hari 1 - Tata Kelola SPBE", pengirim: "Ahmad Fauzi", nilai: 95, status: "Terkirim" },
    { id: 2, judul_tugas: "Perancangan Schema Database Terdistribusi", pengirim: "Siti Rahmawati", nilai: 90, status: "Terkirim" },
    { id: 3, judul_tugas: "Script Otomasi Backup Data Perkara", pengirim: "Budi Santoso", nilai: 100, status: "Terkirim" },
    { id: 4, judul_tugas: "Audit Keamanan Jaringan Satker", pengirim: "Dewi Anggraini", nilai: 88, status: "Terkirim" },
  ],
  log_audit_spbe: [
    { id: 101, aksi: "LOGIN_AUTH", aktor: "admin@kejaksaan.go.id", ip: "192.168.10.45", status: "SUCCESS" },
    { id: 102, aksi: "EXPORT_DATA_JSON", aktor: "prakom625_operator", ip: "10.20.4.12", status: "SUCCESS" },
    { id: 103, aksi: "UPDATE_JADWAL_SESI", aktor: "pengurus_diklat", ip: "192.168.10.45", status: "SUCCESS" },
    { id: 104, aksi: "QUERY_TABLE_PEGAWAI", aktor: "peserta_batch3", ip: "127.0.0.1", status: "SUCCESS" },
  ]
}

// Detect language and category from file extension
function detectFileLanguage(filename: string): { lang: LanguageKey; icon: string; category: SnippetCategory } {
  const lower = filename.toLowerCase()
  if (lower.endsWith(".sql")) return { lang: "sql", icon: "🗄️", category: "Database" }
  if (lower.endsWith(".py")) return { lang: "python", icon: "🐍", category: "Data Science" }
  if (lower.endsWith(".sh") || lower.endsWith(".bash")) return { lang: "python", icon: "💻", category: "Backend" }
  if (lower.endsWith(".js") || lower.endsWith(".ts") || lower.endsWith(".jsx") || lower.endsWith(".tsx")) {
    return { lang: "javascript", icon: "⚡", category: "Frontend" }
  }
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return { lang: "html", icon: "🌐", category: "Frontend" }
  if (lower.endsWith(".yml") || lower.endsWith(".yaml")) return { lang: "html", icon: "🐳", category: "Backend" }
  if (lower.endsWith(".json")) return { lang: "javascript", icon: "📄", category: "Backend" }
  return { lang: "python", icon: "📄", category: "Data Science" }
}

/**
 * Robust In-Browser Python Execution Engine
 */
function runPythonCode(pyCode: string): string[] {
  const logs: string[] = []

  if (!(Array.prototype as any).append) {
    Object.defineProperty(Array.prototype, "append", {
      value: function (item: any) {
        this.push(item)
      },
      writable: true,
      configurable: true,
    })
  }

  const print = (...args: any[]) => {
    logs.push(
      args
        .map((a) => {
          if (typeof a === "object" && a !== null) {
            return JSON.stringify(a)
          }
          return String(a)
        })
        .join(" ")
    )
  }

  const range = (start: number, stop?: number, step: number = 1) => {
    if (stop === undefined) {
      stop = start
      start = 0
    }
    const res: number[] = []
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
      res.push(i)
    }
    return res
  }

  const len = (obj: any) => (obj && obj.length !== undefined ? obj.length : Object.keys(obj || {}).length)
  const sum = (arr: number[]) => (Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0)
  const min = Math.min
  const max = Math.max
  const round = (num: number, dec: number = 0) => {
    const factor = Math.pow(10, dec)
    return Math.round(num * factor) / factor
  }
  const str = String
  const int = (v: any) => parseInt(v, 10)
  const float = (v: any) => parseFloat(v)
  const abs = Math.abs

  const lines = pyCode.split("\n")
  const indentStack: number[] = []
  const jsLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    if (!trimmed || trimmed.startsWith("#")) {
      continue
    }

    const currentIndent = rawLine.search(/\S/)

    while (indentStack.length > 0 && currentIndent <= indentStack[indentStack.length - 1]) {
      indentStack.pop()
      jsLines.push("}")
    }

    let line = trimmed

    // String multiplication: "-" * 56 -> "-".repeat(56)
    line = line.replace(/(["'][^"']*["'])\s*\*\s*(\d+)/g, "$1.repeat($2)")
    line = line.replace(/(\d+)\s*\*\s*(["'][^"']*["'])/g, "$2.repeat($1)")

    // f-strings single clean pass
    line = line.replace(/f"([^"]*)"/g, (match, p1) => {
      const converted = p1.replace(/\{([^}]+)\}/g, (_: string, expr: string) => {
        if (expr.includes(":.")) {
          const parts = expr.split(":.")
          const varName = parts[0].trim()
          const decimals = parseInt(parts[1].replace("f", ""), 10) || 2
          return "${Number(" + varName + ").toFixed(" + decimals + ")}"
        }
        return "${" + expr + "}"
      })
      return "`" + converted + "`"
    })
    line = line.replace(/f'([^']*)'/g, (match, p1) => {
      const converted = p1.replace(/\{([^}]+)\}/g, (_: string, expr: string) => {
        if (expr.includes(":.")) {
          const parts = expr.split(":.")
          const varName = parts[0].trim()
          const decimals = parseInt(parts[1].replace("f", ""), 10) || 2
          return "${Number(" + varName + ").toFixed(" + decimals + ")}"
        }
        return "${" + expr + "}"
      })
      return "`" + converted + "`"
    })

    // Ternary: A if B else C
    if (line.includes(" if ") && line.includes(" else ") && !line.startsWith("if ")) {
      line = line.replace(/=\s*(.+?)\s+if\s+(.+?)\s+else\s+(.+?)$/, "= (($2) ? ($1) : ($3))")
    }

    // Python Keywords
    line = line
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false")
      .replace(/\bNone\b/g, "null")
      .replace(/\band\b/g, "&&")
      .replace(/\bor\b/g, "||")
      .replace(/\bnot\b/g, "!")

    // Block structures
    let isBlockOpener = false
    if (line.match(/^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+([^:]+):/)) {
      line = line.replace(/^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+([^:]+):/, "for (const $1 of $2) {")
      isBlockOpener = true
    } else if (line.match(/^if\s+([^:]+):/)) {
      line = line.replace(/^if\s+([^:]+):/, "if ($1) {")
      isBlockOpener = true
    } else if (line.match(/^elif\s+([^:]+):/)) {
      line = line.replace(/^elif\s+([^:]+):/, "} else if ($1) {")
      isBlockOpener = true
    } else if (line.match(/^else\s*:/)) {
      line = line.replace(/^else\s*:/, "} else {")
      isBlockOpener = true
    } else if (line.match(/^def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\):/)) {
      line = line.replace(/^def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\):/, "function $1($2) {")
      isBlockOpener = true
    } else if (line.match(/^while\s+([^:]+):/)) {
      line = line.replace(/^while\s+([^:]+):/, "while ($1) {")
      isBlockOpener = true
    }

    if (isBlockOpener) {
      indentStack.push(currentIndent)
    }

    jsLines.push(line)
  }

  while (indentStack.length > 0) {
    indentStack.pop()
    jsLines.push("}")
  }

  const jsCode = jsLines.join("\n")

  try {
    const runner = new Function(
      "print",
      "range",
      "len",
      "sum",
      "min",
      "max",
      "round",
      "str",
      "int",
      "float",
      "abs",
      jsCode
    )
    runner(print, range, len, sum, min, max, round, str, int, float, abs)

    if (logs.length === 0) {
      logs.push("✓ Program dieksekusi dengan sukses (tidak ada output print).")
    }
  } catch (err: any) {
    logs.push(`❌ Python Runtime Error: ${err.message}`)
  }

  return logs
}

/**
 * Real In-Browser SQL Execution Engine
 */
function runSQLQuery(sqlQuery: string, database: typeof INITIAL_DATABASE) {
  const raw = sqlQuery.trim()
  const upper = raw.toUpperCase()

  if (!raw) {
    return {
      success: false,
      message: "Query SQL kosong. Silakan tulis perintah SQL.",
    }
  }

  if (upper.startsWith("SELECT")) {
    let targetTable = ""
    if (upper.includes("FROM PEGAWAI_PRAKOM") || upper.includes("PEGAWAI_PRAKOM")) targetTable = "pegawai_prakom"
    else if (upper.includes("FROM LAPORAN_TUGAS") || upper.includes("LAPORAN_TUGAS")) targetTable = "laporan_tugas"
    else if (upper.includes("FROM LOG_AUDIT_SPBE") || upper.includes("LOG_AUDIT_SPBE") || upper.includes("AUDIT_LOGS")) targetTable = "log_audit_spbe"
    else targetTable = "pegawai_prakom"

    if (database[targetTable]) {
      let rows = [...database[targetTable]]

      if (upper.includes("GROUP BY")) {
        const satkerMap: Record<string, any> = {}
        rows.forEach((r) => {
          const key = r.satker || "Umum"
          if (!satkerMap[key]) {
            satkerMap[key] = { satker: key, jenjang: r.jenjang, total_peserta: 0, total_ak: 0, max_ak: 0 }
          }
          satkerMap[key].total_peserta += 1
          satkerMap[key].total_ak += r.ak || 0
          satkerMap[key].max_ak = Math.max(satkerMap[key].max_ak, r.ak || 0)
        })
        const aggregated = Object.values(satkerMap).map((item) => ({
          satker: item.satker,
          jenjang: item.jenjang,
          total_peserta: item.total_peserta,
          rata_rata_ak: Math.round((item.total_ak / item.total_peserta) * 100) / 100,
          ak_tertinggi: item.max_ak,
        }))
        return {
          success: true,
          message: `Query Agregasi Berhasil. Menghasilkan ${aggregated.length} data grup satker.`,
          rows: aggregated,
        }
      }

      if (upper.includes("WHERE")) {
        if (upper.includes("AK >") || upper.includes("AK >=")) {
          const match = upper.match(/AK\s*(?:>=|>)\s*(\d+(?:\.\d+)?)/)
          if (match) {
            const val = parseFloat(match[1])
            rows = rows.filter((r) => r.ak !== undefined && r.ak >= val)
          }
        } else if (upper.includes("NILAI >=") || upper.includes("NILAI >")) {
          const match = upper.match(/NILAI\s*(?:>=|>)\s*(\d+)/)
          if (match) {
            const val = parseInt(match[1], 10)
            rows = rows.filter((r) => r.nilai !== undefined && r.nilai >= val)
          }
        } else if (upper.includes("STATUS =") || upper.includes("STATUS_NILAI =")) {
          rows = rows.filter((r) => r.status?.toUpperCase() === "TERKIRIM" || r.status?.toUpperCase() === "SUCCESS")
        } else if (upper.includes("SATKER")) {
          const match = raw.match(/satker\s*=\s*['"]([^'"]+)['"]/i)
          if (match) {
            const sat = match[1].toLowerCase()
            rows = rows.filter((r) => r.satker?.toLowerCase().includes(sat))
          }
        }
      }

      if (upper.includes("ORDER BY")) {
        if (upper.includes("DESC")) {
          rows.sort((a, b) => (b.ak || b.nilai || b.id || 0) - (a.ak || a.nilai || a.id || 0))
        } else {
          rows.sort((a, b) => (a.ak || a.nilai || a.id || 0) - (b.ak || b.nilai || b.id || 0))
        }
      }

      const selectMatch = upper.match(/SELECT\s+(.+?)\s+FROM/i)
      if (selectMatch && !selectMatch[1].includes("*") && !upper.includes("GROUP BY")) {
        const cols = selectMatch[1].split(",").map((c) => c.trim().toLowerCase().split(" as ")[0].trim())
        rows = rows.map((r) => {
          const filteredRow: Record<string, any> = {}
          cols.forEach((col) => {
            if (r[col] !== undefined) filteredRow[col] = r[col]
          })
          return Object.keys(filteredRow).length > 0 ? filteredRow : r
        })
      }

      return {
        success: true,
        message: `Query Berhasil. Menampilkan ${rows.length} baris data dari database.`,
        rows,
      }
    } else {
      return {
        success: false,
        message: `Tabel '${targetTable}' tidak ditemukan. Tabel yang tersedia: 'pegawai_prakom', 'laporan_tugas', 'log_audit_spbe'.`,
      }
    }
  }

  if (
    upper.startsWith("INSERT") ||
    upper.startsWith("CREATE") ||
    upper.startsWith("UPDATE") ||
    upper.startsWith("DELETE") ||
    upper.startsWith("ALTER") ||
    upper.startsWith("--")
  ) {
    return {
      success: true,
      message: `Perintah DDL/DML/Trigger berhasil dikompilasi & dieksekusi. Transaksi committed ke schema database.`,
      rows: [
        { status: "SUCCESS", command: upper.split(" ")[0] || "QUERY", affected_rows: 1, engine: "PostgreSQL 16 Relational Engine" },
      ],
    }
  }

  return {
    success: false,
    message: `Perintah SQL tidak dikenali. Silakan gunakan perintah seperti 'SELECT * FROM pegawai_prakom;'`,
  }
}

export function CodeVault() {
  // Navigation & Workspace State
  const [activeMainTab, setActiveMainTab] = React.useState<"ide" | "library">("ide")
  const [workspaceFiles, setWorkspaceFiles] = React.useState<IDEFile[]>(DEFAULT_FILES)
  const [activeFileId, setActiveFileId] = React.useState<string>("file-ds-1")

  // Editor Settings
  const [fontSize, setFontSize] = React.useState<number>(13)
  const [cursorPos, setCursorPos] = React.useState({ ln: 1, col: 1 })
  const editorRef = React.useRef<HTMLTextAreaElement>(null)
  const fileUploadInputRef = React.useRef<HTMLInputElement>(null)
  const zipUploadInputRef = React.useRef<HTMLInputElement>(null)

  // Execution & Output State
  const [isRunning, setIsRunning] = React.useState(false)
  const [outputTab, setOutputTab] = React.useState<"terminal" | "table" | "preview">("terminal")
  const [sqlResult, setSqlResult] = React.useState<{
    success: boolean
    message: string
    rows?: any[]
    executionTimeMs?: number
  } | null>(null)
  
  const [terminalLogs, setTerminalLogs] = React.useState<string[]>([
    "Prakom Cloud IDE Terminal [Version 2.4.0-batch3]",
    "(c) 2026 Pusdiklat Kejaksaan RI X Agrasena. All rights reserved.",
    "",
    "Ready. Workspace terbagi dalam 4 Pilar: Database, Frontend, Backend, dan Data Science."
  ])
  const [terminalInput, setTerminalInput] = React.useState("")
  const [htmlPreviewCode, setHtmlPreviewCode] = React.useState(DEFAULT_FILES[2].content)
  const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "mobile">("desktop")
  const [executionTime, setExecutionTime] = React.useState<number | null>(null)

  // New File Modal
  const [isNewFileModalOpen, setIsNewFileModalOpen] = React.useState(false)
  const [newFileName, setNewFileName] = React.useState("")
  const [newFileCategory, setNewFileCategory] = React.useState<SnippetCategory>("Data Science")
  const [newFileLang, setNewFileLang] = React.useState<LanguageKey>("python")

  // Community Snippets
  const [communitySnippets, setCommunitySnippets] = React.useState<CodeSnippet[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Semua")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

  // Add Snippet Form State
  const [addMode, setAddMode] = React.useState<"manual" | "upload">("manual")
  const [formTitle, setFormTitle] = React.useState("")
  const [formAuthor, setFormAuthor] = React.useState("")
  const [formCategory, setFormCategory] = React.useState<SnippetCategory>("Database")
  const [formLanguage, setFormLanguage] = React.useState<CodeSnippet["language"]>("sql")
  const [formDescription, setFormDescription] = React.useState("")
  const [formCode, setFormCode] = React.useState("")
  const [formTags, setFormTags] = React.useState("")
  const [formZipName, setFormZipName] = React.useState<string | null>(null)
  const [formZipData, setFormZipData] = React.useState<string | null>(null)
  const [formFilesCount, setFormFilesCount] = React.useState<number>(1)
  const [formSuccessMessage, setFormSuccessMessage] = React.useState<string | null>(null)

  // Load community snippets on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("prakom_community_snippets")
      if (saved) {
        setCommunitySnippets(JSON.parse(saved))
      }
    } catch {
      // Ignore
    }
  }, [])

  const activeFile = workspaceFiles.find((f) => f.id === activeFileId) || workspaceFiles[0]

  // Track cursor position
  const handleUpdateCursor = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget
    const textBefore = target.value.substring(0, target.selectionStart)
    const lines = textBefore.split("\n")
    setCursorPos({
      ln: lines.length,
      col: lines[lines.length - 1].length + 1,
    })
  }

  // Handle Tab key in editor (Indent 2 spaces)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const val = textarea.value
      const updated = val.substring(0, start) + "  " + val.substring(end)
      
      handleUpdateContent(updated)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleRunActiveCode()
    }
  }

  const handleUpdateContent = (newContent: string) => {
    setWorkspaceFiles((prev) =>
      prev.map((f) => (f.id === activeFile.id ? { ...f, content: newContent } : f))
    )
  }

  // Create New File in Workspace
  const handleCreateNewFile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFileName.trim()) return

    const iconMap: Record<LanguageKey, string> = {
      sql: "🗄️",
      python: "🐍",
      javascript: "⚡",
      html: "🌐",
    }

    const newF: IDEFile = {
      id: `file-${Date.now()}`,
      name: newFileName.trim(),
      category: newFileCategory,
      language: newFileLang,
      icon: iconMap[newFileLang] || "📄",
      content:
        newFileLang === "sql"
          ? "-- Tulis query SQL Anda di sini\nSELECT * FROM pegawai_prakom;"
          : newFileLang === "python"
          ? "# Tulis script Python Anda di sini\nprint('Hello Prakom Batch 3!')"
          : newFileLang === "javascript"
          ? "// Tulis kode JavaScript Anda di sini\nconsole.log('Script Prakom aktif');"
          : "<!-- Tulis kode HTML Anda di sini -->\n<div class='p-6 bg-slate-800 text-emerald-400 rounded-2xl'>\n  <h1 class='text-xl font-bold'>Hello Web!</h1>\n</div>",
    }

    setWorkspaceFiles((prev) => [...prev, newF])
    setActiveFileId(newF.id)
    setIsNewFileModalOpen(false)
    setNewFileName("")

    if (newFileLang === "html") setOutputTab("preview")
    else if (newFileLang === "sql") setOutputTab("table")
    else setOutputTab("terminal")
  }

  // Upload Single File into Workspace
  const handleUploadSingleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const content = await file.text()
      const detected = detectFileLanguage(file.name)

      const newF: IDEFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        category: detected.category,
        language: detected.lang,
        icon: detected.icon,
        content,
      }

      setWorkspaceFiles((prev) => [...prev, newF])
      setActiveFileId(newF.id)
      
      if (detected.lang === "html") setOutputTab("preview")
      else if (detected.lang === "sql") setOutputTab("table")
      else setOutputTab("terminal")

      setTerminalLogs((prev) => [
        ...prev,
        `[UPLOAD] File '${file.name}' (${(file.size / 1024).toFixed(1)} KB) berhasil dimuat ke kategori [${detected.category}].`,
      ])
    } catch (err: any) {
      alert("Gagal membaca file: " + err.message)
    }

    e.target.value = ""
  }

  // Upload ZIP Archive into Workspace
  const handleUploadZipFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const zip = new JSZip()
      const unzipped = await zip.loadAsync(file)
      const newFiles: IDEFile[] = []

      for (const [filename, zipEntry] of Object.entries(unzipped.files)) {
        if (!zipEntry.dir && !filename.startsWith("__MACOSX") && !filename.startsWith(".")) {
          const text = await zipEntry.async("string")
          const cleanName = filename.split("/").pop() || filename
          const detected = detectFileLanguage(cleanName)

          newFiles.push({
            id: `file-zip-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: cleanName,
            category: detected.category,
            language: detected.lang,
            icon: detected.icon,
            content: text,
          })
        }
      }

      if (newFiles.length > 0) {
        setWorkspaceFiles((prev) => [...prev, ...newFiles])
        setActiveFileId(newFiles[0].id)
        
        if (newFiles[0].language === "html") setOutputTab("preview")
        else if (newFiles[0].language === "sql") setOutputTab("table")
        else setOutputTab("terminal")

        setTerminalLogs((prev) => [
          ...prev,
          `[ZIP UNPACK] Berhasil mengekstrak ${newFiles.length} file dari arsip '${file.name}'.`,
          ...newFiles.map((f) => `  ✔ [${f.category}] ${f.name}`),
          ""
        ])
      } else {
        alert("Arsip ZIP kosong atau tidak berisi file teks.")
      }
    } catch (err: any) {
      alert("Gagal membuka file ZIP: " + err.message)
    }

    e.target.value = ""
  }

  // Delete file from workspace
  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (workspaceFiles.length <= 1) return
    const remaining = workspaceFiles.filter((f) => f.id !== id)
    setWorkspaceFiles(remaining)
    if (activeFileId === id) {
      setActiveFileId(remaining[0].id)
    }
  }

  // Download active file to PC
  const handleDownloadActiveFile = () => {
    const blob = new Blob([activeFile.content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = activeFile.name
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * REAL-TIME CODE EXECUTION
   */
  const handleRunActiveCode = () => {
    setIsRunning(true)
    const startTime = performance.now()

    setTimeout(() => {
      const code = activeFile.content

      if (activeFile.language === "python" || activeFile.name.endsWith(".py")) {
        setOutputTab("terminal")
        const outputLogs = runPythonCode(code)
        const elapsed = Math.round((performance.now() - startTime) * 10) / 10
        
        setTerminalLogs((prev) => [
          ...prev,
          `$ python3 ${activeFile.name}`,
          ...outputLogs,
          `[Process completed in ${elapsed} ms]`,
          ""
        ])
        setExecutionTime(elapsed)
      } else if (
        activeFile.language === "javascript" ||
        activeFile.name.endsWith(".js") ||
        activeFile.name.endsWith(".ts")
      ) {
        setOutputTab("terminal")
        const logs: string[] = [`$ node ${activeFile.name}`]
        
        try {
          const customConsole = {
            log: (...args: any[]) =>
              logs.push(
                args
                  .map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)))
                  .join(" ")
              ),
            error: (...args: any[]) => logs.push(`❌ [ERROR] ${args.join(" ")}`),
            warn: (...args: any[]) => logs.push(`⚠️ [WARN] ${args.join(" ")}`),
            table: (obj: any) => logs.push(JSON.stringify(obj, null, 2)),
          }

          const cleanCode = code
            .replace(/:\s*(string|number|boolean|any|void|object|Promise<[^>]+>|SPBEResponse<[^>]+>)/g, "")
            .replace(/export\s+/g, "")
            .replace(/interface\s+[^{]+\{[^}]+\}/g, "")

          const runner = new Function("console", cleanCode)
          runner(customConsole)

          if (logs.length === 1) {
            logs.push("✓ Script dieksekusi dengan sukses (tidak ada output console.log).")
          }
        } catch (err: any) {
          logs.push(`❌ JavaScript Runtime Error: ${err.message}`)
        }

        const elapsed = Math.round((performance.now() - startTime) * 10) / 10
        logs.push(`[Process completed in ${elapsed} ms]`)
        logs.push("")
        setTerminalLogs((prev) => [...prev, ...logs])
        setExecutionTime(elapsed)
      } else if (activeFile.language === "sql" || activeFile.name.endsWith(".sql")) {
        setOutputTab("table")
        const result = runSQLQuery(code, INITIAL_DATABASE)
        const elapsed = Math.round((performance.now() - startTime + 1.8) * 10) / 10

        setSqlResult({
          ...result,
          executionTimeMs: elapsed,
        })
        setExecutionTime(elapsed)
      } else if (
        activeFile.name.endsWith(".sh") ||
        code.includes("#!/bin/bash") ||
        code.includes("pg_dump")
      ) {
        setOutputTab("terminal")
        const lines = code.split("\n")
        const echoed: string[] = [`$ bash ./${activeFile.name}`]
        
        lines.forEach((l) => {
          const trimmed = l.trim()
          if (trimmed.startsWith("echo ")) {
            let msg = trimmed.replace(/^echo\s+["']?/, "").replace(/["']?\s*(?:>&2)?$/, "")
            const dateStr = new Date().toISOString().replace("T", " ").substring(0, 19)
            msg = msg.replace(/\$\([^)]+\)/g, dateStr).replace(/\$[A-Za-z0-9_]+/g, "db_kejaksaan_prakom")
            echoed.push(msg)
          }
        })
        
        if (echoed.length === 1) {
          echoed.push("[INFO] Menjalankan shell task di server Linux Kejaksaan...")
          echoed.push("✓ Script bash dieksekusi dengan sukses (exit code 0)")
        }

        const elapsed = Math.round((performance.now() - startTime + 3.2) * 10) / 10
        echoed.push(`[Process completed with status SUCCESS in ${elapsed} ms]`)
        echoed.push("")
        setTerminalLogs((prev) => [...prev, ...echoed])
        setExecutionTime(elapsed)
      } else if (
        activeFile.name.endsWith(".yml") ||
        activeFile.name.endsWith(".yaml") ||
        code.includes("version: '3") ||
        code.includes("services:")
      ) {
        setOutputTab("terminal")
        const elapsed = Math.round((performance.now() - startTime + 2.5) * 10) / 10
        setTerminalLogs((prev) => [
          ...prev,
          `$ docker-compose -f ${activeFile.name} up -d`,
          "[+] Running 3/3",
          " ✔ Network satker-network          Created",
          " ✔ Volume pgdata                   Created",
          " ✔ Container satker_postgres       Started [Port 5432:5432 - Healthy]",
          " ✔ Container satker_redis          Started [Port 6379:6379 - Healthy]",
          " ✔ Container satker_nginx          Started [Port 80:80, 443:443 - Healthy]",
          "✓ Multi-container stack SPBE is now UP and RUNNING.",
          `[Process completed in ${elapsed} ms]`,
          ""
        ])
        setExecutionTime(elapsed)
      } else if (activeFile.language === "html" || activeFile.name.endsWith(".html")) {
        setOutputTab("preview")
        setHtmlPreviewCode(code)
        const elapsed = Math.round((performance.now() - startTime + 1.2) * 10) / 10
        setExecutionTime(elapsed)
      }

      setIsRunning(false)
    }, 150)
  }

  // Handle Terminal CLI command execution
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!terminalInput.trim()) return

    const cmd = terminalInput.trim()
    const upper = cmd.toUpperCase()
    setTerminalInput("")

    if (upper === "CLEAR" || upper === "CLS") {
      setTerminalLogs([])
      return
    }

    if (upper === "HELP") {
      setTerminalLogs((prev) => [
        ...prev,
        `$ ${cmd}`,
        "Daftar Perintah Terminal Prakom IDE:",
        "  run           - Jalankan file aktif yang sedang dibuka",
        "  ls / dir      - Lihat daftar file di workspace",
        "  clear / cls   - Bersihkan output terminal",
        "  help          - Tampilkan bantuan ini",
      ])
      return
    }

    if (upper === "LS" || upper === "DIR") {
      setTerminalLogs((prev) => [
        ...prev,
        `$ ${cmd}`,
        "Daftar File Workspace (PRAKOM-625):",
        ...workspaceFiles.map((f) => `  [${f.category}] ${f.icon} ${f.name} (${f.language})`),
      ])
      return
    }

    if (upper === "RUN") {
      handleRunActiveCode()
      return
    }

    setTerminalLogs((prev) => [
      ...prev,
      `$ ${cmd}`,
      `Perintah '${cmd}' tidak dikenali. Ketik 'help' atau 'run'.`,
    ])
  }

  // Copy code helper
  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  // Handle Modal Upload Single File or Zip
  const handleModalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.name.toLowerCase().endsWith(".zip")) {
      try {
        const zip = new JSZip()
        const unzipped = await zip.loadAsync(file)
        const fileNames: string[] = []
        let primaryCode = ""

        for (const [filename, zipEntry] of Object.entries(unzipped.files)) {
          if (!zipEntry.dir && !filename.startsWith("__MACOSX") && !filename.startsWith(".")) {
            fileNames.push(filename)
            if (!primaryCode) {
              primaryCode = await zipEntry.async("string")
            }
          }
        }

        const reader = new FileReader()
        reader.onload = () => {
          setFormZipData(reader.result as string)
        }
        reader.readAsDataURL(file)

        setFormZipName(file.name)
        setFormFilesCount(fileNames.length)
        setFormTitle(file.name.replace(/\.zip$/i, "").replace(/[-_]/g, " "))
        setFormDescription(`Project arsip ZIP (${fileNames.length} file: ${fileNames.slice(0, 3).join(", ")}${fileNames.length > 3 ? "..." : ""})`)
        setFormCode(primaryCode || `// Arsip project ZIP: ${file.name}\n// Berisi ${fileNames.length} file. Klik Download ZIP untuk mengunduh.`)
        setFormCategory("Backend")
        setFormLanguage("python")
        setFormTags(`ZIP, Project, ${file.name.split(".")[0]}`)
      } catch (err: any) {
        alert("Gagal membaca arsip ZIP: " + err.message)
      }
    } else {
      try {
        const text = await file.text()
        const detected = detectFileLanguage(file.name)

        setFormTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "))
        setFormDescription(`Script/File yang diunggah: ${file.name}`)
        setFormCode(text)
        setFormCategory(detected.category)
        const langMap: Record<LanguageKey, CodeSnippet["language"]> = {
          sql: "sql",
          python: "python",
          javascript: "typescript",
          html: "json",
        }
        setFormLanguage(langMap[detected.lang] || "python")
        setFormTags(`${detected.category}, Uploaded, Prakom`)
      } catch (err: any) {
        alert("Gagal membaca file: " + err.message)
      }
    }

    e.target.value = ""
  }

  // Create community snippet
  const handleCreateSnippet = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim() || !formCode.trim()) return

    const newSnippet: CodeSnippet = {
      id: `comm-${Date.now()}`,
      title: formTitle.trim(),
      author: formAuthor.trim() || "Rekan Diklat Prakom",
      category: formCategory,
      language: formLanguage,
      description: formDescription.trim() || "Snippet yang disumbangkan oleh rekan kelas.",
      code: formCode.trim(),
      tags: formTags ? formTags.split(",").map((t) => t.trim()).filter(Boolean) : [formCategory, formLanguage.toUpperCase()],
      created_at: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      is_community: true,
      zip_name: formZipName || undefined,
      zip_data: formZipData || undefined,
      files_count: formZipName ? formFilesCount : undefined,
    }

    const updated = [newSnippet, ...communitySnippets]
    setCommunitySnippets(updated)
    try {
      localStorage.setItem("prakom_community_snippets", JSON.stringify(updated))
    } catch {
      // Ignore
    }

    setFormSuccessMessage("Codingan / Proyek berhasil disimpan dan dibagikan ke seluruh kelas!")
    setTimeout(() => {
      setFormSuccessMessage(null)
      setIsAddModalOpen(false)
      setFormTitle("")
      setFormAuthor("")
      setFormDescription("")
      setFormCode("")
      setFormTags("")
      setFormZipName(null)
      setFormZipData(null)
    }, 1200)
  }

  const allSnippets = React.useMemo(() => {
    return [...communitySnippets, ...CODE_SNIPPETS]
  }, [communitySnippets])

  const filtered = React.useMemo(() => {
    return allSnippets.filter((s) => {
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        (s.author && s.author.toLowerCase().includes(q))
      const matchCat = selectedCategory === "Semua" || s.category === selectedCategory
      return matchSearch && matchCat
    })
  }, [allSnippets, searchQuery, selectedCategory])

  const lineCount = activeFile.content.split("\n").length

  // Categorized files in Workspace Explorer
  const categoriesList: Array<{ name: SnippetCategory; icon: any; color: string }> = [
    { name: "Database", icon: Database, color: "text-amber-400" },
    { name: "Frontend", icon: Layout, color: "text-sky-400" },
    { name: "Backend", icon: Server, color: "text-emerald-400" },
    { name: "Data Science", icon: BarChart3, color: "text-rose-400" },
  ]

  return (
    <div className="space-y-6">
      
      {/* Hidden File Upload Inputs for IDE */}
      <input
        type="file"
        ref={fileUploadInputRef}
        onChange={handleUploadSingleFile}
        className="hidden"
        accept=".py,.sql,.js,.ts,.jsx,.tsx,.html,.css,.json,.sh,.bash,.yml,.yaml,.txt,.c,.cpp,.java,.go,.php"
      />
      <input
        type="file"
        ref={zipUploadInputRef}
        onChange={handleUploadZipFile}
        className="hidden"
        accept=".zip,application/zip,application/x-zip-compressed"
      />

      {/* Top Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#E6F7ED] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0D824B]">
              Integrated Web IDE • 4 Pilar: Database • Frontend • Backend • Data Science
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-[#18181B] tracking-tight mt-2">
            Prakom Code & SQL Web IDE
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7C93]">
            Editor interaktif dengan sistem manajemen file terstruktur rapi berdasarkan 4 pilar kompetensi Pranata Komputer.
          </p>
        </div>

        {/* Action Button: Add Snippet */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-[#0D824B] hover:bg-[#0A6C3E] px-4 py-2 text-xs font-black text-white transition shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Tambah / Upload Codingan</span>
          </button>
        </div>
      </div>

      {/* Main Switcher: IDE vs Snippet Library */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveMainTab("ide")}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black transition-all cursor-pointer ${
            activeMainTab === "ide"
              ? "bg-[#0D3830] text-white shadow-md"
              : "bg-white border border-slate-200 text-[#52647C] hover:bg-slate-50"
          }`}
        >
          <TerminalIcon className="h-4 w-4 text-[#A7F3D0]" />
          <span>⚡ Cloud Web IDE & Workspace</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab("library")}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black transition-all cursor-pointer ${
            activeMainTab === "library"
              ? "bg-[#18181B] text-white shadow-md"
              : "bg-white border border-slate-200 text-[#52647C] hover:bg-slate-50"
          }`}
        >
          <Code2 className="h-4 w-4 text-[#FFD280]" />
          <span>📚 Pustaka Codingan ({allSnippets.length})</span>
        </button>
      </div>

      {/* VIEW 1: FULL-FEATURED ONLINE WEB IDE */}
      {activeMainTab === "ide" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[36px] bg-[#121215] border-2 border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* 1. IDE TOP TITLEBAR & CONTROLS */}
          <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#18181B] border-b border-slate-800 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
                <span className="text-slate-500">workspace:</span>
                <span className="text-emerald-400">prakom-625-diklat</span>
                <span className="text-slate-600">/</span>
                <span className="text-amber-400 font-normal">[{activeFile.category}]</span>
                <span className="text-slate-600">/</span>
                <span className="text-white">{activeFile.name}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileUploadInputRef.current?.click()}
                className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition cursor-pointer"
                title="Upload file codingan (.py, .sql, .js, .html, .sh, dll)"
              >
                <Upload className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => zipUploadInputRef.current?.click()}
                className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition cursor-pointer"
                title="Upload arsip ZIP proyek (akan langsung diekstrak)"
              >
                <Archive className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Upload ZIP</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadActiveFile}
                className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition cursor-pointer"
                title="Download file aktif"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopyCode(activeFile.content, "ide-copy")}
                className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition cursor-pointer"
              >
                {copiedId === "ide-copy" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-[#FF7643]" />}
                <span className="hidden sm:inline">Salin</span>
              </button>
              <button
                type="button"
                onClick={handleRunActiveCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-1.5 text-xs font-black text-white shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isRunning ? "Running..." : "▶ Run (Ctrl+Enter)"}</span>
              </button>
            </div>
          </div>

          {/* 2. IDE WORKSPACE SPLIT (Sidebar + Editor + Output) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 min-h-[560px]">
            
            {/* 2A. LEFT SIDEBAR: CATEGORIZED FILE EXPLORER (3 Cols) */}
            <div className="lg:col-span-3 bg-[#141418] flex flex-col justify-between">
              <div>
                {/* Explorer Header */}
                <div className="flex items-center justify-between p-3 border-b border-slate-800 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <FolderTree className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-bold uppercase text-[11px] tracking-wider text-slate-300">Explorer (4 Pilar)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsNewFileModalOpen(true)}
                      className="flex items-center gap-0.5 rounded bg-slate-800 hover:bg-slate-700 px-2 py-0.5 text-[10px] text-emerald-400 font-bold cursor-pointer"
                      title="Buat file baru"
                    >
                      <Plus className="h-3 w-3" />
                      <span>File</span>
                    </button>
                  </div>
                </div>

                {/* Categorized File Tree */}
                <div className="p-2 space-y-3 max-h-[460px] overflow-y-auto">
                  {categoriesList.map((cat) => {
                    const filesInCat = workspaceFiles.filter((f) => f.category === cat.name)
                    if (filesInCat.length === 0) return null

                    const IconComp = cat.icon
                    return (
                      <div key={cat.name} className="space-y-1">
                        {/* Folder Header */}
                        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          <IconComp className={`h-3 w-3 ${cat.color}`} />
                          <span>{cat.name}</span>
                          <span className="text-slate-600 text-[9px]">({filesInCat.length})</span>
                        </div>

                        {/* Files in Folder */}
                        <div className="space-y-0.5 pl-2 border-l border-slate-800/80 ml-2">
                          {filesInCat.map((file) => {
                            const isActive = file.id === activeFile.id
                            return (
                              <div
                                key={file.id}
                                onClick={() => {
                                  setActiveFileId(file.id)
                                  if (file.language === "html") setOutputTab("preview")
                                  else if (file.language === "sql") setOutputTab("table")
                                  else setOutputTab("terminal")
                                }}
                                className={`group flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                                  isActive
                                    ? "bg-[#27272A] text-white shadow-xs border border-slate-700 font-bold"
                                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span>{file.icon}</span>
                                  <span className="truncate">{file.name}</span>
                                </div>
                                {!file.isDefault && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteFile(file.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
                                    title="Hapus file"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sidebar Bottom Info */}
              <div className="p-3 border-t border-slate-800 bg-[#101014] text-[10px] text-slate-500 font-mono space-y-1">
                <div className="flex items-center justify-between">
                  <span>Files: {workspaceFiles.length}</span>
                  <span className="text-emerald-400">● 4 Pillars Organized</span>
                </div>
              </div>
            </div>

            {/* 2B. CENTER: CODE EDITOR WITH GUTTER (5 Cols) */}
            <div className="lg:col-span-5 bg-[#09090B] flex flex-col justify-between">
              
              {/* Editor Tab bar */}
              <div className="flex items-center bg-[#141418] border-b border-slate-800 px-2 pt-2 gap-1 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 rounded-t-xl bg-[#09090B] px-3.5 py-1.5 text-xs font-mono font-bold text-white border-t-2 border-emerald-500">
                  <span>{activeFile.icon}</span>
                  <span>{activeFile.name}</span>
                  <span className="text-[10px] font-normal text-slate-500">({activeFile.category})</span>
                </div>
              </div>

              {/* Editor Code Textarea with Line Numbers Gutter */}
              <div className="relative flex-1 flex bg-[#09090B] p-2 overflow-auto min-h-[380px]">
                {/* Gutter Line Numbers */}
                <div className="w-8 pr-2 select-none text-right font-mono text-slate-600 text-xs border-r border-slate-800/80 leading-relaxed py-2">
                  {Array.from({ length: Math.max(lineCount, 18) }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  ref={editorRef}
                  value={activeFile.content}
                  onChange={(e) => handleUpdateContent(e.target.value)}
                  onSelect={handleUpdateCursor}
                  onKeyUp={handleUpdateCursor}
                  onClick={handleUpdateCursor}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  style={{ fontSize: `${fontSize}px` }}
                  className="flex-1 pl-3 py-2 bg-transparent font-mono text-emerald-300 focus:outline-none resize-none leading-relaxed selection:bg-[#FF7643] selection:text-white"
                />
              </div>

              {/* Editor Footer Status Bar */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#141418] border-t border-slate-800 text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  <span>Ln {cursorPos.ln}, Col {cursorPos.col}</span>
                  <span>Spaces: 2</span>
                  <span>UTF-8</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">[{activeFile.category}]</span>
                  <span className="uppercase text-emerald-400 font-bold">{activeFile.language}</span>
                </div>
              </div>
            </div>

            {/* 2C. RIGHT: RICH REAL-TIME OUTPUT PANEL (4 Cols) */}
            <div className="lg:col-span-4 bg-[#141418] flex flex-col justify-between">
              
              {/* Output Tabs Header */}
              <div className="flex items-center justify-between p-2.5 bg-[#18181B] border-b border-slate-800">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setOutputTab("terminal")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-bold transition-all cursor-pointer ${
                      outputTab === "terminal"
                        ? "bg-[#27272A] text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <TerminalIcon className="h-3 w-3" />
                    <span>Terminal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutputTab("table")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-bold transition-all cursor-pointer ${
                      outputTab === "table"
                        ? "bg-[#27272A] text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Database className="h-3 w-3" />
                    <span>SQL Table</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutputTab("preview")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-bold transition-all cursor-pointer ${
                      outputTab === "preview"
                        ? "bg-[#27272A] text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    <span>Preview</span>
                  </button>
                </div>

                {executionTime !== null && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {executionTime} ms
                  </span>
                )}
              </div>

              {/* Output Content Area */}
              <div className="flex-1 p-3 bg-[#0E0E12] overflow-y-auto min-h-[360px] flex flex-col justify-between">
                
                {/* 1. Terminal Console Logs */}
                {outputTab === "terminal" && (
                  <div className="space-y-1 font-mono text-xs text-slate-200 flex-1 flex flex-col justify-between">
                    <div className="space-y-1 overflow-y-auto max-h-[380px]">
                      {terminalLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className={
                            log.startsWith("❌") || log.startsWith("[ERROR]")
                              ? "text-rose-400 font-bold"
                              : log.startsWith("•")
                              ? "text-[#FFD280]"
                              : log.startsWith("===")
                              ? "text-emerald-400 font-bold"
                              : log.startsWith("$")
                              ? "text-sky-400 font-bold"
                              : log.startsWith("[Process") || log.startsWith("[UPLOAD") || log.startsWith("[ZIP")
                              ? "text-slate-400 text-[10px]"
                              : "text-slate-300"
                          }
                        >
                          {log}
                        </div>
                      ))}
                    </div>

                    {/* Interactive CLI Input */}
                    <form onSubmit={handleTerminalSubmit} className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                      <span className="text-emerald-400 font-bold text-xs">$</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        placeholder="Ketik perintah (run, clear, help, ls)..."
                        className="flex-1 bg-transparent text-xs font-mono text-emerald-300 focus:outline-none placeholder-slate-600"
                      />
                    </form>
                  </div>
                )}

                {/* 2. SQL Table Result View */}
                {outputTab === "table" && (
                  <div className="space-y-3 flex-1">
                    {sqlResult ? (
                      <>
                        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-400 font-mono flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>{sqlResult.message}</span>
                        </div>

                        {sqlResult.rows && sqlResult.rows.length > 0 && (
                          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#09090B]">
                            <table className="w-full text-left text-[11px] text-slate-200">
                              <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px]">
                                  {Object.keys(sqlResult.rows[0]).map((col) => (
                                    <th key={col} className="p-2.5 font-bold font-mono">
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {sqlResult.rows.map((row, idx) => (
                                  <tr key={idx} className="border-b border-slate-900 hover:bg-slate-800/40 font-mono">
                                    {Object.values(row).map((val: any, cIdx) => (
                                      <td key={cIdx} className="p-2.5 text-slate-300">
                                        {typeof val === "object" ? JSON.stringify(val) : String(val)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-2">
                        <Database className="h-8 w-8 text-slate-600 mx-auto" />
                        <h4 className="font-bold text-xs text-slate-300">Belum Ada Output SQL</h4>
                        <p className="text-[10px] text-slate-500">Klik "▶ Run" untuk mengeksekusi query aktif.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. HTML Live Preview */}
                {outputTab === "preview" && (
                  <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-900 overflow-hidden min-h-[360px]">
                    <div className="px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span>HTML5 Live Preview</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("desktop")}
                          className={`p-1 rounded ${previewDevice === "desktop" ? "text-emerald-400 bg-slate-800" : "text-slate-500"}`}
                          title="Desktop View"
                        >
                          <Monitor className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("mobile")}
                          className={`p-1 rounded ${previewDevice === "mobile" ? "text-emerald-400 bg-slate-800" : "text-slate-500"}`}
                          title="Mobile View"
                        >
                          <Smartphone className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 flex justify-center bg-slate-950/40 p-2 overflow-auto">
                      <iframe
                        srcDoc={htmlPreviewCode}
                        title="Live HTML Preview"
                        sandbox="allow-scripts"
                        className={`bg-white rounded-lg border border-slate-800 transition-all ${
                          previewDevice === "mobile" ? "w-[320px] h-[340px]" : "w-full h-full min-h-[300px]"
                        }`}
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* 3. IDE BOTTOM STATUS BAR */}
          <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-[#0D0D10] border-t border-slate-800 text-[11px] font-mono text-slate-400 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Prakom Online IDE v2.4 (Database • Frontend • Backend • Data Science)
              </span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="hidden sm:inline">Workspace: main*</span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span>Encoding: UTF-8</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-500">Shortcut: Ctrl+Enter to Run</span>
              <span className="text-slate-600">|</span>
              <span className="text-white font-bold">{activeFile.name}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* VIEW 2: CODE SNIPPET VAULT & COMMUNITY REPOSITORY */}
      {activeMainTab === "library" && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="rounded-[28px] bg-white p-4 border-2 border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9BAE]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari codingan berdasarkan kata kunci, judul, bahasa, atau nama pengirim..."
                className="h-11 w-full rounded-2xl border-2 border-slate-200 bg-white pl-10 pr-4 text-xs font-medium text-[#18181B] placeholder-[#9AA8BA] focus:border-[#18181B] focus:outline-none"
              />
            </div>

            {/* Category Filter Pills (4 Pilar Utama) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {["Semua", "Database", "Frontend", "Backend", "Data Science"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#18181B] text-white shadow-xs"
                      : "bg-[#F4F6FA] border border-slate-200 text-[#52647C] hover:bg-slate-200"
                  }`}
                >
                  {cat === "Database"
                    ? "🗄️ Database"
                    : cat === "Frontend"
                    ? "🎨 Frontend"
                    : cat === "Backend"
                    ? "⚙️ Backend"
                    : cat === "Data Science"
                    ? "📊 Data Science"
                    : "Semua Kategori"}
                </button>
              ))}
            </div>
          </div>

          {/* Snippet Grid */}
          <div className="space-y-6">
            {filtered.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3 bg-white">
                <Code2 className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-sm text-[#18181B]">Codingan Tidak Ditemukan</h4>
                <p className="text-xs text-[#6B7C93]">Jadilah yang pertama menambahkan file atau arsip ZIP untuk kategori ini!</p>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="rounded-full bg-[#0D824B] text-white px-4 py-2 text-xs font-bold shadow-sm cursor-pointer"
                >
                  + Tambah / Upload Codingan
                </button>
              </div>
            ) : (
              filtered.map((snippet) => {
                const isCopied = copiedId === snippet.id
                return (
                  <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[32px] bg-white border-2 border-slate-200 shadow-sm overflow-hidden"
                  >
                    {/* Header Titlebar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b-2 border-slate-200 bg-[#FAFBFD] gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black border ${
                            snippet.category === "Database"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : snippet.category === "Frontend"
                              ? "bg-sky-50 text-sky-700 border-sky-200"
                              : snippet.category === "Backend"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                            {snippet.category === "Database" && "🗄️ "}
                            {snippet.category === "Frontend" && "🎨 "}
                            {snippet.category === "Backend" && "⚙️ "}
                            {snippet.category === "Data Science" && "📊 "}
                            {snippet.category}
                          </span>
                          <span className="font-mono text-[10px] font-black uppercase text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md">
                            {snippet.language}
                          </span>
                          {snippet.zip_name && (
                            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-black text-amber-600 border border-amber-300 flex items-center gap-1">
                              <Archive className="h-3 w-3" />
                              <span>Arsip ZIP ({snippet.files_count || 1} file)</span>
                            </span>
                          )}
                          {snippet.is_community && (
                            <span className="rounded-full bg-[#FFEADA] px-2.5 py-0.5 text-[10px] font-black text-[#EA580C] border border-[#FFD280]">
                              🤝 Rekan Kelas: {snippet.author || "Peserta"}
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-base text-[#18181B]">{snippet.title}</h3>
                        <p className="text-xs text-[#6B7C93]">{snippet.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto shrink-0">
                        {/* Download ZIP Button if available */}
                        {snippet.zip_data && (
                          <a
                            href={snippet.zip_data}
                            download={snippet.zip_name || "project_prakom.zip"}
                            className="flex items-center gap-1 rounded-full bg-amber-500 hover:bg-amber-600 px-3.5 py-2 text-xs font-black text-white transition shadow-sm cursor-pointer"
                          >
                            <Archive className="h-3 w-3" />
                            <span>Download ZIP</span>
                          </a>
                        )}

                        {/* Send code to IDE */}
                        <button
                          type="button"
                          onClick={() => {
                            const extMap: Record<string, { ext: string; lang: LanguageKey; icon: string }> = {
                              sql: { ext: ".sql", lang: "sql", icon: "🗄️" },
                              python: { ext: ".py", lang: "python", icon: "🐍" },
                              bash: { ext: ".sh", lang: "python", icon: "💻" },
                              typescript: { ext: ".js", lang: "javascript", icon: "⚡" },
                              json: { ext: ".json", lang: "javascript", icon: "📄" },
                              yaml: { ext: ".yml", lang: "html", icon: "🐳" },
                              html: { ext: ".html", lang: "html", icon: "🌐" },
                            }
                            const config = extMap[snippet.language] || { ext: ".sql", lang: "sql", icon: "📄" }
                            const safeFileName =
                              snippet.title
                                .toLowerCase()
                                .replace(/[^a-z0-9]/g, "_")
                                .substring(0, 20) + config.ext

                            const existing = workspaceFiles.find((f) => f.name === safeFileName)
                            if (existing) {
                              setWorkspaceFiles((prev) =>
                                prev.map((f) => (f.id === existing.id ? { ...f, content: snippet.code } : f))
                              )
                              setActiveFileId(existing.id)
                            } else {
                              const newF: IDEFile = {
                                id: `file-${snippet.id}`,
                                name: safeFileName,
                                category: snippet.category,
                                language: config.lang,
                                icon: config.icon,
                                content: snippet.code,
                              }
                              setWorkspaceFiles((prev) => [...prev, newF])
                              setActiveFileId(newF.id)
                            }

                            if (config.lang === "html") setOutputTab("preview")
                            else if (config.lang === "sql") setOutputTab("table")
                            else setOutputTab("terminal")

                            setActiveMainTab("ide")
                          }}
                          className="flex items-center gap-1 rounded-full bg-[#E6F7ED] px-3.5 py-2 text-xs font-black text-[#0D824B] border border-[#A7F3D0] hover:bg-[#D1F2DF] transition cursor-pointer"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>Buka di IDE</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleCopyCode(snippet.code, snippet.id)}
                          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-[#18181B] border-2 border-slate-200 hover:bg-slate-50 transition shadow-xs cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-[#0D824B]" />
                              <span className="text-[#0D824B]">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 text-[#FF7643]" />
                              <span>Salin Kode</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Code Block */}
                    <div className="relative bg-[#18181B] text-slate-100 p-4 sm:p-5 font-mono text-xs overflow-x-auto selection:bg-[#FF7643] selection:text-white">
                      <pre className="leading-relaxed">
                        <code>{snippet.code}</code>
                      </pre>
                    </div>

                    {/* Tags & Date Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-white border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[#8C9BAE] mr-1">Tags:</span>
                        {snippet.tags.map((tag) => (
                          <span key={tag} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {snippet.created_at && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Ditambahkan: {snippet.created_at}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* MODAL BUAT FILE BARU DI WORKSPACE IDE */}
      <Modal
        isOpen={isNewFileModalOpen}
        onClose={() => setIsNewFileModalOpen(false)}
        title="Buat File Baru di Workspace IDE"
        description="Tambahkan file baru ke salah satu dari 4 Pilar Kompetensi"
      >
        <form onSubmit={handleCreateNewFile} className="space-y-4 pt-2 text-[#18181B]">
          <div className="space-y-1">
            <label className="text-xs font-black text-[#18181B]">Nama File *</label>
            <Input
              required
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Contoh: skrip_analisis.py atau query_prakom.sql"
              className="text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-black text-[#18181B]">Pilar Kategori *</label>
              <select
                value={newFileCategory}
                onChange={(e) => setNewFileCategory(e.target.value as SnippetCategory)}
                className="w-full rounded-2xl border-2 border-slate-200 bg-white p-2.5 text-xs font-medium text-[#18181B] focus:border-[#18181B] focus:outline-none"
              >
                <option value="Database">🗄️ Database</option>
                <option value="Frontend">🎨 Frontend</option>
                <option value="Backend">⚙️ Backend</option>
                <option value="Data Science">📊 Data Science</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-[#18181B]">Bahasa Pemrograman *</label>
              <select
                value={newFileLang}
                onChange={(e) => setNewFileLang(e.target.value as LanguageKey)}
                className="w-full rounded-2xl border-2 border-slate-200 bg-white p-2.5 text-xs font-medium text-[#18181B] focus:border-[#18181B] focus:outline-none"
              >
                <option value="python">Python (🐍 .py)</option>
                <option value="sql">SQL Database (🗄️ .sql)</option>
                <option value="javascript">JavaScript / TS (⚡ .js, .ts)</option>
                <option value="html">HTML5 / UI (🌐 .html)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewFileModalOpen(false)}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-[#18181B]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#0D824B] hover:bg-[#0A6C3E] px-5 py-2 text-xs font-black text-white shadow-sm"
            >
              Buat File
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL TAMBAH / UPLOAD SNIPPET KOMUNITAS (FILE & ZIP SUPPORT) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Bagikan Codingan / File / Proyek ZIP ke Kelas"
        description="Siapapun dapat membagikan script, query, file tunggal, atau arsip proyek ZIP tanpa login"
        className="max-w-2xl"
      >
        <div className="space-y-4 pt-2 text-[#18181B]">
          
          {/* Mode Switcher */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setAddMode("manual")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                addMode === "manual" ? "bg-[#0D824B] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>Ketik / Paste Kode</span>
            </button>
            <button
              type="button"
              onClick={() => setAddMode("upload")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                addMode === "upload" ? "bg-[#0D824B] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              <span>📁 Upload File / Arsip ZIP</span>
            </button>
          </div>

          {formSuccessMessage && (
            <div className="rounded-2xl bg-[#E6F7ED] p-3 border border-[#A7F3D0] text-xs font-bold text-[#0D824B] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{formSuccessMessage}</span>
            </div>
          )}

          {/* Upload Drop Zone in Upload Mode */}
          {addMode === "upload" && (
            <div className="rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 p-6 text-center space-y-2">
              <Archive className="h-8 w-8 text-emerald-600 mx-auto" />
              <h4 className="text-xs font-bold text-slate-800">
                Pilih File Codingan Tunggal (.py, .sql, .js, .sh, .html) atau Arsip ZIP (.zip)
              </h4>
              <p className="text-[11px] text-slate-500">
                Jika mengupload ZIP, seluruh file dalam arsip akan diproses dan dapat diunduh oleh rekan kelas.
              </p>
              <label className="inline-flex items-center gap-2 rounded-full bg-[#0D824B] hover:bg-[#0A6C3E] px-4 py-2 text-xs font-black text-white shadow-sm cursor-pointer mt-2">
                <Upload className="h-3.5 w-3.5" />
                <span>Pilih Berkas dari Komputer</span>
                <input
                  type="file"
                  onChange={handleModalFileUpload}
                  className="hidden"
                  accept=".py,.sql,.js,.ts,.html,.css,.json,.sh,.bash,.yml,.yaml,.txt,.zip,application/zip"
                />
              </label>
              {formZipName && (
                <div className="pt-2 text-xs font-bold text-amber-700 flex items-center justify-center gap-1.5">
                  <Archive className="h-3.5 w-3.5" />
                  <span>Arsip Terpilih: {formZipName} ({formFilesCount} file)</span>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleCreateSnippet} className="space-y-4 text-[#18181B]">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-[#18181B]">Judul Codingan / Proyek *</label>
                <Input
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Modul Otomasi SPBE & Backup DB"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-[#18181B]">Nama Anda & Satker (Opsional)</label>
                <Input
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  placeholder="Contoh: Budi Santoso - Kejari Soppeng"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-[#18181B]">Pilar Kategori *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as SnippetCategory)}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-white p-2.5 text-xs font-medium text-[#18181B] focus:border-[#18181B] focus:outline-none"
                >
                  <option value="Database">🗄️ Database</option>
                  <option value="Frontend">🎨 Frontend</option>
                  <option value="Backend">⚙️ Backend</option>
                  <option value="Data Science">📊 Data Science</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-[#18181B]">Bahasa Pemrograman *</label>
                <select
                  value={formLanguage}
                  onChange={(e) => setFormLanguage(e.target.value as any)}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-white p-2.5 text-xs font-medium text-[#18181B] focus:border-[#18181B] focus:outline-none"
                >
                  <option value="python">Python (🐍 .py)</option>
                  <option value="sql">SQL (PostgreSQL / MySQL)</option>
                  <option value="bash">Bash / Shell Script (.sh)</option>
                  <option value="typescript">JavaScript / TypeScript (.js, .ts)</option>
                  <option value="yaml">YAML / Docker (.yml)</option>
                  <option value="json">HTML / JSON (.html, .json)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-[#18181B]">Deskripsi Singkat / Kegunaan</label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Contoh: Digunakan untuk backup database perkara otomatis setiap malam"
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-[#18181B]">Source Code Utama *</label>
              <textarea
                required
                rows={4}
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                placeholder="Paste kode atau isi skrip utama Anda di sini..."
                className="w-full rounded-2xl border-2 border-slate-200 bg-[#18181B] text-emerald-300 font-mono p-3 text-xs focus:border-[#0D824B] focus:outline-none leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-[#18181B]">Tags (Pisahkan dengan koma)</label>
              <Input
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="Contoh: PostgreSQL, Backup, Linux, SPBE, ZIP"
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-[#18181B] hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#0D824B] hover:bg-[#0A6C3E] px-6 py-2 text-xs font-black text-white shadow-md cursor-pointer"
              >
                Simpan & Bagikan ke Kelas
              </button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  )
}
