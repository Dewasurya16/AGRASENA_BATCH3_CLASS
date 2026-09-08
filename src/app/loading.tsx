import { MinimalistLoader } from "@/components/ui/minimalist-loader"

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] w-full items-center justify-center p-4 bg-[#F4F6FA]/70 dark:bg-[#101520]/75 backdrop-blur-xs select-none pointer-events-none transition-opacity duration-200">
      <MinimalistLoader
        title="Memuat Halaman..."
        subtitle="Agrasena 625 • Kejaksaan RI"
        delayMs={250}
      />
    </div>
  )
}
