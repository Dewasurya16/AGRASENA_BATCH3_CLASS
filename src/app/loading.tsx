import { MinimalistLoader } from "@/components/ui/minimalist-loader"

export default function GlobalLoading() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-300">
      <MinimalistLoader
        title="Memuat Halaman Kelas"
        subtitle="Diklat Fungsional Pranata Komputer Batch 3"
        delayMs={0}
      />
    </div>
  )
}
