import { MinimalistLoader } from "@/components/ui/minimalist-loader"

export default function GlobalLoading() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center p-4">
      <MinimalistLoader
        title="Memuat Halaman..."
        subtitle="Agrasena 625 • Kejaksaan RI"
        delayMs={60}
      />
    </div>
  )
}
