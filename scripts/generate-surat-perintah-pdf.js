const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, '..', 'public');
const docDir = path.join(publicDir, 'documents');
const logoPath = path.join(publicDir, 'Logo.png');

let logoBase64 = '';
if (fs.existsSync(logoPath)) {
  const logoBuf = fs.readFileSync(logoPath);
  logoBase64 = `data:image/png;base64,${logoBuf.toString('base64')}`;
}

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>SURAT PERINTAH PENUNJUKAN ADMIN AGRASENA</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 15mm 8mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: "Bookman Old Style", "Times New Roman", Times, serif;
      font-size: 9pt;
      line-height: 1.25;
      color: #000;
      margin: 0;
      padding: 0;
      background: #fff;
    }
    
    /* KOP SURAT KEJAKSAAN RI */
    .kop-wrapper {
      position: relative;
      text-align: center;
      padding-bottom: 0px;
    }
    .kop-logo {
      position: absolute;
      left: 0;
      top: 2px;
      width: 60px;
      height: 60px;
      object-fit: contain;
    }
    .kop-text {
      margin-left: 68px;
      margin-right: 10px;
    }
    .kop-text .instansi-1 {
      font-size: 11.5pt;
      font-weight: 800;
      letter-spacing: 0.6px;
      margin: 0;
      text-transform: uppercase;
    }
    .kop-text .instansi-2 {
      font-size: 10.5pt;
      font-weight: 800;
      letter-spacing: 0.4px;
      margin: 1px 0;
      text-transform: uppercase;
    }
    .kop-text .instansi-3 {
      font-size: 9.5pt;
      font-weight: 700;
      letter-spacing: 0.2px;
      margin: 1px 0;
      text-transform: uppercase;
      color: #0d4a2b;
    }
    .kop-text .alamat {
      font-family: Arial, sans-serif;
      font-size: 6.8pt;
      margin: 2px 0 0 0;
      color: #333;
      line-height: 1.2;
    }
    
    .garis-kop-tebal {
      border-top: 2.2px solid #000;
      margin-top: 5px;
      margin-bottom: 1.2px;
    }
    .garis-kop-tipis {
      border-top: 0.7px solid #000;
      margin-bottom: 8px;
    }
    
    /* JUDUL SURAT */
    .judul-surat-box {
      text-align: center;
      margin-bottom: 8px;
    }
    .judul-surat {
      font-size: 11pt;
      font-weight: 800;
      text-decoration: underline;
      letter-spacing: 0.8px;
      margin: 0;
      text-transform: uppercase;
    }
    .nomor-surat {
      font-size: 8.5pt;
      font-weight: 700;
      margin: 1.5px 0 0 0;
      font-family: Arial, sans-serif;
      letter-spacing: 0.3px;
    }

    /* DASAR PERTIMBANGAN */
    .section-grid {
      display: table;
      width: 100%;
      margin-bottom: 4px;
    }
    .row-grid {
      display: table-row;
    }
    .label-col {
      display: table-cell;
      width: 72px;
      font-weight: bold;
      vertical-align: top;
      font-size: 9pt;
    }
    .separator-col {
      display: table-cell;
      width: 12px;
      font-weight: bold;
      vertical-align: top;
    }
    .content-col {
      display: table-cell;
      vertical-align: top;
      text-align: justify;
    }
    
    ol.dasar-list {
      margin: 0;
      padding-left: 16px;
    }
    ol.dasar-list li {
      margin-bottom: 2px;
      text-align: justify;
      line-height: 1.22;
      font-size: 8.5pt;
    }

    /* PERINTAH */
    .perintah-header {
      text-align: center;
      font-weight: 800;
      font-size: 9.8pt;
      letter-spacing: 1.2px;
      margin: 5px 0 4px 0;
      text-transform: uppercase;
    }

    /* TABEL APARATUR YANG DIUTUS */
    .tabel-petugas {
      width: 100%;
      border-collapse: collapse;
      margin: 3px 0 6px 0;
      font-size: 8.2pt;
    }
    .tabel-petugas th {
      background-color: #f8fafc;
      border: 1px solid #333;
      padding: 3.5px 5px;
      font-size: 7.8pt;
      text-align: center;
      font-weight: 800;
      text-transform: uppercase;
    }
    .tabel-petugas td {
      border: 1px solid #333;
      padding: 3.5px 6px;
      vertical-align: top;
      line-height: 1.2;
    }
    .text-center {
      text-align: center;
    }
    .petugas-nama {
      font-weight: 800;
      color: #0b3b24;
      font-size: 8.5pt;
    }
    .petugas-satker {
      font-weight: 600;
      color: #0f172a;
    }
    .petugas-tugas {
      font-style: italic;
      color: #334155;
      font-size: 7.8pt;
    }

    /* DAFTAR UNTUK */
    ol.untuk-list {
      margin: 0;
      padding-left: 16px;
    }
    ol.untuk-list li {
      margin-bottom: 2.5px;
      text-align: justify;
      line-height: 1.22;
      font-size: 8.5pt;
    }

    /* TANDA TANGAN & LEGALITAS */
    .ttd-wrapper {
      width: 100%;
      margin-top: 6px;
      display: table;
    }
    .ttd-left {
      display: table-cell;
      width: 46%;
      vertical-align: top;
      font-size: 7.5pt;
      font-family: Arial, sans-serif;
      padding-top: 4px;
    }
    .ttd-right {
      display: table-cell;
      width: 54%;
      vertical-align: top;
      text-align: center;
    }
    .ttd-tempat-tgl {
      font-size: 8.8pt;
      margin-bottom: 2px;
      text-align: center;
    }
    .ttd-jabatan {
      font-size: 8.5pt;
      font-weight: 800;
      text-transform: uppercase;
      line-height: 1.2;
      margin: 0 auto;
    }
    .stempel-box {
      position: relative;
      height: 48px;
      margin: 2px 0;
    }
    .digital-seal {
      display: inline-block;
      border: 1.2px dashed #0d4a2b;
      padding: 3px 8px;
      border-radius: 4px;
      color: #0d4a2b;
      font-size: 6.8pt;
      font-family: Arial, sans-serif;
      font-weight: bold;
      background: rgba(13, 74, 43, 0.04);
      margin-top: 5px;
    }
    .ttd-nama {
      font-size: 9.5pt;
      font-weight: 800;
      text-decoration: underline;
      text-transform: uppercase;
      margin: 0;
    }
    .ttd-pangkat {
      font-size: 7.8pt;
      font-weight: 600;
      margin: 1px 0 0 0;
      font-family: Arial, sans-serif;
    }

    /* SECURITY FOOTER */
    .security-notice {
      margin-top: 8px;
      border-top: 1px solid #cbd5e1;
      padding-top: 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: Arial, sans-serif;
      font-size: 6.5pt;
      color: #64748b;
    }
    .qr-mock {
      border: 1px solid #94a3b8;
      padding: 2.5px;
      background: #fff;
      display: inline-block;
      font-size: 6pt;
      font-weight: bold;
      color: #0f172a;
      line-height: 1.2;
    }
  </style>
</head>
<body>

  <!-- KOP SURAT RESMI KEJAKSAAN RI -->
  <div class="kop-wrapper">
    ${logoBase64 ? `<img src="${logoBase64}" class="kop-logo" alt="Logo Kejaksaan RI" />` : ''}
    <div class="kop-text">
      <div class="instansi-1">KEJAKSAAN REPUBLIK INDONESIA</div>
      <div class="instansi-2">BADAN PENDIDIKAN DAN PELATIHAN</div>
      <div class="instansi-3">KOMUNITAS BELAJAR PRANATA KOMPUTER KEAHLIAN "AGRASENA"</div>
      <div class="alamat">
        Sekretariat: Kampus Sasana Adhi Karyadika, Jl. Pusdiklat Kejaksaan RI No. 1, Ragunan, Pasar Minggu, Jakarta Selatan<br />
        Laman Resmi: <em>https://agrasena-batch3-class.vercel.app</em> • Pos-el: <em>prakom.agrasena@kejaksaan.go.id</em>
      </div>
    </div>
  </div>

  <div class="garis-kop-tebal"></div>
  <div class="garis-kop-tipis"></div>

  <!-- JUDUL SURAT PERINTAH -->
  <div class="judul-surat-box">
    <div class="judul-surat">SURAT PERINTAH TUGAS</div>
    <div class="nomor-surat">NOMOR: PRINT-001/L.1/Prakom.Agrasena/Admin/09/2026</div>
  </div>

  <!-- DASAR -->
  <div class="section-grid">
    <div class="row-grid">
      <div class="label-col">DASAR</div>
      <div class="separator-col">:</div>
      <div class="content-col">
        <ol class="dasar-list">
          <li>Undang-Undang Nomor 11 Tahun 2021 tentang Perubahan atas Undang-Undang Nomor 16 Tahun 2004 tentang Kejaksaan Republik Indonesia;</li>
          <li>Peraturan Presiden Republik Indonesia Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE);</li>
          <li>Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 32 Tahun 2020 tentang Jabatan Fungsional Pranata Komputer;</li>
          <li>Program Kerja Diklat Fungsional Pranata Komputer Keahlian Kejaksaan Republik Indonesia Angkatan 2026;</li>
          <li>Kebutuhan tata kelola teknis, koordinasi pembelajaran, ketertiban sesi perkuliahan virtual, moderasi forum diskusi, dan pengarsipan modul kurikulum 120 JP pada Portal Belajar Terpadu Agrasena.</li>
        </ol>
      </div>
    </div>
  </div>

  <!-- MEMERINTAHKAN -->
  <div class="perintah-header">MEMERINTAHKAN:</div>

  <!-- KEPADA -->
  <div class="section-grid">
    <div class="row-grid">
      <div class="label-col">KEPADA</div>
      <div class="separator-col">:</div>
      <div class="content-col">
        <table class="tabel-petugas">
          <thead>
            <tr>
              <th style="width: 28px;">NO</th>
              <th style="width: 175px;">NAMA & PANGKAT</th>
              <th style="width: 145px;">JABATAN</th>
              <th>SATUAN KERJA & PENUGASAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center font-bold">1.</td>
              <td>
                <span class="petugas-nama">RISKY ANDINI, S.Kom.</span><br />
                <span style="font-size: 8.5pt; color: #475569;">NIP. 19960814 202203 2 004</span><br />
                <span style="font-size: 8.5pt;">Penata Muda (III/a)</span>
              </td>
              <td>
                <strong>Pranata Komputer Ahli Pertama</strong>
              </td>
              <td>
                <span class="petugas-satker">Kejaksaan Negeri Palu</span><br />
                <span class="petugas-tugas">Penugasan: <strong>Administrator Sesi Kelas Virtual & Presensi</strong></span>
              </td>
            </tr>
            <tr>
              <td class="text-center font-bold">2.</td>
              <td>
                <span class="petugas-nama">FEGGY RIPANI, S.Kom.</span><br />
                <span style="font-size: 8.5pt; color: #475569;">NIP. 19970221 202203 1 003</span><br />
                <span style="font-size: 8.5pt;">Penata Muda (III/a)</span>
              </td>
              <td>
                <strong>Pranata Komputer Ahli Pertama</strong>
              </td>
              <td>
                <span class="petugas-satker">Kejaksaan Negeri Bangka Selatan</span><br />
                <span class="petugas-tugas">Penugasan: <strong>Administrator Teknis Zoom & Moderasi Forum</strong></span>
              </td>
            </tr>
            <tr>
              <td class="text-center font-bold">3.</td>
              <td>
                <span class="petugas-nama">KURNIA RAMADANI, S.Kom.</span><br />
                <span style="font-size: 8.5pt; color: #475569;">NIP. 19980112 202203 2 006</span><br />
                <span style="font-size: 8.5pt;">Penata Muda (III/a)</span>
              </td>
              <td>
                <strong>Pranata Komputer Ahli Pertama</strong>
              </td>
              <td>
                <span class="petugas-satker">Kejaksaan Negeri Lampung Timur</span><br />
                <span class="petugas-tugas">Penugasan: <strong>Administrator Pustaka Modul & Rekapitulasi Tugas</strong></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- UNTUK -->
  <div class="section-grid" style="margin-top: 4px;">
    <div class="row-grid">
      <div class="label-col">UNTUK</div>
      <div class="separator-col">:</div>
      <div class="content-col">
        <ol class="untuk-list">
          <li>Menjadi <strong>Administrator Resmi</strong> Portal Kelas Virtual Diklat Fungsional Pranata Komputer Keahlian Agrasena (Batch 3 & Batch 4) Kejaksaan Republik Indonesia;</li>
          <li>Mengelola kelancaran operasional kelas virtual, membantu pendampingan peserta diklat, serta mengawasi ketertiban tata tertib perkuliahan daring;</li>
          <li>Mendokumentasikan, menyinkronkan bahan ajar modul 120 JP, serta memfasilitasi komunikasi teknis antara widyaiswara/pengampu materi dengan peserta diklat;</li>
          <li>Melaksanakan tugas kedinasan ini dengan <strong>sebaik-baiknya</strong>, menjunjung tinggi nilai-nilai <em>Trapsila Adhyaksa</em>, berintegritas, cermat, dan penuh tanggung jawab;</li>
          <li>Melaporkan berkala dinamika pelaksanaan tugas kepada Super Admin dan Tim Penyelenggara Diklat Fungsional Kejaksaan RI.</li>
        </ol>
      </div>
    </div>
  </div>

  <!-- TANDA TANGAN & PENGESAHAN -->
  <div class="ttd-wrapper">
    <div class="ttd-left">
      <div class="qr-mock">
        [VERIFIKASI ELEKTRONIK KEJAKSAAN RI]<br />
        Dokumen SAH: Terdaftar pada Sistem Informasi Manajemen<br />
        Diklat Fungsional Prakom Keahlian Agrasena 2026<br />
        Kode Hash Dokumen: SHA256-AGR-ADM-2026-09
      </div>
      <div style="margin-top: 6px; font-size: 7.5pt; color: #475569;">
        <em>Tembusan Yth:</em><br />
        1. Kepala Badan Pendidikan dan Pelatihan Kejaksaan RI;<br />
        2. Kepala Kejaksaan Negeri Palu;<br />
        3. Kepala Kejaksaan Negeri Bangka Selatan;<br />
        4. Kepala Kejaksaan Negeri Lampung Timur;<br />
        5. Arsip Kedinasan.
      </div>
    </div>
    <div class="ttd-right">
      <div class="ttd-tempat-tgl">Ditetapkan di : Jakarta<br />Pada tanggal   : 17 September 2026</div>
      <div class="ttd-jabatan">
        SUPER ADMIN PORTAL KELAS DIKLAT<br />
        PRANATA KOMPUTER KEAHLIAN AGRASENA<br />
        KEJAKSAAN REPUBLIK INDONESIA
      </div>
      <div class="stempel-box">
        <div class="digital-seal">
          ★ TERTANDA SECARA ELEKTRONIK ★<br />
          SUPER ADMIN AGRASENA RI
        </div>
      </div>
      <div class="ttd-nama">SUPER ADMIN</div>
      <div class="ttd-pangkat">Sistem Informasi Manajemen Diklat Terpadu</div>
    </div>
  </div>

  <div class="security-notice">
    <span>Naskah Dinas Resmi Portal Belajar Diklat Fungsional Pranata Komputer Keahlian Agrasena Kejaksaan RI 2026</span>
    <span>Lembar 1 dari 1 (Dokumen Sah)</span>
  </div>

</body>
</html>
`;

// 1. Tulis file HTML
const htmlPath = path.join(docDir, 'surat-perintah-admin.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('HTML generated at:', htmlPath);

// 2. Jalankan Edge headless print-to-pdf
const pdfPath = path.join(docDir, 'SURAT_PERINTAH_PENUNJUKAN_ADMIN_AGRASENA_2026.pdf');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

if (fs.existsSync(edgePath)) {
  console.log('Executing Edge headless print-to-pdf...');
  const cmd = '"' + edgePath + '" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="' + pdfPath + '" "' + htmlPath + '"';
  try {
    execSync(cmd, { stdio: 'inherit' });
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      console.log('SUCCESS: PDF generated successfully! Size: ' + stats.size + ' bytes');
    } else {
      console.error('PDF file was not created.');
    }
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
} else {
  console.error('Microsoft Edge not found at path:', edgePath);
}
