import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "orange" | "secondary" | "outline" | "ghost" | "danger" | "glass"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
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
          "group relative inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
          // Sizing
          size === "sm" && "h-8.5 rounded-xl px-3.5 text-xs gap-1.5",
          size === "md" && "h-10.5 rounded-2xl px-5 text-xs sm:text-sm gap-2",
          size === "lg" && "h-12 rounded-2xl px-6 text-sm sm:text-base gap-2.5",
          
          // Variants
          variant === "primary" &&
            "bg-[#0D3830] text-white shadow-md shadow-[#0D3830]/15 hover:bg-[#082822] hover:shadow-lg hover:shadow-[#0D3830]/20",
          variant === "orange" &&
            "bg-[#FF7643] text-white shadow-md shadow-[#FF7643]/20 hover:bg-[#F06530] hover:shadow-lg hover:shadow-[#FF7643]/30",
          variant === "secondary" &&
            "bg-[#EDF2F7] text-[#131E29] hover:bg-[#E2E8F0] hover:text-[#0D3830]",
          variant === "outline" &&
            "border border-slate-200/80 bg-white text-[#131E29] hover:bg-slate-50 hover:border-slate-300",
          variant === "ghost" &&
            "bg-transparent text-[#6B7C93] hover:bg-slate-100/70 hover:text-[#131E29]",
          variant === "danger" &&
            "bg-[#FFEAE9] text-[#E11D48] hover:bg-[#FCDAD7] border border-[#FFCDCA]",
          variant === "glass" &&
            "bg-white/80 text-[#131E29] border border-white/60 shadow-sm backdrop-blur-md hover:bg-white",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
      </button>
    )
  }
)
Button.displayName = "Button"
