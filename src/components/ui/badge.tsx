import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "popular" | "accent" | "overlay" | "soft" | "ink" | "success" | "warning" | "danger" | "info" | "purple" | "orange" | "forest" | "outline" | "gradient" | "sky" | "rose" | "indigo" | "emerald"
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
        "inline-flex items-center gap-1.5 font-semibold transition-all select-none rounded-full",
        eyebrow
          ? "px-3 py-0.5 text-[11px] uppercase tracking-normal"
          : "px-2.5 py-0.5 text-xs",
        
        variant === "default" && "bg-[#f6f5f4] text-[#31302e] border border-[#e6e6e6] dark:bg-[#252525] dark:text-[#e0e0e0] dark:border-[#333333]",
        variant === "popular" && "bg-[#0075de] text-white",
        variant === "accent" && "bg-[#0075de] text-white",
        variant === "overlay" && "bg-[rgba(49,48,46,0.6)] text-white backdrop-blur-xs",
        variant === "soft" && "bg-[#f6f5f4] text-[#31302e] dark:bg-[#252525] dark:text-[#e0e0e0]",
        variant === "ink" && "bg-[#000000] text-white dark:bg-white dark:text-[#000000]",
        variant === "gradient" && "bg-gradient-to-r from-[#0075de] to-indigo-600 text-white shadow-2xs",
        variant === "sky" && "bg-[#62aef0]/15 text-[#005bab] border border-[#62aef0]/30 dark:bg-[#62aef0]/20 dark:text-[#a0d2fb] dark:border-[#62aef0]/40",
        variant === "indigo" && "bg-[#213183]/15 text-[#213183] border border-[#213183]/30 dark:bg-[#213183]/25 dark:text-[#9db3ff] dark:border-[#213183]/50",
        variant === "emerald" && "bg-[#1aae39]/15 text-[#116622] border border-[#1aae39]/30 dark:bg-[#1aae39]/20 dark:text-[#76e58f] dark:border-[#1aae39]/40",
        variant === "rose" && "bg-[#ff64c8]/15 text-[#9e1c6b] border border-[#ff64c8]/30 dark:bg-[#ff64c8]/20 dark:text-[#ff9ee0] dark:border-[#ff64c8]/40",
        variant === "success" && "bg-[#1aae39]/15 text-[#116622] border border-[#1aae39]/30 dark:bg-[#1aae39]/20 dark:text-[#76e58f] dark:border-[#1aae39]/40",
        variant === "warning" && "bg-[#dd5b00]/15 text-[#793400] border border-[#dd5b00]/30 dark:bg-[#dd5b00]/20 dark:text-[#ffaa66] dark:border-[#dd5b00]/40",
        variant === "danger" && "bg-red-500/15 text-red-700 border border-red-500/30 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/40",
        variant === "info" && "bg-[#2a9d99]/15 text-[#135956] border border-[#2a9d99]/30 dark:bg-[#2a9d99]/20 dark:text-[#78dcd8] dark:border-[#2a9d99]/40",
        variant === "purple" && "bg-[#d6b6f6]/30 text-[#391c57] border border-[#d6b6f6]/50 dark:bg-[#d6b6f6]/25 dark:text-[#e4ceff] dark:border-[#d6b6f6]/40",
        variant === "orange" && "bg-[#dd5b00]/15 text-[#793400] border border-[#dd5b00]/30 dark:bg-[#dd5b00]/20 dark:text-[#ffaa66] dark:border-[#dd5b00]/40",
        variant === "forest" && "bg-[#1aae39]/15 text-[#116622] border border-[#1aae39]/30 dark:bg-[#1aae39]/20 dark:text-[#76e58f]",
        variant === "outline" && "border border-[#e6e6e6] bg-white text-[#31302e] dark:border-[#333333] dark:bg-[#222222] dark:text-[#e0e0e0]",
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0 animate-pulse",
            variant === "default" && "bg-indigo-500",
            variant === "gradient" && "bg-white",
            variant === "sky" && "bg-sky-500",
            variant === "indigo" && "bg-indigo-500",
            variant === "emerald" && "bg-emerald-500",
            variant === "rose" && "bg-rose-500",
            variant === "success" && "bg-emerald-500",
            variant === "warning" && "bg-amber-500",
            variant === "danger" && "bg-red-500",
            variant === "info" && "bg-cyan-500",
            variant === "purple" && "bg-purple-500",
            variant === "orange" && "bg-orange-500",
            variant === "forest" && "bg-emerald-400",
            variant === "outline" && "bg-indigo-500"
          )}
        />
      )}
      <span>{children}</span>
    </div>
  )
}
