const cron = require('node-cron')

/**
 * Konfigurasi Akses Resmi Zoom Tatap Muka Online (TMO) Angkatan 4 Agrasena
 */
const ZOOM_CONFIG = {
  angkatan: 4,
  batchName: 'Agrasena Batch 4 Kejaksaan RI',
  meetingIdDisplay: process.env.ZOOM_MEETING_ID_DISPLAY || process.env.ZOOM_MEETING_ID || '',
  meetingId: process.env.ZOOM_MEETING_ID || '',
  passcode: process.env.ZOOM_PASSCODE || '',
  joinUrl: process.env.ZOOM_JOIN_URL || '',
  lmsUrl: process.env.LMS_URL || 'https://pengembangan.kejaksaan.go.id/dashboard',
  portalUrl: process.env.PORTAL_URL || 'https://agrasena-batch-3-class.vercel.app/batch-4',
}

/**
 * Filter & Isolasi Dataset Khusus Agrasena Batch 4 (Mengecualikan Batch 3)
 */
function isBatch4Item(item) {
  if (!item) return false
  if (item.batch === 4 || item.batch === 'batch-4' || item.batch === '4') return true
  if (item.batch === 3 || item.batch === 'batch-3' || item.batch === '3') return false
  const text = `${item.subject_name || ''} ${item.title || ''} ${item.room || ''} ${item.meeting_link || ''} ${item.id || ''} ${item.author || ''} ${item.content || ''}`.toLowerCase()
  if (
    text.includes('batch 4') ||
    text.includes('batch-4') ||
    text.includes('b4-') ||
    text.includes('agrasena 4') ||
    text.includes('agrasena batch 4') ||
    text.includes('angkatan 06') ||
    text.includes('angkatan 6') ||
    text.includes('angkatan iv') ||
    text.includes('angkatan 4') ||
    text.includes('prakom-batch4')
  ) {
    return true
  }
  if (
    text.includes('batch 3') ||
    text.includes('batch-3') ||
    text.includes('angkatan 5') ||
    text.includes('kelas 6') ||
    text.includes('sobat prakom 625')
  ) {
    return false
  }
  return false
}

function isBatch4Announcement(a) {
  if (!a) return false
  if (a.batch === 4 || a.batch === 'batch-4' || a.batch === '4') return true
  if (a.batch === 3 || a.batch === 'batch-3' || a.batch === '3') return false
  const text = `${a.title || ''} ${a.content || ''} ${a.author || ''}`.toLowerCase()
  if (
    text.includes('batch 4') ||
    text.includes('batch-4') ||
    text.includes('angkatan 4') ||
    text.includes('angkatan iv')
  ) {
    return true
  }
  if (
    text.includes('batch 3') ||
    text.includes('batch-3') ||
    text.includes('angkatan 5') ||
    text.includes('kelas 6') ||
    text.includes('sobat prakom 625')
  ) {
    return false
  }
  if (a.batch === 'all' || text.includes('semua batch') || text.includes('seluruh peserta')) {
    return true
  }
  return false
}

function isBatch4Task(t) {
  if (!t) return false
  if (t.batch === 4 || t.batch === 'batch-4' || t.batch === '4') return true
  if (t.batch === 3 || t.batch === 'batch-3' || t.batch === '3') return false
  const text = `${t.subject_name || ''} ${t.title || ''} ${t.description || ''}`.toLowerCase()
  if (
    text.includes('batch 4') ||
    text.includes('batch-4') ||
    text.includes('agrasena 4') ||
    text.includes('agrasena batch 4') ||
    text.includes('angkatan 06') ||
    text.includes('angkatan 6') ||
    text.includes('angkatan 4') ||
    text.includes('angkatan iv') ||
    text.includes('84420264444') ||
    text.includes('prakom-batch4') ||
    (typeof t.id === 'string' && (t.id.startsWith('b4-') || t.id.includes('batch4')))
  ) {
    return true
  }
  return false
}

function isBatch4Material(m) {
  if (!m) return false
  if (m.batch === 4 || m.batch === 'batch-4' || m.batch === '4') return true
  if (m.batch === 3 || m.batch === 'batch-3' || m.batch === '3') return false
  const text = `${m.title || ''} ${m.subject_name || ''} ${m.description || ''} ${m.category || ''}`.toLowerCase()
  if (text.includes('batch 3') || text.includes('batch-3')) return false
  return true
}

/**
 * Kalender Kurikulum 35 Hari Diklat Fungsional Prakom Batch 4
 * Default tanggal mulai: 28 September 2026 (Senin)
 */
function buildCurriculumDays(startDateStr = process.env.BATCH4_START_DATE || '2026-09-28') {
  const days = []
  const [y, m, d] = startDateStr.split('-').map(Number)
  const cur = new Date(y, m - 1, d, 8, 0, 0)
  let dayNum = 1
  while (dayNum <= 35) {
    const dayOfWeek = cur.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      let stage = 'Tahap 1 • MOOC'
      if (dayNum > 5 && dayNum <= 15) stage = 'Tahap 2 • TMO'
      else if (dayNum > 15 && dayNum <= 30) stage = 'Tahap 3 • Lab Prakom'
      else if (dayNum > 30) stage = 'Tahap 4 • Seminar'

      const yStr = cur.getFullYear()
      const mStr = String(cur.getMonth() + 1).padStart(2, '0')
      const dStr = String(cur.getDate()).padStart(2, '0')
      days.push({
        day: dayNum,
        stage,
        date: `${yStr}-${mStr}-${dStr}`,
      })
      dayNum++
    }
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

let CURRICULUM_DAYS = buildCurriculumDays()

/**
 * Ekstraksi tanggal jadwal secara akurat dari kolom date, session_date, color,
 * ataupun pola ISO [YYYY-MM-DD] pada subject_name.
 */
function getScheduleDate(s) {
  if (!s) return null
  if (s.date && /^\d{4}-\d{2}-\d{2}/.test(String(s.date).trim())) return String(s.date).trim().slice(0, 10)
  if (s.session_date && /^\d{4}-\d{2}-\d{2}/.test(String(s.session_date).trim())) return String(s.session_date).trim().slice(0, 10)
  if (s.color && /^\d{4}-\d{2}-\d{2}/.test(String(s.color).trim())) return String(s.color).trim().slice(0, 10)
  const text = `${s.subject_name || ''} ${s.title || ''}`
  const match = text.match(/\[(\d{4}-\d{2}-\d{2})\]/)
  if (match) return match[1]
  return null
}

/**
 * Ekstraksi nomor hari diklat (1-35) secara strict agar Hari 1 tidak tertukar dengan Hari 10-19.
 */
function getScheduleDayNumber(s) {
  if (!s) return null
  const subject = String(s.subject_name || s.title || '').trim()
  const dayStr = String(s.day || '').trim()

  const tagMatch = subject.match(/\[\s*hari\s*(\d+)\s*\]/i)
  if (tagMatch) {
    const num = parseInt(tagMatch[1], 10)
    if (num >= 1 && num <= 35) return num
  }

  const dayFieldMatch = dayStr.match(/hari\s*(?:ke[-\s]*)?(\d+)/i)
  if (dayFieldMatch) {
    const num = parseInt(dayFieldMatch[1], 10)
    if (num >= 1 && num <= 35) return num
  }

  if (/^\d+$/.test(dayStr)) {
    const num = parseInt(dayStr, 10)
    if (num >= 1 && num <= 35) return num
  }

  return null
}

/**
 * Sinkronisasi dinamis kalender 35 hari dengan data aktual di Supabase
 */
async function syncCurriculumWithDatabase(supabase) {
  if (!supabase) return
  try {
    const { data: allSchedules } = await supabase
      .from('schedules')
      .select('*')
    if (allSchedules && allSchedules.length > 0) {
      const b4 = allSchedules.filter((s) => isBatch4Item(s))
      b4.forEach((s) => {
        const dayNum = getScheduleDayNumber(s)
        const sDate = getScheduleDate(s)
        if (dayNum !== null && sDate) {
          const existing = CURRICULUM_DAYS.find((c) => c.day === dayNum)
          if (existing) {
            existing.date = sDate
          } else {
            let stage = 'Tahap 1 • MOOC'
            if (dayNum > 5 && dayNum <= 15) stage = 'Tahap 2 • TMO'
            else if (dayNum > 15 && dayNum <= 30) stage = 'Tahap 3 • Lab Prakom'
            else if (dayNum > 30) stage = 'Tahap 4 • Seminar'
            CURRICULUM_DAYS.push({ day: dayNum, stage, date: sDate })
          }
        }
      })
      CURRICULUM_DAYS.sort((a, b) => a.day - b.day)
    }
  } catch (e) {
    console.warn('[Scheduler] Gagal sinkronisasi kalender dari DB:', e.message)
  }
}

/**
 * Koleksi Untaian Penyemangat Pagi Wibu / Anime (Agrasena Batch 4)
 * Berisi 30 variasi berbeda agar pesan pagi selalu segar, kocak, dan tidak monoton.
 */
const ANIME_MORNING_QUOTES = [
  'Ohayou gozaimasu, Nakama Agrasena 4! ☀️ Kopi hitam +100 Mana sudah diseduh? Bangunkan kage bunshin kalian, jangan biarkan rasa kantuk menghentikan grinding EXP ilmu TI hari ini!',
  'Panggilan darurat dari Markas Besar Adhyaksa! 🚨 Aktifkan mode Super Saiyan! Jangan biarkan koneksi internet nge-lag saat Sensei Widyaiswara mulai menjelaskan arsitektur SPBE!',
  'Bahkan Frieren saja belajar sihir ribuan tahun tanpa mengeluh, masa kita diklat 35 hari udah pengen jadi slime? Bangkit, para calon arsitek digital Kejaksaan RI! 🧝‍♀️✨',
  'Selamat pagi para pejuang ranking S! 🎮 Daily Quest telah aktif: Buka Zoom, pasang kemeja putih, dan isi presensi LMS sebelum kena penalti debuff dari panitia!',
  'Ohayou sekai, Good Morning World! 🧪 Senku pernah bilang: sains dan pemrograman itu 10 miliar persen butuh ketelitian. Siapkan laptop dan mari taklukkan materi hari ini!',
  'Bankai! Tensa Zangetsu! ⚔️ Tebas tuntas rasa mager pagi ini! Zoom sudah menunggu, jangan sampai nama kalian dipanggil pemateri pas lagi ngunyah sarapan!',
  'Bangun wahai keturunan klan Adhyaksa! 🍥 Kumpulkan chakra di ujung jari, siapkan notepad, dan jangan lupa nyalakan webcam biar dikira murid teladan di anime shounen!',
  'Ehe te nandayo?! Jangan tarik selimut lagi setelah alarm bunyi! 🧚 Panitia dan Widyaiswara sudah standby di lobby. Waktunya push rank pengetahuan!',
  'Sasageyo! Sasageyo! Shinzou wo sasageyo! ✊ Persembahkan fokus dan konsentrasi terbaik kalian di layar monitor demi masa depan digitalisasi Kejaksaan yang gemilang!',
  'Ingat kata Gojo Satoru: "Daijoubu, boku saikyou dakara" (Tenang, aku kan yang terkuat). Materi sesulit apa pun hari ini pasti bisa kalian libas. Ganbatte kudasai! 🕶️🔥',
  'Pagi-pagi minum kopi, siang-siang makan onigiri. Presensi LMS jangan sampai lupa diisi, biar lulus diklat tanpa drama di kemudian hari! 🍙✨',
  'Arise! Bangkit dari kasur wahai Shadow Monarch! 🗡️ Tingkatkan stat INT dan WIS kalian di kelas hari ini. Dungeon pembelajaran akan segera dibuka pukul 08:00 WIB!',
  'Kimi no Na wa? Nama kalian sudah terdaftar di log presensi belum? 🌌 Cek LMS sekarang juga sebelum sistem mengunci gerbang kehadiran!',
  'Di dunia isekai mungkin kita jadi petualang biasa, tapi di dunia nyata kita adalah garda terdepan teknologi Kejaksaan RI! Semangat pagi, minna-san! 🛡️💻',
  'Tatake! Tatake! Maju terus pantang mundur! 🦅 Jangan biarkan rasa kantuk menguasai alam bawah sadar. Segera seduh ramuan penambah stamina!',
  'Konnichiwa... eh masih Ohayou! ☕ Apakah buff sarapan pagi sudah terpasang sempurna? Jangan sampai pas sesi tanya-jawab suara perut kalian masuk ke microphone Zoom!',
  'Pagi ini cerah secerah senyuman waifu/husbando kalian! 🌸 Jadikan itu motivasi untuk belajar tekun hari ini. Ingat, tiket konser dan figure anime butuh SK Prakom!',
  'Rasengan fokus telah diisi penuh! 🌀 Siapkan dua layar monitor bila perlu: satu buat slide materi, satu buat buka portal kelas. Jangan buat buka tab anime dulu ya!',
  'Level Up Loading: [████████▒▒] 80%. Sedikit lagi menuju insan Prakom paripurna. Awali pagi ini dengan bismillah dan semangat pantang menyerah!',
  'Selamat pagi para pilar Adhyaksa! ⚔️ Tanjiro saja berlatih pernapasan air sampai pedangnya patah. Kita cukup berlatih pernapasan sabar saat menyimak materi 120 JP!',
  'Alert: Sinyal titan mendekat! 🏃‍♂️ Cepat masuk ke Wall Maria (ruang Zoom) sebelum jam 07:40 WIB. Kenakan seragam rapi dan senyum penuh optimisme!',
  'Okaeri... eh Ohayou! Selamat datang kembali di petualangan Agrasena 4! 🌿 Hari baru, modul baru, dan kesempatan emas meng-upgrade skill jadi programmer dewa!',
  'Jadilah seperti Luffy yang pantang menyerah mencari One Piece! 👒 Cari ilmu sebanyak-banyaknya hari ini sampai menemukan harta karun arsitektur TI yang hakiki!',
  'Pagi yang indah untuk tidak terkena mental breakdown oleh coding dan subnetting! ☕ Tarik napas dalam-dalam, hembuskan perlahan, dan mari mulai hari dengan senyuman!',
  'Zetsubou (keputusasaan) bukan bagian dari kamus Agrasena 4! ⚡ Kalahkan semua rintangan materi hari ini bagaikan Saitama mengalahkan monster dalam satu pukulan!',
  'Dunia digital Kejaksaan memanggil para ksatria terbaiknya! 🚀 Pastikan koneksi Wi-Fi stabil, headset terpasang, dan fokus 100% pada paparan pemateri!',
  'Jangan biarkan diri kalian terkena "Tsukuyomi Tak Terbatas" alias ketiduran di depan laptop! 👁️ Tetap melek, catat poin penting, dan aktif berdiskusi di kelas!',
  'Senyum Pagi: "Gak ada error yang gak bisa di-fix, gak ada materi yang gak bisa dipahami asal ada niat dan kopi!" Ganbatte ne, minna! ☕💻',
  'Pagi ini kita grinding bareng satu guild Agrasena 4! 🛡️ Saling support antar rekan, yang ngerti bantu yang bingung, biar lulus bareng sampai wisuda akhir!',
  'Detik-detik menuju kelas dimulai! ⏳ Pasang headset, rapikan rambut, dan siapkan senyum terbaik. Saatnya menunjukkan pesona Prakom berintegritas tinggi!',
]

/**
 * Status Buff Pagi Anime Lucu
 */
const ANIME_MORNING_BUFFS = [
  'Buff Aktif: Kopi Hitam Panas (+100 Mana, +50 Resilience Kantuk) ☕',
  'Buff Aktif: Sarapan Bergizi (+200 Stamina, +50 Konsentrasi Menyimak) 🍙',
  'Buff Aktif: Mode Senpai (+100 Charisma, +75 Kemampuan Coding) ✨',
  'Buff Aktif: Domain Expansion: Ruang Zoom (+150 Aura Mahasiswa Teladan) 🌐',
  'Buff Aktif: Spirit of Adhyaksa (+500 Integritas, +100 Dedikasi Pelayanan) ⚖️',
  'Buff Aktif: Ultra Instinct (+80 Kecepatan Mengetik Catatan Materi) ⚡',
  'Buff Aktif: Koneksi Wi-Fi Dewa (Ping 5ms, Anti-Disconnect di Tengah Kuliah) 📶',
  'Buff Aktif: Perisai Anti-AFK (+100 Kesiapsiagaan Pas Ditunjuk Pemateri) 🛡️',
  'Buff Aktif: Ramuan Elixir Pagi (+150 Fokus Mata, -99% Mata Panda) 🧪',
  'Buff Aktif: Kage Bunshin Mandiri (Mata fokus ke slide, jari aktif catat materi) 🍥',
]

/**
 * Koleksi Untaian Penutup Sore Wibu / Anime (Agrasena Batch 4)
 * Berisi 30 variasi berbeda agar pesan sore selalu segar, kocak, dan tidak monoton.
 */
const ANIME_CLOSING_QUOTES = [
  'Otsukaresama deshita, Minna-san! 🍵 Sesi grinding materi hari ini resmi kelar! Silakan rebahan dan regen HP, tapi awas... Boss Quest bernama Tugas Mandiri menanti di LMS!',
  'Misi harian selesai dengan predikat S-Rank! 🏆 Kalian semua berhasil bertahan hidup sampai jam 15:00 WIB. Saatnya santai, nonton anime, tapi jangan lupa cicil tugas ya!',
  'Bel pulang telah berbunyi seperti ending anime slice-of-life di kala senja! 🌅 Terima kasih atas perjuangan hebat kalian hari ini, nakama. Sampai jumpa di episode besok!',
  'Bahkan Levi Ackerman pun bakal hormat melihat ketahanan mental kalian menyimak materi dari pagi! ⚔️ Istirahatlah prajurit, kalian layak mendapatkan waktu santai!',
  'Mana habis? Stamina bar warna merah? 🧪 Segera kembali ke save point (kasur/meja makan). Tapi ingat wasiat leluhur: "Tugas yang dicicil hari ini menjauhkan overthinking tengah malam"!',
  'Pukul 15:00 WIB: Safe Zone telah diaktifkan! 🛡️ Kalian terbebas dari paparan slide presentasi. Saatnya makan enak, minum boba, dan charge jiwa wibu sampai penuh!',
  'Konoha aman berkat para shinobi yang tekun berlatih! 🍃 Terima kasih partisipasinya hari ini. Jangan lupa save as tugas kalian, jangan sampai file-nya hilang kena jutsu!',
  'Isekai boleh fiksi, tapi tenggat tugas LMS itu nyata, kawan! 📖 Selesaikan quest penugasan sebelum monster deadline muncul pukul 23:59 WIB!',
  'Yare yare daze... 🧢 Materi hari ini lumayan menguras chakra ya? Tapi rekan-rekan Agrasena 4 memang bermental baja. Selamat menikmati waktu istirahat sore!',
  'Mission Cleared! 🎉 EXP bertambah +9999. Jangan lupa upload laporan ke LMS biar reward kelulusan cair sempurna. Sampai jumpa di medan tempur esok hari!',
  'Anya Forger bilang: Belajar selesai itu "Waku Waku"! 🥜 Renggangkan otot leher dan istirahatkan mata dari radiasi monitor. Selamat menikmati sore hari!',
  'Arigatou gozaimashita untuk kebersamaan hari ini! 🙏 Kalian bukan sekadar peserta diklat biasa, kalian adalah pilar transformasi digital Kejaksaan RI masa depan!',
  'Akhirnya sesi Zoom ditutup! 🚪 Tarik napas lega, lepaskan kemeja formal, ganti baju santai, dan nikmati sisa hari dengan bahagia bersama orang-orang tercinta!',
  'Kalian berhasil melewati hari ini tanpa kena debuff kantuk berat! ⭐ Beri tepuk tangan untuk diri sendiri. Besok kita lanjutkan grinding ke level yang lebih tinggi!',
  'Perut keroncongan? Saatnya berburu kuliner ramen atau nasi goreng! 🍜 Isi ulang energi fisik kalian sebelum mulai mengetik laporan penugasan malam nanti!',
  'Sesi perkuliahan hari ini tamat! 🎬 Jangan lupa tulis rangkuman materi selagi memorinya masih fresh di kepala. Sedikit usaha sore ini, hasil maksimal esok hari!',
  'Pahlawan juga butuh tidur! 🛌 Rehatkan otak dari algoritma dan regulasi SPBE. Besok pagi kita sambut lagi dengan semangat membara ala anime shounen!',
  'Ingat prinsip Edward Elric: "Hukum Pertukaran Setara"! ⚙️ Waktu belajar yang kalian curahkan hari ini akan terbayar lunas dengan kompetensi hebat di masa depan!',
  'Kelas bubar jalan! 🏃‍♂️ Terima kasih kepada Widyaiswara dan seluruh nakama kelas. Tetap jaga kesehatan, minum air putih yang banyak, dan tetap tersenyum!',
  'Dungeon hari ini cleared! 🎮 Tinggalkan ruang Zoom dengan kepala tegak. Jangan biarkan tugas menumpuk sampai jadi hutang peradaban!',
  'Selamat menikmati sore yang syahdu! 🌇 Putar lagu opening anime favorit, seduh teh hangat, dan biarkan pikiran kalian rileks sejenak!',
  'Kalian semua adalah MVP hari ini! 🏅 Bertahan menyimak materi teknis selama berjam-jam bukanlah hal mudah. Kalian luar biasa, Agrasena 4!',
  'Saatnya logout dari Zoom, tapi jangan logout dari tanggung jawab tugas! 📝 Cek portal LMS, pastikan file PDF sudah terunggah dengan format nama yang benar!',
  'Waktu siaga sore berakhir! 🕊️ Nikmati senja yang tenang. Semoga ilmu yang didapat hari ini berkah dan bermanfaat untuk satuan kerja masing-masing!',
  'Bahkan Naruto butuh waktu makan ramen di Ichiraku setelah misi berat! 🍥 Nikmati makanan favorit kalian sore ini, rekan-rekan!',
  'Sesi hari ini selesai dengan aman dan tertib! 👏 Terima kasih atas kekompakan seluruh peserta Agrasena Batch 4. Kalian memang tim terbaik!',
  'Jangan biarkan deadline tugas menatapmu dari kegelapan! 🕶️ Selesaikan lebih awal, tidur lebih nyenyak, dan bangun besok pagi tanpa beban!',
  'Kalian telah mengumpulkan banyak exp poin hari ini! 📈 Setiap hari selangkah lebih dekat menuju gelar Pranata Komputer yang kompeten dan berintegritas!',
  'Sayonara untuk hari ini! 👋 Persiapkan mental dan semangat untuk materi esok pagi. Kita bertemu lagi di jam 07:40 WIB!',
  'Tutup laptop sejenak, hirup udara segar di luar. Rehat yang berkualitas adalah kunci performa belajar yang tahan lama. Otsukaresama!',
]

/**
 * Punchline Sore Anime Lucu
 */
const ANIME_CLOSING_PUNCHLINES = [
  'Dungeon Selesai: EXP +10,000, Koin Lelah +50, Status: Siap Rebahan! 🎮',
  'Mode Santai Diaktifkan: Silakan streaming anime atau push rank sampai tugas memanggil! ⚔️',
  'Peringatan Sistem: Kapasitas memori otak 99% penuh, disarankan reboot dengan segelas kopi es! ☕',
  'Pencapaian Unlocked: "Selamat Dari Kuliah Seharian Tanpa Tertidur Pulas" 🏆',
  'HP & MP sedang dipulihkan di save point terdekat. Jangan diganggu kecuali urusan tugas! 🛌',
  'Sensei Widyaiswara telah pamit undur diri, murid teladan Agrasena 4 dipersilakan bubar! 🌸',
]

/**
 * Generator Pesan Pagi Anime Dinamis (Berotasi Harian Sehingga Tidak Monoton)
 */
function getDailyAnimeMorning(date = new Date(), dayInfo = {}) {
  const d = new Date(date)
  const startOfYear = new Date(d.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((d - startOfYear) / (1000 * 60 * 60 * 24))
  const dayNum = dayInfo.day || (dayOfYear > 0 ? dayOfYear : 1)

  const quoteIdx = Math.abs((dayNum * 7 + dayOfYear * 3) % ANIME_MORNING_QUOTES.length)
  const buffIdx = Math.abs((dayNum * 13 + dayOfYear * 5) % ANIME_MORNING_BUFFS.length)

  return {
    quote: ANIME_MORNING_QUOTES[quoteIdx],
    buff: ANIME_MORNING_BUFFS[buffIdx],
  }
}

/**
 * Generator Pesan Sore Anime Dinamis (Berotasi Harian Sehingga Tidak Monoton)
 */
function getDailyAnimeClosing(date = new Date(), dayInfo = {}) {
  const d = new Date(date)
  const startOfYear = new Date(d.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((d - startOfYear) / (1000 * 60 * 60 * 24))
  const dayNum = dayInfo.day || (dayOfYear > 0 ? dayOfYear : 1)

  const quoteIdx = Math.abs((dayNum * 11 + dayOfYear * 7) % ANIME_CLOSING_QUOTES.length)
  const punchlineIdx = Math.abs((dayNum * 17 + dayOfYear * 2) % ANIME_CLOSING_PUNCHLINES.length)

  return {
    quote: ANIME_CLOSING_QUOTES[quoteIdx],
    punchline: ANIME_CLOSING_PUNCHLINES[punchlineIdx],
  }
}

// =========================================================================
// ANTI-SPAM & DATE HELPERS
// =========================================================================
let lastScheduleSentDate = null
let lastClosingSentDate = null

function formatIndonesianDate(date = new Date()) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ]
  const d = new Date(date)
  const dayName = days[d.getDay()]
  const dayDate = d.getDate()
  const monthName = months[d.getMonth()]
  const year = d.getFullYear()
  return `${dayName}, ${dayDate < 10 ? '0' + dayDate : dayDate} ${monthName} ${year}`
}

function getJakartaDateStr(date = new Date()) {
  const d = new Date(date)
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
}

function getDiklatDayInfo(date = new Date()) {
  const dateStr = getJakartaDateStr(date)
  const found = CURRICULUM_DAYS.find((c) => c.date === dateStr)
  if (found) return found

  const d = new Date(date)
  const dayOfWeek = d.getDay()
  return {
    day: null,
    stage: dayOfWeek === 0 || dayOfWeek === 6 ? 'Akhir Pekan' : 'Hari Libur Diklat',
    date: dateStr,
    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
  }
}

/**
 * Memeriksa apakah waktu saat ini di zona waktu WIB (Asia/Jakarta)
 * sudah mencapai atau melewati pukul 15:00 WIB (jam 3 sore WIB).
 */
function isPastAfternoonCutoff(date = new Date()) {
  try {
    const jakartaTimeStr = date.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })
    const [hour] = jakartaTimeStr.split(':').map(Number)
    return hour >= 15
  } catch {
    const utcHours = date.getUTCHours()
    const wibHours = (utcHours + 7) % 24
    return wibHours >= 15
  }
}

/**
 * Mencari hari diklat aktif berikutnya dalam kalender (melewati akhir pekan / libur).
 */
function getNextActiveDiklatDay(startDate = new Date()) {
  const cur = new Date(startDate)
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(cur)
    nextDate.setDate(nextDate.getDate() + i)
    const dayInfo = getDiklatDayInfo(nextDate)
    if (dayInfo.day && !dayInfo.isWeekend) {
      return { date: nextDate, dayInfo }
    }
  }
  return null
}

/**
 * Menghitung timestamp batas akhir tugas (23:59:59 WIB pada hari tenggat waktu).
 * Sesuai dengan kalkulasi pada website kelas (src/lib/utils.ts).
 */
function getTaskDeadlineTimestamp(dueDateStr) {
  if (!dueDateStr) return 0
  const d = new Date(dueDateStr)
  let datePart = ''
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    datePart = formatter.format(d)
  } catch {
    const match = String(dueDateStr).match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) datePart = match[0]
  }

  if (datePart) {
    const [y, m, day] = datePart.split('-').map(Number)
    const targetUTC = new Date(Date.UTC(y, m - 1, day, 16, 59, 59, 999))
    return targetUTC.getTime()
  }

  const fallback = new Date(dueDateStr)
  fallback.setHours(23, 59, 59, 999)
  return fallback.getTime()
}

/**
 * Format sisa waktu tenggat tugas dalam bahasa Indonesia (countdown)
 */
function formatRemainingTime(deadlineMs, now = Date.now()) {
  const diffMs = deadlineMs - now
  if (diffMs <= 0) return 'Tenggat telah berakhir'
  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const totalHours = Math.floor(totalMinutes / 60)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  const minutes = totalMinutes % 60

  if (days > 0) {
    return `${days} hari ${hours > 0 ? hours + ' jam ' : ''}lagi`
  }
  if (hours > 0) {
    return `${hours} jam ${minutes > 0 ? minutes + ' menit ' : ''}lagi`
  }
  return `${Math.max(1, minutes)} menit lagi`
}

async function loadNotificationHistory(supabase) {
  if (!supabase) return
  try {
    const { data } = await supabase.from('wa_bot_config').select('value').eq('key', 'notification_history').single()
    if (data?.value) {
      lastScheduleSentDate = data.value.last_schedule_sent_date || null
      lastClosingSentDate = data.value.last_closing_sent_date || null
    }
  } catch {}
}

async function saveNotificationHistory(supabase, update) {
  if (!supabase) return
  try {
    const { data } = await supabase.from('wa_bot_config').select('value').eq('key', 'notification_history').single()
    const current = data?.value || {}
    const updated = { ...current, ...update, updated_at: new Date().toISOString() }
    await supabase.from('wa_bot_config').upsert(
      {
        key: 'notification_history',
        value: updated,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )
  } catch {}
}

// =========================================================================
// 1. DATE QUERY PARSER (UNTUK CEK JADWAL PER TANGGAL / HARI KE-N)
// =========================================================================

function parseDateQuery(query) {
  if (!query || typeof query !== 'string') {
    return { success: true, date: new Date(), queryType: 'today' }
  }

  const str = query.trim().toLowerCase()
  if (!str || str === 'hari ini' || str === 'today') {
    return { success: true, date: new Date(), queryType: 'today' }
  }

  if (str === 'besok' || str === 'tomorrow') {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return { success: true, date: d, queryType: 'tomorrow' }
  }

  if (str === 'kemarin' || str === 'yesterday') {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return { success: true, date: d, queryType: 'yesterday' }
  }

  // 1. Pola nomor hari diklat: "12", "hari 12", "h12", "ke-12"
  const dayMatch = str.match(/^(?:hari\s+(?:ke-?)?|h|ke-?)?(\d{1,2})$/i)
  if (dayMatch) {
    const dayNum = parseInt(dayMatch[1], 10)
    if (dayNum >= 1 && dayNum <= 35) {
      const cur = CURRICULUM_DAYS.find((c) => c.day === dayNum)
      if (cur) {
        const [y, m, d] = cur.date.split('-').map(Number)
        const targetDate = new Date(y, m - 1, d, 8, 0, 0)
        return { success: true, date: targetDate, dayNum, queryType: 'dayNumber' }
      }
    }
  }

  // 2. Pola nama bulan: "8 Sep", "8 September", "08 September 2026", "8-Sep-2026"
  const monthMap = {
    jan: 0, januari: 0,
    feb: 1, februari: 1,
    mar: 2, maret: 2,
    apr: 3, april: 3,
    mei: 4,
    jun: 5, juni: 5,
    jul: 6, juli: 6,
    ags: 7, agust: 7, agustus: 7,
    sep: 8, sept: 8, september: 8,
    okt: 9, oktober: 9,
    nov: 10, november: 10,
    des: 11, desember: 11,
  }

  const textDateMatch = str.match(/^(\d{1,2})\s*[-/ ]\s*([a-zA-Z]+)(?:\s*[-/ ]\s*(\d{2,4}))?$/)
  if (textDateMatch) {
    const day = parseInt(textDateMatch[1], 10)
    const mStr = textDateMatch[2].toLowerCase()
    let foundMonth = null
    for (const [key, val] of Object.entries(monthMap)) {
      if (mStr.startsWith(key)) {
        foundMonth = val
        break
      }
    }
    if (foundMonth !== null && day >= 1 && day <= 31) {
      let year = textDateMatch[3] ? parseInt(textDateMatch[3], 10) : 2026
      if (year < 100) year += 2000
      const targetDate = new Date(year, foundMonth, day, 8, 0, 0)
      return { success: true, date: targetDate, queryType: 'date' }
    }
  }

  // 3. Pola numerik: "DD-MM-YYYY", "DD/MM/YYYY", "DD/MM", "YYYY-MM-DD", "DD.MM.YYYY"
  const isoMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/)
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10)
    const month = parseInt(isoMatch[2], 10) - 1
    const day = parseInt(isoMatch[3], 10)
    const targetDate = new Date(year, month, day, 8, 0, 0)
    return { success: true, date: targetDate, queryType: 'date' }
  }

  const ddmmyyyyMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{2,4}))?$/)
  if (ddmmyyyyMatch) {
    const day = parseInt(ddmmyyyyMatch[1], 10)
    const month = parseInt(ddmmyyyyMatch[2], 10) - 1
    let year = ddmmyyyyMatch[3] ? parseInt(ddmmyyyyMatch[3], 10) : 2026
    if (year < 100) year += 2000
    const targetDate = new Date(year, month, day, 8, 0, 0)
    return { success: true, date: targetDate, queryType: 'date' }
  }

  return { success: false }
}

// =========================================================================
// 2. GENERATOR JADWAL PEMBELAJARAN (RAPI, MENARIK & TIDAK PANJANG)
// =========================================================================

async function getSessionsForDate(supabase, targetDate = new Date(), dayInfo = null) {
  if (!supabase) return []
  let sessions = []
  try {
    const { data: allSchedules } = await supabase
      .from('schedules')
      .select('*')
      .order('start_time', { ascending: true })

    if (allSchedules && allSchedules.length > 0) {
      // 1. Isolasi: Hanya ambil data yang berelasi dengan Batch 4
      const b4Schedules = allSchedules.filter((s) => isBatch4Item(s))

      if (b4Schedules.length > 0) {
        // Sinkronisasi otomatis tanggal kurikulum dari data yang ditemukan di DB
        b4Schedules.forEach((s) => {
          const dayNum = getScheduleDayNumber(s)
          const sDate = getScheduleDate(s)
          if (dayNum !== null && sDate) {
            const existing = CURRICULUM_DAYS.find((c) => c.day === dayNum)
            if (existing && existing.date !== sDate) {
              existing.date = sDate
            }
          }
        })

        const targetDateStr = getJakartaDateStr(targetDate)

        // 2. Cocokkan tanggal pasti (via date, session_date, color, atau pola [YYYY-MM-DD])
        const dateMatched = b4Schedules.filter((s) => {
          const sDate = getScheduleDate(s)
          return sDate === targetDateStr
        })

        if (dateMatched.length > 0) {
          sessions = dateMatched
        } else if (dayInfo && dayInfo.day) {
          // 3. Cocokkan nomor hari secara strict ([Hari X], hari ke-X)
          sessions = b4Schedules.filter((s) => {
            const explicitDay = getScheduleDayNumber(s)
            return explicitDay === dayInfo.day
          })
        }

        if (sessions.length === 0) {
          // 4. Fallback ke nama hari hanya jika jadwal tidak memiliki tanggal spesifik
          const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
          const currentDayName = dayNames[new Date(targetDate).getDay()]
          sessions = b4Schedules.filter((s) => {
            const sDate = getScheduleDate(s)
            if (sDate) return false
            return (s.day || '').toLowerCase() === currentDayName.toLowerCase()
          })
        }

        // Urutkan sesi secara kronologis berdasarkan jam mulai
        sessions.sort((a, b) => String(a.start_time || '').localeCompare(String(b.start_time || '')))
      }
    }
  } catch (e) {
    console.error('[Scheduler Error] Gagal mengambil jadwal Batch 4:', e.message)
  }
  return sessions
}

function formatSessionsText(sessions, dayInfo) {
  let text = ''
  if (!sessions || sessions.length === 0) {
    text += `▫️ Sesi pembelajaran berlangsung sesuai kurikulum *${dayInfo?.stage || 'Pusdiklat'}*.\n\n`
  } else {
    sessions.forEach((s, idx) => {
      let cleanTitle = (s.subject_name || s.title || 'Mata Diklat')
        .replace(/\[Hari\s*\d+\]\s*/gi, '')
        .replace(/\[Batch\s*4\]\s*/gi, '')
        .trim()
      const timeStr = s.start_time && s.end_time
        ? `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)} WIB`
        : s.time_slot || '08:00 WIB'
      const lecturer = s.lecturer ? s.lecturer.trim() : 'Widyaiswara Pusdiklat'

      text += `*${idx + 1}. ${cleanTitle}*\n`
      text += `   ⏰ Waktu   : *${timeStr}*\n`
      text += `   👤 Pemateri: ${lecturer}\n`
      if (s.room || s.meeting_link) {
        text += `   📍 Ruang   : ${s.room || s.meeting_link}\n`
      }
      text += `\n`
    })
  }
  return text
}

async function getActiveDeadlineTasks(supabase) {
  if (!supabase) return []
  const now = Date.now()
  let tasks = []
  try {
    const { data: dbTasks } = await supabase
      .from('tasks')
      .select('*')
      .neq('status', 'completed')
      .order('due_date', { ascending: true })

    if (dbTasks && dbTasks.length > 0) {
      tasks = dbTasks.filter((t) => {
        // Hanya tugas Batch 4
        if (!isBatch4Task(t)) return false

        const status = (t.status || '').toLowerCase().trim()
        // Jangan tampilkan yang berstatus selesai
        if (status === 'completed' || status === 'selesai' || status === 'done') return false
        // Cukup tampilkan yang masih ada deadline saja (belum lewat batas waktu)
        if (!t.due_date) return false
        const deadlineMs = getTaskDeadlineTimestamp(t.due_date)
        return deadlineMs > now
      })
    }
  } catch (e) {
    console.error('[Scheduler Error] Gagal mengambil tugas Batch 4:', e.message)
  }
  return tasks
}

function formatTasksText(tasks) {
  const now = Date.now()
  let text = ''
  if (!tasks || tasks.length === 0) {
    text += `📝 *STATUS TUGAS MANDIRI*\n`
    text += `────────────────────────\n`
    text += `✅ *Alhamdulillah, tidak ada tugas aktif dengan deadline berjalan.*\n`
    text += `Semua tugas telah diselesaikan atau telah melewati batas waktu pengumpulan. Selamat beristirahat! 🎉\n\n`
    text += `🌐 *Portal Tugas:* ${ZOOM_CONFIG.portalUrl}/tasks\n\n`
  } else {
    text += `📝 *TUGAS MANDIRI AKTIF (BER-DEADLINE)*\n`
    text += `────────────────────────\n\n`
    tasks.forEach((t, i) => {
      const taskTitle = t.title || t.name || 'Tugas Mandiri'
      const deadlineMs = getTaskDeadlineTimestamp(t.due_date)
      const formattedDueDate = formatIndonesianDate(t.due_date)
      const remainingStr = formatRemainingTime(deadlineMs, now)
      const desc = t.description ? t.description.slice(0, 110).replace(/\r?\n/g, ' ').trim() : ''

      text += `*${i + 1}. ${taskTitle}*\n`
      text += `   ⏳ Batas Waktu : *${formattedDueDate} (23:59 WIB)*\n`
      text += `   ⏱️ Sisa Waktu  : _${remainingStr}_\n`
      if (desc) {
        text += `   📄 Keterangan  : _${desc}${t.description.length > 110 ? '...' : ''}_\n`
      }
      text += `\n`
    })

    text += `📤 *Pengumpulan Tugas:*\n`
    text += `Unggah laporan / lembar kerja melalui LMS Kejaksaan:\n`
    text += `👉 ${ZOOM_CONFIG.lmsUrl}\n\n`
    text += `📂 *Panduan & Format Lembar Kerja:*\n`
    text += `👉 ${ZOOM_CONFIG.portalUrl}/tasks\n\n`
  }
  return text
}

function formatZoomAccessSection() {
  let text = `🎥 *Akses Ruang Virtual Zoom (Angkatan 4):*\n`
  if (ZOOM_CONFIG.meetingId && ZOOM_CONFIG.passcode) {
    text += `• Meeting ID : *${ZOOM_CONFIG.meetingIdDisplay || ZOOM_CONFIG.meetingId}*\n`
    text += `• Passcode   : *${ZOOM_CONFIG.passcode}*\n`
    if (ZOOM_CONFIG.joinUrl) {
      text += `• Link Zoom  : ${ZOOM_CONFIG.joinUrl}\n`
    }
  } else {
    text += `Tautan Zoom resmi selalu dapat diakses melalui Portal Kelas:\n`
    text += `👉 ${ZOOM_CONFIG.portalUrl}\n`
  }
  text += `\n`
  return text
}

async function generateScheduleMessage(supabase, date = new Date(), options = {}) {
  let dayInfo = getDiklatDayInfo(date)
  const fullDateFormatted = formatIndonesianDate(date)
  const { isMorningCron = false } = options

  // Ambil Jadwal Sesi dari Database terlebih dahulu
  const sessions = await getSessionsForDate(supabase, date, dayInfo)

  // Jika dayInfo.day belum terdefinisi namun ada sesi di DB, deteksi nomor hari dari sesi
  if (!dayInfo.day && sessions.length > 0) {
    const detectedDay = getScheduleDayNumber(sessions[0])
    if (detectedDay) {
      let stage = 'Tahap 1 • MOOC'
      if (detectedDay > 5 && detectedDay <= 15) stage = 'Tahap 2 • TMO'
      else if (detectedDay > 15 && detectedDay <= 30) stage = 'Tahap 3 • Lab Prakom'
      else if (detectedDay > 30) stage = 'Tahap 4 • Seminar'
      dayInfo = { ...dayInfo, day: detectedDay, stage }
    }
  }

  const animeMorning = getDailyAnimeMorning(date, dayInfo)

  let msg = isMorningCron
    ? `⚔️ *OHAYOU GOZAIMASU! PENGINGAT KELAS PAGI* ⚔️\n`
    : `🏛️ *JADWAL PEMBELAJARAN AGRASENA BATCH 4*\n`
  msg += `*Diklat Fungsional Prakom • Kejaksaan RI 2026* 🌸\n`
  msg += `────────────────────────\n`
  msg += `📅 *Hari/Tanggal:* ${fullDateFormatted}\n`
  if (dayInfo.day) {
    msg += `📌 *Tahapan Diklat:* Hari ke-${dayInfo.day}`
    if (dayInfo.stage) msg += ` • ${dayInfo.stage}`
    msg += `\n`
  }
  msg += `────────────────────────\n\n`

  if (isMorningCron) {
    msg += `🎌 *Penyemangat Pagi Shinobi Adhyaksa:*\n`
    msg += `_"${animeMorning.quote}"_\n\n`
    msg += `🎮 *${animeMorning.buff}*\n\n`
    if (!dayInfo.isWeekend && dayInfo.day) {
      msg += `⏰ *Waktu Siaga Zoom:* Pukul *07:40 WIB*\n`
      msg += `📌 _Peringatan Guild: Mohon rekan nakama segera login LMS & presensi tepat waktu sebelum di-domain expansion oleh panitia!_ 🛡️\n\n`
    }
  }

  // Jika Akhir Pekan (Sabtu/Minggu) dan memang tidak ada sesi
  if (dayInfo.isWeekend && sessions.length === 0) {
    msg += `☕ *Agenda Hari Ini:*\n`
    msg += `Hari libur pembelajaran tatap muka (Akhir Pekan). Selamat beristirahat bersama keluarga! 🌿\n\n`
    msg += `🌐 *Portal Web Kelas & Materi:*\n`
    msg += `👉 ${ZOOM_CONFIG.portalUrl}\n\n`
    msg += `────────────────────────\n`
    msg += `💡 *Perintah Cepat:*\n`
    msg += `• *!jadwal besok* : Jadwal pembelajaran esok hari\n`
    msg += `• *!tugas* : Cek status tugas mandiri aktif\n`
    msg += `• *!pengumuman* : Cek info penting mendesak\n`
    msg += `• *!help* : Daftar panduan perintah`
    return { text: msg, count: 0, dayInfo }
  }

  // Jika hari kerja tetapi tidak ada jadwal sesi dan bukan hari diklat
  if (!dayInfo.day && sessions.length === 0) {
    msg += `☕ *Agenda Hari Ini:*\n`
    msg += `Tidak ada agenda perkuliahan tatap muka terjadwal hari ini. Selamat melanjutkan tugas mandiri! 🌿\n\n`
    msg += `🌐 *Portal Web Kelas & Materi:*\n`
    msg += `👉 ${ZOOM_CONFIG.portalUrl}\n\n`
    msg += `────────────────────────\n`
    msg += `💡 *Perintah Cepat:*\n`
    msg += `• *!jadwal besok* : Jadwal pembelajaran esok hari\n`
    msg += `• *!tugas* : Cek status tugas mandiri aktif\n`
    msg += `• *!pengumuman* : Cek info penting mendesak\n`
    msg += `• *!help* : Daftar panduan perintah`
    return { text: msg, count: 0, dayInfo }
  }

  msg += `📚 *Mata Diklat Hari Ini:*\n`
  msg += formatSessionsText(sessions, dayInfo)

  msg += formatZoomAccessSection()

  msg += `────────────────────────\n`
  msg += `💡 *Perintah Cepat:*\n`
  msg += `• *!jadwal besok* : Jadwal pembelajaran esok hari\n`
  msg += `• *!tugas* : Cek status tugas mandiri aktif\n`
  msg += `• *!pengumuman* : Cek info penting mendesak\n`
  msg += `• *!help* : Panduan bot lengkap`

  return { text: msg, count: sessions.length, dayInfo }
}

async function generateDailyScheduleMessage(supabase, date = new Date(), options = {}) {
  const isAfternoon = isPastAfternoonCutoff(date)

  // KETIKA SUDAH MELEWATI JAM 3 SORE WIB (15:00 WIB):
  // Otomatis tampilkan status kelas hari ini telah selesai,
  // tampilkan "DIKLAT BERLANJUT BESOK", dan berikan rincian jadwal pembelajaran besok!
  if (isAfternoon && !options.isMorningCron && !options.forceToday) {
    const todayInfo = getDiklatDayInfo(date)
    const todayFormatted = formatIndonesianDate(date)

    const tomorrow = new Date(date)
    tomorrow.setDate(tomorrow.getDate() + 1)
    let tomorrowInfo = getDiklatDayInfo(tomorrow)
    const tomorrowFormatted = formatIndonesianDate(tomorrow)
    const tomorrowSessions = await getSessionsForDate(supabase, tomorrow, tomorrowInfo)

    if (!tomorrowInfo.day && tomorrowSessions.length > 0) {
      const detectedDay = getScheduleDayNumber(tomorrowSessions[0])
      if (detectedDay) {
        let stage = 'Tahap 1 • MOOC'
        if (detectedDay > 5 && detectedDay <= 15) stage = 'Tahap 2 • TMO'
        else if (detectedDay > 15 && detectedDay <= 30) stage = 'Tahap 3 • Lab Prakom'
        else if (detectedDay > 30) stage = 'Tahap 4 • Seminar'
        tomorrowInfo = { ...tomorrowInfo, day: detectedDay, stage }
      }
    }

    const animeClosing = getDailyAnimeClosing(date, todayInfo)

    let msg = `🏁 *OTSUKARESAMA DESHITA! SESI DIKLAT TELAH SELESAI* 🍵✨\n`
    msg += `*Diklat Fungsional Prakom • Agrasena Batch 4* 🌸\n`
    msg += `*Kejaksaan Republik Indonesia 2026*\n`
    msg += `────────────────────────\n`
    msg += `📅 *Hari Ini:* ${todayFormatted}`
    if (todayInfo.day) {
      msg += ` | Hari ke-${todayInfo.day}`
      if (todayInfo.stage) msg += ` (${todayInfo.stage})`
    }
    msg += `\n────────────────────────\n\n`
    msg += `💬 *Pesan Rehat Shinobi Adhyaksa:*\n`
    msg += `_"${animeClosing.quote}"_\n\n`
    msg += `🎮 *Status Quest:* ${animeClosing.punchline}\n\n`
    msg += `Sesi tatap muka hari ini resmi rampung pukul *15:00 WIB*. Selamat me-regen HP & MP rekan-rekan nakama sekalian! 👏\n\n`

    msg += `⏩ *DIKLAT BERLANJUT BESOK:*\n`
    msg += `📅 *Tanggal:* ${tomorrowFormatted}`
    if (tomorrowInfo.day) {
      msg += ` | Hari ke-${tomorrowInfo.day}`
      if (tomorrowInfo.stage) msg += ` (${tomorrowInfo.stage})`
    }
    msg += `\n────────────────────────\n\n`

    if (tomorrowSessions.length > 0) {
      msg += `📚 *Mata Diklat Besok:*\n`
      msg += formatSessionsText(tomorrowSessions, tomorrowInfo)

      msg += `⏰ *Waktu Siaga Besok:* Pukul *07:40 WIB*\n`
      msg += `📌 _Pengingat persiapan kelas: Mohon rekan-rekan bersiap di Zoom & mengisi presensi harian tepat waktu esok pagi._\n\n`
    } else if (tomorrowInfo.isWeekend) {
      msg += `☕ *Agenda Besok:*\n`
      msg += `Hari libur pembelajaran tatap muka (Akhir Pekan). Selamat beristirahat bersama keluarga! 🌿\n\n`

      const nextActive = getNextActiveDiklatDay(date)
      if (nextActive) {
        msg += `📌 *Pembelajaran Tatap Muka Berlanjut Pada:*\n`
        msg += `📅 *${formatIndonesianDate(nextActive.date)}* | Hari ke-${nextActive.dayInfo.day} (${nextActive.dayInfo.stage})\n\n`

        const nextSessions = await getSessionsForDate(supabase, nextActive.date, nextActive.dayInfo)
        msg += `📚 *Mata Diklat:*\n`
        msg += formatSessionsText(nextSessions, nextActive.dayInfo)
      }
    } else {
      msg += `☕ *Agenda Besok:*\n`
      msg += `Tidak ada agenda tatap muka terjadwal esok hari. Selamat beristirahat atau belajar mandiri! 🌿\n\n`
    }

    msg += formatZoomAccessSection()

    msg += `────────────────────────\n`
    msg += `💡 *Perintah Cepat:*\n`
    msg += `• *!jadwal hari ini* : Tetap melihat rekap sesi hari ini\n`
    msg += `• *!tugas* : Cek status tugas mandiri aktif\n`
    msg += `• *!pengumuman* : Cek info penting mendesak\n`
    msg += `• *!help* : Menu panduan lengkap`

    return { text: msg, count: 0, dayInfo: todayInfo, tomorrowInfo, isAfterCutoff: true }
  }

  return generateScheduleMessage(supabase, date, options)
}

async function generateTomorrowScheduleMessage(supabase, date = new Date()) {
  const tomorrow = new Date(date)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return generateScheduleMessage(supabase, tomorrow, { isManualQuery: true })
}

async function generateScheduleForQuery(supabase, query) {
  const parsed = parseDateQuery(query)
  if (!parsed.success) {
    let msg = `⚠️ *FORMAT TANGGAL BELUM SESUAI*\n`
    msg += `*Diklat Prakom Batch 4 • Agrasena Kejaksaan RI*\n`
    msg += `────────────────────────\n\n`
    msg += `Silakan gunakan salah satu format berikut:\n`
    msg += `• *!jadwal 15 Okt* atau *!jadwal 15 Oktober*\n`
    msg += `• *!jadwal 12* (Cek jadwal Diklat Hari ke-12)\n`
    msg += `• *!jadwal 15-10-2026* atau *!jadwal 15/10*\n`
    msg += `• *!jadwal besok* (Jadwal esok hari)\n\n`
    msg += `────────────────────────\n`
    msg += `💡 _Ketik *!jadwal* tanpa tanggal untuk melihat jadwal hari ini._`
    return { text: msg, count: 0, error: true }
  }

  // Jika queryType adalah 'today' dan waktu sudah lewat 15:00 WIB:
  // Tampilkan jadwal hari ini dengan catatan bahwa kelas sudah selesai dan diklat lanjut besok
  if (parsed.queryType === 'today' && isPastAfternoonCutoff()) {
    const result = await generateScheduleMessage(supabase, parsed.date, { isManualQuery: true, forceToday: true })
    const note = `💡 _Catatan: Sesi tatap muka hari ini sudah selesai pukul 15:00 WIB. Diklat lanjut besok (Ketik *!jadwal* atau *!jadwal besok*)._\n\n`
    return { ...result, text: note + result.text }
  }

  return generateScheduleMessage(supabase, parsed.date, { isManualQuery: true })
}

// =========================================================================
// 3. PENUTUP SORE & PENGINGAT TUGAS MANDIRI AKTIF
// =========================================================================

async function generateClosingAndTaskMessage(supabase, date = new Date()) {
  const dayInfo = getDiklatDayInfo(date)
  const fullDateFormatted = formatIndonesianDate(date)

  const animeClosing = getDailyAnimeClosing(date, dayInfo)

  let msg = `🏁 *OTSUKARESAMA DESHITA! KELAS SELESAI & QUEST SORE* 🍵✨\n`
  msg += `*Diklat Fungsional Prakom • Agrasena Batch 4* 🌸\n`
  msg += `*Kejaksaan Republik Indonesia 2026*\n`
  msg += `────────────────────────\n`
  msg += `📅 *Hari/Tanggal:* ${fullDateFormatted}`
  if (dayInfo.day) {
    msg += ` | Hari ke-${dayInfo.day}`
  }
  msg += `\n────────────────────────\n\n`

  msg += `💬 *Pesan Rehat Shinobi Adhyaksa:*\n`
  msg += `_"${animeClosing.quote}"_\n\n`
  msg += `🎮 *Laporan Guild Sore:* ${animeClosing.punchline}\n\n`

  msg += `Sesi perkuliahan tatap muka hari ini resmi rampung pukul *15:00 WIB*. Selamat me-regen HP & MP kalian, nakama sekalian! 👏\n\n`

  // 1. DIKLAT LANJUT BESOK (JADWAL ESOK HARI)
  const tomorrow = new Date(date)
  tomorrow.setDate(tomorrow.getDate() + 1)
  let tomorrowInfo = getDiklatDayInfo(tomorrow)
  const tomorrowFormatted = formatIndonesianDate(tomorrow)
  const tomorrowSessions = await getSessionsForDate(supabase, tomorrow, tomorrowInfo)

  if (!tomorrowInfo.day && tomorrowSessions.length > 0) {
    const detectedDay = getScheduleDayNumber(tomorrowSessions[0])
    if (detectedDay) {
      let stage = 'Tahap 1 • MOOC'
      if (detectedDay > 5 && detectedDay <= 15) stage = 'Tahap 2 • TMO'
      else if (detectedDay > 15 && detectedDay <= 30) stage = 'Tahap 3 • Lab Prakom'
      else if (detectedDay > 30) stage = 'Tahap 4 • Seminar'
      tomorrowInfo = { ...tomorrowInfo, day: detectedDay, stage }
    }
  }

  msg += `⏩ *DIKLAT BERLANJUT BESOK:*\n`
  msg += `📅 *Tanggal:* ${tomorrowFormatted}`
  if (tomorrowInfo.day) {
    msg += ` | Hari ke-${tomorrowInfo.day}`
    if (tomorrowInfo.stage) msg += ` (${tomorrowInfo.stage})`
  }
  msg += `\n────────────────────────\n\n`

  if (tomorrowSessions.length > 0) {
    msg += `📚 *Mata Diklat Besok:*\n`
    msg += formatSessionsText(tomorrowSessions, tomorrowInfo)
    msg += `⏰ *Waktu Siaga Besok:* Pukul *07:40 WIB*\n\n`
  } else if (tomorrowInfo.isWeekend) {
    msg += `☕ *Agenda Besok:*\n`
    msg += `Hari libur pembelajaran tatap muka (Akhir Pekan). Selamat beristirahat bersama keluarga! 🌿\n\n`

    const nextActive = getNextActiveDiklatDay(date)
    if (nextActive) {
      msg += `📌 *Pembelajaran Tatap Muka Berlanjut Pada:*\n`
      msg += `📅 *${formatIndonesianDate(nextActive.date)}* | Hari ke-${nextActive.dayInfo.day} (${nextActive.dayInfo.stage})\n\n`
    }
  } else {
    msg += `☕ *Agenda Besok:*\n`
    msg += `Tidak ada agenda tatap muka terjadwal esok hari. Selamat beristirahat atau belajar mandiri! 🌿\n\n`
  }

  // 2. TUGAS MANDIRI AKTIF (HANYA YANG BELUM SELESAI & MASIH ADA DEADLINE)
  const tasks = await getActiveDeadlineTasks(supabase)
  msg += formatTasksText(tasks)

  msg += `────────────────────────\n`
  msg += `💡 *Perintah Cepat:*\n`
  msg += `• *!jadwal besok* : Jadwal pembelajaran esok hari\n`
  msg += `• *!tugas* : Cek status tugas mandiri aktif\n`
  msg += `• *!pengumuman* : Cek info penting mendesak\n`
  msg += `• *!help* : Menu panduan lengkap`

  return { text: msg, count: tasks.length, dayInfo }
}

/**
 * Generator Khusus Perintah !tugas (Menampilkan Tugas yang Masih Ada Deadline)
 */
async function generateTaskListMessage(supabase, date = new Date()) {
  const dayInfo = getDiklatDayInfo(date)
  const fullDateFormatted = formatIndonesianDate(date)

  let msg = `📝 *STATUS TUGAS MANDIRI AKTIF*\n`
  msg += `*Diklat Fungsional Prakom • Agrasena Batch 4*\n`
  msg += `*Kejaksaan Republik Indonesia 2026*\n`
  msg += `────────────────────────\n`
  msg += `📅 *Per Tanggal:* ${fullDateFormatted}`
  if (dayInfo.day) {
    msg += ` | Hari ke-${dayInfo.day}`
  }
  msg += `\n────────────────────────\n\n`

  // HANYA AMBIL TUGAS YANG BELUM SELESAI & MASIH ADA DEADLINE AKTIF
  const tasks = await getActiveDeadlineTasks(supabase)
  msg += formatTasksText(tasks)

  msg += `────────────────────────\n`
  msg += `💡 *Perintah Cepat:*\n`
  msg += `• *!jadwal* : Cek jadwal perkuliahan\n`
  msg += `• *!modul* : Cari modul & materi diklat\n`
  msg += `• *!pengumuman* : Cek info penting mendesak\n`
  msg += `• *!help* : Menu panduan lengkap`

  return { text: msg, count: tasks.length }
}

// =========================================================================
// 4. DISPATCHERS DENGAN ANTI-SPAM (HANYA 1X SEHARI)
// =========================================================================

async function sendScheduleNotification(sock, supabase, targetJid, { force = false, isMorningCron = true } = {}) {
  if (!sock || !targetJid) {
    console.warn('[Scheduler] Socket atau Target Group JID belum siap.')
    return { success: false, error: 'Socket atau Target Group JID belum terkonfigurasi.' }
  }

  const todayStr = getJakartaDateStr()

  if (!force && lastScheduleSentDate === todayStr) {
    console.log(`[Anti-Spam] Jadwal pagi (${todayStr}) sudah pernah terkirim. Melewati agar tidak spam.`)
    return { success: true, skipped: true, message: 'Jadwal hari ini sudah terkirim.' }
  }

  try {
    const { text, count } = await generateDailyScheduleMessage(supabase, new Date(), { isMorningCron })
    await sock.sendMessage(targetJid, { text })

    lastScheduleSentDate = todayStr
    await saveNotificationHistory(supabase, {
      last_schedule_sent_date: todayStr,
      last_schedule_sent_at: new Date().toISOString(),
    })

    console.log(`[Scheduler] Berhasil kirim notifikasi pengingat kelas pagi ke ${targetJid}`)
    return { success: true, count }
  } catch (err) {
    console.error('[Scheduler Error] Gagal kirim jadwal:', err)
    return { success: false, error: err.message }
  }
}

async function sendTaskNotification(sock, supabase, targetJid, { force = false } = {}) {
  if (!sock || !targetJid) {
    console.warn('[Scheduler] Socket atau Target Group JID belum siap.')
    return { success: false, error: 'Socket atau Target Group JID belum terkonfigurasi.' }
  }

  const todayStr = getJakartaDateStr()

  if (!force && lastClosingSentDate === todayStr) {
    console.log(`[Anti-Spam] Penutup kelas & tugas sore (${todayStr}) sudah pernah terkirim. Melewati agar tidak spam.`)
    return { success: true, skipped: true, message: 'Penutup kelas sore sudah terkirim.' }
  }

  try {
    const { text, count } = await generateClosingAndTaskMessage(supabase)
    await sock.sendMessage(targetJid, { text })

    lastClosingSentDate = todayStr
    await saveNotificationHistory(supabase, {
      last_closing_sent_date: todayStr,
      last_closing_sent_at: new Date().toISOString(),
    })

    console.log(`[Scheduler] Berhasil kirim notifikasi kelas selesai & tugas ke ${targetJid}`)
    return { success: true, count }
  } catch (err) {
    console.error('[Scheduler Error] Gagal kirim penutup kelas:', err)
    return { success: false, error: err.message }
  }
}

// =========================================================================
// 5. CRON INITIALIZER
// =========================================================================

function initScheduler(getSock, supabase, getTargetJid) {
  const scheduleCron = process.env.SCHEDULE_REMINDER_CRON || '40 7 * * *'
  const taskCron = process.env.TASK_REMINDER_CRON || '0 15 * * *'
  const timezone = process.env.TIMEZONE || 'Asia/Jakarta'

  console.log(`[Scheduler] Memasang cron pengingat kelas pagi: '${scheduleCron}' (Jam 07:40 WIB, Timezone: ${timezone})`)
  console.log(`[Scheduler] Memasang cron notifikasi kelas selesai: '${taskCron}' (Jam 15:00 WIB, Timezone: ${timezone})`)

  loadNotificationHistory(supabase)

  // 1. Cron Pagi 07:40 WIB
  cron.schedule(
    scheduleCron,
    async () => {
      console.log('[Scheduler Trigger] Menjalankan pengingat jadwal & kelas pagi (07:40 WIB)...')
      const sock = getSock()
      const targetJid = getTargetJid()
      if (sock && targetJid) {
        await sendScheduleNotification(sock, supabase, targetJid, { force: false, isMorningCron: true })
      }
    },
    { timezone }
  )

  // 2. Cron Sore 15:00 WIB
  cron.schedule(
    taskCron,
    async () => {
      console.log('[Scheduler Trigger] Menjalankan notifikasi kelas selesai & tugas sore (15:00 WIB)...')
      const sock = getSock()
      const targetJid = getTargetJid()
      if (sock && targetJid) {
        await sendTaskNotification(sock, supabase, targetJid, { force: false })
      }
    },
    { timezone }
  )
}

// =========================================================================
// 6. PROGRES DIKLAT 35 HARI & PENCARIAN MODUL
// =========================================================================

function generateProgressMessage() {
  const dayInfo = getDiklatDayInfo(new Date())
  const fullDateFormatted = formatIndonesianDate(new Date())
  const totalDays = 35
  const dayNum = dayInfo.day || 1
  const pct = ((dayNum / totalDays) * 100).toFixed(1)
  const barLen = 12
  const filled = Math.min(barLen, Math.max(1, Math.round((dayNum / totalDays) * barLen)))
  const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled)
  const sisa = Math.max(0, totalDays - dayNum)

  let nextStageInfo = 'Tahap 2 • TMO (Tatap Muka Online Zoom)'
  if (dayNum > 5 && dayNum <= 15) {
    nextStageInfo = 'Tahap 3 • Lab Prakom (Laboratorium di Satker)'
  } else if (dayNum > 15 && dayNum <= 30) {
    nextStageInfo = 'Tahap 4 • Seminar Proyek Inovasi'
  } else if (dayNum > 30) {
    nextStageInfo = 'Penyusunan Laporan Akhir & Penutupan Diklat'
  }

  let msg = `📊 *TRACKER PROGRES DIKLAT PRAKOM*\n`
  msg += `*Diklat Agrasena Batch 4 • Kejaksaan RI 2026*\n`
  msg += `────────────────────────\n`
  msg += `📅 *Waktu Pantau:* ${fullDateFormatted}\n`
  msg += `────────────────────────\n\n`
  msg += `📌 *Indikator Progres Diklat:*\n`
  msg += `• Hari Berjalan : *Ke-${dayNum}* dari ${totalDays} Hari Kerja\n`
  msg += `• Persentase    : [${bar}] *${pct}%*\n`
  msg += `• Tahap Aktif   : *${dayInfo.stage || 'Tahap 1 • MOOC'}*\n`
  msg += `• Tahap Lanjutan: ${nextStageInfo}\n`
  msg += `• Sisa Pelatihan: *${sisa} hari kerja lagi*\n\n`
  msg += `────────────────────────\n`
  msg += `✨ _"Setiap baris kode dan analisis adalah langkah nyata kemajuan SPBE Kejaksaan RI. Tetap prima!"_\n\n`
  msg += `🌐 *Portal Kelas:* ${ZOOM_CONFIG.portalUrl}`

  return { text: msg }
}

async function searchMaterialsMessage(supabase, query) {
  if (!supabase) {
    return { text: '⚠️ Koneksi database website belum siap.' }
  }

  const cleanQuery = (query || '').trim()

  if (!cleanQuery) {
    // Tampilkan 3 modul terbaru
    let materials = []
    try {
      const { data } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false })
      materials = (data || []).filter((m) => isBatch4Material(m)).slice(0, 3)
    } catch {}

    let msg = `📚 *PUSTAKA MODUL DIKLAT (120 JP)*\n`
    msg += `*Diklat Fungsional Prakom • Agrasena Batch 4*\n`
    msg += `────────────────────────\n\n`
    msg += `📖 *Modul Pembelajaran Tersedia:*\n\n`

    if (materials.length > 0) {
      materials.forEach((m, idx) => {
        const sizeStr = m.file_size ? ` • ${(m.file_size / (1024 * 1024)).toFixed(1)} MB` : ''
        msg += `*${idx + 1}. ${m.title}*\n`
        msg += `   📁 ${m.subject_name || 'Modul Pembelajaran'}${sizeStr}\n`
      })
      msg += `\n`
    }

    msg += `────────────────────────\n`
    msg += `💡 *Pencarian Cepat:* Ketik *!modul <kata kunci>*\n`
    msg += `   _Contoh:_ *!modul lms* atau *!modul jarkom*\n\n`
    msg += `🌐 *Pustaka Modul Lengkap di Web:*\n`
    msg += `👉 ${ZOOM_CONFIG.portalUrl}/materials`
    return { text: msg }
  }

  // Cari di database Supabase
  let results = []
  try {
    const { data } = await supabase
      .from('materials')
      .select('*')
      .or(`title.ilike.%${cleanQuery}%,subject_name.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%`)

    results = (data || []).filter((m) => isBatch4Material(m)).slice(0, 4)
  } catch (err) {
    console.error('[Search Materials Error]', err.message)
  }

  if (results.length === 0) {
    let msg = `📚 *PENCARIAN MODUL DIKLAT*\n`
    msg += `*Diklat Fungsional Prakom • Agrasena Batch 4*\n`
    msg += `────────────────────────\n\n`
    msg += `🔍 Kata kunci: *"${cleanQuery}"*\n\n`
    msg += `⚠️ *Modul tidak ditemukan.* Tidak ada materi yang cocok dengan kata kunci tersebut.\n\n`
    msg += `💡 *Saran:* Coba gunakan kata kunci umum (misal: *!modul lms*, *!modul data*, atau *!modul spbe*).\n\n`
    msg += `🌐 *Jelajahi Pustaka Lengkap di Web:*\n`
    msg += `👉 ${ZOOM_CONFIG.portalUrl}/materials`
    return { text: msg }
  }

  let msg = `📚 *HASIL PENCARIAN MODUL DIKLAT*\n`
  msg += `*Diklat Fungsional Prakom • Agrasena Batch 4*\n`
  msg += `────────────────────────\n`
  msg += `🔍 Kata kunci: *"${cleanQuery}"*\n`
  msg += `────────────────────────\n\n`

  results.forEach((m, idx) => {
    const sizeStr = m.file_size ? ` • ${(m.file_size / (1024 * 1024)).toFixed(1)} MB` : ''
    msg += `*${idx + 1}. ${m.title}*\n`
    msg += `   📁 ${m.subject_name || 'Modul'}${sizeStr}\n`
  })

  msg += `\n────────────────────────\n`
  msg += `📖 *Unduh / Baca Modul Lengkap di Web:*\n`
  msg += `👉 ${ZOOM_CONFIG.portalUrl}/materials`

  return { text: msg }
}

// =========================================================================
// 7. PENGUMUMAN RESMI DIKLAT (HANYA YANG URGENT)
// =========================================================================

async function generateAnnouncementMessage(supabase) {
  if (!supabase) {
    return { text: '⚠️ Koneksi database website belum siap.' }
  }

  let announcements = []
  try {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .eq('is_urgent', true)
      .order('created_at', { ascending: false })

    announcements = (data || []).filter((a) => isBatch4Announcement(a)).slice(0, 3)
  } catch (err) {
    console.error('[Announcement Fetch Error]', err.message)
  }

  // Jika TIDAK ADA pengumuman urgent, beri tahu & arahkan langsung untuk akses web
  if (announcements.length === 0) {
    let msg = `📢 *PENGUMUMAN RESMI DIKLAT*\n`
    msg += `*Diklat Fungsional Prakom • Agrasena Batch 4*\n`
    msg += `*Kejaksaan Republik Indonesia 2026*\n`
    msg += `────────────────────────\n\n`
    msg += `ℹ️ *Status Pengumuman:*\n`
    msg += `Saat ini *tidak ada pengumuman mendesak (urgent)* dari panitia atau widyaiswara untuk Batch 4.\n\n`
    msg += `Untuk melihat seluruh daftar pengumuman berkala, surat edaran panitia, dan informasi kegiatan diklat secara lengkap, silakan kunjungi website kelas:\n\n`
    msg += `🌐 *Portal Pengumuman Resmi:*\n`
    msg += `👉 ${ZOOM_CONFIG.portalUrl}/announcements\n\n`
    msg += `────────────────────────\n`
    msg += `💡 _Ketik *!help* untuk melihat menu panduan perintah._`
    return { text: msg, count: 0 }
  }

  // Jika ADA pengumuman urgent, tampilkan rincian urgent-nya
  let msg = `🚨 *PENGUMUMAN MENDESAK (URGENT)*\n`
  msg += `*Diklat Fungsional Prakom • Agrasena Batch 4*\n`
  msg += `*Kejaksaan Republik Indonesia 2026*\n`
  msg += `────────────────────────\n\n`
  msg += `⚠️ *PERHATIAN:* Terdapat pengumuman penting yang memerlukan atensi segera dari seluruh rekan peserta Batch 4:\n\n`

  announcements.forEach((a, idx) => {
    const dateFormatted = formatIndonesianDate(a.created_at)
    const authorStr = a.author ? `👤 ${a.author}  •  ` : ''
    let cleanContent = (a.content || '').replace(/\r?\n/g, '\n   ').trim()

    msg += `*${idx + 1}. ${a.title.toUpperCase()}*\n`
    msg += `   ${authorStr}📅 ${dateFormatted}\n`
    msg += `   📌 Status: *MENDESAK (URGENT)*\n`
    if (cleanContent) {
      msg += `\n   ${cleanContent}\n`
    }
    msg += `\n`
  })

  msg += `────────────────────────\n`
  msg += `📖 *Baca Selengkapnya & Unduh Lampiran di Web:*\n`
  msg += `👉 ${ZOOM_CONFIG.portalUrl}/announcements\n\n`
  msg += `💡 _Ketik *!jadwal* untuk jadwal hari ini | *!tugas* untuk tugas mandiri._`

  return { text: msg, count: announcements.length }
}

module.exports = {
  initScheduler,
  sendScheduleNotification,
  sendTaskNotification,
  generateDailyScheduleMessage,
  generateTomorrowScheduleMessage,
  generateScheduleForQuery,
  generateClosingAndTaskMessage,
  generateTaskListMessage,
  generateProgressMessage,
  searchMaterialsMessage,
  generateAnnouncementMessage,
  parseDateQuery,
  formatIndonesianDate,
  formatRemainingTime,
  getTaskDeadlineTimestamp,
  isPastAfternoonCutoff,
  getNextActiveDiklatDay,
  syncCurriculumWithDatabase,
  getScheduleDate,
  getScheduleDayNumber,
  CURRICULUM_DAYS,
  ZOOM_CONFIG,
}
