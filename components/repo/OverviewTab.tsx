"use client";

import { Code2, Layers, Zap } from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import Badge from "@/components/ui/Badge";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import type { RepoAnalysis } from "@/types/repo";

interface OverviewTabProps {
    analysis: RepoAnalysis | undefined;
    isLoading: boolean;
    isError: boolean;
}

export default function OverviewTab({ analysis, isLoading, isError }: OverviewTabProps) {
    if (isLoading) {
        return (
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                <div
                    style={{
                        background: "var(--card)",
                        borderRadius: 16,
                        padding: 24,
                        border: "1px solid var(--border)",
                    }}
                >
                    <SkeletonLoader height={18} width="40%" />
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                        <SkeletonLoader height={13} count={6} />
                    </div>
                </div>
                <div
                    style={{
                        background: "var(--card)",
                        borderRadius: 16,
                        padding: 24,
                        border: "1px solid var(--border)",
                    }}
                >
                    <SkeletonLoader height={18} width="30%" />
                    <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <SkeletonLoader key={i} height={26} width={80} rounded="full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div
                style={{
                    margin: 24,
                    padding: 24,
                    borderRadius: 16,
                    background: "rgba(239,68,68,0.06)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    textAlign: "center",
                }}
            >
                <p style={{ color: "var(--danger)", fontSize: 14, fontWeight: 600 }}>Analysis failed</p>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 6 }}>
                    Could not load the repository analysis. Try re-analyzing.
                </p>
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
            {/* AI Overview */}
            <div
                style={{
                    background: "var(--card)",
                    borderRadius: 16,
                    padding: 24,
                    border: "1px solid var(--border)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 16,
                        paddingBottom: 12,
                        borderBottom: "1px solid var(--border-subtle)",
                    }}
                >
                    <div
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: "var(--primary-glow)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Zap size={14} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0 }}>
                        Project Overview
                    </h2>
                </div>
                <MarkdownRenderer content={analysis.overview} />
            </div>

            {/* Tech Stack */}
            {analysis.techStack && analysis.techStack.length > 0 && (
                <div
                    style={{
                        background: "var(--card)",
                        borderRadius: 16,
                        padding: 24,
                        border: "1px solid var(--border)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 16,
                            paddingBottom: 12,
                            borderBottom: "1px solid var(--border-subtle)",
                        }}
                    >
                        <div
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                background: "var(--accent-glow)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Code2 size={14} color="var(--accent)" />
                        </div>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0 }}>
                            Tech Stack
                        </h2>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {analysis.techStack.map((tech) => (
                            <Badge key={tech} variant="primary">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Key Features from overview */}
            <div
                style={{
                    background: "var(--card)",
                    borderRadius: 16,
                    padding: 24,
                    border: "1px solid var(--border)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 16,
                        paddingBottom: 12,
                        borderBottom: "1px solid var(--border-subtle)",
                    }}
                >
                    <div
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: "rgba(167,139,250,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Layers size={14} color="#a78bfa" />
                    </div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0 }}>
                        Architecture Snapshot
                    </h2>
                </div>
                <MarkdownRenderer content={analysis.architecture} />
            </div>
        </div>
    );
}
