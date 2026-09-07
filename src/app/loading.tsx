import { MinimalistLoader } from "@/components/ui/minimalist-loader"

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex h-[100dvh] w-full items-center justify-center p-4 bg-[#F4F6FA]/90 dark:bg-[#14181F]/95 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <MinimalistLoader
        title="Memuat Halaman..."
        subtitle="Agrasena 625 • Kejaksaan RI"
        delayMs={0}
      />
    </div>
  )
}
