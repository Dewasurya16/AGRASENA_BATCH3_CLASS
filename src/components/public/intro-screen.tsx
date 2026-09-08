'use client'

import * as React from "react"
import anime from "animejs"
import "./anime-intro-logo.css"
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  User,
  Building2,
  CreditCard,
  Edit3,
  AlertCircle,
  BookOpen,
  Calendar,
  RotateCcw,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Spinner } from "@/components/ui/spinner"

function getTimeGreeting(): { greeting: string; period: string; icon: string } {
  const hours = new Date().getHours()
  if (hours >= 4 && hours < 11) {
    return { greeting: "Selamat Pagi", period: "pagi ini", icon: "☀️" }
  } else if (hours >= 11 && hours < 15) {
    return { greeting: "Selamat Siang", period: "siang ini", icon: "🌤️" }
  } else if (hours >= 15 && hours < 18) {
    return { greeting: "Selamat Sore", period: "sore ini", icon: "🌅" }
  } else {
    return { greeting: "Selamat Malam", period: "malam ini", icon: "🌙" }
  }
}

function isProfileValid(pName: string, pSatker: string, pNip?: string): boolean {
  const trimmedName = (pName || "").trim()
  const trimmedSatker = (pSatker || "").trim()
  const trimmedNip = (pNip || "").trim()
  return (
    trimmedName.length >= 3 &&
    trimmedName.toLowerCase() !== "peserta diklat" &&
    trimmedSatker.length >= 3 &&
    trimmedNip.length >= 6
  )
}

// Pilihan Karakter Maskot 3D Prakom Andal (Duo Kejaksaan + Apple Emojis)
const PRAKOM_CHARACTERS = [
  {
    id: 'duo-kejaksaan',
    name: 'Duo Prakom Kejaksaan',
    role: 'Pria & Wanita Seragam Dinas',
    src: '/prakom-duo-transparent.png',
    thumb: '/prakom-duo-transparent.png',
    quote: 'Siap Belajar & Berkarya Bersama! 🇮🇩',
  },
  {
    id: 'prakom-dev',
    name: 'Prakom Dev',
    role: 'Pengembang Aplikasi TI',
    src: '/memoji-prakom-transparent.png',
    thumb: '/memoji-prakom-transparent.png',
    quote: 'Yuk Coding & Bangun Solusi! 💻',
  },
  {
    id: 'prakom-female',
    name: 'Prakom Hijab',
    role: 'Tata Kelola Sistem TI',
    src: '/memoji-prakom-female-transparent.png',
    thumb: '/memoji-prakom-female-transparent.png',
    quote: 'Tata Kelola TI Andal & Presisi! ✨',
  },
  {
    id: 'prakom-thumbs',
    name: 'Prakom WWDC',
    role: 'Infrastruktur Jaringan TI',
    src: '/memoji-prakom-thumbs-transparent.png',
    thumb: '/memoji-prakom-thumbs-transparent.png',
    quote: 'Infrastruktur & Inovasi Digital! 🚀',
  }
]

export function IntroScreen() {
  const [mounted, setMounted] = React.useState(false)
  const [showIntro, setShowIntro] = React.useState(false)
  const [viewState, setViewState] = React.useState<'welcome' | 'form' | 'recognized'>('welcome')
  const [hasExistingProfile, setHasExistingProfile] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isExiting, setIsExiting] = React.useState(false)
  const [isAnimationPlaying, setIsAnimationPlaying] = React.useState(false)
  const [activeCharIndex, setActiveCharIndex] = React.useState(0)
  const currentChar = PRAKOM_CHARACTERS[activeCharIndex]
  const { theme, toggleTheme } = useTheme()

  const [name, setName] = React.useState("")
  const [nip, setNip] = React.useState("")
  const [satker, setSatker] = React.useState("")
  const [timeInfo, setTimeInfo] = React.useState({ greeting: "Selamat Datang", period: "hari ini", icon: "👋" })

  const modalRef = React.useRef<HTMLDivElement>(null)
  const contentCardRef = React.useRef<HTMLDivElement>(null)
  const timelineRef = React.useRef<anime.AnimeTimelineInstance | null>(null)

  // Inisialisasi status profil dan sesi:
  // - User yang BELUM mengisi nama data (baru maupun lama) TIDAK BISA MASUK!
  // - User yang SUDAH PERNAH mengisi otomatis langsung masuk ke portal!
  React.useEffect(() => {
    try {
      const savedName = localStorage.getItem("prakom_user_name") || ""
      const savedNip = localStorage.getItem("prakom_user_nip") || ""
      const savedSatker = localStorage.getItem("prakom_user_satker") || ""

      const valid = isProfileValid(savedName, savedSatker, savedNip)

      if (savedName) setName(savedName)
      if (savedNip) setNip(savedNip)
      if (savedSatker) setSatker(savedSatker)
      setHasExistingProfile(valid)

      // JIKA SUDAH PERNAH MENGISI LENGKAP: OTOMATIS BISA MASUK!
      if (valid) {
        try {
          sessionStorage.setItem("has_entered_portal_session", "true")
        } catch {}
        setMounted(true)
        setShowIntro(false)
        return
      }

      // JIKA BELUM PERNAH MENGISI ATAU DATA BELUM VALID (BAIK USER BARU MAUPUN LAMA):
      // KUNCI AKSES! TIDAK BISA MASUK SEBELUM ISI DATA!
      try {
        sessionStorage.removeItem("has_entered_portal_session")
      } catch {}

      setTimeInfo(getTimeGreeting())
      setMounted(true)
      setShowIntro(true)
      
      // Jika ada nama tersimpan lama tapi NIP/Satker belum lengkap, langsung minta lengkapi
      if (savedName.trim() && !valid) {
        setViewState('form')
        setErrorMessage("Silakan lengkapi NIP dan Satuan Kerja Anda untuk membuka akses portal.")
      } else {
        setViewState('welcome')
      }
    } catch {
      setMounted(true)
      setShowIntro(true)
      setViewState('welcome')
    }
  }, [])

  // Event listener jika ada yang memicu pembukaan intro secara manual (misal klik profil navbar)
  React.useEffect(() => {
    const handleOpenIntro = () => {
      const savedName = localStorage.getItem("prakom_user_name") || ""
      const savedNip = localStorage.getItem("prakom_user_nip") || ""
      const savedSatker = localStorage.getItem("prakom_user_satker") || ""
      const valid = isProfileValid(savedName, savedSatker, savedNip)

      if (savedName) setName(savedName)
      if (savedNip) setNip(savedNip)
      if (savedSatker) setSatker(savedSatker)
      setHasExistingProfile(valid)

      setShowIntro(true)
      setIsExiting(false)
      setViewState(valid ? 'recognized' : 'form')
    }
    window.addEventListener("prakom-open-intro", handleOpenIntro)
    return () => window.removeEventListener("prakom-open-intro", handleOpenIntro)
  }, [])

  // Cegah scrolling background ketika intro modal aktif
  React.useEffect(() => {
    if (showIntro) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [showIntro])

  // =========================================================================
  // KINETIC SQUASH & STRETCH ANIMATION TIMELINE: "Hallo ! 👋"
  // Menggunakan fisika elastis murni Anime.js (Julian Garnier Bounce & Rebound)
  // =========================================================================
  const playLogoAnimation = React.useCallback(() => {
    const root = modalRef.current
    if (!root) return

    const ambientGlow = root.querySelector('.apple-ambient-glow')
    const heroStage = root.querySelector('.prakom-character-stage')
    const speechBubble = root.querySelector('.prakom-speech-bubble')
    const chars = root.querySelectorAll('.apple-char')
    const excl = root.querySelector('.apple-char-excl')
    const waveEmoji = root.querySelector<HTMLElement>('.apple-wave-emoji')
    const descTitle = root.querySelector('.apple-desc-title')
    const descP = root.querySelector('.apple-desc-p')
    const interactivePanel = root.querySelector('.interactive-panel')

    // Hentikan timeline lama jika ada
    if (timelineRef.current) {
      try {
        timelineRef.current.pause()
      } catch {}
    }

    setIsAnimationPlaying(true)
    if (waveEmoji) {
      waveEmoji.classList.remove('animate-apple-wave')
    }

    // Set nilai awal: posisi bawah tanah terkompresi
    anime.set(chars, {
      transformOrigin: '50% 100% 0px',
      translateY: 140,
      scaleX: 0.35,
      scaleY: 0.3,
      opacity: 0.001,
      rotateZ: -18
    })

    if (excl) {
      anime.set(excl, {
        transformOrigin: '50% 100% 0px',
        translateY: -220,
        scaleX: 0.5,
        scaleY: 1.8,
        opacity: 0.001,
        rotateZ: 25
      })
    }

    if (waveEmoji) {
      anime.set(waveEmoji, {
        transformOrigin: '75% 85% 0px',
        translateY: -180,
        scaleX: 0.6,
        scaleY: 1.6,
        opacity: 0.001,
        rotateZ: -45
      })
    }

    if (heroStage) anime.set(heroStage, { opacity: 0.001, scale: 0.88, translateY: 25 })
    if (speechBubble) anime.set(speechBubble, { opacity: 0.001, scale: 0.7, translateY: 12 })
    if (ambientGlow) anime.set(ambientGlow, { opacity: 0.001, scale: 0.5 })
    if (descTitle && descP) anime.set([descTitle, descP], { opacity: 0.001, translateY: 35 })
    if (interactivePanel) anime.set(interactivePanel, { opacity: 0.001, translateY: 30 })

    // Konstruksi Timeline kinetik elastis penuh
    const tl = anime.timeline({
      autoplay: false,
      easing: 'easeOutSine',
      complete: () => {
        setIsAnimationPlaying(false)
        if (waveEmoji) {
          waveEmoji.classList.add('animate-apple-wave')
        }
      }
    })

    // 1. Mekar lingkaran ambient cahaya Apple
    tl.add({
      targets: ambientGlow,
      opacity: [0.001, 1],
      scale: [0.5, 1],
      duration: 1000,
      easing: 'easeOutCubic'
    }, 40)
      // 2. Ilustrasi Karakter 3D Prakom & Balon Kata membal naik elastis
      .add({
        targets: heroStage,
        opacity: [0.001, 1],
        scale: [0.88, 1],
        translateY: [25, 0],
        duration: 700,
        easing: 'easeOutElastic(1.05, 0.7)'
      }, 100)
      .add({
        targets: speechBubble,
        opacity: [0.001, 1],
        scale: [0.7, 1],
        translateY: [12, 0],
        duration: 550,
        easing: 'easeOutElastic(1.2, 0.65)'
      }, 180)
      // 4. Huruf H - a - l - l - o melompat elastis (Squash & Stretch Rebound)
      .add({
        targets: chars,
        transformOrigin: ['50% 100% 0px', '50% 100% 0px'],
        opacity: { value: [0.001, 1], duration: 90 },
        translateY: [
          { value: [140, -110], duration: 200, endDelay: 20, easing: 'cubicBezier(0.225, 1, 0.915, 0.980)' },
          { value: 6, duration: 130, easing: 'easeInQuad' },
          { value: -14, duration: 110, easing: 'easeOutQuad' },
          { value: 0, duration: 180, easing: 'easeOutQuad' }
        ],
        scaleX: [
          { value: [0.35, 0.85], duration: 200, easing: 'easeOutQuad' },
          { value: 1.28, duration: 130, delay: 70, easing: 'easeInOutSine' },
          { value: 0.94, duration: 110, easing: 'easeOutQuad' },
          { value: 1, duration: 220, easing: 'easeOutElastic(1, .6)' }
        ],
        scaleY: [
          { value: [0.3, 1.35], duration: 180, easing: 'easeOutSine' },
          { value: 0.55, duration: 130, delay: 70, easing: 'easeInOutSine' },
          { value: 1.12, duration: 110, easing: 'easeOutQuad' },
          { value: 1, duration: 260, easing: 'easeOutElastic(1, .6)' }
        ],
        rotateZ: [
          { value: [-18, 8], duration: 200, easing: 'easeOutQuad' },
          { value: -4, duration: 130, easing: 'easeInOutSine' },
          { value: 0, duration: 200, easing: 'easeOutElastic(1, .5)' }
        ],
        delay: anime.stagger(85, { start: 80 })
      }, 180)
      // 4. Tanda seru emas (!) jatuh dari atas, menghantam dan membal tinggi
      .add({
        targets: excl,
        transformOrigin: ['50% 100% 0px', '50% 100% 0px'],
        opacity: { value: [0.001, 1], duration: 80 },
        translateY: [
          { value: [-220, 8], duration: 280, easing: 'cubicBezier(0.350, 0.560, 0.305, 1)' },
          { value: -22, duration: 150, easing: 'easeOutQuad' },
          { value: 4, duration: 100, easing: 'easeInQuad' },
          { value: 0, duration: 180, easing: 'easeOutElastic(1.2, .5)' }
        ],
        scaleX: [
          { value: [0.5, 0.8], duration: 280, easing: 'easeInQuad' },
          { value: 1.45, duration: 120, easing: 'easeInOutSine' },
          { value: 0.9, duration: 120, easing: 'easeOutQuad' },
          { value: 1, duration: 240, easing: 'easeOutElastic(1.2, .5)' }
        ],
        scaleY: [
          { value: [1.8, 1.4], duration: 280, easing: 'easeInQuad' },
          { value: 0.45, duration: 120, easing: 'easeInOutSine' },
          { value: 1.15, duration: 120, easing: 'easeOutQuad' },
          { value: 1, duration: 240, easing: 'easeOutElastic(1.2, .5)' }
        ],
        rotateZ: [
          { value: [25, -10], duration: 280, easing: 'easeOutQuad' },
          { value: 4, duration: 120, easing: 'easeInOutSine' },
          { value: 0, duration: 200, easing: 'easeOutElastic(1, .5)' }
        ]
      }, '-=220')
      // 5. Emotikon 👋 jatuh elastis, membal ke atas, dan siap melambai
      .add({
        targets: waveEmoji,
        transformOrigin: ['75% 85% 0px', '75% 85% 0px'],
        opacity: { value: [0.001, 1], duration: 100 },
        translateY: [
          { value: [-180, 8], duration: 320, easing: 'cubicBezier(0.350, 0.560, 0.305, 1)' },
          { value: -20, duration: 160, easing: 'easeOutQuad' },
          { value: 0, duration: 200, easing: 'easeOutElastic(1.1, .6)' }
        ],
        scaleX: [
          { value: [0.6, 0.9], duration: 320, easing: 'easeInQuad' },
          { value: 1.35, duration: 120, easing: 'easeInOutSine' },
          { value: 1, duration: 250, easing: 'easeOutElastic(1.1, .6)' }
        ],
        scaleY: [
          { value: [1.6, 1.2], duration: 320, easing: 'easeInQuad' },
          { value: 0.55, duration: 120, easing: 'easeInOutSine' },
          { value: 1, duration: 250, easing: 'easeOutElastic(1.1, .6)' }
        ],
        rotateZ: [
          { value: [-45, 22], duration: 320, easing: 'easeOutQuad' },
          { value: -12, duration: 140, easing: 'easeInOutSine' },
          { value: 0, duration: 200, easing: 'easeOutElastic(1, .5)' }
        ]
      }, '-=280')
      // 6. Deskripsi teks meluncur masuk halus
      .add({
        targets: [descTitle, descP],
        opacity: { value: [0.001, 1], duration: 500 },
        translateY: [
          { value: 35, duration: 0 },
          { value: 0, duration: 700, easing: 'easeOutElastic(1, .8)' }
        ],
        delay: anime.stagger(80)
      }, '-=200')
      // 7. Panel tombol aksi interaktif muncul siap digunakan
      .add({
        targets: interactivePanel,
        opacity: { value: [0.001, 1], duration: 450 },
        translateY: [
          { value: 30, duration: 0 },
          { value: 0, duration: 700, easing: 'easeOutElastic(1, .8)' }
        ]
      }, '-=350')

    timelineRef.current = tl
    tl.play()
  }, [])

  // Jalankan animasi saat intro pertama kali dibuka
  React.useEffect(() => {
    if (!showIntro) return
    const timer = setTimeout(() => {
      playLogoAnimation()
    }, 100)
    return () => {
      clearTimeout(timer)
      if (timelineRef.current) {
        try {
          timelineRef.current.pause()
        } catch {}
      }
    }
  }, [showIntro, playLogoAnimation])

  // Transisi pergantian view state (welcome <-> form <-> recognized)
  const handleSwitchViewState = (targetState: 'welcome' | 'form' | 'recognized') => {
    if (contentCardRef.current) {
      anime({
        targets: contentCardRef.current,
        opacity: [1, 0],
        translateY: [0, -10],
        scale: [1, 0.98],
        duration: 160,
        easing: 'easeInQuad',
        complete: () => {
          setErrorMessage(null)
          setViewState(targetState)
          setTimeout(() => {
            if (contentCardRef.current) {
              anime({
                targets: contentCardRef.current,
                opacity: [0, 1],
                translateY: [12, 0],
                scale: [0.98, 1],
                duration: 240,
                easing: 'easeOutCubic'
              })
            }
          }, 20)
        }
      })
    } else {
      setErrorMessage(null)
      setViewState(targetState)
    }
  }

  // Eksekusi animasi keluar dan pembukaan portal kelas
  const executePortalEntry = React.useCallback(() => {
    try {
      sessionStorage.setItem("has_entered_portal_session", "true")
    } catch {}

    setIsExiting(true)

    if (modalRef.current) {
      anime({
        targets: modalRef.current,
        opacity: [1, 0],
        scale: [1, 1.03],
        translateY: [0, -20],
        duration: 350,
        easing: 'easeInOutCubic',
        complete: () => {
          setShowIntro(false)
          setIsExiting(false)
          try {
            window.dispatchEvent(new CustomEvent("prakom-portal-entered"))
          } catch {}
        }
      })
    } else {
      setShowIntro(false)
      setIsExiting(false)
      try {
        window.dispatchEvent(new CustomEvent("prakom-portal-entered"))
      } catch {}
    }
  }, [])

  // Masuk ke portal kelas dengan validasi ketat
  const handleEnterPortal = React.useCallback(() => {
    if (isExiting) return

    const currentName = (name || localStorage.getItem("prakom_user_name") || "").trim()
    const currentSatker = (satker || localStorage.getItem("prakom_user_satker") || "").trim()
    const currentNip = (nip || localStorage.getItem("prakom_user_nip") || "").trim()

    if (!isProfileValid(currentName, currentSatker, currentNip)) {
      setErrorMessage("Silakan lengkapi data diri Anda (Nama, NIP, Satuan Kerja) terlebih dahulu untuk membuka akses.")
      handleSwitchViewState('form')
      return
    }

    executePortalEntry()
  }, [name, satker, nip, isExiting, executePortalEntry])

  // Simpan data profil peserta ke LocalStorage & langsung otomatis masuk portal
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()

    const finalName = name.trim()
    const finalNip = nip.trim()
    const finalSatker = satker.trim()

    if (!finalName) {
      setErrorMessage("Nama lengkap dan gelar wajib diisi.")
      return
    }
    if (finalName.toLowerCase() === "peserta diklat" || finalName.length < 3) {
      setErrorMessage("Mohon masukkan nama lengkap asli Anda (minimal 3 karakter).")
      return
    }
    if (!finalNip || finalNip.length < 6) {
      setErrorMessage("NIP wajib diisi dengan benar (minimal 6 karakter/digit).")
      return
    }
    if (!finalSatker || finalSatker.length < 3) {
      setErrorMessage("Satuan kerja wajib diisi (minimal 3 karakter).")
      return
    }

    setErrorMessage(null)

    try {
      localStorage.setItem("prakom_user_name", finalName)
      localStorage.setItem("prakom_user_nip", finalNip)
      localStorage.setItem("prakom_user_satker", finalSatker)
      localStorage.setItem("prakom_user_onboarded", "true")

      window.dispatchEvent(new CustomEvent("prakom-profile-updated", {
        detail: { name: finalName, nip: finalNip, satker: finalSatker }
      }))
    } catch {}

    setName(finalName)
    setNip(finalNip)
    setSatker(finalSatker)
    setHasExistingProfile(true)

    // Pengguna yang sudah mengisi data langsung otomatis masuk portal!
    executePortalEntry()
  }

  // Interaksi klik huruf: membal elastis (Squash & Bounce)
  const handleCharClick = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    anime({
      targets: el,
      transformOrigin: '50% 100% 0px',
      translateY: [
        { value: -32, duration: 180, easing: 'easeOutQuad' },
        { value: 5, duration: 130, easing: 'easeInQuad' },
        { value: 0, duration: 160, easing: 'easeOutBounce' }
      ],
      scaleX: [
        { value: 0.85, duration: 180 },
        { value: 1.25, duration: 130 },
        { value: 1, duration: 160 }
      ],
      scaleY: [
        { value: 1.28, duration: 180 },
        { value: 0.72, duration: 130 },
        { value: 1, duration: 160 }
      ]
    })
  }

  // Animasi elastis balon kata (speech bubble) saat ganti karakter
  const animateSpeechBubble = React.useCallback(() => {
    const root = modalRef.current
    const bubbleEl = root?.querySelector<HTMLElement>('.prakom-speech-bubble')
    if (bubbleEl) {
      anime({
        targets: bubbleEl,
        scale: [0.75, 1],
        opacity: [0.3, 1],
        translateY: [6, 0],
        duration: 360,
        easing: 'easeOutBack(2)'
      })
    }
  }, [])

  // Interaksi klik karakter 3D: pantulan elastis + ganti karakter berikutnya
  const handleCharacterClick = () => {
    const root = modalRef.current
    const avatarBtn = root?.querySelector<HTMLElement>('.prakom-character-avatar-btn')
    if (avatarBtn) {
      anime({
        targets: avatarBtn,
        scale: [
          { value: 0.93, duration: 90, easing: 'easeInQuad' },
          { value: 1.08, duration: 160, easing: 'easeOutBack(2)' },
          { value: 1, duration: 240, easing: 'easeOutElastic(1.1, 0.6)' }
        ]
      })
    }
    setActiveCharIndex((prev) => (prev + 1) % PRAKOM_CHARACTERS.length)
    setTimeout(animateSpeechBubble, 40)
  }

  // Pilih langsung dari tab switcher
  const handleSelectChar = (index: number) => {
    setActiveCharIndex(index)
    const root = modalRef.current
    const imgEl = root?.querySelector<HTMLElement>('.prakom-character-img')
    if (imgEl) {
      anime({
        targets: imgEl,
        scale: [
          { value: 0.9, duration: 80, easing: 'easeInQuad' },
          { value: 1.08, duration: 150, easing: 'easeOutBack(2)' },
          { value: 1, duration: 220, easing: 'easeOutElastic(1.1, 0.5)' }
        ]
      })
    }
    setTimeout(animateSpeechBubble, 40)
  }

  // Interaksi klik tangan: melambai gembira
  const handleWaveClick = () => {
    const root = modalRef.current
    const waveEmoji = root?.querySelector<HTMLElement>('.apple-wave-emoji')
    if (waveEmoji) {
      anime({
        targets: waveEmoji,
        transformOrigin: '75% 85% 0px',
        rotate: [0, 26, -18, 24, -10, 16, 0],
        scale: [1, 1.25, 1],
        duration: 850,
        easing: 'easeInOutSine'
      })
    }
  }

  // Keyboard shortcut Enter untuk masuk
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showIntro && viewState === 'recognized' && (e.key === "Enter" || e.key === " ")) {
        handleEnterPortal()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showIntro, viewState, handleEnterPortal])

  if (!mounted || !showIntro) return null

  const isDark = theme === 'dark'

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex h-[100dvh] min-h-[100dvh] w-full max-w-[100vw] flex-col justify-between items-center select-none overflow-y-auto bg-[#F8F9FC] dark:bg-[#0c1017] text-[#18181B] dark:text-[#E2E8F0] transition-colors duration-200 transform-gpu"
    >
      {/* ── Top Header Bar ── */}
      <div className="relative z-20 w-full max-w-5xl flex items-center justify-between px-4 sm:px-8 pt-3 sm:pt-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] overflow-hidden shadow-xs ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-[#141b27]">
            <img src="/Logo.webp" alt="Logo Prakom" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#18181B] dark:text-[#E2E8F0]">
              Pranata Komputer Keahlian
            </span>
            <span className="text-[10px] font-semibold text-[#6B7C93] dark:text-[#8FA3BC]">
              Kejaksaan RI × Agrasena 625
            </span>
          </div>
        </div>

        {/* Right: Badges & Controls */}
        <div className="flex items-center gap-2">
          {/* Replay Animation Button */}
          <button
            type="button"
            onClick={playLogoAnimation}
            disabled={isAnimationPlaying}
            title="Putar Ulang Animasi Kinetik"
            className="flex items-center gap-1.5 rounded-full bg-white dark:bg-[#141b27] px-3 py-1 text-[11px] font-semibold text-[#007aff] dark:text-[#60a5fa] border border-slate-200 dark:border-slate-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-[#1c2433] active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`h-3 w-3 ${isAnimationPlaying ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Putar Ulang</span>
          </button>

          <span className="rounded-full bg-white dark:bg-[#141b27] px-3 py-1 text-[10px] font-black text-[#007aff] dark:text-[#60a5fa] border border-slate-200 dark:border-slate-800 shadow-2xs hidden xs:inline">
            Batch 3 • 120 JP
          </span>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-[#1c2433] shadow-2xs cursor-pointer active:scale-95 transition"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── Center Content: Signature Kinetic "Hallo ! 👋" Typography ── */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4 py-2 sm:py-3 w-full max-w-2xl">

        <div className="apple-intro-container">
          {/* Soft Ambient Diffusion Orb */}
          <div className="apple-ambient-glow" />

          {/* Compact 3D Character Stage with Speech Bubble & Switcher */}
          <div className="prakom-character-stage prakom-character-float">
            {/* Balon Kata-kata Maskot (Apple-style Speech Bubble) */}
            <div
              onClick={handleCharacterClick}
              title={`${currentChar.name} • Klik untuk kata-kata maskot berikutnya!`}
              className="prakom-speech-bubble"
            >
              <span className="prakom-speech-text">{currentChar.quote}</span>
              <span className="prakom-speech-tail" />
            </div>

            <button
              type="button"
              onClick={handleCharacterClick}
              title={`${currentChar.name} • Klik untuk ganti emoji / karakter!`}
              className="prakom-character-avatar-btn group"
            >
              <img
                src={currentChar.src}
                alt={currentChar.name}
                className="prakom-character-img"
              />
            </button>

            {/* Compact Switcher Pill */}
            <div className="prakom-switcher-pill" role="tablist" aria-label="Pilih Karakter Maskot">
              {PRAKOM_CHARACTERS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCharIndex === idx}
                  onClick={() => handleSelectChar(idx)}
                  title={`${item.name} • ${item.role}`}
                  className={`prakom-switch-tab ${activeCharIndex === idx ? 'active' : ''}`}
                >
                  <img src={item.thumb} alt={item.name} />
                </button>
              ))}
            </div>
          </div>

          {/* Kinetic "Hallo!" with Interactive Elastic Letters & Waving Hand */}
          <div className="apple-hello-wrapper">
            <h1 className="apple-hello-title">
              <span className="apple-char" onClick={handleCharClick} title="Klik saya!">H</span>
              <span className="apple-char" onClick={handleCharClick} title="Klik saya!">a</span>
              <span className="apple-char" onClick={handleCharClick} title="Klik saya!">l</span>
              <span className="apple-char" onClick={handleCharClick} title="Klik saya!">l</span>
              <span className="apple-char" onClick={handleCharClick} title="Klik saya!">o</span>
              <span className="apple-char-excl" onClick={handleCharClick} title="Klik saya!">!</span>
            </h1>
            <span
              className="apple-wave-emoji"
              role="img"
              aria-label="Lambaian Tangan Apple"
              title="Klik untuk melambai!"
              onClick={handleWaveClick}
            >
              👋
            </span>
          </div>

          {/* Sub-headline & Description */}
          <div className="space-y-1">
            <h2 className="apple-desc-title text-[#18181B] dark:text-white">
              Diklat Fungsional <span className="text-[#007aff] dark:text-[#60a5fa]">Pranata Komputer</span>
            </h2>
            <p className="apple-desc-p text-[#615d59] dark:text-[#94a3b8]">
              Pusat materi 120 JP modul resmi, rundown 35 hari, simulasi kuis MOOC, dan asisten AI proposal makalah.
            </p>
          </div>
        </div>

        {/* ── Interactive User Action Panel (Welcome / Form / Recognized) ── */}
        <div
          ref={contentCardRef}
          className="interactive-panel w-full max-w-md mt-3 sm:mt-4 flex flex-col items-center opacity-0"
        >

          {/* 1. STATE: WELCOME (Pengunjung Baru) */}
          {viewState === 'welcome' && (
            <div className="flex flex-col items-center gap-4 w-full">
              {/* Badge Sapaan Jam */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#141b27] px-3.5 py-1 text-xs font-bold text-[#007aff] dark:text-[#60a5fa] border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span>{timeInfo.icon}</span>
                <span>{timeInfo.greeting}, Prakom Andal!</span>
              </div>

              {/* 3 Mini Feature Highlight Tiles */}
              <div className="grid grid-cols-3 gap-2 w-full">
                <div className="rounded-[14px] bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 p-2.5 flex flex-col items-center justify-center text-center shadow-2xs hover:border-[#007aff]/50 transition-colors">
                  <BookOpen className="h-4 w-4 text-[#007aff] mb-1" />
                  <span className="font-bold text-[11px] text-[#18181B] dark:text-white">120 JP</span>
                  <span className="text-[9px] text-[#615d59] dark:text-[#94a3b8]">Modul PDF</span>
                </div>
                <div className="rounded-[14px] bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 p-2.5 flex flex-col items-center justify-center text-center shadow-2xs hover:border-[#16a34a]/50 transition-colors">
                  <Calendar className="h-4 w-4 text-[#16a34a] dark:text-[#4ade80] mb-1" />
                  <span className="font-bold text-[11px] text-[#18181B] dark:text-white">35 Hari</span>
                  <span className="text-[9px] text-[#615d59] dark:text-[#94a3b8]">Roadmap Sesi</span>
                </div>
                <div className="rounded-[14px] bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 p-2.5 flex flex-col items-center justify-center text-center shadow-2xs hover:border-[#af52de]/50 transition-colors">
                  <Sparkles className="h-4 w-4 text-[#af52de] dark:text-[#c084fc] mb-1" />
                  <span className="font-bold text-[11px] text-[#18181B] dark:text-white">AI Makalah</span>
                  <span className="text-[9px] text-[#615d59] dark:text-[#94a3b8]">Generator Satker</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="w-full flex flex-col items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSwitchViewState('form')}
                  className="group relative flex items-center justify-center gap-2.5 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white w-full py-3.5 px-6 text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Isi Data Diri & Buka Akses Portal</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium text-center">
                  🔒 Wajib mengisi Nama, NIP, & Satker untuk membuka akses portal
                </span>
              </div>
            </div>
          )}

          {/* 2. STATE: FORM (Pengisian Identitas) */}
          {viewState === 'form' && (
            <div className="w-full rounded-[20px] bg-white dark:bg-[#141b27] p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-left">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                <button
                  type="button"
                  onClick={() => handleSwitchViewState(hasExistingProfile ? 'recognized' : 'welcome')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#615d59] dark:text-[#94a3b8] hover:text-[#000000] dark:hover:text-white transition cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{hasExistingProfile ? "Tutup" : "Kembali"}</span>
                </button>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#007aff] dark:text-[#60a5fa] bg-[#007aff]/10 dark:bg-[#007aff]/20 px-2.5 py-0.5 rounded-full">
                  Identitas Peserta Diklat (Wajib)
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#18181B] dark:text-white">
                  {hasExistingProfile ? "Perbarui Identitas Peserta" : "Lengkapi Data Diri Peserta"}
                </h3>
                <p className="text-xs text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
                  Data Anda tersimpan secara lokal di browser untuk sertifikat, kuis, dan draf AI Makalah.
                </p>
              </div>

              {errorMessage && (
                <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-2.5 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#18181B] dark:text-slate-200">
                    Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 h-4 w-4 text-[#615d59] dark:text-[#94a3b8]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (errorMessage) setErrorMessage(null)
                      }}
                      placeholder="Contoh: Dewa Sinar Surya, S.Kom."
                      required
                      autoFocus
                      className="w-full rounded-[10px] bg-[#f6f5f4] dark:bg-[#101520] border border-slate-200 dark:border-slate-800 pl-9 pr-3 py-2 text-xs text-[#18181B] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#64748b] focus:outline-hidden focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#18181B] dark:text-slate-200">
                    NIP (Nomor Induk Pegawai) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <CreditCard className="absolute left-3 h-4 w-4 text-[#615d59] dark:text-[#94a3b8]" />
                    <input
                      type="text"
                      value={nip}
                      onChange={(e) => {
                        setNip(e.target.value)
                        if (errorMessage) setErrorMessage(null)
                      }}
                      placeholder="Contoh: 199801012022031001"
                      required
                      maxLength={25}
                      className="w-full rounded-[10px] bg-[#f6f5f4] dark:bg-[#101520] border border-slate-200 dark:border-slate-800 pl-9 pr-3 py-2 text-xs text-[#18181B] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#64748b] focus:outline-hidden focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] font-mono transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#18181B] dark:text-slate-200">
                    Satuan Kerja (Satker) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Building2 className="absolute left-3 h-4 w-4 text-[#615d59] dark:text-[#94a3b8]" />
                    <input
                      type="text"
                      value={satker}
                      onChange={(e) => {
                        setSatker(e.target.value)
                        if (errorMessage) setErrorMessage(null)
                      }}
                      placeholder="Contoh: Kejaksaan Negeri Soppeng / Kejaksaan Agung"
                      required
                      className="w-full rounded-[10px] bg-[#f6f5f4] dark:bg-[#101520] border border-slate-200 dark:border-slate-800 pl-9 pr-3 py-2 text-xs text-[#18181B] dark:text-white placeholder-[#94a3b8] dark:placeholder-[#64748b] focus:outline-hidden focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] transition"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isExiting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white py-2.5 px-6 text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer w-full disabled:opacity-75"
                  >
                    {isExiting ? (
                      <>
                        <Spinner size="xs" variant="white" />
                        <span>Menyimpan & Membuka Portal...</span>
                      </>
                    ) : (
                      <>
                        <span>{hasExistingProfile ? "Simpan Perubahan & Masuk" : "Simpan Data & Buka Akses Portal"}</span>
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. STATE: RECOGNIZED (Pengguna Sudah Terdaftar) */}
          {viewState === 'recognized' && (
            <div className="flex flex-col items-center gap-3.5 w-full">
              {/* Badge Sapaan */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#141b27] px-3.5 py-1 text-xs font-bold text-[#007aff] dark:text-[#60a5fa] border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span>{timeInfo.icon}</span>
                <span>{timeInfo.greeting}, Prakom Andal!</span>
              </div>

              {/* Personalized Heading */}
              <div className="space-y-1 text-center">
                <h2 className="text-lg sm:text-xl font-black text-[#18181B] dark:text-white tracking-tight">
                  Selamat Datang,{" "}
                  <span className="text-[#007aff] dark:text-[#60a5fa]">{name}</span>!
                </h2>
                <p className="text-xs text-[#6B7C93] dark:text-[#8FA3BC] max-w-sm">
                  Satuan Kerja: <strong className="text-[#18181B] dark:text-white">{satker}</strong>
                </p>
              </div>

              {/* Identity Tag & Edit Option */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-[#141b27] px-3.5 py-1.5 text-[11px] text-[#615d59] dark:text-[#94a3b8] border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="truncate max-w-[220px] font-semibold text-[#000000] dark:text-white">
                  👤 {name}
                </span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleSwitchViewState('form')}
                  title="Ubah Profil Identitas"
                  className="text-[#007aff] dark:text-[#60a5fa] hover:underline font-bold text-[10px] inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <Edit3 className="h-2.5 w-2.5" />
                  <span>Ubah Data</span>
                </button>
              </div>

              {/* Enter Button with Enter/Space support */}
              <button
                type="button"
                onClick={handleEnterPortal}
                disabled={isExiting}
                className="group relative flex items-center justify-center gap-2 rounded-full bg-[#18181B] dark:bg-[#E2E8F0] hover:bg-[#27272A] dark:hover:bg-white px-7 py-3 text-xs sm:text-sm font-black text-white dark:text-[#18181B] shadow-lg shadow-black/20 cursor-pointer transition-all duration-200 mt-1 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 w-full sm:w-auto"
              >
                {isExiting ? (
                  <>
                    <Spinner size="xs" variant={isDark ? "primary" : "white"} />
                    <span>Membuka Portal...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Portal Kelas</span>
                    <ArrowRight className="h-4 w-4 text-[#FFD280] dark:text-[#EA580C] group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>

      </div>

      {/* ── Bottom Info ── */}
      <div className="relative z-10 text-center text-[10px] text-[#8C9BAE] dark:text-[#5C7089] font-medium pb-4 sm:pb-6 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        {viewState === 'recognized'
          ? "Tekan tombol Enter atau spasi untuk langsung masuk • Sesi tersimpan otomatis"
          : "Portal Resmi Diklat Fungsional Pranata Komputer Keahlian Batch 3 Kejaksaan RI 2026"}
      </div>

    </div>
  )
}
