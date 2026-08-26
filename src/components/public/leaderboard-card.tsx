'use client'

import * as React from "react"
import { ArrowUp, ArrowDown, Trophy } from "lucide-react"

export interface LeaderboardUser {
  rank: number
  trend: "up" | "down"
  name: string
  avatarChar: string
  avatarBg: string
  course: string
  hour: number
  point: number
}

const DEFAULT_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    trend: "up",
    name: "Cody Fisher",
    avatarChar: "C",
    avatarBg: "bg-[#0D3830] text-white",
    course: "15/25",
    hour: 270,
    point: 778.35,
  },
  {
    rank: 2,
    trend: "down",
    name: "Courtney Henry",
    avatarChar: "H",
    avatarBg: "bg-[#FF7643] text-white",
    course: "09/25",
    hour: 145,
    point: 779.58,
  },
  {
    rank: 3,
    trend: "up",
    name: "Arlene McCoy",
    avatarChar: "A",
    avatarBg: "bg-[#2563EB] text-white",
    course: "19/25",
    hour: 136,
    point: 446.61,
  },
]

export function LeaderboardCard() {
  return (
    <div className="rounded-[32px] bg-white p-6 soft-card-shadow border border-slate-100/90 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-lg text-[#131E29]">Leaderboard & Keaktifan</h4>
        <span className="text-xs font-bold text-[#FF7643] bg-[#FFEADA] px-3 py-1 rounded-full flex items-center gap-1">
          <Trophy className="h-3.5 w-3.5" />
          Top Students
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[#8C9BAE] text-[11px] font-bold">
              <th className="pb-3 px-2">Rank</th>
              <th className="pb-3 px-3">Nama</th>
              <th className="pb-3 px-3">Tugas</th>
              <th className="pb-3 px-3">Jam Belajar</th>
              <th className="pb-3 px-3 text-right">Poin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60">
            {DEFAULT_LEADERBOARD.map((user) => (
              <tr key={user.rank} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-2 font-bold text-[#131E29]">
                  <div className="flex items-center gap-1.5">
                    <span>{user.rank}</span>
                    {user.trend === "up" ? (
                      <ArrowUp className="h-3 w-3 text-[#0D824B]" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-[#E11D48]" />
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 font-semibold text-[#131E29]">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${user.avatarBg}`}>
                      {user.avatarChar}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-[#6B7C93] font-medium">{user.course}</td>
                <td className="py-3 px-3 text-[#6B7C93] font-medium">{user.hour} Jam</td>
                <td className="py-3 px-3 text-right font-bold text-[#131E29]">
                  {user.point.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
