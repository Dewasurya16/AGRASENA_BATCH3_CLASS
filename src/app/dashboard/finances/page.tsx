'use client'

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { StatsCard } from "@/components/ui/stats-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
  Search,
  CheckCircle2,
  DollarSign
} from "lucide-react"

interface Transaction {
  id: string
  title: string
  type: "pemasukan" | "pengeluaran"
  amount: number
  date: string
  recordedBy: string
  description: string
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "1", title: "Iuran Kas Mingguan Siswa (32 Siswa)", type: "pemasukan", amount: 320000, date: "2026-08-22", recordedBy: "Bendahara Kelas", description: "Iuran kas pekan ke-3 Agustus" },
  { id: "2", title: "Pembelian Spidol & Penghapus Whiteboard", type: "pengeluaran", amount: 45000, date: "2026-08-20", recordedBy: "Bendahara Kelas", description: "3 spidol hitam + 1 penghapus magnetik" },
  { id: "3", title: "Iuran Kas Mingguan Siswa (30 Siswa)", type: "pemasukan", amount: 300000, date: "2026-08-15", recordedBy: "Bendahara Kelas", description: "Iuran kas pekan ke-2 Agustus" },
  { id: "4", title: "Pengadaan Tempat Sampah & Sapu Kelas", type: "pengeluaran", amount: 75000, date: "2026-08-12", recordedBy: "Seksi Kebersihan", description: "2 sapu ijuk dan 1 tempat sampah bertutup" },
  { id: "5", title: "Saldo Awal Kas Kelas Semester Ganjil", type: "pemasukan", amount: 950000, date: "2026-08-01", recordedBy: "Wali Kelas", description: "Sisa kas semester genap sebelumnya" },
]

export default function FinancesPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states
  const [title, setTitle] = React.useState("")
  const [type, setType] = React.useState<"pemasukan" | "pengeluaran">("pemasukan")
  const [amount, setAmount] = React.useState("")
  const [description, setDescription] = React.useState("")

  const totalIncome = transactions
    .filter((t) => t.type === "pemasukan")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === "pengeluaran")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const currentBalance = totalIncome - totalExpense

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val)
  }

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amount) return

    const newTx: Transaction = {
      id: Date.now().toString(),
      title,
      type,
      amount: Number(amount),
      date: new Date().toISOString().split("T")[0],
      recordedBy: "Bendahara Kelas",
      description: description || "-",
    }

    setTransactions([newTx, ...transactions])
    setIsModalOpen(false)
    setTitle("")
    setAmount("")
    setDescription("")
  }

  const filtered = transactions.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge eyebrow variant="warning" dot>
            Transparansi Kas
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            Kas & Keuangan Kelas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Laporan transparansi pemasukan, pengeluaran, dan saldo kas kelas
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          icon={<Plus className="h-4 w-4" />}
        >
          Catat Transaksi
        </Button>
      </div>

      {/* 3 Summary Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatsCard
          title="Saldo Kas Saat Ini"
          value={formatRupiah(currentBalance)}
          subtitle="Tersedia di bendahara"
          trend={{ value: "Surplus", isPositive: true }}
          icon={<Wallet className="h-5 w-5" />}
          variant="forest"
        />

        <StatsCard
          title="Total Pemasukan"
          value={formatRupiah(totalIncome)}
          subtitle="Akumulasi semester ini"
          trend={{ value: "Iuran Rutin", isPositive: true }}
          icon={<ArrowUpRight className="h-5 w-5 text-emerald-400" />}
          variant="emerald"
        />

        <StatsCard
          title="Total Pengeluaran"
          value={formatRupiah(totalExpense)}
          subtitle="Keperluan kelas & kebersihan"
          trend={{ value: "Terkontrol", isPositive: true }}
          icon={<ArrowDownRight className="h-5 w-5 text-red-400" />}
          variant="amber"
        />
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Riwayat Transaksi Keuangan</CardTitle>
            <CardDescription>Catatan arus kas kelas secara terperinci</CardDescription>
          </div>

          <div className="w-full sm:w-64">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi..."
              icon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-semibold">Tanggal</th>
                  <th className="py-3 px-4 font-semibold">Keterangan Transaksi</th>
                  <th className="py-3 px-4 font-semibold">Tipe</th>
                  <th className="py-3 px-4 font-semibold">Pencatat</th>
                  <th className="py-3 px-4 font-semibold text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">{t.date}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-200">{t.title}</p>
                      <p className="text-[11px] text-slate-500">{t.description}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={t.type === "pemasukan" ? "success" : "danger"} dot>
                        {t.type === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{t.recordedBy}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap">
                      <span
                        className={
                          t.type === "pemasukan"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }
                      >
                        {t.type === "pemasukan" ? "+" : "-"} {formatRupiah(t.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Catat Transaksi */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Transaksi Kas"
        description="Masukkan data pemasukan atau pengeluaran uang kas kelas."
      >
        <form onSubmit={handleCreateTransaction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("pemasukan")}
                className={`flex items-center justify-center gap-2 rounded-2xl p-2.5 text-xs font-semibold border transition ${
                  type === "pemasukan"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm"
                    : "bg-white/[0.02] text-slate-400 border-white/[0.06]"
                }`}
              >
                <ArrowUpRight className="h-4 w-4" />
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setType("pengeluaran")}
                className={`flex items-center justify-center gap-2 rounded-2xl p-2.5 text-xs font-semibold border transition ${
                  type === "pengeluaran"
                    ? "bg-red-500/20 text-red-300 border-red-500/40 shadow-sm"
                    : "bg-white/[0.02] text-slate-400 border-white/[0.06]"
                }`}
              >
                <ArrowDownRight className="h-4 w-4" />
                Pengeluaran
              </button>
            </div>
          </div>

          <Input
            label="Keterangan / Nama Transaksi"
            placeholder="Contoh: Iuran Kas Pekan 4"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            label="Nominal (Rupiah)"
            type="number"
            placeholder="Contoh: 50000"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Catatan Tambahan
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan kwitansi atau detail barang..."
              className="w-full rounded-2xl border border-white/[0.08] bg-[#0c101d] p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500/60 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="md">
              Simpan Transaksi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
