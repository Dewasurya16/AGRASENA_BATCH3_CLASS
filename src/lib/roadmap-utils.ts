export interface RoadmapDayDetail {
  dayNumber: number
  stageNumber: number
  stageName: string
  stageSubtitle: string
  dateStr: string
  dayOfWeek: string
  dotsCount: number
  status: "completed" | "in_progress" | "upcoming"
  badgeLabel1: string
  badgeLabel2: string
  sessions: Array<{
    id?: string
    time: string
    title: string
    instructor?: string
    room?: string
    zoomUrl?: string
  }>
}

export interface RoadmapProgressSummary {
  currentDayNumber: number
  totalDays: number
  progressPercentage: number
  completedDays: number
  currentStageName: string
  isDiklatFinished: boolean
}

export const RUANG_DIKLAT_URL =
  "https://pengembangan.kejaksaan.go.id/course/pelatihan-fungsional-pranata-komputer-kategori-keahlian-batch-3/ruang-diklat"

// 35-Day Curriculum Structure (Hari 1 s/d Hari 35) - Isi kegiatan 100% manual dari Supabase
export const RAW_DAYS_DATA = [
  // TAHAP 1: MOOC (Hari 1 - 5: 24 Agu - 28 Agu 2026)
  { day: 1, stage: 1, stageName: "Tahap 1 • MOOC", stageSubtitle: "Pembelajaran Mandiri", date: "24 Agu 2026", dayOfWeek: "Senin", dots: 8 },
  { day: 2, stage: 1, stageName: "Tahap 1 • MOOC", stageSubtitle: "Pembelajaran Mandiri", date: "25 Agu 2026", dayOfWeek: "Selasa", dots: 8 },
  { day: 3, stage: 1, stageName: "Tahap 1 • MOOC", stageSubtitle: "Pembelajaran Mandiri", date: "26 Agu 2026", dayOfWeek: "Rabu", dots: 5 },
  { day: 4, stage: 1, stageName: "Tahap 1 • MOOC", stageSubtitle: "Pembelajaran Mandiri", date: "27 Agu 2026", dayOfWeek: "Kamis", dots: 4 },
  { day: 5, stage: 1, stageName: "Tahap 1 • MOOC", stageSubtitle: "Pembelajaran Mandiri", date: "28 Agu 2026", dayOfWeek: "Jumat", dots: 3 },

  // TAHAP 2: TMO (Hari 6 - 15: 31 Agu - 11 Sep 2026)
  { day: 6, stage: 2, stageName: "Tahap 2 • TMO", stageSubtitle: "Tatap Muka Online", date: "31 Agu 2026", dayOfWeek: "Senin", dots: 4 },
  { day: 7, stage: 2, stageName: "Tahap 2 • TMO", stageSubtitle: "Tatap Muka Online", date: "1 Sep 2026", dayOfWeek: "Selasa", dots: 5 },
  { day: 8, stage: 2, stageName: "Tahap 2 • TMO", stageSubtitle: "Tatap Muka Online", date: "2 Sep 2026", dayOfWeek: "Rabu", dots: 2 },
  { day: 9, stage: 2, stageName: "Tahap 2 • TMO", stageSubtitle: "Tatap Muka Online", date: "3 Sep 2026", dayOfWeek: "Kamis", dots: 4 },
  { day: 10, stage: 2, stageName: "Tahap 2 • TMO", stageSubtitle: "Tatap Muka Online", date: "4 Sep 2026", dayOfWeek: "Jumat", dots: 2 },
  { day: 11, stage: 2, stageName: "Tahap 2 • TMO", stageSubtitle: "Tatap Muka Online", date: "7 Sep 2026", dayOfWeek: "Senin", dots: 4 },
  { day: 12, stage: 2, stageName: "Tahap 2 • TMO", stageSubtitle: "Tatap Muka Online", date: "8 Sep 2026", dayOfWeek: "Selasa", dots: 2 },
  { day: 13, stage: 2, stageName: "Tahap 2 • TMO", stageSubtitle: "Tatap Muka Online", date: "9 Sep 2026", dayOfWeek: "Rabu", dots: 4 },
  { day: 14, stage: 2, stageName: "Tahap 2 • TMO", stageSubtitle: "Tatap Muka Online", date: "10 Sep 2026", dayOfWeek: "Kamis", dots: 2 },
  { day: 15, stage: 2, stageName: "Tahap 2 • TMO", stageSubtitle: "Tatap Muka Online", date: "11 Sep 2026", dayOfWeek: "Jumat", dots: 4 },

  // TAHAP 3: Lab Prakom (Hari 16 - 30: 14 Sep - 2 Okt 2026)
  { day: 16, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "14 Sep 2026", dayOfWeek: "Senin", dots: 1 },
  { day: 17, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "15 Sep 2026", dayOfWeek: "Selasa", dots: 1 },
  { day: 18, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "16 Sep 2026", dayOfWeek: "Rabu", dots: 1 },
  { day: 19, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "17 Sep 2026", dayOfWeek: "Kamis", dots: 1 },
  { day: 20, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "18 Sep 2026", dayOfWeek: "Jumat", dots: 1 },
  { day: 21, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "21 Sep 2026", dayOfWeek: "Senin", dots: 1 },
  { day: 22, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "22 Sep 2026", dayOfWeek: "Selasa", dots: 1 },
  { day: 23, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "23 Sep 2026", dayOfWeek: "Rabu", dots: 1 },
  { day: 24, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "24 Sep 2026", dayOfWeek: "Kamis", dots: 1 },
  { day: 25, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "25 Sep 2026", dayOfWeek: "Jumat", dots: 1 },
  { day: 26, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "28 Sep 2026", dayOfWeek: "Senin", dots: 1 },
  { day: 27, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "29 Sep 2026", dayOfWeek: "Selasa", dots: 1 },
  { day: 28, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "30 Sep 2026", dayOfWeek: "Rabu", dots: 1 },
  { day: 29, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "1 Okt 2026", dayOfWeek: "Kamis", dots: 1 },
  { day: 30, stage: 3, stageName: "Tahap 3 • Lab Prakom", stageSubtitle: "Laboratorium di Unit Kerja", date: "2 Okt 2026", dayOfWeek: "Jumat", dots: 1 },

  // TAHAP 4: Seminar (Hari 31 - 35: 5 Okt - 9 Okt 2026)
  { day: 31, stage: 4, stageName: "Tahap 4 • Seminar", stageSubtitle: "Seminar Klasikal", date: "5 Okt 2026", dayOfWeek: "Senin", dots: 1 },
  { day: 32, stage: 4, stageName: "Tahap 4 • Seminar", stageSubtitle: "Seminar Klasikal", date: "6 Okt 2026", dayOfWeek: "Selasa", dots: 1 },
  { day: 33, stage: 4, stageName: "Tahap 4 • Seminar", stageSubtitle: "Seminar Klasikal", date: "7 Okt 2026", dayOfWeek: "Rabu", dots: 1 },
  { day: 34, stage: 4, stageName: "Tahap 4 • Seminar", stageSubtitle: "Seminar Klasikal", date: "8 Okt 2026", dayOfWeek: "Kamis", dots: 1 },
  { day: 35, stage: 4, stageName: "Tahap 4 • Seminar", stageSubtitle: "Seminar Klasikal", date: "9 Okt 2026", dayOfWeek: "Jumat", dots: 1 },
]

/**
 * Menghitung hari diklat ke-N secara otomatis berdasarkan kalender tanggal berjalan
 */
export function getCurrentDiklatDay(): number {
  const now = new Date()
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
  const currentMonthStr = monthNames[now.getMonth()]
  const targetDateStr = `${now.getDate()} ${currentMonthStr}`

  // Cari apakah tanggal hari ini cocok dengan tanggal di kalender kurikulum 35 hari
  const matched = RAW_DAYS_DATA.find((d) => d.date.startsWith(targetDateStr))
  if (matched) {
    return matched.day
  }

  // Jika sebelum tanggal mulai diklat (24 Agu 2026) -> Hari 1
  const diklatStartDate = new Date(2026, 7, 24)
  if (now < diklatStartDate) return 1

  return 3 // Default Hari 3
}

/**
 * Maps live manual schedules from Supabase to the 35 days structure.
 */
export function getAutoRoadmapData(
  overrideDay?: number,
  supabaseSchedules: any[] = []
): {
  days: RoadmapDayDetail[]
  summary: RoadmapProgressSummary
} {
  const autoDay = getCurrentDiklatDay()
  const currentDay = overrideDay && overrideDay >= 1 && overrideDay <= 35 ? overrideDay : autoDay
  const totalDays = 35
  const completedDays = Math.max(0, currentDay - 1)
  const progressPercentage = Math.round((currentDay / totalDays) * 100)

  const currentStageObj = RAW_DAYS_DATA.find((d) => d.day === currentDay)
  const currentStageName = currentStageObj ? currentStageObj.stageName : "Tahap 1 • MOOC"

  const days: RoadmapDayDetail[] = RAW_DAYS_DATA.map((item) => {
    let status: "completed" | "in_progress" | "upcoming" = "upcoming"
    let badgeLabel1 = "BELUM MULAI"
    let badgeLabel2 = "JADWAL MENDATANG"

    if (item.day < currentDay) {
      status = "completed"
      badgeLabel1 = "SELESAI"
      badgeLabel2 = "SELESAI"
    } else if (item.day === currentDay) {
      status = "in_progress"
      badgeLabel1 = "BERJALAN"
      badgeLabel2 = "JADWAL HARI INI"
    }

    // Match sessions from Supabase for this day
    const matchedSessions = supabaseSchedules
      .filter((s) => {
        const subject = String(s.subject_name || "").toLowerCase()
        const dayStr = String(s.day || "").toLowerCase().trim()
        const targetDay = `hari ${item.day}`
        const targetTag = `[hari ${item.day}]`

        // Check if subject explicitly contains [Hari X] or Hari X
        if (subject.includes(targetTag) || subject.includes(targetDay)) {
          return true
        }

        // If day string explicitly matches
        if (dayStr === targetDay || dayStr === String(item.day)) {
          return true
        }

        return false
      })
      .map((s) => {
        // Clean [Hari X] prefix from display title if present
        const cleanTitle = s.subject_name.replace(/\[Hari\s*\d+\]\s*/i, "").trim()
        return {
          id: s.id,
          time: `${s.start_time || "08:00"} - ${s.end_time || "15:30"}`,
          title: cleanTitle || s.subject_name,
          instructor: s.lecturer,
          room: s.room,
          zoomUrl: s.meeting_link || RUANG_DIKLAT_URL,
        }
      })

    return {
      dayNumber: item.day,
      stageNumber: item.stage,
      stageName: item.stageName,
      stageSubtitle: item.stageSubtitle,
      dateStr: item.date,
      dayOfWeek: item.dayOfWeek,
      dotsCount: item.dots,
      status,
      badgeLabel1,
      badgeLabel2,
      sessions: matchedSessions,
    }
  })

  return {
    days,
    summary: {
      currentDayNumber: currentDay,
      totalDays,
      progressPercentage,
      completedDays,
      currentStageName,
      isDiklatFinished: currentDay >= totalDays,
    },
  }
}
