import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: string
    isPositive?: boolean
  }
  icon?: React.ReactNode
  variant?: "forest" | "orange" | "cyan" | "emerald" | "amber" | "purple"
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = "forest",
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] bg-white border border-slate-100/90 p-5 sm:p-6 soft-card-shadow soft-card-hover",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            variant === "forest" && "bg-[#E6F7ED] text-[#0D3830]",
            variant === "orange" && "bg-[#FFEADA] text-[#EA580C]",
            variant === "cyan" && "bg-[#E8F2FE] text-[#2563EB]",
            variant === "emerald" && "bg-[#E6F7ED] text-[#0D824B]",
            variant === "amber" && "bg-[#FFF4D6] text-[#B47D00]",
            variant === "purple" && "bg-[#F3E8FF] text-[#7E22CE]"
          )}
        >
          {icon}
        </div>

        {trend && (
          <Badge
            variant={trend.isPositive ? "success" : "danger"}
            dot
          >
            {trend.value}
          </Badge>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs font-semibold text-[#8C9BAE]">{title}</p>
        <p className="text-2xl font-extrabold tracking-tight text-[#131E29]">{value}</p>
        {subtitle && (
          <p className="text-[11px] text-[#6B7C93]">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
