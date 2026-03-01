"use client";

interface SkeletonProps {
    height?: string | number;
    width?: string | number;
    rounded?: "sm" | "md" | "lg" | "full";
    count?: number;
    gap?: number;
    className?: string;
}

const roundedMap: Record<string, string> = {
    sm: "4px",
    md: "8px",
    lg: "16px",
    full: "9999px",
};

export default function SkeletonLoader({
    height = 16,
    width = "100%",
    rounded = "md",
    count = 1,
    gap = 10,
    className,
}: SkeletonProps) {
    const h = typeof height === "number" ? `${height}px` : height;
    const w = typeof width === "number" ? `${width}px` : width;
    const borderRadius = roundedMap[rounded] ?? "8px";

    const bar = (key: number, overrideWidth?: string) => (
        <div
            key={key}
            className={`skeleton${className ? ` ${className}` : ""}`}
            style={{
                height: h,
                width: overrideWidth ?? w,
                borderRadius,
                flexShrink: 0,
            }}
        />
    );

    if (count <= 1) {
        return bar(0);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap }}>
            {Array.from({ length: count }).map((_, i) =>
                bar(i, i === count - 1 ? "70%" : w)
            )}
        </div>
    );
}
