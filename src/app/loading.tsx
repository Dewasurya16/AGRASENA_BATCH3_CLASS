import { MinimalistLoader } from "@/components/ui/minimalist-loader"

export default function GlobalLoading() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <MinimalistLoader
        title="Memuat Halaman Kelas"
        subtitle="Diklat Fungsional Pranata Komputer • Batch 3"
        delayMs={0}
      />
    </div>
  )
}
