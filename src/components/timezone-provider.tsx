'use client'

import * as React from 'react'

export type IndonesianTimezone = 'WIB' | 'WITA' | 'WIT'

export interface TimezoneInfo {
  code: IndonesianTimezone
  label: string
  utcOffset: number // in hours: WIB=7, WITA=8, WIT=9
  diffFromWIB: number // in hours: WIB=0, WITA=1, WIT=2
  regionName: string
}

export const TIMEZONES: Record<IndonesianTimezone, TimezoneInfo> = {
  WIB: {
    code: 'WIB',
    label: 'WIB (UTC+7)',
    utcOffset: 7,
    diffFromWIB: 0,
    regionName: 'Waktu Indonesia Barat (Sumatera, Jawa, Kalbar, Kalteng)',
  },
  WITA: {
    code: 'WITA',
    label: 'WITA (UTC+8)',
    utcOffset: 8,
    diffFromWIB: 1,
    regionName: 'Waktu Indonesia Tengah (Sulawesi, Bali, NTT, NTB, Kalsel, Kaltim, Kaltara)',
  },
  WIT: {
    code: 'WIT',
    label: 'WIT (UTC+9)',
    utcOffset: 9,
    diffFromWIB: 2,
    regionName: 'Waktu Indonesia Timur (Maluku, Papua, Papua Barat)',
  },
}

interface TimezoneContextType {
  timezone: IndonesianTimezone
  setTimezone: (tz: IndonesianTimezone) => void
  timezoneInfo: TimezoneInfo
  convertWibTimeToCurrent: (timeStr: string) => string
  convertTimeRange: (timeRangeStr: string) => string
  getNowInCurrentZone: () => Date
  formatCurrentTime: (includeSeconds?: boolean) => string
}

const TimezoneContext = React.createContext<TimezoneContextType | undefined>(undefined)

const STORAGE_KEY = 'diklat_prakom_timezone'

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [timezone, setTimezoneState] = React.useState<IndonesianTimezone>('WIB')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as IndonesianTimezone | null
      if (saved && (saved === 'WIB' || saved === 'WITA' || saved === 'WIT')) {
        setTimezoneState(saved)
      } else {
        // Auto-detect if browser timezone indicates WITA or WIT
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase()
        if (userTz.includes('makassar') || userTz.includes('singapore') || userTz.includes('bali') || userTz.includes('manado')) {
          setTimezoneState('WITA')
        } else if (userTz.includes('jayapura') || userTz.includes('tokyo') || userTz.includes('papua')) {
          setTimezoneState('WIT')
        }
      }
    } catch {
      // Fallback silently if storage unavailable
    }
    setMounted(true)
  }, [])

  const setTimezone = React.useCallback((tz: IndonesianTimezone) => {
    setTimezoneState(tz)
    try {
      localStorage.setItem(STORAGE_KEY, tz)
    } catch {
      // Ignore
    }
  }, [])

  const timezoneInfo = TIMEZONES[timezone] || TIMEZONES.WIB

  /**
   * Mengonversi waktu WIB dasar (format "HH:MM" atau "H:MM") ke zona waktu aktif.
   * Contoh: "08:00" WIB -> WITA (+1h) -> "09:00"
   */
  const convertWibTimeToCurrent = React.useCallback((timeStr: string): string => {
    if (!timeStr) return timeStr
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})/)
    if (!match) return timeStr

    let hours = parseInt(match[1], 10)
    const minutes = match[2]

    hours = (hours + timezoneInfo.diffFromWIB) % 24
    const hStr = hours.toString().padStart(2, '0')
    return `${hStr}:${minutes}`
  }, [timezoneInfo.diffFromWIB])

  /**
   * Mengonversi rentang jam perkuliahan, contoh:
   * "08:00 – 16:00 WIB" -> "09:00 – 17:00 WITA" (jika zona WITA)
   */
  const convertTimeRange = React.useCallback((timeRangeStr: string): string => {
    if (!timeRangeStr) return timeRangeStr

    // Bersihkan sufiks WIB / WITA / WIT lama jika ada
    const cleanStr = timeRangeStr.replace(/\s*(WIB|WITA|WIT)\s*/gi, '').trim()
    const separator = cleanStr.includes('–') ? '–' : cleanStr.includes('-') ? '-' : null

    if (!separator) {
      return `${convertWibTimeToCurrent(cleanStr)} ${timezone}`
    }

    const parts = cleanStr.split(separator).map((p) => p.trim())
    if (parts.length === 2) {
      const start = convertWibTimeToCurrent(parts[0])
      const end = convertWibTimeToCurrent(parts[1])
      return `${start} – ${end} ${timezone}`
    }

    return `${convertWibTimeToCurrent(cleanStr)} ${timezone}`
  }, [convertWibTimeToCurrent, timezone])

  /**
   * Menghasilkan object Date yang jamnya sudah disesuaikan dengan zona waktu aktif
   */
  const getNowInCurrentZone = React.useCallback((): Date => {
    const now = new Date()
    // Hitung offset UTC real browser
    const localUtcOffsetHours = -now.getTimezoneOffset() / 60
    const targetOffsetHours = timezoneInfo.utcOffset
    const offsetDiffMs = (targetOffsetHours - localUtcOffsetHours) * 60 * 60 * 1000
    return new Date(now.getTime() + offsetDiffMs)
  }, [timezoneInfo.utcOffset])

  /**
   * Format jam sekarang, contoh "14:30:15"
   */
  const formatCurrentTime = React.useCallback((includeSeconds = true): string => {
    const date = getNowInCurrentZone()
    const h = date.getHours().toString().padStart(2, '0')
    const m = date.getMinutes().toString().padStart(2, '0')
    if (!includeSeconds) return `${h}:${m}`
    const s = date.getSeconds().toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }, [getNowInCurrentZone])

  const contextValue = React.useMemo(() => ({
    timezone,
    setTimezone,
    timezoneInfo,
    convertWibTimeToCurrent,
    convertTimeRange,
    getNowInCurrentZone,
    formatCurrentTime,
  }), [
    timezone,
    setTimezone,
    timezoneInfo,
    convertWibTimeToCurrent,
    convertTimeRange,
    getNowInCurrentZone,
    formatCurrentTime,
  ])

  return (
    <TimezoneContext.Provider value={contextValue}>
      {children}
    </TimezoneContext.Provider>
  )
}

export function useTimezone() {
  const context = React.useContext(TimezoneContext)
  if (!context) {
    // Fallback safe object if outside provider
    return {
      timezone: 'WIB' as IndonesianTimezone,
      setTimezone: () => {},
      timezoneInfo: TIMEZONES.WIB,
      convertWibTimeToCurrent: (t: string) => t,
      convertTimeRange: (r: string) => r,
      getNowInCurrentZone: () => new Date(),
      formatCurrentTime: () => '00:00:00',
    }
  }
  return context
}
