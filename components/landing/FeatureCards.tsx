"use client";

import { Brain, Network, MessageCircle } from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "AI Codebase Overview",
        description:
            "Get a high-level AI-generated explanation of the project — architecture, purpose, and key technologies in seconds.",
        color: "#6366f1",
        glow: "rgba(99,102,241,0.12)",
    },
    {
        icon: Network,
        title: "Architecture Analysis",
        description:
            "Understand how modules, components, and services interact. Visualize the system design at a glance.",
        color: "#a78bfa",
        glow: "rgba(167,139,250,0.12)",
    },
    {
        icon: MessageCircle,
        title: "Chat With Your Code",
        description:
            "Ask natural language questions about the repository. Powered by RAG with vector search over your codebase.",
        color: "#22c55e",
        glow: "rgba(34,197,94,0.12)",
    },
];

export default function FeatureCards() {
    return (
        <section
            style={{
                padding: "0 24px 80px",
                maxWidth: 1100,
                margin: "0 auto",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 20,
                }}
            >
                {features.map(({ icon: Icon, title, description, color, glow }) => (
                    <div
                        key={title}
                        style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 18,
                            padding: 28,
                            transition: "all 0.25s ease",
                            cursor: "default",
                            position: "relative",
                            overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                            const el = e.currentTarget;
                            el.style.borderColor = `${color}40`;
                            el.style.boxShadow = `0 0 40px ${glow}`;
                            el.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            el.style.borderColor = "var(--border)";
                            el.style.boxShadow = "none";
                            el.style.transform = "translateY(0)";
                        }}
                    >
                        {/* Icon */}
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                background: glow,
                                border: `1px solid ${color}30`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 18,
                            }}
                        >
                            <Icon size={22} color={color} />
                        </div>

                        <h3
                            style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "var(--text)",
                                marginBottom: 10,
                                letterSpacing: "-0.2px",
                            }}
                        >
                            {title}
                        </h3>
                        <p
                            style={{
                                fontSize: 14,
                                color: "var(--text-dim)",
                                lineHeight: 1.7,
                            }}
                        >
                            {description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
