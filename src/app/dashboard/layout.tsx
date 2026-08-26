import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  let userProfile = null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        userProfile = profile
      }
    } catch {
      // Fallback for offline / unconfigured mode
    }
  }

  return (
    <div className="flex min-h-screen bg-[#070a14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Fixed/Sticky Sidebar for Desktop */}
      <Sidebar
        userEmail={user?.email}
        userRole={userProfile?.role || "teacher"}
        fullName={userProfile?.full_name}
      />

      {/* Main App Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          userEmail={user?.email}
          userRole={userProfile?.role || "teacher"}
          fullName={userProfile?.full_name}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
