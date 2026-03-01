"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { decodeRepoId } from "@/services/api";
import { useRepoStore } from "@/store/repoStore";
import { useRepoAnalysis } from "@/hooks/useRepo";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/repo/Sidebar";
import TabBar from "@/components/repo/TabBar";
import OverviewTab from "@/components/repo/OverviewTab";
import ArchitectureTab from "@/components/repo/ArchitectureTab";
import FileSummaryTab from "@/components/repo/FileSummaryTab";
import DependenciesTab from "@/components/repo/DependenciesTab";
import ChatPanel from "@/components/chat/ChatPanel";

export default function RepoDashboardPage() {
    const { repoId } = useParams<{ repoId: string }>();
    const repoUrl = decodeRepoId(repoId);

    const { setRepoUrl, activeTab } = useRepoStore();
    const { data: analysis, isLoading, isError } = useRepoAnalysis(repoUrl);

    useEffect(() => {
        if (repoUrl) setRepoUrl(repoUrl);
    }, [repoUrl, setRepoUrl]);

    // Extract a display name from the URL: "owner/repo"
    const repoSlug = (() => {
        try {
            const m = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
            return m ? m[1] : repoUrl;
        } catch {
            return repoUrl;
        }
    })();

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
            <Navbar />

            {/* Repo breadcrumb bar */}
            <div
                style={{
                    padding: "8px 20px",
                    borderBottom: "1px solid var(--border-subtle)",
                    background: "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexShrink: 0,
                }}
            >
                <a
                    href="/"
                    style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        textDecoration: "none",
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                    Home
                </a>
                <span style={{ fontSize: 12, color: "var(--border)" }}>/</span>
                <span
                    style={{
                        fontSize: 12,
                        color: "#a5b4fc",
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {repoSlug}
                </span>

                {isLoading && (
                    <span
                        style={{
                            marginLeft: "auto",
                            fontSize: 11,
                            color: "var(--text-muted)",
                            background: "var(--card)",
                            padding: "3px 10px",
                            borderRadius: 6,
                            border: "1px solid var(--border)",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "var(--accent)",
                                display: "inline-block",
                                animation: "pulse 1.5s ease-in-out infinite",
                            }}
                        />
                        Analyzing…
                    </span>
                )}

                {!isLoading && !isError && (
                    <span
                        style={{
                            marginLeft: "auto",
                            fontSize: 11,
                            color: "#86efac",
                            background: "var(--accent-glow)",
                            padding: "3px 10px",
                            borderRadius: 6,
                            border: "1px solid rgba(34,197,94,0.2)",
                        }}
                    >
                        ✓ Analysis complete
                    </span>
                )}
            </div>

            {/* IDE Layout: sidebar | main content | chat */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {/* Sidebar */}
                <Sidebar repoUrl={repoUrl} />

                {/* Main content */}
                <main
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        background: "var(--bg)",
                    }}
                >
                    <TabBar />

                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {activeTab === "overview" && (
                            <OverviewTab
                                analysis={analysis}
                                isLoading={isLoading}
                                isError={isError}
                            />
                        )}
                        {activeTab === "architecture" && (
                            <ArchitectureTab analysis={analysis} isLoading={isLoading} />
                        )}
                        {activeTab === "file" && <FileSummaryTab repoUrl={repoUrl} />}
                        {activeTab === "deps" && (
                            <DependenciesTab analysis={analysis} isLoading={isLoading} />
                        )}
                    </div>
                </main>

                {/* Chat panel */}
                <ChatPanel repoUrl={repoUrl} />
            </div>
        </div>
    );
}
