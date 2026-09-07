'use client'

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
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

  if (!mounted) return null

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto p-3 sm:p-6 flex min-h-screen items-center justify-center">
          {/* Backdrop with smooth fade in and out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-slate-950/70 dark:bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Card with smooth scale & translate spring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative z-10 w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[92vh] flex flex-col rounded-[20px] bg-white dark:bg-[#151c28] shadow-2xl shadow-black/40 dark:shadow-black/80 border border-slate-200 dark:border-white/10 my-auto overflow-hidden",
              className
            )}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-[#121824] shrink-0">
              <div className="pr-4 space-y-0.5">
                <h3 className="text-base sm:text-lg font-bold text-[#131E29] dark:text-[#D8E0EC] tracking-tight">{title}</h3>
                {description && (
                  <p className="text-xs text-[#6B7C93] dark:text-[#8A9BB8] leading-relaxed">{description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup Modal"
                className="rounded-full bg-slate-200/70 dark:bg-white/10 p-1.5 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 hover:text-slate-800 dark:hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body with internal scrolling */}
            <div className={cn("flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain text-[#18181B] dark:text-[#D8E0EC]", bodyClassName)}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

