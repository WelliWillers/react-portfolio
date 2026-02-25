import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: [
    "bg-gradient-to-r from-primary-600 to-accent-600 text-white",
    "hover:opacity-90",
    "shadow-lg shadow-primary-500/20",
  ].join(" "),

  secondary: [
    "bg-gray-800 text-gray-300 border border-gray-700",
    "hover:bg-gray-700 hover:text-white hover:border-gray-600",
  ].join(" "),

  danger: [
    "bg-red-500/10 text-red-400 border border-red-500/30",
    "hover:bg-red-500/20 hover:border-red-500/50",
  ].join(" "),

  ghost: ["text-gray-400", "hover:bg-gray-800 hover:text-white"].join(" "),

  outline: [
    "border border-primary-500/50 text-primary-400",
    "hover:bg-primary-500/10 hover:border-primary-500",
  ].join(" "),
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-200 select-none",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "active:scale-[0.97]",

          variants[variant],
          sizes[size],

          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 size={size === "lg" ? 18 : 14} className="animate-spin" />
        ) : (
          icon &&
          iconPosition === "left" && <span className="shrink-0">{icon}</span>
        )}

        {children && <span>{children}</span>}

        {!loading && icon && iconPosition === "right" && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, Variant as ButtonVariant, Size as ButtonSize };
