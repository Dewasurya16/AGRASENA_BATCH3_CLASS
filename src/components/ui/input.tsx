import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, trailingIcon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-bold text-[#131E29] dark:text-white">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="pointer-events-none absolute left-3.5 flex items-center text-[#8C9BAE] dark:text-slate-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E2433] px-4 text-xs sm:text-sm text-[#131E29] dark:text-white placeholder-[#9AA8BA] dark:placeholder-slate-400 shadow-sm transition-all focus:border-[#0D3830] dark:focus:border-emerald-500 focus:ring-2 focus:ring-[#0D3830]/10 dark:focus:ring-emerald-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              trailingIcon && "pr-10",
              error && "border-red-400 focus:border-red-500 focus:ring-red-500/10",
              className
            )}
            ref={ref}
            {...props}
          />
          {trailingIcon && (
            <div className="absolute right-3.5 flex items-center text-[#8C9BAE] dark:text-slate-400">
              {trailingIcon}
            </div>
          )}
        </div>
        {error && <p className="text-[11px] font-medium text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"
