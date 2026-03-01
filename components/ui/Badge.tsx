"use client";

import { clsx } from "clsx";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "primary" | "accent" | "neutral" | "warning" | "danger";
    size?: "sm" | "md";
    className?: string;
}

const variants = {
    primary: "bg-[var(--primary-glow)] text-[#a5b4fc] border border-[var(--primary)]/20",
    accent: "bg-[var(--accent-glow)] text-[#86efac] border border-[var(--accent)]/20",
    neutral: "bg-[var(--surface)] text-[var(--text-dim)] border border-[var(--border)]",
    warning: "bg-amber-950/30 text-amber-400 border border-amber-800/30",
    danger: "bg-red-950/30 text-red-400 border border-red-800/30",
};

const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-3 py-1",
};

export default function Badge({
    children,
    variant = "neutral",
    size = "md",
    className,
}: BadgeProps) {
    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full font-medium",
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </span>
    );
}
