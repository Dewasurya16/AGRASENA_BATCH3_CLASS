import { DEFAULT_SCHEDULES_DATA } from "@/lib/default-schedules"

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

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  mei: 4,
  jun: 5,
  jul: 6,
  agu: 7,
  agt: 7,
  aug: 7,
  sep: 8,
  okt: 9,
  oct: 9,
  nov: 10,
  des: 11,
  dec: 11,
}

export function parseDiklatDate(dateStr: string): Date | null {
  const parts = dateStr.trim().split(/\s+/)
  if (parts.length < 3) return null
  const day = parseInt(parts[0], 10)
  const monthKey = parts[1].toLowerCase().slice(0, 3)
  const month = MONTH_MAP[monthKey] ?? 7
  const year = parseInt(parts[2], 10) || 2026
  return new Date(year, month, day, 0, 0, 0, 0)
}

/**
 * Menghitung hari diklat ke-N secara otomatis berdasarkan kalender tanggal berjalan
 */
export function getCurrentDiklatDay(): number {
  const now = new Date()
  const todayAtMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)

  // 1. Cari apakah tanggal hari ini cocok dengan tanggal di kalender kurikulum 35 hari
  for (const item of RAW_DAYS_DATA) {
    const itemDate = parseDiklatDate(item.date)
    if (itemDate && itemDate.getTime() === todayAtMidnight.getTime()) {
      return item.day
    }
  }

  // 2. Jika sebelum tanggal mulai diklat (24 Agu 2026) -> Hari 1
  const firstDayDate = parseDiklatDate(RAW_DAYS_DATA[0].date)
  if (firstDayDate && todayAtMidnight.getTime() < firstDayDate.getTime()) {
    return 1
  }

  // 3. Jika hari ini jatuh pada hari libur/weekend di antara tahap perkuliahan, ambil hari perkuliahan aktif berikutnya
  for (let i = 0; i < RAW_DAYS_DATA.length; i++) {
    const itemDate = parseDiklatDate(RAW_DAYS_DATA[i].date)
    if (itemDate && todayAtMidnight.getTime() < itemDate.getTime()) {
      return RAW_DAYS_DATA[i].day
    }
  }

  // 4. Jika setelah seluruh jadwal 35 hari selesai (setelah 9 Okt 2026) -> Hari 35
  return 35
}

/**
 * Resolves the explicit Day Number (1 - 35) for a given schedule or task record.
 * Uses strict regex parsing to prevent Day 3 matching Day 2 or Day 4 matching Day 3.
 */
export function getScheduleDayNumber(s: { subject_name?: string | null; day?: string | null }): number | null {
  const subject = String(s.subject_name || "").trim()
  const dayStr = String(s.day || "").trim()

  // 1. Check for explicit [Hari X] tag in subject_name
  const tagMatch = subject.match(/\[\s*hari\s*(\d+)\s*\]/i)
  if (tagMatch) {
    const num = parseInt(tagMatch[1], 10)
    if (num >= 1 && num <= 35) return num
  }

  // 2. Check for explicit "Hari X" or "Hari ke-X" or "Hari ke X" in day field
  const dayFieldMatch = dayStr.match(/hari\s*(?:ke[-\s]*)?(\d+)/i)
  if (dayFieldMatch) {
    const num = parseInt(dayFieldMatch[1], 10)
    if (num >= 1 && num <= 35) return num
  }

  // 3. Check if day field is purely a number e.g. "3" or 3
  if (/^\d+$/.test(dayStr)) {
    const num = parseInt(dayStr, 10)
    if (num >= 1 && num <= 35) return num
  }

  // 4. Check for standalone "Hari X" in subject_name
  const subjectDayMatch = subject.match(/\bhari\s*(?:ke[-\s]*)?(\d+)\b/i)
  if (subjectDayMatch) {
    const num = parseInt(subjectDayMatch[1], 10)
    if (num >= 1 && num <= 35) return num
  }

  return null
}

function cleanTimeFormat(timeStr?: string | null, fallback = "08:00"): string {
  if (!timeStr) return fallback
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})/)
  if (match) {
    const h = match[1].padStart(2, '0')
    const m = match[2]
    return `${h}:${m}`
  }
  return timeStr.trim()
}

function parseTimeToMins(timeStr?: string | null): number {
  if (!timeStr) return 0
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})/)
  if (match) {
    return parseInt(match[1], 10) * 60 + parseInt(match[2], 10)
  }
  return 0
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

  const effectiveSchedules =
    supabaseSchedules && supabaseSchedules.length > 0
      ? supabaseSchedules
      : DEFAULT_SCHEDULES_DATA

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

    // Match sessions from Supabase for this day with STRICT day identification & sort chronologically
    const matchedSessions = effectiveSchedules
      .filter((s) => {
        const explicitDay = getScheduleDayNumber(s)
        if (explicitDay !== null) {
          // If explicit day was found, it must STRICTLY match this day number
          return explicitDay === item.day
        }

        // Fallback: If no day number is found, check if day name matches
        const dayStr = String(s.day || "").toLowerCase().trim()
        if (dayStr && (dayStr === item.dayOfWeek.toLowerCase() || dayStr === `hari ${item.day}`)) {
          return true
        }

        return false
      })
      .sort((a, b) => parseTimeToMins(a.start_time) - parseTimeToMins(b.start_time))
      .map((s) => {
        // Clean [Hari X] prefix from display title if present
        const cleanTitle = s.subject_name.replace(/\[Hari\s*\d+\]\s*/i, "").trim()
        const start = cleanTimeFormat(s.start_time, "08:00")
        const end = cleanTimeFormat(s.end_time, "15:30")
        return {
          id: s.id,
          time: `${start} - ${end}`,
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
