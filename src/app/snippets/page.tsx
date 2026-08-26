import { PublicShell } from "@/components/public/public-shell"
import { CodeVault } from "@/components/public/code-vault"

export const metadata = {
  title: "Code & Query Snippet Vault — Lab Prakom Batch 3",
  description: "Kumpulan template SQL query, script automasi server Linux, konfigurasi Docker, dan API SPBE untuk penugasan satker",
}

export default function SnippetsPage() {
  return (
    <PublicShell>
      <CodeVault />
    </PublicShell>
  )
}
