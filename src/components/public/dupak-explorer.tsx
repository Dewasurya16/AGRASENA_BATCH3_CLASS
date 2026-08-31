'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Copy,
  Check,
  Calculator,
  FileSpreadsheet,
  Award,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { DUPAK_ITEMS_DATA, DupakItem } from '@/lib/dupak-items-data'

interface BasketItem {
  item: DupakItem
  count: number
}

export function DupakExplorer() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedLevel, setSelectedLevel] = React.useState<string>('Semua')
  const [selectedSubUnsur, setSelectedSubUnsur] = React.useState<string>('Semua')
  const [basket, setBasket] = React.useState<BasketItem[]>([])
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  // Load basket from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('prakom_dupak_basket')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setBasket(parsed)
        }
      }
    } catch {
      // Ignore
    }
  }, [])

  // Save basket to localStorage
  const saveBasket = (newBasket: BasketItem[]) => {
    setBasket(newBasket)
    try {
      localStorage.setItem('prakom_dupak_basket', JSON.stringify(newBasket))
    } catch {
      // Ignore
    }
  }

  const handleAddToBasket = (item: DupakItem) => {
    const existingIndex = basket.findIndex((b) => b.item.id === item.id)
    if (existingIndex >= 0) {
      const updated = [...basket]
      updated[existingIndex].count += 1
      saveBasket(updated)
    } else {
      saveBasket([...basket, { item, count: 1 }])
    }
  }

  const handleUpdateCount = (itemId: string, delta: number) => {
    const updated = basket
      .map((b) => {
        if (b.item.id === itemId) {
          const newCount = b.count + delta
          return newCount > 0 ? { ...b, count: newCount } : null
        }
        return b
      })
      .filter(Boolean) as BasketItem[]
    saveBasket(updated)
  }

  const handleRemoveFromBasket = (itemId: string) => {
    const updated = basket.filter((b) => b.item.id !== itemId)
    saveBasket(updated)
  }

  const handleClearBasket = () => {
    if (confirm('Kosongkan seluruh simulasi keranjang Angka Kredit?')) {
      saveBasket([])
    }
  }

  // Filtered items
  const filteredItems = React.useMemo(() => {
    return DUPAK_ITEMS_DATA.filter((item) => {
      const matchLevel =
        selectedLevel === 'Semua' ||
        item.level === selectedLevel ||
        item.level === 'Semua Jenjang'
      const matchSubUnsur =
        selectedSubUnsur === 'Semua' || item.subUnsur === selectedSubUnsur
      const query = searchQuery.toLowerCase().trim()
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.subUnsur.toLowerCase().includes(query) ||
        item.evidence.toLowerCase().includes(query) ||
        item.keywords.some((k) => k.toLowerCase().includes(query)) ||
        (item.tipsKejaksaan && item.tipsKejaksaan.toLowerCase().includes(query))

      return matchLevel && matchSubUnsur && matchQuery
    })
  }, [searchQuery, selectedLevel, selectedSubUnsur])

  // Total calculated AK
  const totalAk = React.useMemo(() => {
    return basket.reduce((acc, curr) => acc + curr.item.ak * curr.count, 0)
  }, [basket])

  // Copy Rekap to Clipboard for SPMK
  const handleCopyRekap = () => {
    if (basket.length === 0) return

    let text = `REKAP SIMULASI ANGKA KREDIT DUPAK PRAKOM KEJAKSAAN RI\n`
    text += `======================================================\n\n`
    basket.forEach((b, idx) => {
      const subtotal = (b.item.ak * b.count).toFixed(3)
      text += `${idx + 1}. [${b.item.code}] ${b.item.title}\n`
      text += `   - Jenjang: ${b.item.level} | Sub-Unsur: ${b.item.subUnsur}\n`
      text += `   - Volume: ${b.count} ${b.item.outputUnit} × ${b.item.ak} AK = ${subtotal} AK\n`
      text += `   - Bukti Fisik Wajib: ${b.item.evidence}\n\n`
    })
    text += `======================================================\n`
    text += `TOTAL ESTIMASI ANGKA KREDIT: ${totalAk.toFixed(3)} AK\n`
    text += `(Target Tahunan Ahli Pertama: 12.5 AK | Ahli Muda: 25 AK)\n`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const subUnsurList = [
    'Semua',
    'Tata Kelola & SPBE',
    'Infrastruktur & Jaringan',
    'Sistem Informasi & Basis Data',
    'Pengolahan Data',
    'Pengembangan Profesi',
    'Penunjang Tugas'
  ]

  const levelsList = [
    'Semua',
    'Ahli Pertama',
    'Ahli Muda',
    'Ahli Madya',
    'Terampil/Mahir'
  ]

  return (
    <div className="space-y-6">
      {/* Header Banner & Summary */}
      <div className="rounded-[16px] bg-[#f6f5f4] dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-5 sm:p-6 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#1a2332] px-3 py-0.5 text-xs font-bold text-[#007aff] dark:text-[#60a5fa] border border-[#e6e6e6] dark:border-white/10 shadow-2xs">
              <Calculator className="h-3.5 w-3.5" />
              <span>Katalog Butir Kegiatan & Estimator Angka Kredit (AK)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#000000] dark:text-white tracking-tight">
              Pencarian Butir DUPAK & PermenPAN-RB No. 32/2020
            </h2>
            <p className="text-xs text-[#615d59] dark:text-[#94a3b8] leading-relaxed max-w-2xl">
              Cari butir kegiatan kedinasan Prakom di Kejaksaan, temukan bukti fisik yang sah, dan hitung simulasi capaian Angka Kredit tahunan Anda secara instan.
            </p>
          </div>

          {/* Quick Target Indicator */}
          <div className="p-3.5 rounded-[12px] bg-white dark:bg-[#101520] border border-[#e6e6e6] dark:border-white/10 flex items-center gap-3 shrink-0 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007aff]/15 text-[#007aff] dark:bg-[#007aff]/25 dark:text-[#60a5fa]">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#615d59] dark:text-[#94a3b8]">
                Estimasi Keranjang AK
              </div>
              <div className="text-lg font-black font-mono text-[#007aff] dark:text-[#60a5fa]">
                {totalAk.toFixed(3)} <span className="text-xs font-sans font-semibold text-[#615d59] dark:text-[#94a3b8]">AK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Search & Catalog (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search Bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-[#615d59] dark:text-[#94a3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari butir kegiatan: 'backup', 'database', 'firewall', 'makalah', 'sql', 'sop'..."
              className="w-full rounded-[12px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#000000] dark:text-white placeholder-[#94a3b8] focus:outline-hidden focus:border-[#007aff] shadow-2xs transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-[#615d59] hover:text-[#000000] dark:hover:text-white font-semibold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters Rail: Jenjang & Sub-Unsur */}
          <div className="space-y-2">
            {/* Level Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[11px] font-bold text-[#615d59] dark:text-[#94a3b8] shrink-0 mr-1">
                Jenjang:
              </span>
              {levelsList.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-[#007aff] text-white shadow-2xs'
                      : 'bg-white dark:bg-[#141b27] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 hover:text-[#000000] dark:hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Sub-Unsur Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[11px] font-bold text-[#615d59] dark:text-[#94a3b8] shrink-0 mr-1">
                Sub-Unsur:
              </span>
              {subUnsurList.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubUnsur(sub)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedSubUnsur === sub
                      ? 'bg-[#007aff] text-white shadow-2xs'
                      : 'bg-white dark:bg-[#141b27] text-[#615d59] dark:text-[#94a3b8] border border-[#e6e6e6] dark:border-white/10 hover:text-[#000000] dark:hover:text-white'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#615d59] dark:text-[#94a3b8] px-1">
              <span>Menampilkan {filteredItems.length} Butir Kegiatan</span>
              <span className="text-[11px] font-normal">Klik butir untuk melihat bukti fisik</span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="p-12 text-center rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 space-y-2">
                <Search className="h-8 w-8 mx-auto text-[#94a3b8]" />
                <p className="text-xs font-bold text-[#000000] dark:text-white">
                  Tidak ditemukan butir kegiatan untuk "{searchQuery}"
                </p>
                <p className="text-[11px] text-[#615d59] dark:text-[#94a3b8]">
                  Coba kata kunci lain atau pilih filter "Semua Jenjang".
                </p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isExpanded = expandedId === item.id
                const inBasket = basket.find((b) => b.item.id === item.id)

                return (
                  <motion.div
                    key={item.id}
                    layout
                    className="rounded-[14px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 shadow-2xs hover:border-[#007aff]/30 transition-all overflow-hidden"
                  >
                    {/* Main Row */}
                    <div className="p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-[6px] bg-[#f6f5f4] dark:bg-[#1a2332] text-[#007aff] dark:text-[#60a5fa] border border-[#e6e6e6] dark:border-white/10">
                            {item.code}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#007aff]/10 text-[#007aff] dark:bg-[#007aff]/20 dark:text-[#60a5fa]">
                            {item.level}
                          </span>
                          <span className="text-[10px] font-medium text-[#615d59] dark:text-[#94a3b8]">
                            • {item.subUnsur}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-[#000000] dark:text-white leading-snug">
                          {item.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#615d59] dark:text-[#94a3b8]">
                          <span>Satuan: <strong className="text-[#000000] dark:text-white">{item.outputUnit}</strong></span>
                          {item.maxPerYear && (
                            <span>Batas: <strong className="text-[#000000] dark:text-white">{item.maxPerYear}</strong></span>
                          )}
                        </div>
                      </div>

                      {/* Right: AK Value + Action Button */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e6e6e6] dark:border-white/10">
                        <div className="text-right">
                          <div className="text-sm sm:text-base font-black font-mono text-[#007aff] dark:text-[#60a5fa]">
                            +{item.ak.toFixed(3)}
                          </div>
                          <span className="text-[10px] text-[#615d59] dark:text-[#94a3b8]">AK / Output</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            className="p-1.5 rounded-[8px] bg-[#f6f5f4] dark:bg-[#1a2332] text-[#615d59] dark:text-[#94a3b8] hover:text-[#000000] dark:hover:text-white border border-[#e6e6e6] dark:border-white/10 transition cursor-pointer"
                            title="Detail bukti fisik & tips"
                          >
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAddToBasket(item)}
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer ${
                              inBasket
                                ? 'bg-[#34c759] text-white hover:bg-[#28a745]'
                                : 'bg-[#007aff] text-white hover:bg-[#0062cc]'
                            }`}
                          >
                            <Plus className="h-3 w-3" strokeWidth={2.5} />
                            <span>{inBasket ? `Tambah (${inBasket.count})` : 'Simulasi'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-[#e6e6e6] dark:border-white/10 bg-[#f6f5f4]/70 dark:bg-[#101520]/70 p-4 space-y-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-[#000000] dark:text-white text-[11px]">
                              <ShieldCheck className="h-3.5 w-3.5 text-[#16a34a]" />
                              <span>Bukti Fisik Sah yang Wajib Disiapkan:</span>
                            </div>
                            <p className="text-[#31302e] dark:text-[#cbd5e1] leading-relaxed pl-5 text-[11px]">
                              {item.evidence}
                            </p>
                          </div>

                          {item.tipsKejaksaan && (
                            <div className="space-y-1 p-2.5 rounded-[10px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 text-[11px]">
                              <div className="flex items-center gap-1.5 font-bold text-[#007aff] dark:text-[#60a5fa]">
                                <Sparkles className="h-3 w-3" />
                                <span>Tips Pelaksanaan di Satker Kejaksaan:</span>
                              </div>
                              <p className="text-[#615d59] dark:text-[#94a3b8] leading-relaxed">
                                {item.tipsKejaksaan}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Simulation Calculator Basket (4 Cols) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="rounded-[16px] bg-white dark:bg-[#141b27] border border-[#e6e6e6] dark:border-white/10 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#e6e6e6] dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-[#007aff] dark:text-[#60a5fa]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#000000] dark:text-white">
                  Simulasi Angka Kredit Saya
                </h3>
              </div>
              {basket.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearBasket}
                  className="text-[11px] text-[#ef4444] hover:underline font-semibold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {basket.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-[#615d59] dark:text-[#94a3b8]">
                <Layers className="h-7 w-7 mx-auto opacity-40" />
                <p className="text-xs font-semibold">Belum ada butir kegiatan dipilih</p>
                <p className="text-[11px]">
                  Klik tombol <strong>"+ Simulasi"</strong> pada butir kegiatan untuk menghitung estimasi capaian AK tahunan.
                </p>
              </div>
            ) : (
              <>
                {/* Basket Items List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {basket.map((b) => (
                    <div
                      key={b.item.id}
                      className="p-2.5 rounded-[10px] bg-[#f6f5f4] dark:bg-[#1a2332] border border-[#e6e6e6] dark:border-white/10 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate text-[#000000] dark:text-white text-[11px]">
                          [{b.item.code}] {b.item.title}
                        </div>
                        <div className="text-[10px] text-[#615d59] dark:text-[#94a3b8]">
                          {b.count} × {b.item.ak} = <strong className="text-[#007aff] dark:text-[#60a5fa]">{(b.item.ak * b.count).toFixed(3)} AK</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateCount(b.item.id, -1)}
                          className="h-6 w-6 rounded-[6px] bg-white dark:bg-[#141b27] flex items-center justify-center text-[#615d59] hover:text-[#000000] dark:hover:text-white border border-[#e6e6e6] dark:border-white/10 cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-mono text-xs font-bold w-5 text-center">
                          {b.count}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCount(b.item.id, 1)}
                          className="h-6 w-6 rounded-[6px] bg-white dark:bg-[#141b27] flex items-center justify-center text-[#615d59] hover:text-[#000000] dark:hover:text-white border border-[#e6e6e6] dark:border-white/10 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Score & Targets */}
                <div className="pt-3 border-t border-[#e6e6e6] dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#000000] dark:text-white">
                      Total Estimasi AK:
                    </span>
                    <span className="text-lg font-black font-mono text-[#007aff] dark:text-[#60a5fa]">
                      {totalAk.toFixed(3)} AK
                    </span>
                  </div>

                  {/* Annual Target Progress */}
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-[#615d59] dark:text-[#94a3b8]">
                      <span>Target Ahli Pertama (12.5 AK/th):</span>
                      <span className="font-mono font-bold text-[#000000] dark:text-white">
                        {Math.min(100, Math.round((totalAk / 12.5) * 100))}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#f6f5f4] dark:bg-[#1a2332] overflow-hidden">
                      <div
                        className="h-full bg-[#007aff] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (totalAk / 12.5) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Copy Rekap Button */}
                  <button
                    type="button"
                    onClick={handleCopyRekap}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#007aff] hover:bg-[#0062cc] active:scale-[0.98] text-white py-2 text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Rekap SPMK'}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
