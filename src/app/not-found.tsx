import { AnimatedErrorView } from "@/components/public/error-pages/animated-error-view"

export const metadata = {
  title: "404 • Halaman Tidak Ditemukan | Agrasena 625",
  description: "Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.",
}

export default function NotFound() {
  return (
    <AnimatedErrorView
      code="404"
      badgeText="Halaman Tidak Ditemukan • 404"
      badgeColor="amber"
      title="Ups! Halaman Nyasar Entah ke Mana"
      description="Maaf, tautan atau rute yang Anda tuju tidak tersedia, telah dipindahkan, atau alamat URL yang dimasukkan kurang tepat."
    />
  )
}
