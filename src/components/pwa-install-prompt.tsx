'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, Download, X, CheckCircle2, Share, PlusSquare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = React.useState(false)
  const [isDismissed, setIsDismissed] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)
  const [isIOS, setIsIOS] = React.useState(false)

  React.useEffect(() => {
    // 1. Check if already installed / running in standalone mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true

    setIsStandalone(isStandaloneMode)

    // Check if dismissed in this session
    const dismissedSession = sessionStorage.getItem('pwa_prompt_dismissed')
    if (dismissedSession) {
      setIsDismissed(true)
    }

    // 2. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(isIosDevice)

    // 3. Listen for Android Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Trigger native Chrome/Android install prompt
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      if (choiceResult.outcome === 'accepted') {
        setIsDismissed(true)
        setDeferredPrompt(null)
      }
    } else {
      // Open informative guide modal (for iOS or browsers without native prompt)
      setShowModal(true)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem('pwa_prompt_dismissed', 'true')
  }

  // If already running standalone or dismissed, don't show the floating banner
  if (isStandalone || isDismissed) {
    return null
  }

  return (
    <>
      {/* ── Floating Mobile / Desktop Install Banner ── */}
      <AnimatePresence>
        {!isDismissed && (
          <motion.aside
            aria-label="Install Aplikasi Web Kelas"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed bottom-20 sm:bottom-6 left-3.5 right-3.5 sm:left-auto sm:right-6 z-40 sm:max-w-md"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-[#121620]/95 backdrop-blur-xl border border-emerald-500/30 dark:border-emerald-500/20 shadow-2xl p-4 sm:p-4.5 text-[#131E29] dark:text-white">
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-[#FF7643] to-indigo-500" />

              <div className="flex items-center gap-3.5">
                {/* App Icon */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#1A2235] p-1 border border-slate-200/80 dark:border-[#2A3550] shadow-sm">
                  <img
                    src="/icon-192x192.png"
                    alt="Logo Prakom"
                    className="h-full w-full object-contain rounded-lg"
                  />
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white font-bold">
                    ✓
                  </div>
                </div>

                {/* Text Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      Web Kelas Batch 3
                    </h4>
                    <span className="rounded bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                      App
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1 mt-0.5">
                    Install di Android & iOS untuk akses cepat offline
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleDismiss}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1F2738] transition"
                  aria-label="Tutup"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center gap-2">
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  className="flex-1 h-9 rounded-xl bg-[#0D3830] hover:bg-[#092620] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Install Aplikasi</span>
                </Button>

                <Button
                  onClick={() => setShowModal(true)}
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 rounded-xl border-slate-200 dark:border-[#2A3550] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A2235] text-xs font-semibold cursor-pointer"
                >
                  Panduan
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Informational Guide Modal ── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#2A3550] p-6 shadow-2xl text-slate-900 dark:text-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2A3550]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-[#0D3830] dark:text-emerald-400">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold leading-snug">
                      Install Aplikasi Web Kelas
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      PWA Resmi Prakom Batch 3 Kejaksaan RI
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-[#1F2738] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body Guides */}
              <div className="py-5 space-y-4 text-xs">
                {/* Android Chrome Guide */}
                <div className="rounded-2xl bg-slate-50 dark:bg-[#1A2235] p-4 border border-slate-200/80 dark:border-[#2A3550]/70 space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white font-black">
                      A
                    </span>
                    <span>Android (Google Chrome / Edge)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
                    <li>
                      Klik tombol <strong>"Install Sekarang"</strong> di bawah.
                    </li>
                    <li>
                      Atau tap menu titik tiga (<strong>⋮</strong>) di pojok kanan atas browser.
                    </li>
                    <li>
                      Pilih <strong>"Install Aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
                    </li>
                  </ol>
                </div>

                {/* iOS Safari Guide */}
                <div className="rounded-2xl bg-slate-50 dark:bg-[#1A2235] p-4 border border-slate-200/80 dark:border-[#2A3550]/70 space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-black">
                      i
                    </span>
                    <span>iPhone / iPad (Safari)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
                    <li>
                      Buka website ini melalui browser <strong>Safari</strong>.
                    </li>
                    <li>
                      Tap tombol <strong>Bagikan (Share <Share className="inline h-3.5 w-3.5" />)</strong> di menu bawah Safari.
                    </li>
                    <li>
                      Scroll ke bawah dan pilih <strong>"Add to Home Screen" (<PlusSquare className="inline h-3.5 w-3.5" />)</strong>.
                    </li>
                  </ol>
                </div>

                {/* Keunggulan */}
                <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 p-3 text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[11px] leading-tight font-medium">
                    Aplikasi berjalan full-screen tanpa address bar browser, hemat kuota data, dan mendukung akses materi saat koneksi lambat.
                  </span>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#2A3550]">
                {deferredPrompt && (
                  <Button
                    onClick={async () => {
                      setShowModal(false)
                      await handleInstallClick()
                    }}
                    className="h-10 px-5 rounded-xl bg-[#0D3830] hover:bg-[#092620] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    <Download className="h-4 w-4 mr-1.5" />
                    Install Sekarang
                  </Button>
                )}
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="h-10 px-4 rounded-xl border-slate-200 dark:border-[#2A3550] text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
