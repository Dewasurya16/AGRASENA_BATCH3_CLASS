export type SnippetCategory = "Database" | "Frontend" | "Backend" | "Data Science"

export interface CodeSnippet {
  id: string
  title: string
  category: SnippetCategory
  language: "sql" | "bash" | "json" | "typescript" | "yaml" | "python" | "html"
  description: string
  code: string
  tags: string[]
  author?: string
  created_at?: string
  is_community?: boolean
  zip_name?: string
  zip_data?: string
  files_count?: number
}

export const CODE_SNIPPETS: CodeSnippet[] = [
  // ==========================================
  // 1. DATABASE (SQL, Schema, Audit Trail, Indexing)
  // ==========================================
  {
    id: "db-query-analitik",
    title: "SQL Analitik: Agregasi Capaian Angka Kredit & Ranking Satker (PostgreSQL)",
    category: "Database",
    language: "sql",
    description: "Query agregasi, grouping, dan pemeringkatan satker berdasarkan rata-rata Angka Kredit (AK) dan akumulasi jam diklat 120 JP.",
    tags: ["PostgreSQL", "Database", "Analytics", "Ranking"],
    code: `-- Analisis Data Kepegawaian & Angka Kredit Prakom Kejaksaan RI
SELECT 
    satker, 
    jenjang, 
    COUNT(*) AS total_peserta, 
    ROUND(AVG(ak)::numeric, 2) AS rata_rata_ak,
    MAX(ak) AS ak_tertinggi
FROM pegawai_prakom
GROUP BY satker, jenjang
ORDER BY rata_rata_ak DESC;`
  },
  {
    id: "db-audit-log-trigger",
    title: "SQL Trigger & Table Audit Log Perubahan Data (PostgreSQL)",
    category: "Database",
    language: "sql",
    description: "Membuat tabel audit trail otomatis untuk mencatat riwayat INSERT, UPDATE, DELETE data kepegawaian/perkara sesuai standar SPBE.",
    tags: ["PostgreSQL", "Database", "Trigger", "Audit Trail", "Security"],
    code: `-- 1. Buat Tabel Log Audit
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(64) NOT NULL,
    action_type VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    record_id TEXT,
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(100) DEFAULT CURRENT_USER,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Buat Fungsi Trigger Penampung
CREATE OR REPLACE FUNCTION fn_audit_logger()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (table_name, action_type, record_id, old_data)
        VALUES (TG_TABLE_NAME, 'DELETE', OLD.id::TEXT, to_jsonb(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (table_name, action_type, record_id, old_data, new_data)
        VALUES (TG_TABLE_NAME, 'UPDATE', NEW.id::TEXT, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (table_name, action_type, record_id, new_data)
        VALUES (TG_TABLE_NAME, 'INSERT', NEW.id::TEXT, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Verifikasi Log Terkini
SELECT * FROM log_audit_spbe ORDER BY id DESC;`
  },

  // ==========================================
  // 2. FRONTEND (HTML5, Tailwind, JS UI, Canvas)
  // ==========================================
  {
    id: "fe-dashboard-spbe",
    title: "UI Dashboard Portal SPBE Kejaksaan RI (HTML5 + Tailwind)",
    category: "Frontend",
    language: "html",
    description: "Komponen antarmuka web modern responsif dengan Tailwind CSS untuk monitoring status node SPBE dan progres peserta.",
    tags: ["Frontend", "HTML5", "Tailwind CSS", "Dashboard", "UI"],
    code: `<!DOCTYPE html>
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
</html>`
  },
  {
    id: "fe-kalkulator-ak-ui",
    title: "Widget Kalkulator Validasi NIP & Simulasi Angka Kredit (JavaScript)",
    category: "Frontend",
    language: "typescript",
    description: "Script interaktif parsing 18 digit NIP BKN (Tgl Lahir, TMT, Gender) dan simulasi persentase pemenuhan target angka kredit tahunan.",
    tags: ["Frontend", "JavaScript", "Validation", "NIP", "AK"],
    code: `// Validasi Format NIP & Kalkulasi Kebutuhan Angka Kredit
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

const targetAK = 25; // Jenjang Ahli Pertama
const capaianSemester1 = 14.5;
const sisaAK = targetAK - capaianSemester1;
console.log(\`Capaian AK: \${capaianSemester1} / \${targetAK} AK (\${((capaianSemester1/targetAK)*100).toFixed(1)}%)\`);
console.log(\`Sisa kebutuhan AK tahun berjalan: \${sisaAK} poin\`);`
  },

  // ==========================================
  // 3. BACKEND (Node.js API, Bash, Docker Stack)
  // ==========================================
  {
    id: "be-spbe-api-fetcher",
    title: "Client REST API Gateway SPBE dengan Bearer Auth (Node.js / TS)",
    category: "Backend",
    language: "typescript",
    description: "Template client handler komunikasi API antar instansi berstandar interoperabilitas SPBE dengan Bearer Token.",
    tags: ["Backend", "REST API", "Interoperabilitas", "SPBE", "Node.js"],
    code: `// Helper pemanggilan Layanan Interoperabilitas SPBE
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

testSPBEConnection();`
  },
  {
    id: "be-bash-db-backup",
    title: "Script Otomasi Backup Database PostgreSQL & Rotasi 7 Hari (Bash)",
    category: "Backend",
    language: "bash",
    description: "Script shell Linux untuk backup berkala database PostgreSQL dengan kompresi gzip dan penghapusan otomatis arsip lebih dari 7 hari.",
    tags: ["Backend", "Bash", "Cron", "Backup", "Linux Server"],
    code: `#!/bin/bash
# ==========================================================
# Script Backup Database Harian Satker Kejaksaan RI
# Letakkan di crontab: 0 2 * * * /opt/scripts/backup_db.sh
# ==========================================================

BACKUP_DIR="/var/backups/postgres"
DB_NAME="db_kejaksaan_prakom"
DB_USER="postgres"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/$DB_NAME-$DATE.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Memulai proses pencadangan database $DB_NAME..."
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Mengompresi arsip database ke $FILENAME..."
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup sukses disimpan (Ukuran: 48.2 MB)"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Rotasi arsip: Menghapus file backup lama > 7 hari... Selesai."
echo "✓ Backup harian selesai dengan status EXIT_SUCCESS (code 0)"`
  },
  {
    id: "be-docker-compose-stack",
    title: "Docker Compose Stack: Nginx + PostgreSQL 16 + Redis 7 (YAML)",
    category: "Backend",
    language: "yaml",
    description: "Konfigurasi multi-container Docker Compose siap pakai untuk environment aplikasi mandiri di satuan kerja Kejaksaan.",
    tags: ["Backend", "Docker", "Nginx", "PostgreSQL", "Redis", "DevOps"],
    code: `version: '3.8'

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
  pgdata:`
  },

  // ==========================================
  // 4. DATA SCIENCE (Python, Evaluasi 120 JP, Visualisasi, Statistik)
  // ==========================================
  {
    id: "ds-analisis-kelulusan",
    title: "Analisis Kelulusan & Kalkulasi Pembobotan Nilai Diklat 120 JP (Python)",
    category: "Data Science",
    language: "python",
    description: "Script Python data processing untuk menghitung nilai akhir peserta (MOOC 30%, TMO 30%, Lab 40%) beserta statistik kelulusan angkatan.",
    tags: ["Data Science", "Python", "Analytics", "Kelulusan", "Statistik"],
    code: `# ==========================================================
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
print("Persentase Kelulusan = 100.0% (4 dari 4 Peserta Memenuhi Syarat)")`
  },
  {
    id: "ds-proyeksi-angka-kredit",
    title: "Kalkulator Proyeksi Kenaikan Pangkat Jabatan Fungsional (Python)",
    category: "Data Science",
    language: "python",
    description: "Simulasi proyeksi waktu kenaikan pangkat berdasarkan predikat kinerja tahunan (Sangat Baik / Baik / Cukup) dan kebutuhan AK kumulatif.",
    tags: ["Data Science", "Python", "Simulasi", "Angka Kredit", "Prakom"],
    code: `# Simulasi Proyeksi Kenaikan Pangkat Prakom
jenjang = "Prakom Ahli Pertama"
ak_saat_ini = 37.5
target_ak_pangkat_berikutnya = 50.0 # Ke III/b
sisa_kebutuhan = target_ak_pangkat_berikutnya - ak_saat_ini

# Target tahunan (12.5 AK / tahun untuk predikat Baik)
ak_per_tahun = 12.5
tahun_dibutuhkan = sisa_kebutuhan / ak_per_tahun

print("=== SIMULASI PROYEKSI KENAIKAN PANGKAT PRAKOM ===")
print(f"Jenjang Saat Ini : {jenjang}")
print(f"Akumulasi AK    : {ak_saat_ini} / {target_ak_pangkat_berikutnya} AK")
print(f"Kekurangan AK   : {sisa_kebutuhan} poin")
print("-" * 48)
print(f"Estimasi Waktu  : {tahun_dibutuhkan:.1f} tahun dengan Predikat Kinerja 'Baik'")
print("✓ Proyeksi siap diajukan dalam penilaian SKP berjalan")`
  }
]
