"use client";

import { useState, memo } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import { clsx } from "clsx";
import type { FileNode } from "@/types/repo";

interface FileTreeNodeProps {
    node: FileNode;
    allNodes: FileNode[];
    depth: number;
    selectedFile: string | null;
    onFileClick: (path: string) => void;
}

function getExtColor(path: string): string {
    const ext = path.split(".").pop()?.toLowerCase();
    const colorMap: Record<string, string> = {
        ts: "#3b82f6", tsx: "#06b6d4", js: "#eab308", jsx: "#f59e0b",
        py: "#22c55e", rb: "#ef4444", go: "#00acd7", rs: "#f97316",
        css: "#a78bfa", scss: "#f472b6", html: "#f97316", json: "#6ee7b7",
        md: "#9ca3af", yaml: "#fbbf24", yml: "#fbbf24", sh: "#84cc16",
        env: "#34d399", sql: "#f59e0b",
    };
    return colorMap[ext ?? ""] ?? "#6b7280";
}

const FileTreeNode = memo(function FileTreeNode({
    node,
    allNodes,
    depth,
    selectedFile,
    onFileClick,
}: FileTreeNodeProps) {
    const [isOpen, setIsOpen] = useState(depth < 1);
    const isFolder = node.type === "tree";
    const isActive = selectedFile === node.path;

    const children = isFolder
        ? allNodes.filter((n) => {
            const rel = n.path.slice(node.path.length + 1);
            return n.path.startsWith(node.path + "/") && !rel.includes("/");
        })
        : [];

    const fileName = node.path.split("/").pop() ?? node.path;
    const iconColor = isFolder ? "#6366f1" : getExtColor(node.path);

    return (
        <div>
            <div
                onClick={() => {
                    if (isFolder) setIsOpen((o) => !o);
                    else onFileClick(node.path);
                }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    paddingLeft: depth * 14 + 8,
                    paddingRight: 8,
                    paddingTop: 5,
                    paddingBottom: 5,
                    cursor: "pointer",
                    borderRadius: 7,
                    margin: "1px 4px",
                    background: isActive
                        ? "rgba(99,102,241,0.12)"
                        : "transparent",
                    border: isActive
                        ? "1px solid rgba(99,102,241,0.25)"
                        : "1px solid transparent",
                    transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                }}
            >
                {/* Chevron for folders */}
                {isFolder ? (
                    <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </span>
                ) : (
                    <span style={{ width: 12, flexShrink: 0 }} />
                )}

                {/* Icon */}
                <span style={{ color: iconColor, flexShrink: 0 }}>
                    {isFolder ? (
                        isOpen ? <FolderOpen size={14} /> : <Folder size={14} />
                    ) : (
                        <File size={14} />
                    )}
                </span>

                {/* Label */}
                <span
                    style={{
                        fontSize: 13,
                        color: isActive ? "#a5b4fc" : isFolder ? "var(--text)" : "var(--text-dim)",
                        fontWeight: isFolder ? 500 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                    }}
                >
                    {fileName}
                </span>
            </div>

            {/* Children */}
            {isFolder && isOpen && children.length > 0 && (
                <div>
                    {children.map((child) => (
                        <FileTreeNode
                            key={child.path}
                            node={child}
                            allNodes={allNodes}
                            depth={depth + 1}
                            selectedFile={selectedFile}
                            onFileClick={onFileClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default FileTreeNode;
