"use client";

import { motion } from "framer-motion";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-600/25",
  secondary:
    "bg-accent-500 text-white hover:bg-accent-600 shadow-md shadow-accent-500/25",
  outline:
    "border-2 border-brand-600 text-brand-600 hover:bg-brand-50",
  ghost: "text-gray-600 hover:bg-gray-100",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm rounded-lg",
  md: "px-6 py-2.5 text-base rounded-xl",
  lg: "px-8 py-3.5 text-lg rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", icon, loading, children, className = "", disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 
          ${variantStyles[variant]} ${sizeStyles[size]} 
          ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
          ${className}`}
        disabled={disabled || loading}
        {...(props as any)}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
