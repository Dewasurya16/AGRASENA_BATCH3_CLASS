'use client'

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  bodyClassName,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto p-3 sm:p-6 flex min-h-screen items-center justify-center">
      {/* Full-Screen Deep Frosted Backdrop Blur (Direct on document.body) */}
      <div
        className="fixed inset-0 bg-slate-950/75 dark:bg-black/85 transition-all duration-300 animate-fadeIn"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        onClick={onClose}
      />

      {/* Modal Card Container */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[94vh] flex flex-col rounded-[16px] bg-white dark:bg-[#1B2130] shadow-2xl shadow-black/60 dark:shadow-black/90 border border-slate-200 dark:border-[#2A3550] transition-all animate-scaleUp my-auto overflow-hidden",
          className
        )}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 dark:border-[#2A3550] bg-[#FAFBFD] dark:bg-[#1E2535] shrink-0">
          <div className="pr-4 space-y-0.5">
            <h3 className="text-base sm:text-lg font-black text-[#131E29] dark:text-[#D8E0EC] tracking-tight">{title}</h3>
            {description && (
              <p className="text-xs text-[#6B7C93] dark:text-[#8A9BB8] leading-relaxed">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Modal"
            className="rounded-full bg-slate-100 dark:bg-[#253045] p-2 text-slate-500 dark:text-[#7A8FA8] hover:bg-slate-200 dark:hover:bg-[#2D3A52] hover:text-slate-800 dark:hover:text-[#D8E0EC] transition shrink-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body with internal scrolling */}
        <div className={cn("flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain text-[#18181B] dark:text-[#D8E0EC]", bodyClassName)}>
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
