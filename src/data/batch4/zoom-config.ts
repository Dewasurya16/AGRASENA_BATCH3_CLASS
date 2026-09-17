export interface BatchZoomConfig {
  batchName: string
  batchNumber: number
  batchSlug: string
  themeColor: string
  zoomUrl: string
  meetingId: string
  passcode: string
  hostName: string
  sessionScheduleText: string
  guidelines: string[]
}

export const BATCH4_ZOOM_CONFIG: BatchZoomConfig = {
  batchName: "Agrasena Batch 4",
  batchNumber: 4,
  batchSlug: "batch-4",
  themeColor: "indigo",
  zoomUrl: "https://zoom.us/j/84420264444?pwd=prakom-batch4-agrasena",
  meetingId: "844 2026 4444",
  passcode: "AGRASENA4",
  hostName: "Host Pusdiklat Kejaksaan RI & BPS RI",
  sessionScheduleText: "Senin – Jumat | 08:00 – 15:30 WIB",
  guidelines: [
    "Format display name Zoom: [No Absen] - [Nama Lengkap] - [Nama Satker]",
    "Wajib menyalakan kamera (on-cam) dengan Virtual Background resmi Batch 4.",
    "Menggunakan pakaian dinas rapi sesuai ketentuan hari pelatihan.",
    "Mute mikrofon saat narasumber/widyaiswara memaparkan materi perkuliahan.",
    "Presensi digital dibuka 15 menit sebelum sesi dimulai."
  ]
}
