export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#14181F] text-[#0F172A] dark:text-[#D8E0EC] antialiased transition-colors duration-200">
      {children}
    </div>
  )
}

