"use client";

import { LayoutDashboard, Network, FileText, Package } from "lucide-react";
import { clsx } from "clsx";
import { useRepoStore } from "@/store/repoStore";
import type { TabName } from "@/store/repoStore";

const TABS: { id: TabName; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "architecture", label: "Architecture", icon: Network },
    { id: "file", label: "File Summary", icon: FileText },
    { id: "deps", label: "Dependencies", icon: Package },
];

export default function TabBar() {
    const { activeTab, setActiveTab } = useRepoStore();

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: "0 16px",
                borderBottom: "1px solid var(--border-subtle)",
                background: "var(--surface)",
                flexShrink: 0,
                overflowX: "auto",
            }}
        >
            {TABS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            padding: "12px 14px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? "#a5b4fc" : "var(--text-muted)",
                            borderBottom: isActive
                                ? "2px solid var(--primary)"
                                : "2px solid transparent",
                            marginBottom: -1,
                            transition: "all 0.15s ease",
                            whiteSpace: "nowrap",
                            borderRadius: 0,
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.color = "var(--text-dim)";
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.color = "var(--text-muted)";
                        }}
                    >
                        <Icon size={14} />
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
