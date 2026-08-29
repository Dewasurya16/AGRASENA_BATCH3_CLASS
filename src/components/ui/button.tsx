import * as React from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "orange" | "secondary" | "outline" | "ghost" | "danger" | "glass"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      icon,
      trailingIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "group relative inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
          // Sizing
          size === "sm" && "h-8.5 rounded-xl px-3.5 text-xs gap-1.5",
          size === "md" && "h-10.5 rounded-2xl px-5 text-xs sm:text-sm gap-2",
          size === "lg" && "h-12 rounded-2xl px-6 text-sm sm:text-base gap-2.5",
          
          // Variants
          variant === "primary" &&
            "bg-[#0D3830] dark:bg-emerald-600 text-white shadow-md shadow-[#0D3830]/15 dark:shadow-emerald-900/30 hover:bg-[#082822] dark:hover:bg-emerald-700 hover:shadow-lg hover:shadow-[#0D3830]/20",
          variant === "orange" &&
            "bg-[#FF7643] text-white shadow-md shadow-[#FF7643]/20 hover:bg-[#F06530] hover:shadow-lg hover:shadow-[#FF7643]/30",
          variant === "secondary" &&
            "bg-[#EDF2F7] dark:bg-slate-800 text-[#131E29] dark:text-white hover:bg-[#E2E8F0] dark:hover:bg-slate-700 hover:text-[#0D3830] dark:hover:text-emerald-400",
          variant === "outline" &&
            "border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#131E29] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
          variant === "ghost" &&
            "bg-transparent text-[#6B7C93] dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800 hover:text-[#131E29] dark:hover:text-white",
          variant === "danger" &&
            "bg-[#FFEAE9] dark:bg-rose-950/80 text-[#E11D48] dark:text-rose-300 hover:bg-[#FCDAD7] dark:hover:bg-rose-900 border border-[#FFCDCA] dark:border-rose-800",
          variant === "glass" &&
            "bg-white/80 dark:bg-slate-800/80 text-[#131E29] dark:text-white border border-white/60 dark:border-slate-700 shadow-sm backdrop-blur-md hover:bg-white dark:hover:bg-slate-800",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Spinner
            size={size === "sm" ? "xs" : "sm"}
            variant="current"
            delayMs={150}
            className="text-current"
          />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        
        {isLoading && loadingText ? (
          <span>{loadingText}</span>
        ) : (
          children && <span>{children}</span>
        )}
        
        {!isLoading && trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
      </button>
    )
  }
)
Button.displayName = "Button"
