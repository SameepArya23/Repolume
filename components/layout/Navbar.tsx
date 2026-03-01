"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export default function Navbar() {
    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                borderBottom: "1px solid var(--border-subtle)",
                background: "rgba(11, 15, 25, 0.85)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    padding: "0 24px",
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Link
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        textDecoration: "none",
                    }}
                >
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 16px rgba(99,102,241,0.4)",
                        }}
                    >
                        <Zap size={16} color="white" fill="white" />
                    </div>
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: 18,
                            background: "linear-gradient(135deg, #e5e7eb, #a5b4fc)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            letterSpacing: "-0.3px",
                        }}
                    >
                        Repolume
                    </span>
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            padding: "6px 14px",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "var(--surface)",
                            color: "var(--text-dim)",
                            fontSize: 13,
                            fontWeight: 500,
                            textDecoration: "none",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--primary)";
                            e.currentTarget.style.color = "var(--text)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.color = "var(--text-dim)";
                        }}
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </header>
    );
}
