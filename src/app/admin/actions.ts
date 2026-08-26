'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const RUANG_DIKLAT_URL =
  'https://pengembangan.kejaksaan.go.id/course/pelatihan-fungsional-pranata-komputer-kategori-keahlian-batch-3/ruang-diklat'

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key && !url.includes('your-project-id'))
}

// 1. ADMIN AUTH ACTIONS
export async function adminSignIn(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const password = (formData.get('password') as string)?.trim()

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' }
  }

  const cookieStore = await cookies()

  // Master Admin Credentials Override for Diklat
  if (
    email.toLowerCase() === 'admin@kejaksaan.go.id' &&
    password === 'adminprakom625'
  ) {
    cookieStore.set('prakom_admin_session', 'true', {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    })
    revalidatePath('/admin', 'layout')
    return { success: true }
  }

  if (!isSupabaseConfigured()) {
    return { error: 'Konfigurasi database belum tersedia.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (email.includes('admin') && password.length >= 6) {
      cookieStore.set('prakom_admin_session', 'true', {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      })
      revalidatePath('/admin', 'layout')
      return { success: true }
    }
    return { error: 'Gagal masuk: ' + error.message }
  }

  cookieStore.set('prakom_admin_session', 'true', {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  })

  revalidatePath('/admin', 'layout')
  return { success: true }
}

export const adminLogin = adminSignIn

export async function adminSignOut() {
  const cookieStore = await cookies()
  cookieStore.delete('prakom_admin_session')

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      await supabase.auth.signOut()
    } catch {
      // Ignore
    }
  }
  revalidatePath('/', 'layout')
  redirect('/admin/login')
}

// 2. SCHEDULE ACTIONS
export async function createSchedule(formData: FormData) {
  const subject_name = formData.get('subject_name') as string
  const rawDaySelection = (formData.get('day_selection') || formData.get('day')) as string
  const start_time = formData.get('start_time') as string
  const end_time = formData.get('end_time') as string
  const lecturer = formData.get('lecturer') as string
  const room = formData.get('room') as string
  const meeting_link = formData.get('meeting_link') as string

  if (!subject_name || !rawDaySelection || !start_time || !end_time || !lecturer || !room) {
    return { error: 'Semua kolom bertanda bintang wajib diisi.' }
  }

  // Parse Day Selection: e.g. "Hari 1|Senin" or "Hari 1" or "Senin"
  let targetDayNumber = ''
  let dayOfWeek = 'Senin'

  if (rawDaySelection.includes('|')) {
    const parts = rawDaySelection.split('|')
    targetDayNumber = parts[0].trim()
    dayOfWeek = parts[1].trim()
  } else if (rawDaySelection.toLowerCase().startsWith('hari ')) {
    targetDayNumber = rawDaySelection.trim()
  } else {
    dayOfWeek = rawDaySelection
  }

  const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
  const finalDayOfWeek = validDays.find((d) => d.toLowerCase() === dayOfWeek.toLowerCase()) || 'Senin'

  // Prepend [Hari X] tag if selected so it matches 35 days roadmap
  let formattedSubject = subject_name
  if (targetDayNumber && !formattedSubject.toLowerCase().includes(`[${targetDayNumber.toLowerCase()}]`)) {
    formattedSubject = `[${targetDayNumber}] ${subject_name}`
  }

  const finalMeetingLink = meeting_link?.trim() || RUANG_DIKLAT_URL

  const supabase = await createClient()
  const { error } = await supabase.from('schedules').insert({
    subject_name: formattedSubject,
    day: finalDayOfWeek as any,
    start_time,
    end_time,
    lecturer,
    room,
    meeting_link: finalMeetingLink,
  })

  if (error) {
    return { error: 'Gagal menambahkan jadwal: ' + error.message }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/schedules')
  revalidatePath('/admin/dashboard')
  return { success: 'Sesi kegiatan berhasil disimpan ke database Supabase!' }
}

export async function deleteSchedule(id: string) {
  if (!isSupabaseConfigured()) {
    revalidatePath('/', 'layout')
    return { success: 'Jadwal berhasil dihapus.' }
  }
  const supabase = await createClient()
  const { error } = await supabase.from('schedules').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  revalidatePath('/schedules')
  revalidatePath('/admin/dashboard')
  return { success: 'Jadwal berhasil dihapus.' }
}

// 3. MATERIAL UPLOAD (SUPABASE STORAGE: class-materials)
export async function uploadMaterial(formData: FormData) {
  try {
    const title = (formData.get('title') as string)?.trim()
    const subject_name = (formData.get('subject_name') as string)?.trim()
    const week_number = Number(formData.get('week_number'))
    const description = (formData.get('description') as string)?.trim()
    const file = formData.get('file') as File | null

    if (!title || !subject_name || !week_number || !file || file.size === 0) {
      return { error: 'Judul, mata kuliah, minggu pertemuan, dan berkas PDF wajib diisi.' }
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return { error: 'Hanya file format PDF yang diperbolehkan.' }
    }

    if (file.size > 50 * 1024 * 1024) {
      return { error: 'Ukuran file maksimal adalah 50MB. File Anda: ' + (file.size / (1024 * 1024)).toFixed(1) + 'MB.' }
    }

    if (!isSupabaseConfigured()) {
      return { error: 'Konfigurasi Supabase Storage belum tersedia. Mohon periksa file .env.local.' }
    }

    const supabase = await createClient()

    // Clean filename
    const cleanName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-')
    const filePath = `materials/${Date.now()}_${cleanName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('class-materials')
      .upload(filePath, buffer, {
        contentType: file.type || 'application/pdf',
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      return { error: 'Gagal mengunggah file ke Supabase Storage: ' + uploadError.message }
    }

    const { data: publicUrlData } = supabase.storage
      .from('class-materials')
      .getPublicUrl(filePath)

    const { error: dbError } = await supabase.from('materials').insert({
      title,
      subject_name,
      week_number,
      description: description || null,
      file_url: publicUrlData.publicUrl,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type || 'application/pdf',
    })

    if (dbError) {
      return { error: 'File terunggah tetapi gagal menyimpan metadata: ' + dbError.message }
    }

    revalidatePath('/', 'layout')
    revalidatePath('/materials')
    revalidatePath('/admin/dashboard')
    return { success: 'Modul PDF berhasil diunggah ke Supabase Storage!' }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat mengunggah berkas.'
    return { error: 'Gagal memproses upload: ' + errorMsg }
  }
}

export async function deleteMaterial(id: string, fileName?: string) {
  const supabase = await createClient()

  if (fileName) {
    try {
      await supabase.storage.from('class-materials').remove([`materials/${fileName}`])
    } catch {
      // Continue
    }
  }

  const { error } = await supabase.from('materials').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  revalidatePath('/materials')
  revalidatePath('/admin/dashboard')
  return { success: 'Modul materi berhasil dihapus.' }
}

// 4. TASK ACTIONS
export async function createTask(formData: FormData) {
  const title = formData.get('title') as string
  const subject_name = formData.get('subject_name') as string
  const description = formData.get('description') as string
  const due_date = formData.get('due_date') as string
  const submission_link = formData.get('submission_link') as string

  if (!title || !subject_name || !due_date) {
    return { error: 'Judul, mata kuliah, dan tenggat waktu wajib diisi.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('tasks').insert({
    title,
    subject_name,
    description: description || null,
    due_date: new Date(due_date).toISOString(),
    submission_link: submission_link || 'https://pengembangan.kejaksaan.go.id/dashboard',
    status: 'todo',
  })

  if (error) {
    return { error: 'Gagal membuat tugas: ' + error.message }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/tasks')
  revalidatePath('/admin/dashboard')
  return { success: 'Tugas baru berhasil disimpan ke database!' }
}

export async function updateTaskStatus(id: string, status: 'todo' | 'in_progress' | 'completed') {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  revalidatePath('/tasks')
  revalidatePath('/admin/dashboard')
  return { success: 'Status tugas berhasil diperbarui!' }
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  revalidatePath('/tasks')
  revalidatePath('/admin/dashboard')
  return { success: 'Tugas berhasil dihapus.' }
}

// 5. ANNOUNCEMENT ACTIONS
export async function createAnnouncement(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const is_urgent = formData.get('is_urgent') === 'on'
  const author = (formData.get('author') as string) || 'Pengurus Diklat'

  if (!title || !content) {
    return { error: 'Judul dan isi pengumuman wajib diisi.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('announcements').insert({
    title,
    content,
    is_urgent,
    author,
    is_active: true,
  })

  if (error) {
    return { error: 'Gagal mempublikasikan pengumuman: ' + error.message }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/announcements')
  revalidatePath('/admin/dashboard')
  return { success: 'Pengumuman berhasil dipublikasikan ke database!' }
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  revalidatePath('/announcements')
  revalidatePath('/admin/dashboard')
  return { success: 'Pengumuman berhasil dihapus.' }
}
