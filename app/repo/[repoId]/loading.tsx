import SkeletonLoader from "@/components/ui/SkeletonLoader";

export default function RepoDashboardLoading() {
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                background: "var(--bg)",
            }}
        >
            {/* Navbar skeleton */}
            <div
                style={{
                    height: 60,
                    borderBottom: "1px solid var(--border-subtle)",
                    background: "var(--surface)",
                    padding: "0 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexShrink: 0,
                }}
            >
                <SkeletonLoader height={28} width={28} rounded="lg" />
                <SkeletonLoader height={18} width={100} />
                <div style={{ marginLeft: "auto" }}>
                    <SkeletonLoader height={28} width={70} rounded="lg" />
                </div>
            </div>

            {/* Breadcrumb skeleton */}
            <div
                style={{
                    height: 37,
                    borderBottom: "1px solid var(--border-subtle)",
                    background: "var(--surface)",
                    padding: "0 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}
            >
                <SkeletonLoader height={12} width={30} />
                <SkeletonLoader height={12} width={120} />
            </div>

            {/* Body */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Sidebar skeleton */}
                <div
                    style={{
                        width: 260,
                        borderRight: "1px solid var(--border-subtle)",
                        background: "var(--surface)",
                        padding: "16px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        flexShrink: 0,
                    }}
                >
                    {[80, 65, 90, 55, 75, 60, 85, 70, 50, 80].map((w, i) => (
                        <SkeletonLoader key={i} height={14} width={`${w}%`} />
                    ))}
                </div>

                {/* Main content skeleton */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Tab bar */}
                    <div
                        style={{
                            height: 45,
                            borderBottom: "1px solid var(--border-subtle)",
                            background: "var(--surface)",
                            padding: "0 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {[80, 90, 100, 100].map((w, i) => (
                            <SkeletonLoader key={i} height={14} width={w} />
                        ))}
                    </div>

                    {/* Content */}
                    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                style={{
                                    background: "var(--card)",
                                    borderRadius: 16,
                                    padding: 24,
                                    border: "1px solid var(--border)",
                                }}
                            >
                                <SkeletonLoader height={18} width="40%" />
                                <div style={{ marginTop: 16 }}>
                                    <SkeletonLoader height={13} count={6} gap={10} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat panel skeleton */}
                <div
                    style={{
                        width: 320,
                        borderLeft: "1px solid var(--border-subtle)",
                        background: "var(--surface)",
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        flexShrink: 0,
                    }}
                >
                    <SkeletonLoader height={36} rounded="lg" />
                    <SkeletonLoader height={13} count={4} gap={10} />
                </div>
            </div>
        </div>
    );
}
