"use client";

import { clsx } from "clsx";

interface SpinnerProps {
    size?: "xs" | "sm" | "md" | "lg";
    color?: "primary" | "accent" | "muted";
    className?: string;
}

const sizes = {
    xs: "w-3 h-3 border-[1.5px]",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-[3px]",
};

const colors = {
    primary: "border-[var(--primary)]/20 border-t-[var(--primary)]",
    accent: "border-[var(--accent)]/20 border-t-[var(--accent)]",
    muted: "border-[var(--border)] border-t-[var(--text-dim)]",
};

export default function Spinner({
    size = "md",
    color = "primary",
    className,
}: SpinnerProps) {
    return (
        <div
            className={clsx(
                "rounded-full animate-spin",
                sizes[size],
                colors[color],
                className
            )}
            style={{ animation: "spin 0.75s linear infinite" }}
        />
    );
}
