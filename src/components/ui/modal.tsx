'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex min-h-screen items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0A1612]/60 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Card Container */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[92vh] flex flex-col rounded-[32px] bg-white shadow-2xl shadow-black/25 border-2 border-slate-200 transition-all animate-scaleUp my-auto overflow-hidden",
          className
        )}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 bg-[#FAFBFD] shrink-0">
          <div className="pr-4 space-y-0.5">
            <h3 className="text-base sm:text-lg font-black text-[#131E29] tracking-tight">{title}</h3>
            {description && (
              <p className="text-xs text-[#6B7C93] leading-relaxed">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Modal"
            className="rounded-full bg-slate-200/80 p-2 text-slate-500 hover:bg-slate-300 hover:text-slate-800 transition shrink-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body with internal scrolling */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 overscroll-contain text-[#18181B]">
          {children}
        </div>
      </div>
    </div>
  )
}
