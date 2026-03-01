"use client";

import { Package } from "lucide-react";
import Badge from "@/components/ui/Badge";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import type { RepoAnalysis } from "@/types/repo";

interface DependenciesTabProps {
    analysis: RepoAnalysis | undefined;
    isLoading: boolean;
}

// Categorize tech into rough groups for visual separation
function categorizeTech(items: string[]): Record<string, string[]> {
    const cats: Record<string, string[]> = {
        "Frontend": [],
        "Backend": [],
        "Database & Storage": [],
        "AI & ML": [],
        "DevTools & Infrastructure": [],
        "Other": [],
    };

    const rules: [RegExp, string][] = [
        [/react|vue|svelte|angular|next\.js|nuxt|astro|remix|solid|tailwind|css|html|vite/i, "Frontend"],
        [/node|express|fastapi|django|flask|rails|spring|go|rust|php|laravel|hono/i, "Backend"],
        [/supabase|postgres|mysql|mongo|redis|sqlite|prisma|drizzle|firebase/i, "Database & Storage"],
        [/openai|gpt|llm|langchain|hugging|anthropic|gemini|claude|embedding/i, "AI & ML"],
        [/docker|kubernetes|github|vercel|netlify|aws|azure|gcp|ci|cd|jest|vitest|testing|eslint|prettier|typescript|webpack|babel/i, "DevTools & Infrastructure"],
    ];

    for (const item of items) {
        let placed = false;
        for (const [regex, cat] of rules) {
            if (regex.test(item)) {
                cats[cat].push(item);
                placed = true;
                break;
            }
        }
        if (!placed) cats["Other"].push(item);
    }

    return cats;
}

const catVariant: Record<string, "primary" | "accent" | "neutral" | "warning"> = {
    "Frontend": "primary",
    "Backend": "accent",
    "Database & Storage": "warning",
    "AI & ML": "primary",
    "DevTools & Infrastructure": "neutral",
    "Other": "neutral",
};

export default function DependenciesTab({ analysis, isLoading }: DependenciesTabProps) {
    if (isLoading) {
        return (
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
                        <SkeletonLoader height={16} width="30%" />
                        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {[1, 2, 3, 4, 5, 6].map((j) => (
                                <SkeletonLoader key={j} height={26} width={70 + j * 8} rounded="full" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!analysis?.techStack?.length) {
        return (
            <div
                style={{
                    padding: 40,
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: 14,
                }}
            >
                No dependencies detected.
            </div>
        );
    }

    const categorized = categorizeTech(analysis.techStack);
    const populated = Object.entries(categorized).filter(([, items]) => items.length > 0);

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
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 18px",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(34,197,94,0.04))",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                }}
            >
                <Package size={18} color="var(--primary)" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                    Detected Technologies
                </span>
                <span
                    style={{
                        marginLeft: "auto",
                        fontSize: 12,
                        color: "var(--text-muted)",
                        background: "var(--surface)",
                        padding: "2px 8px",
                        borderRadius: 6,
                        border: "1px solid var(--border)",
                    }}
                >
                    {analysis.techStack.length} total
                </span>
            </div>

            {/* Categories */}
            {populated.map(([category, items]) => (
                <div
                    key={category}
                    style={{
                        background: "var(--card)",
                        borderRadius: 16,
                        padding: 20,
                        border: "1px solid var(--border)",
                    }}
                >
                    <h3
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--text-muted)",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            marginBottom: 14,
                            paddingBottom: 10,
                            borderBottom: "1px solid var(--border-subtle)",
                        }}
                    >
                        {category}
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {items.map((tech) => (
                            <Badge key={tech} variant={catVariant[category] ?? "neutral"}>
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
