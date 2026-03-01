"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, ArrowRight, Loader2 } from "lucide-react";
import { useAnalyzeRepo } from "@/hooks/useRepo";
import { encodeRepoId } from "@/services/api";
import { useRepoStore } from "@/store/repoStore";

export default function HeroSection() {
    const router = useRouter();
    const [repoUrl, setRepoUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { setRepoUrl: storeSetRepoUrl } = useRepoStore();
    const { mutate, isPending } = useAnalyzeRepo();

    const isValidGithubUrl = (url: string) =>
        /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/.*)?$/.test(url.trim());

    const handleAnalyze = () => {
        setError(null);
        const trimmed = repoUrl.trim();
        if (!trimmed) {
            setError("Please enter a GitHub repository URL.");
            return;
        }
        if (!isValidGithubUrl(trimmed)) {
            setError("Please enter a valid GitHub URL (e.g. https://github.com/owner/repo).");
            return;
        }

        mutate(trimmed, {
            onSuccess: () => {
                storeSetRepoUrl(trimmed);
                const repoId = encodeRepoId(trimmed);
                router.push(`/repo/${repoId}`);
            },
            onError: (err: Error) => {
                setError(err.message);
            },
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleAnalyze();
    };

    return (
        <section
            style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 24px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background glow orbs */}
            <div
                style={{
                    position: "absolute",
                    top: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 600,
                    height: 300,
                    background: "radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "10%",
                    right: "20%",
                    width: 300,
                    height: 200,
                    background: "radial-gradient(ellipse at center, rgba(34,197,94,0.07) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 680,
                    textAlign: "center",
                    animation: "fadeIn 0.5s ease both",
                }}
            >
                {/* Eyebrow badge */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 14px",
                        borderRadius: 999,
                        border: "1px solid rgba(99,102,241,0.3)",
                        background: "rgba(99,102,241,0.08)",
                        marginBottom: 28,
                    }}
                >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
                    <span style={{ fontSize: 12, color: "#a5b4fc", fontWeight: 500, letterSpacing: "0.3px" }}>
                        AI-Powered Developer Tool
                    </span>
                </div>

                {/* Headline */}
                <h1
                    style={{
                        fontSize: "clamp(2rem, 5vw, 3.5rem)",
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: "-1.5px",
                        marginBottom: 20,
                        color: "var(--text)",
                    }}
                >
                    Understand Any{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #22c55e 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Codebase
                    </span>{" "}
                    Instantly
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: 16,
                        color: "var(--text-dim)",
                        lineHeight: 1.8,
                        marginBottom: 48,
                        maxWidth: 520,
                        margin: "0 auto 48px",
                    }}
                >
                    Paste a GitHub repository and Repolume will analyze the entire project,
                    explain the architecture, summarize files, and let you chat with the codebase.
                </p>

                {/* Input Card */}
                <div
                    style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 20,
                        padding: 24,
                        boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            background: "var(--surface)",
                            border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
                            borderRadius: 12,
                            padding: "4px 4px 4px 16px",
                            transition: "border-color 0.2s, box-shadow 0.2s",
                            boxShadow: error ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
                        }}
                        onFocus={() => { }}
                    >
                        <Github size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <input
                            value={repoUrl}
                            onChange={(e) => {
                                setRepoUrl(e.target.value);
                                if (error) setError(null);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="https://github.com/username/repository"
                            disabled={isPending}
                            style={{
                                flex: 1,
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                color: "var(--text)",
                                fontSize: 14,
                                padding: "10px 0",
                            }}
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={isPending || !repoUrl.trim()}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "10px 20px",
                                borderRadius: 10,
                                border: "none",
                                background: isPending || !repoUrl.trim()
                                    ? "var(--surface)"
                                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                color: isPending || !repoUrl.trim() ? "var(--text-muted)" : "white",
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: isPending || !repoUrl.trim() ? "not-allowed" : "pointer",
                                transition: "all 0.2s",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                            }}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 size={14} style={{ animation: "spin 0.75s linear infinite" }} />
                                    Analyzing…
                                </>
                            ) : (
                                <>
                                    Analyze
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <p
                            style={{
                                marginTop: 12,
                                fontSize: 13,
                                color: "var(--danger)",
                                textAlign: "left",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    {isPending && (
                        <div
                            style={{
                                marginTop: 16,
                                padding: 14,
                                borderRadius: 10,
                                background: "rgba(99,102,241,0.06)",
                                border: "1px solid rgba(99,102,241,0.15)",
                                fontSize: 13,
                                color: "#a5b4fc",
                                textAlign: "left",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 10,
                            }}
                        >
                            <Loader2 size={14} style={{ animation: "spin 0.75s linear infinite", marginTop: 1, flexShrink: 0 }} />
                            <span>
                                <strong>Analyzing repository…</strong>
                                <br />
                                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                                    This may take 30–60 seconds while we fetch files and run AI analysis.
                                </span>
                            </span>
                        </div>
                    )}
                </div>

                <p style={{ marginTop: 16, fontSize: 12, color: "var(--text-muted)" }}>
                    Supports public GitHub repositories · Powered by OpenAI
                </p>
            </div>
        </section>
    );
}
