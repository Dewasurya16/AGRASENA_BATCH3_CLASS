/**
 * Calendar Utilities for syncing Diklat schedules to Google Calendar & Apple/Outlook iCal (.ics)
 */

export interface CalendarEvent {
  title: string
  description: string
  location?: string
  startDate: string // YYYY-MM-DD or YYYYMMDD
  startTime: string // HH:mm
  endTime: string // HH:mm
}

const MONTH_MAP: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', mei: '05', may: '05',
  jun: '06', jul: '07', agu: '08', aug: '08', sep: '09', okt: '10', oct: '10',
  nov: '11', des: '12', dec: '12'
}

function parseToIsoDate(dateStr: string): string {
  if (!dateStr) return '20260827'
  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr.replace(/-/g, '')
  }
  // If formatted like "27 Agu 2026" or "27 Agustus 2026"
  const parts = dateStr.trim().split(/\s+/)
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0')
    const monthKey = parts[1].toLowerCase().slice(0, 3)
    const month = MONTH_MAP[monthKey] || '08'
    const year = parts[2]
    return `${year}${month}${day}`
  }
  return dateStr.replace(/[^0-9]/g, '').slice(0, 8) || '20260827'
}

/**
 * Formats a date and time string into Google Calendar compatible ISO string (YYYYMMDDTHHmmss)
 */
function formatToGCalDateTime(dateStr: string, timeStr: string): string {
  const cleanDate = parseToIsoDate(dateStr)
  const cleanTime = (timeStr || '08:00').replace(/[^0-9]/g, '').slice(0, 4).padEnd(4, '0') + '00'
  return `${cleanDate}T${cleanTime}`
}

/**
 * Generates direct Google Calendar Add Event URL
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const start = formatToGCalDateTime(event.startDate, event.startTime)
  const end = formatToGCalDateTime(event.startDate, event.endTime)
  const location = event.location || 'Ruang Diklat Virtual Zoom Pusdiklat Kejaksaan RI'
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `[Diklat Prakom Batch 3] ${event.title}`,
    dates: `${start}/${end}`,
    details: `${event.description}\n\n🔗 Akses Portal LMS: https://pengembangan.kejaksaan.go.id\n💻 Web Kelas Agrasena: https://pengembangan.kejaksaan.go.id`,
    location: location,
    ctz: 'Asia/Jakarta'
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Generates and triggers download of .ics iCalendar file for Apple Calendar, Outlook, and Android
 */
export function downloadIcsFile(event: CalendarEvent): void {
  const start = formatToGCalDateTime(event.startDate, event.startTime)
  const end = formatToGCalDateTime(event.startDate, event.endTime)
  const location = event.location || 'Ruang Diklat Virtual Zoom Pusdiklat Kejaksaan RI'
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Diklat Prakom Batch 3//Web Kelas Agrasena//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:diklat-prakom-${Date.now()}@kejaksaan.go.id`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=Asia/Jakarta:${start}`,
    `DTEND;TZID=Asia/Jakarta:${end}`,
    `SUMMARY:[Diklat Prakom Batch 3] ${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}\\n\\nPortal LMS: https://pengembangan.kejaksaan.go.id`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'DESCRIPTION:Pengingat Sesi Perkuliahan Diklat Prakom',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `Jadwal_Diklat_${event.startDate}_${event.title.slice(0, 20).replace(/\s+/g, '_')}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
