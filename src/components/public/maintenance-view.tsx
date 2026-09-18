"use client"

import React, { useEffect, useState } from "react"
import anime from "animejs"
import Link from "next/link"
import Image from "next/image"
import {
  Clock,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  CheckCircle,
} from "lucide-react"
import { MaintenanceConfig } from "@/lib/maintenance"

interface MaintenanceViewProps {
  config: MaintenanceConfig
  isPreview?: boolean
  isAdmin?: boolean
}

export function MaintenanceView({
  config,
  isPreview = false,
  isAdmin = false,
}: MaintenanceViewProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    isEnded: boolean
  } | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [termLines, setTermLines] = useState<string[]>([])

  // ══════════════════════════════════════════════════════════
  // FAKE TERMINAL — cute loading lines appearing one by one
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    const lines = [
      "$ ssh agrasena-625@server",
      "✓ Connected to production",
      "$ systemctl maintenance --start",
      "⟳ Upgrading kurikulum batch 4...",
      "⟳ Optimizing database indexes...",
      "⟳ Feeding server cat... 🐱",
      "✓ Cat is happy! Continuing...",
      "⟳ Patching security modules...",
      "✓ Progress: ████████░░ 85%",
      "⏳ Almost done, hang tight! 🚀",
    ]
    let idx = 0
    const timer = setInterval(() => {
      if (idx < lines.length) {
        setTermLines((p) => [...p, lines[idx]])
        idx++
      } else {
        clearInterval(timer)
      }
    }, 900)
    return () => clearInterval(timer)
  }, [])

  // ══════════════════════════════════════════════════════════
  // ANIME.JS — Rich orchestrated animations
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    // Hero pops in with spring
    anime({
      targets: "#hero-img",
      scale: [0, 1],
      opacity: [0, 1],
      duration: 1000,
      delay: 100,
      easing: "spring(1, 60, 8, 0)",
    })

    // Hero idle float
    anime({
      targets: "#hero-img",
      translateY: [-5, 5],
      duration: 3200,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
      delay: 1200,
    })

    // Title slide down
    anime({
      targets: "#title",
      translateY: [-30, 0],
      opacity: [0, 1],
      duration: 700,
      delay: 400,
      easing: "spring(1, 80, 10, 0)",
    })

    // Subtitle fade in
    anime({
      targets: "#subtitle",
      translateY: [15, 0],
      opacity: [0, 1],
      duration: 600,
      delay: 600,
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // Bottom strip slides up
    anime({
      targets: "#bottom-strip",
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 800,
      delay: 500,
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // Countdown numbers spring
    anime({
      targets: ".cd-num",
      scale: [1.5, 1],
      opacity: [0, 1],
      duration: 500,
      delay: anime.stagger(80, { start: 800 }),
      easing: "spring(1, 80, 10, 0)",
    })

    // Terminal slides in from right
    anime({
      targets: "#terminal",
      translateX: [40, 0],
      opacity: [0, 1],
      duration: 700,
      delay: 900,
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    })

    // Action buttons pop
    anime({
      targets: ".act-btn",
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 500,
      delay: anime.stagger(100, { start: 1100 }),
      easing: "spring(1, 80, 10, 0)",
    })

    // Badge wobbles
    anime({
      targets: "#badge-fix",
      rotate: [-4, 4],
      translateY: [-3, 3],
      duration: 2000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    anime({
      targets: "#badge-cat",
      rotate: [3, -3],
      translateY: [3, -4],
      duration: 2600,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })

    // Emoji scatter float in
    anime({
      targets: ".bg-emoji",
      opacity: () => [0, anime.random(0.06, 0.22)],
      scale: () => [0, anime.random(0.8, 1.4)],
      rotate: () => anime.random(-30, 30),
      duration: () => anime.random(600, 1000),
      delay: anime.stagger(50),
      easing: "spring(1, 80, 12, 0)",
    })

    // Sparkle stars twinkle
    anime({
      targets: ".sparkle",
      opacity: () => [0, anime.random(0.4, 1)],
      scale: () => [0.5, anime.random(1, 2)],
      duration: () => anime.random(800, 2000),
      direction: "alternate",
      loop: true,
      delay: anime.stagger(200),
      easing: "easeInOutSine",
    })

    // Hearts float up
    anime({
      targets: ".fl-heart",
      translateY: [0, -40],
      opacity: [0.7, 0],
      scale: [0.7, 1.3],
      duration: 2200,
      loop: true,
      delay: anime.stagger(700),
      easing: "easeOutCubic",
    })

    // WA button glow pulse
    anime({
      targets: "#wa-btn",
      boxShadow: [
        "0 3px 16px rgba(34,197,94,0.25)",
        "0 5px 30px rgba(34,197,94,0.55)",
        "0 3px 16px rgba(34,197,94,0.25)",
      ],
      duration: 1800,
      loop: true,
      easing: "easeInOutSine",
    })

    // Status dot pulse
    anime({
      targets: "#status-dot",
      scale: [1, 1.5, 1],
      opacity: [1, 0.4, 1],
      duration: 1200,
      loop: true,
      easing: "easeInOutSine",
    })

    // Wavy footer
    anime({
      targets: "#wave path",
      d: [
        "M0,6 Q160,0 320,6 T640,6 T960,6 V30 H0 Z",
        "M0,2 Q160,10 320,2 T640,2 T960,2 V30 H0 Z",
      ],
      duration: 3000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })
  }, [])

  // ══════════════════════════════════════════════════════════
  // COUNTDOWN
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!config.estimatedEnd) { setTimeLeft(null); return }
    const target = new Date(config.estimatedEnd).getTime()
    if (isNaN(target)) { setTimeLeft(null); return }
    const calc = () => {
      const diff = target - Date.now()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true })
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        isEnded: false,
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [config.estimatedEnd])

  const handleRefresh = () => {
    setIsRefreshing(true)
    anime({ targets: "#ref-icon", rotate: [0, 720], duration: 700, easing: "easeInOutQuad" })
    setTimeout(() => window.location.reload(), 750)
  }

  const waNum = (config.emergencyContact || "6281234567890").replace(/\D/g, "")
  const waUrl = `https://wa.me/${waNum}?text=` + encodeURIComponent("Halo Admin Agrasena 625, saya ingin tanya status maintenance Web Kelas.")

  const eta = config.estimatedEnd
    ? new Date(config.estimatedEnd).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Makassar" }) + " WITA"
    : "Segera"

  // Background emojis
  const emojis = [
    "🔧","⚙️","🐱","💻","🚧","⚡","☕","🎯","🔩","📡",
    "🛠️","✨","🧰","🖥️","💾","🔌","🏗️","🎉","🐈","🚀",
  ]

  return (
    <div style={{
      height: "100dvh", width: "100%", overflow: "hidden",
      background: "linear-gradient(170deg, #FFF9ED 0%, #FFFDF6 35%, #FFF4D9 100%)",
      fontFamily: "'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif",
      display: "flex", flexDirection: "column", position: "relative",
    }}>
      {/* ═══ BG LAYER — emoji scatter + sparkles + hearts ═══ */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {emojis.map((e, i) => (
          <span key={i} className="bg-emoji" style={{
            position: "absolute",
            top: `${5 + (i * 4.5) % 90}%`,
            left: `${3 + (i * 5.3) % 94}%`,
            fontSize: "clamp(0.9rem, 1.8vw, 1.5rem)",
            opacity: 0, userSelect: "none",
          }}>{e}</span>
        ))}
        {[
          {t:"8%",l:"25%"},{t:"12%",l:"70%"},{t:"30%",l:"45%"},
          {t:"55%",l:"15%"},{t:"65%",l:"80%"},{t:"85%",l:"55%"},
        ].map((s,i)=>(
          <svg key={i} className="sparkle" style={{position:"absolute",top:s.t,left:s.l,opacity:0}} width="10" height="10" viewBox="0 0 12 12">
            <path d="M6 0L7 4.5L12 6L7 7.5L6 12L5 7.5L0 6L5 4.5Z" fill="#FCD34D"/>
          </svg>
        ))}
        {[0,1,2].map(i=>(
          <span key={i} className="fl-heart" style={{
            position:"absolute",top:"42%",left:`${46+i*4}%`,
            fontSize:"0.9rem",opacity:0,
          }}>💛</span>
        ))}
      </div>

      {/* ═══ HEADER — compact, 1 line ═══ */}
      <header style={{ position:"relative",zIndex:20,padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <Image src="/Logo.png" alt="Agrasena" width={24} height={24} style={{objectFit:"contain"}} />
          <span style={{fontSize:"0.76rem",fontWeight:900,color:"#1A2340"}}>Agrasena 625</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {isAdmin && (
            <>
              <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",background:"rgba(245,158,11,0.12)",borderRadius:8,border:"1px solid rgba(245,158,11,0.4)"}}>
                <ShieldCheck style={{width:12,height:12,color:"#D97706"}}/>
                <span style={{fontSize:"0.55rem",fontWeight:700,color:"#92400E"}}>Admin</span>
              </div>
              <a href="/?bypass=1" style={{fontSize:"0.55rem",fontWeight:700,color:"#92400E",textDecoration:"none",padding:"3px 8px",background:"rgba(245,158,11,0.08)",borderRadius:8}}>Bypass ↗</a>
              <Link href="/admin/dashboard" style={{fontSize:"0.55rem",fontWeight:800,color:"#fff",textDecoration:"none",padding:"3px 8px",background:"#D97706",borderRadius:8}}>Dashboard</Link>
            </>
          )}
          {isPreview && !isAdmin && (
            <span style={{fontSize:"0.55rem",fontWeight:700,color:"#64748B",padding:"3px 8px",background:"rgba(100,116,139,0.08)",borderRadius:8}}>👁️ Preview</span>
          )}
        </div>
      </header>

      {/* ═══ MAIN — everything in one screen ═══ */}
      <main style={{ flex:1,position:"relative",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 16px",gap:"clamp(4px,1vh,10px)",minHeight:0,overflow:"hidden" }}>

        {/* ─── ROW 1: HERO IMAGE with floating badges ─── */}
        <div style={{ position:"relative",width:"100%",maxWidth:750,display:"flex",justifyContent:"center" }}>
          {/* Badge left */}
          <div id="badge-fix" style={{
            position:"absolute",top:"5%",left:"clamp(2px,8%,80px)",zIndex:5,
            background:"#fff",borderRadius:12,padding:"5px 10px",
            boxShadow:"0 3px 16px rgba(26,35,64,0.10)",border:"2px solid #FCD34D",
            display:"flex",alignItems:"center",gap:5,
          }}>
            <span style={{fontSize:"0.85rem"}}>🔧</span>
            <span style={{fontSize:"0.6rem",fontWeight:800,color:"#92400E"}}>Lagi di-fix nih!</span>
          </div>

          {/* Badge right */}
          <div id="badge-cat" style={{
            position:"absolute",bottom:"2%",right:"clamp(2px,8%,80px)",zIndex:5,
            background:"#FEF3C7",borderRadius:12,padding:"5px 12px",
            boxShadow:"0 3px 16px rgba(245,158,11,0.25)",border:"2px solid #FBBF24",
            display:"flex",alignItems:"center",gap:5,
          }}>
            <span style={{fontSize:"0.85rem"}}>😺</span>
            <span style={{fontSize:"0.6rem",fontWeight:800,color:"#92400E"}}>Sabar ya!</span>
            <span style={{fontSize:"0.75rem"}}>✨</span>
          </div>

          {/* Hero */}
          <div id="hero-img" style={{ opacity:0,transform:"scale(0)",width:"clamp(220px,50vw,420px)" }}>
            <Image
              src="/Maintenance.webp"
              alt="Tim Agrasena 625 maintenance"
              width={420} height={294} priority
              style={{ width:"100%",height:"auto",objectFit:"contain",maxHeight:"clamp(140px,25vh,260px)",filter:"drop-shadow(0 10px 30px rgba(26,35,64,0.13))" }}
            />
          </div>
        </div>

        {/* ─── ROW 2: TITLE + SUBTITLE ─── */}
        <div style={{textAlign:"center",maxWidth:500}}>
          <h1 id="title" style={{fontSize:"clamp(1.1rem,3vw,1.8rem)",fontWeight:900,color:"#1A2340",lineHeight:1.15,margin:0,opacity:0,letterSpacing:"-0.02em"}}>
            {config.title || "Oops! Kami Sedang Upgrade 🛠️"}
          </h1>
          <p id="subtitle" style={{fontSize:"clamp(0.62rem,1.3vw,0.76rem)",color:"#64748B",lineHeight:1.5,margin:"3px auto 0",maxWidth:420,opacity:0}}>
            {config.message || "Kami sedang meningkatkan sistem. Silakan kembali sebentar lagi!"}
          </p>
        </div>

        {/* ─── ROW 3: COUNTDOWN + TERMINAL side by side ─── */}
        <div id="bottom-strip" style={{
          opacity:0,width:"100%",maxWidth:750,
          display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,
          minHeight:0,
        }}>
          {/* COUNTDOWN CARD */}
          <div style={{
            background:"#fff",borderRadius:16,
            padding:"clamp(8px,1.2vh,14px) clamp(10px,1.5vw,16px)",
            border:"2px solid rgba(252,211,77,0.5)",
            boxShadow:"0 3px 16px rgba(245,158,11,0.08)",
            display:"flex",flexDirection:"column",gap:6,justifyContent:"center",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:"0.85rem"}}>⏱️</span>
              <span style={{fontSize:"0.58rem",fontWeight:800,color:"#92400E",letterSpacing:"0.1em",textTransform:"uppercase"}}>Estimasi Selesai</span>
            </div>

            {timeLeft && !timeLeft.isEnded ? (
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>
                {[
                  {val:timeLeft.days,label:"Hari",accent:"#1A2340",bg:"#F1F5F9"},
                  {val:timeLeft.hours,label:"Jam",accent:"#F59E0B",bg:"#FFFBEB"},
                  {val:timeLeft.minutes,label:"Mnt",accent:"#F97316",bg:"#FFF7ED"},
                  {val:timeLeft.seconds,label:"Dtk",accent:"#EF4444",bg:"#FEF2F2"},
                ].map(({val,label,accent,bg})=>(
                  <div key={label} className="cd-num" style={{textAlign:"center",background:bg,borderRadius:10,padding:"5px 2px 3px",opacity:0}}>
                    <div style={{fontSize:"clamp(1rem,2.2vw,1.5rem)",fontWeight:900,color:accent,fontVariantNumeric:"tabular-nums",lineHeight:1}}>
                      {String(val).padStart(2,"0")}
                    </div>
                    <div style={{fontSize:"0.45rem",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",marginTop:2}}>{label}</div>
                  </div>
                ))}
              </div>
            ) : timeLeft?.isEnded ? (
              <div style={{display:"flex",alignItems:"center",gap:5,padding:"6px 8px",background:"rgba(16,185,129,0.08)",borderRadius:10}}>
                <CheckCircle style={{width:13,height:13,color:"#10B981"}}/>
                <span style={{fontSize:"0.65rem",fontWeight:700,color:"#065F46"}}>Sudah selesai! Cek status ↓</span>
              </div>
            ) : (
              <div style={{fontSize:"0.75rem",fontWeight:800,color:"#1A2340"}}>Segera kembali! 🎉</div>
            )}

            {/* Mini info badges */}
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:3,padding:"2px 7px",background:"#FEF3C7",borderRadius:7,border:"1px solid #FDE68A"}}>
                <div id="status-dot" style={{width:5,height:5,borderRadius:"50%",background:"#F59E0B"}}/>
                <span style={{fontSize:"0.5rem",fontWeight:700,color:"#92400E"}}>Maintenance</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:3,padding:"2px 7px",background:"#F1F5F9",borderRadius:7}}>
                <Clock style={{width:9,height:9,color:"#94A3B8"}}/>
                <span style={{fontSize:"0.5rem",fontWeight:700,color:"#64748B"}}>{eta}</span>
              </div>
            </div>
          </div>

          {/* FAKE TERMINAL */}
          <div id="terminal" style={{
            background:"#1A2340",borderRadius:16,overflow:"hidden",
            display:"flex",flexDirection:"column",opacity:0,
            border:"2px solid rgba(30,41,59,0.3)",
          }}>
            {/* Title bar */}
            <div style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",background:"rgba(255,255,255,0.05)"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#EF4444"}}/>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#F59E0B"}}/>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#22C55E"}}/>
              <span style={{fontSize:"0.5rem",color:"#64748B",marginLeft:5,fontWeight:600}}>agrasena-625@server</span>
            </div>
            {/* Content */}
            <div style={{flex:1,padding:"5px 9px",overflowY:"auto",fontFamily:"'Fira Code','Consolas',monospace",fontSize:"clamp(0.48rem,0.8vw,0.58rem)",lineHeight:1.55,color:"#94A3B8",minHeight:0}}>
              {termLines.map((line,i)=>(
                <div key={i} style={{color: line.startsWith("✓")?"#22C55E":line.startsWith("⟳")?"#F59E0B":line.startsWith("⏳")?"#A78BFA":"#94A3B8"}}>
                  {line}
                </div>
              ))}
              <span style={{display:"inline-block",width:6,height:11,background:"#F59E0B",animation:"cb 0.8s step-end infinite"}}/>
            </div>
          </div>
        </div>

        {/* ─── ROW 4: ACTION BUTTONS ─── */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",width:"100%",maxWidth:400}}>
          <a
            id="wa-btn"
            className="act-btn"
            href={waUrl} target="_blank" rel="noopener noreferrer"
            style={{
              flex:1,minWidth:160,display:"flex",alignItems:"center",justifyContent:"center",gap:7,
              padding:"9px 16px",background:"linear-gradient(135deg,#22C55E,#16A34A)",
              borderRadius:12,color:"#fff",fontWeight:800,fontSize:"0.72rem",textDecoration:"none",
              boxShadow:"0 3px 16px rgba(34,197,94,0.25)",opacity:0,
            }}
          >
            <MessageCircle style={{width:14,height:14}}/>
            Chat Admin Agrasena
            <span style={{width:18,height:18,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem"}}>↗</span>
          </a>

          <button
            type="button"
            className="act-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              padding:"9px 16px",background:"#fff",borderRadius:12,color:"#1A2340",
              fontWeight:700,fontSize:"0.72rem",cursor:isRefreshing?"not-allowed":"pointer",
              border:"1.5px solid rgba(30,41,59,0.12)",boxShadow:"0 2px 8px rgba(26,35,64,0.05)",
              opacity:0,fontFamily:"inherit",
            }}
          >
            <RefreshCw id="ref-icon" style={{width:12,height:12,color:isRefreshing?"#F59E0B":"#64748B"}}/>
            {isRefreshing?"Checking...":"Periksa Status"}
          </button>
        </div>
      </main>

      {/* ═══ FOOTER — wavy ═══ */}
      <footer style={{position:"relative",zIndex:10,flexShrink:0}}>
        <svg id="wave" style={{display:"block",width:"100%",height:10}} viewBox="0 0 960 30" preserveAspectRatio="none">
          <path d="M0,6 Q160,0 320,6 T640,6 T960,6 V30 H0 Z" fill="#fff"/>
        </svg>
        <div style={{background:"#fff",textAlign:"center",padding:"0 16px 6px"}}>
          <span style={{fontSize:"0.5rem",color:"#CBD5E1"}}>© 2025 Agrasena 625 — Web Kelas Diklat Fungsional Pranata Komputer Kejaksaan RI</span>
        </div>
      </footer>

      <style>{`
        @keyframes cb{0%,100%{opacity:1}50%{opacity:0}}
        @media(max-width:580px){
          #bottom-strip{grid-template-columns:1fr!important}
          #badge-fix,#badge-cat{display:none!important}
        }
      `}</style>
    </div>
  )
}
