"use client";

import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    children: React.ReactNode;
}

export default function Button({
    variant = "primary",
    size = "md",
    loading = false,
    children,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center gap-2 font-medium rounded-xl border transition-all duration-200 cursor-pointer select-none";

    const variants = {
        primary:
            "btn-primary-gradient border-transparent text-white shadow-lg shadow-indigo-950/30",
        secondary:
            "bg-[var(--card)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--card-hover)] hover:border-[var(--primary)]",
        ghost:
            "bg-transparent border-transparent text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface)]",
        danger:
            "bg-red-950/40 border-red-800/50 text-red-400 hover:bg-red-900/40 hover:border-red-600",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3.5 text-base",
    };

    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={clsx(
                base,
                variants[variant],
                sizes[size],
                (disabled || loading) && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {children}
        </button>
    );
}
