import { Spinner } from "@/components/ui/spinner"

export default function GlobalLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/80 dark:bg-[#161B26]/80 backdrop-blur-md border border-slate-200/80 dark:border-[#2A3550] shadow-xl max-w-xs w-full">
        <Spinner size="lg" variant="primary" type="ios" delayMs={0} />
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Memuat Halaman...
        </p>
      </div>
    </div>
  )
}
