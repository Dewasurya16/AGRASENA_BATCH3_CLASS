import { KineticSvgError } from "@/components/public/error-pages/kinetic-svg-error"

export const metadata = {
  title: "404 • Halaman Tidak Ditemukan | Diklat Prakom Batch 3",
  description: "Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.",
}

export default function NotFound() {
  return (
    <KineticSvgError
      code="404"
      badgeText="Halaman Tidak Ditemukan"
      title="Halaman Tidak Ditemukan"
      description="Maaf, tautan atau rute yang Anda tuju tidak tersedia, telah dipindahkan, atau alamat URL yang Anda masukkan kurang tepat."
    />
  )
}
