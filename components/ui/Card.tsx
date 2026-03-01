"use client";

import { clsx } from "clsx";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    glow?: boolean;
    glowColor?: "primary" | "accent";
    padding?: "none" | "sm" | "md" | "lg";
    hover?: boolean;
    onClick?: () => void;
}

export default function Card({
    children,
    className,
    glow = false,
    glowColor = "primary",
    padding = "md",
    hover = false,
    onClick,
}: CardProps) {
    const paddings = {
        none: "",
        sm: "p-4",
        md: "p-5",
        lg: "p-7",
    };

    const glowStyles = {
        primary: "shadow-[0_0_30px_var(--primary-glow)] border-[var(--primary)]/30",
        accent: "shadow-[0_0_30px_var(--accent-glow)] border-[var(--accent)]/30",
    };

    return (
        <div
            onClick={onClick}
            className={clsx(
                "rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-all duration-200",
                paddings[padding],
                glow && glowStyles[glowColor],
                hover && "hover:border-[var(--primary)]/40 hover:bg-[var(--card-hover)] cursor-pointer",
                onClick && "cursor-pointer",
                className
            )}
        >
            {children}
        </div>
    );
}
