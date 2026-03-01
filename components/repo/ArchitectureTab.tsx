"use client";

import { Network } from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import type { RepoAnalysis } from "@/types/repo";

interface ArchitectureTabProps {
    analysis: RepoAnalysis | undefined;
    isLoading: boolean;
}

export default function ArchitectureTab({ analysis, isLoading }: ArchitectureTabProps) {
    if (isLoading) {
        return (
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        style={{
                            background: "var(--card)",
                            borderRadius: 16,
                            padding: 24,
                            border: "1px solid var(--border)",
                        }}
                    >
                        <SkeletonLoader height={16} width="35%" />
                        <div style={{ marginTop: 14 }}>
                            <SkeletonLoader height={12} count={4} gap={8} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <div
            style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                animation: "fadeIn 0.3s ease both",
            }}
        >
            {/* Header card */}
            <div
                style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(167,139,250,0.06))",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: 16,
                    padding: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: "var(--primary-glow)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Network size={18} color="var(--primary)" />
                </div>
                <div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0 }}>
                        System Architecture
                    </h2>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>
                        AI-generated breakdown of the project structure and component interactions
                    </p>
                </div>
            </div>

            {/* Architecture content */}
            <div
                style={{
                    background: "var(--card)",
                    borderRadius: 16,
                    padding: 24,
                    border: "1px solid var(--border)",
                }}
            >
                <MarkdownRenderer content={analysis.architecture} />
            </div>
        </div>
    );
}
