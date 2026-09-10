import { ForbiddenView } from "@/components/public/error-pages/forbidden-view"

export const metadata = {
  title: "403 • Akses Ditolak (Forbidden) | Diklat Prakom Batch 3",
  description: "Akses ke halaman ini memerlukan otorisasi khusus administrator.",
}

export default function ForbiddenPage() {
  return <ForbiddenView />
}
