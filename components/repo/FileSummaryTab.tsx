"use client";

import { FileText, MousePointerClick } from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useExplainFile } from "@/hooks/useRepo";
import { useRepoStore } from "@/store/repoStore";

interface FileSummaryTabProps {
    repoUrl: string;
}

export default function FileSummaryTab({ repoUrl }: FileSummaryTabProps) {
    const { selectedFile } = useRepoStore();
    const { data, isLoading, isError } = useExplainFile(repoUrl, selectedFile);

    if (!selectedFile) {
        return (
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 40,
                    textAlign: "center",
                    gap: 16,
                }}
            >
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 20,
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MousePointerClick size={28} color="var(--text-muted)" />
                </div>
                <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                        No file selected
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 280, lineHeight: 1.6 }}>
                        Click any file in the sidebar to see an AI-generated explanation of its purpose and contents.
                    </p>
                </div>
            </div>
        );
    }

    const fileName = selectedFile.split("/").pop() ?? selectedFile;

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
            {/* File header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 18px",
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                }}
            >
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <FileText size={16} color="var(--primary)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--text)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {fileName}
                    </div>
                    <div
                        style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginTop: 2,
                        }}
                    >
                        {selectedFile}
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading && (
                <div
                    style={{
                        background: "var(--card)",
                        borderRadius: 16,
                        padding: 24,
                        border: "1px solid var(--border)",
                    }}
                >
                    <SkeletonLoader height={16} width="45%" />
                    <div style={{ marginTop: 16 }}>
                        <SkeletonLoader height={13} count={8} gap={10} />
                    </div>
                </div>
            )}

            {isError && (
                <div
                    style={{
                        padding: 24,
                        borderRadius: 16,
                        background: "rgba(239,68,68,0.06)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        textAlign: "center",
                    }}
                >
                    <p style={{ color: "var(--danger)", fontSize: 14, fontWeight: 600 }}>
                        Failed to explain file
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 6 }}>
                        The file may be too large or inaccessible.
                    </p>
                </div>
            )}

            {data && (
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
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--text-muted)",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            marginBottom: 16,
                            paddingBottom: 10,
                            borderBottom: "1px solid var(--border-subtle)",
                        }}
                    >
                        AI Explanation
                    </div>
                    <MarkdownRenderer content={data.summary} />
                </div>
            )}
        </div>
    );
}
