import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates the exact timestamp for 23:59:59 (WIB / Asia/Jakarta) on the task's due date.
 * Guarantees that on any given day, the deadline remains active until 23:59:59 at night.
 */
export function getTaskDeadlineTimestamp(dueDateStr: string): number {
  if (!dueDateStr) return 0

  // Standardize date extraction in Asia/Jakarta timezone
  const d = new Date(dueDateStr)
  let datePart = ""

  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    datePart = formatter.format(d) // "YYYY-MM-DD"
  } catch {
    const match = dueDateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) datePart = match[0]
  }

  if (datePart) {
    const [y, m, day] = datePart.split("-").map(Number)
    // 23:59:59.999 in WIB (UTC+7) corresponds to 16:59:59.999 UTC
    const targetUTC = new Date(Date.UTC(y, m - 1, day, 16, 59, 59, 999))
    return targetUTC.getTime()
  }

  const fallback = new Date(dueDateStr)
  fallback.setHours(23, 59, 59, 999)
  return fallback.getTime()
}
