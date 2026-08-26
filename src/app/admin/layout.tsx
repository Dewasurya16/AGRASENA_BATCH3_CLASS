import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#070a14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {children}
    </div>
  )
}
