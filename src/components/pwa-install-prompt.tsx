'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, Download, X, Share, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react'
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
  const [isMobileDevice, setIsMobileDevice] = React.useState(false)

  React.useEffect(() => {
    try {
      // 1. Check standalone mode
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true

      setIsStandalone(isStandaloneMode)

      // 2. Check dismissal state
      const dismissedSession = sessionStorage.getItem('pwa_prompt_dismissed')
      if (dismissedSession) {
        setIsDismissed(true)
      }

      // 3. Detect iOS & mobile/touch device
      const userAgent = window.navigator.userAgent.toLowerCase()
      const isIos = /iphone|ipad|ipod/.test(userAgent)
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || window.innerWidth < 1024

      setIsIOS(isIos)
      setIsMobileDevice(isMobile)

      // 4. Android beforeinstallprompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e as BeforeInstallPromptEvent)
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    } catch {
      // Safe fallback
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const choiceResult = await deferredPrompt.userChoice
        if (choiceResult.outcome === 'accepted') {
          setIsDismissed(true)
          setDeferredPrompt(null)
          sessionStorage.setItem('pwa_prompt_dismissed', 'true')
        }
      } catch {
        setShowModal(true)
      }
    } else {
      setShowModal(true)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    try {
      sessionStorage.setItem('pwa_prompt_dismissed', 'true')
    } catch {
      // Ignore
    }
  }

  // Hide on desktop (>= 1024px) or if standalone or dismissed
  if (!isMobileDevice || isStandalone || isDismissed) {
    return null
  }

  return (
    <>
      {/* ── Floating Mobile (Android & iOS) Install Banner ── */}
      <AnimatePresence>
        {!isDismissed && (
          <motion.aside
            aria-label="Install Aplikasi Web Kelas"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-3 right-3 sm:left-auto sm:right-6 z-40 sm:max-w-sm md:hidden"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-[#151A24]/95 backdrop-blur-xl border border-emerald-500/30 dark:border-emerald-500/25 shadow-2xl p-3.5 sm:p-4 text-[#131E29] dark:text-white">
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-[#FF7643] to-indigo-500" />

              <div className="flex items-center gap-3">
                {/* App Icon */}
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#1C2333] p-1 border border-slate-200/80 dark:border-[#2A3550] shadow-xs">
                  <img
                    src="/Logo.webp"
                    alt="Logo Prakom"
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white font-bold shadow-xs">
                    ✓
                  </div>
                </div>

                {/* Info Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      Web Kelas Batch 3
                    </h4>
                    <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 text-[8px] font-black uppercase text-emerald-700 dark:text-emerald-400">
                      PWA
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1 mt-0.5 font-medium">
                    {isIOS ? 'Akses cepat & offline di iPhone' : 'Install aplikasi di Android untuk akses cepat'}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleDismiss}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#222B3D] transition cursor-pointer"
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
                  className="flex-1 h-8.5 rounded-xl bg-[#0D3830] hover:bg-[#092620] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isIOS ? 'Cara Pasang' : 'Install Aplikasi'}</span>
                </Button>

                <Button
                  onClick={() => setShowModal(true)}
                  variant="outline"
                  size="sm"
                  className="h-8.5 px-3 rounded-xl border-slate-200 dark:border-[#2A3550] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E2638] text-xs font-semibold cursor-pointer"
                >
                  Panduan
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Informational Guide Modal (iOS & Android) ── */}
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

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#2A3550] p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#2A3550]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-[#0D3830] dark:text-emerald-400">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold leading-snug">
                      Install Aplikasi Web Kelas
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      PWA Resmi Prakom Batch 3 Kejaksaan RI
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-[#1F2738] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Step by Step Guides */}
              <div className="py-4 space-y-3.5 text-xs">
                {/* Android Chrome Guide */}
                <div className={`rounded-xl p-3.5 border transition ${!isIOS ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-50 dark:bg-[#1A2235] border-slate-200/80 dark:border-[#2A3550]/70'}`}>
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white font-black">
                      A
                    </span>
                    <span>Android (Google Chrome / Edge)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    <li>
                      Klik tombol <strong>"Install Sekarang"</strong> di bawah.
                    </li>
                    <li>
                      Atau ketuk menu titik tiga (<strong>⋮</strong>) di pojok kanan atas browser Chrome.
                    </li>
                    <li>
                      Pilih opsi <strong>"Install Aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
                    </li>
                  </ol>
                </div>

                {/* iOS Safari Guide */}
                <div className={`rounded-xl p-3.5 border transition ${isIOS ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500/30' : 'bg-slate-50 dark:bg-[#1A2235] border-slate-200/80 dark:border-[#2A3550]/70'}`}>
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-black">
                      i
                    </span>
                    <span>iPhone / iPad (Safari)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    <li>
                      Buka website di browser <strong>Safari</strong> (bukan di dalam in-app browser WA).
                    </li>
                    <li>
                      Tap ikon <strong>Bagikan (Share <Share className="inline h-3 w-3 mx-0.5 text-blue-500" />)</strong> di bilah bawah Safari.
                    </li>
                    <li>
                      Scroll dan pilih <strong>"Add to Home Screen" (<PlusSquare className="inline h-3 w-3 mx-0.5 text-slate-700 dark:text-slate-300" />)</strong>.
                    </li>
                  </ol>
                </div>

                {/* Features & Benefits */}
                <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 p-2.5 text-emerald-800 dark:text-emerald-300 text-[11px]">
                  <Sparkles className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="leading-tight font-medium">
                    Akses satu ketuk di homescreen, bebas tabrakan status bar, dan performa mulus.
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#2A3550]">
                {deferredPrompt && (
                  <Button
                    onClick={async () => {
                      setShowModal(false)
                      await handleInstallClick()
                    }}
                    className="h-9 px-4 rounded-xl bg-[#0D3830] hover:bg-[#092620] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-sm cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Install Sekarang
                  </Button>
                )}
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="h-9 px-4 rounded-xl border-slate-200 dark:border-[#2A3550] text-xs font-semibold cursor-pointer"
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
