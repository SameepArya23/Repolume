"use client";

import { User, Zap } from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import type { ChatMessage as ChatMessageType } from "@/store/repoStore";

interface ChatMessageProps {
    message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <div
            style={{
                display: "flex",
                gap: 10,
                flexDirection: isUser ? "row-reverse" : "row",
                alignItems: "flex-start",
                animation: "fadeIn 0.25s ease both",
            }}
        >
            {/* Avatar */}
            <div
                style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: isUser
                        ? "var(--primary-glow)"
                        : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    border: isUser
                        ? "1px solid rgba(99,102,241,0.3)"
                        : "none",
                }}
            >
                {isUser ? (
                    <User size={14} color="#a5b4fc" />
                ) : (
                    <Zap size={14} color="white" fill="white" />
                )}
            </div>

            {/* Bubble */}
            <div
                style={{
                    maxWidth: "82%",
                    padding: isUser ? "10px 14px" : "12px 16px",
                    borderRadius: isUser ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                    background: isUser
                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                        : "var(--card)",
                    border: isUser
                        ? "none"
                        : "1px solid var(--border)",
                    boxShadow: isUser
                        ? "0 4px 16px rgba(99,102,241,0.2)"
                        : "none",
                }}
            >
                {isUser ? (
                    <p style={{ fontSize: 13, color: "white", lineHeight: 1.6, margin: 0 }}>
                        {message.content}
                    </p>
                ) : (
                    <MarkdownRenderer content={message.content} />
                )}
            </div>
        </div>
    );
}
