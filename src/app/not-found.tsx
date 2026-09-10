import { AnimatedErrorView } from "@/components/public/error-pages/animated-error-view"

export const metadata = {
  title: "404 • Halaman Tidak Ditemukan | Diklat Prakom Batch 3",
  description: "Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.",
}

export default function NotFound() {
  return (
    <AnimatedErrorView
      code="404"
      badgeText="Lost in Space • 404"
      badgeColor="blue"
      title="Halaman Tidak Ditemukan"
      description="Maaf, tautan atau rute yang Anda tuju tidak tersedia, telah dipindahkan, atau alamat URL yang Anda masukkan kurang tepat."
    />
  )
}
