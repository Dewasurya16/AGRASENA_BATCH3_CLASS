import * as React from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "soft" | "orange" | "secondary" | "outline" | "ghost" | "danger" | "glass" | "gradient" | "emerald" | "indigo" | "amber" | "rose" | "purple"
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
          "group relative inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
          // Sizing: Stadium Pill with standard padding
          size === "sm" && "h-8.5 rounded-full px-4 text-xs gap-1.5",
          size === "md" && "h-10 rounded-full px-5 text-sm gap-2",
          size === "lg" && "h-12 rounded-full px-6 text-sm sm:text-base gap-2.5",
          
          // Notion Design System Variants
          variant === "primary" &&
            "bg-[#0075de] text-white hover:bg-[#005bab] dark:bg-[#3390ec] dark:text-white dark:hover:bg-[#2678c8] shadow-xs",
          variant === "accent" &&
            "bg-[#0075de] text-white hover:bg-[#005bab] shadow-xs",
          variant === "soft" &&
            "bg-[#f6f5f4] text-[#31302e] hover:bg-[#e6e6e6] dark:bg-[#252525] dark:text-[#e0e0e0] dark:hover:bg-[#2c2c2c]",
          variant === "outline" &&
            "bg-white text-[#31302e] border border-[#e6e6e6] hover:bg-[#f6f5f4] dark:bg-[#222222] dark:text-[#e0e0e0] dark:border-[#333333] dark:hover:bg-[#292929]",
          variant === "secondary" &&
            "bg-white text-[#31302e] border border-[#e6e6e6] hover:bg-[#f6f5f4] dark:bg-[#222222] dark:text-[#e0e0e0] dark:border-[#333333] dark:hover:bg-[#292929] shadow-2xs",
          variant === "ghost" &&
            "bg-transparent text-[#615d59] hover:text-[#000000] hover:bg-[#f6f5f4] dark:text-[#9e9e9e] dark:hover:text-white dark:hover:bg-[#252525]",
          variant === "gradient" &&
            "bg-gradient-to-r from-[#0075de] via-indigo-600 to-[#dd5b00] text-white hover:brightness-110 shadow-xs",
          variant === "orange" &&
            "bg-[#dd5b00] text-white hover:bg-[#c24f00]",
          variant === "indigo" &&
            "bg-[#213183] text-white hover:bg-[#1a2668]",
          variant === "emerald" &&
            "bg-[#1aae39] text-white hover:bg-[#158f2e]",
          variant === "amber" &&
            "bg-[#dd5b00] text-white hover:bg-[#c24f00]",
          variant === "rose" &&
            "bg-[#ff64c8] text-white hover:bg-[#e650b2]",
          variant === "purple" &&
            "bg-[#793400] text-white hover:bg-[#602900]",
          variant === "danger" &&
            "bg-red-600 text-white hover:bg-red-700",
          variant === "glass" &&
            "bg-white/90 dark:bg-[#222222]/90 text-[#31302e] dark:text-[#e0e0e0] border border-[#e6e6e6] dark:border-[#333333] backdrop-blur-md hover:bg-white dark:hover:bg-[#252525]",
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
