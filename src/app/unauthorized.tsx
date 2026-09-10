import { UnauthorizedView } from "@/components/public/error-pages/unauthorized-view"

export const metadata = {
  title: "401 • Belum Terautentikasi | Diklat Prakom Batch 3",
  description: "Sesi Anda telah berakhir atau Anda belum login.",
}

export default function Unauthorized() {
  return <UnauthorizedView />
}
