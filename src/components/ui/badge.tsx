import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple" | "orange" | "forest" | "outline"
  dot?: boolean
  eyebrow?: boolean
}

export function Badge({
  className,
  variant = "default",
  dot = false,
  eyebrow = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-bold transition-colors select-none",
        eyebrow
          ? "rounded-full px-3 py-1 text-[10px] uppercase tracking-wider"
          : "rounded-xl px-2.5 py-0.5 text-xs",
        
        variant === "default" && "bg-slate-100 text-slate-700",
        variant === "success" && "bg-[#E6F7ED] text-[#0D824B]",
        variant === "warning" && "bg-[#FFF4D6] text-[#B47D00]",
        variant === "danger" && "bg-[#FFEAE9] text-[#E11D48]",
        variant === "info" && "bg-[#E8F2FE] text-[#2563EB]",
        variant === "purple" && "bg-[#F3E8FF] text-[#7E22CE]",
        variant === "orange" && "bg-[#FFEADA] text-[#EA580C]",
        variant === "forest" && "bg-[#E8F1EF] text-[#0D3830]",
        variant === "outline" && "border border-slate-200 bg-white text-slate-700",
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            variant === "default" && "bg-slate-500",
            variant === "success" && "bg-[#0D824B]",
            variant === "warning" && "bg-[#B47D00]",
            variant === "danger" && "bg-[#E11D48]",
            variant === "info" && "bg-[#2563EB]",
            variant === "purple" && "bg-[#7E22CE]",
            variant === "orange" && "bg-[#EA580C]",
            variant === "forest" && "bg-[#0D3830]",
            variant === "outline" && "bg-slate-400"
          )}
        />
      )}
      <span>{children}</span>
    </div>
  )
}
