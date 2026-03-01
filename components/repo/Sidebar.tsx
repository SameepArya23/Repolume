"use client";

import { GitBranch, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useRepoStore } from "@/store/repoStore";
import { useRepoTree } from "@/hooks/useRepo";
import FileTreeNode from "./FileTreeNode";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface SidebarProps {
    repoUrl: string;
}

export default function Sidebar({ repoUrl }: SidebarProps) {
    const { selectedFile, setSelectedFile, setActiveTab, sidebarOpen, toggleSidebar } =
        useRepoStore();
    const { data, isLoading, isError } = useRepoTree(repoUrl);

    const handleFileClick = (path: string) => {
        setSelectedFile(path);
        setActiveTab("file");
    };

    // Build root-level nodes from the flat tree
    const rootNodes =
        data?.tree.filter((node) => !node.path.includes("/")) ?? [];

    return (
        <>
            {/* Sidebar panel */}
            <aside
                style={{
                    width: sidebarOpen ? 260 : 0,
                    minWidth: sidebarOpen ? 260 : 0,
                    height: "100%",
                    overflow: "hidden",
                    borderRight: "1px solid var(--border-subtle)",
                    background: "var(--surface)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "width 0.25s ease, min-width 0.25s ease",
                    flexShrink: 0,
                }}
            >
                {/* Sidebar header */}
                <div
                    style={{
                        padding: "12px 12px 8px",
                        borderBottom: "1px solid var(--border-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexShrink: 0,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <GitBranch size={13} color="var(--text-muted)" />
                        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                            File Explorer
                        </span>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--text-muted)",
                            padding: 4,
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            transition: "color 0.15s",
                        }}
                        title="Collapse sidebar"
                    >
                        <PanelLeftClose size={15} />
                    </button>
                </div>

                {/* Repo name badge */}
                {data && (
                    <div
                        style={{
                            padding: "8px 12px",
                            borderBottom: "1px solid var(--border-subtle)",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            flexShrink: 0,
                        }}
                    >
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
                            {data.owner}/{data.repo}
                        </span>
                        <span
                            style={{
                                marginLeft: "auto",
                                fontSize: 10,
                                color: "var(--text-muted)",
                                background: "var(--card)",
                                padding: "2px 6px",
                                borderRadius: 4,
                                border: "1px solid var(--border)",
                                flexShrink: 0,
                            }}
                        >
                            {data.totalFiles}
                        </span>
                    </div>
                )}

                {/* Tree content */}
                <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
                    {isLoading && (
                        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                            {[80, 65, 90, 55, 75, 60, 85].map((w, i) => (
                                <SkeletonLoader key={i} height={14} width={`${w}%`} />
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div style={{ padding: 16, fontSize: 12, color: "var(--danger)", textAlign: "center" }}>
                            Failed to load file tree.
                            <br />
                            <span style={{ color: "var(--text-muted)" }}>Check your network or GitHub token.</span>
                        </div>
                    )}

                    {data && rootNodes.length === 0 && (
                        <div style={{ padding: 16, fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
                            No files found.
                        </div>
                    )}

                    {data &&
                        rootNodes.map((node) => (
                            <FileTreeNode
                                key={node.path}
                                node={node}
                                allNodes={data.tree}
                                depth={0}
                                selectedFile={selectedFile}
                                onFileClick={handleFileClick}
                            />
                        ))}
                </div>
            </aside>

            {/* Toggle button when sidebar is closed */}
            {!sidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    style={{
                        position: "absolute",
                        left: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        padding: 6,
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        transition: "all 0.15s",
                    }}
                    title="Open sidebar"
                >
                    <PanelLeftOpen size={15} />
                </button>
            )}
        </>
    );
}
