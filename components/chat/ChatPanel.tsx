"use client";

import { useEffect, useRef } from "react";
import { Send, MessageCircle, Trash2 } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ChatMessage from "./ChatMessage";
import Spinner from "@/components/ui/Spinner";

const SUGGESTIONS = [
    "Explain the overall architecture",
    "What does the auth system do?",
    "Summarize the main modules",
    "How is state managed?",
    "What are the key API endpoints?",
];

interface ChatPanelProps {
    repoUrl: string;
}

export default function ChatPanel({ repoUrl }: ChatPanelProps) {
    const { messages, inputValue, setInputValue, sendMessage, isLoading, clearChat, canSend } =
        useChat();
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Auto-resize textarea
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const el = e.target;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
        setInputValue(el.value);
    };

    return (
        <div
            style={{
                width: 320,
                minWidth: 320,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid var(--border-subtle)",
                background: "var(--surface)",
                flexShrink: 0,
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MessageCircle size={14} color="white" />
                </div>
                <span
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text)",
                        flex: 1,
                    }}
                >
                    Chat with Repo
                </span>
                {messages.length > 0 && (
                    <button
                        onClick={clearChat}
                        title="Clear chat"
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
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                {messages.length === 0 && (
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 16,
                            textAlign: "center",
                            padding: "24px 8px",
                        }}
                    >
                        <div
                            style={{
                                width: 52,
                                height: 52,
                                borderRadius: 16,
                                background: "var(--primary-glow)",
                                border: "1px solid rgba(99,102,241,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <MessageCircle size={22} color="var(--primary)" />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
                                Ask about the codebase
                            </p>
                            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
                                Use RAG-powered search to query any part of this repository
                            </p>
                        </div>

                        {/* Suggestion chips */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                                width: "100%",
                                marginTop: 8,
                            }}
                        >
                            {SUGGESTIONS.slice(0, 4).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => sendMessage(s)}
                                    disabled={!canSend}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: 8,
                                        background: "var(--card)",
                                        border: "1px solid var(--border)",
                                        color: "var(--text-dim)",
                                        fontSize: 12,
                                        cursor: "pointer",
                                        textAlign: "left",
                                        transition: "all 0.15s",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
                                        e.currentTarget.style.color = "var(--text)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = "var(--border)";
                                        e.currentTarget.style.color = "var(--text-dim)";
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <ChatMessage key={msg.timestamp} message={msg} />
                ))}

                {isLoading && (
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 8,
                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <Spinner size="xs" color="accent" />
                        </div>
                        <div
                            style={{
                                padding: "10px 14px",
                                borderRadius: "4px 14px 14px 14px",
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                display: "flex",
                                gap: 4,
                                alignItems: "center",
                            }}
                        >
                            {[0, 0.2, 0.4].map((delay) => (
                                <div
                                    key={delay}
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        background: "var(--text-muted)",
                                        animation: "pulse 1.4s ease-in-out infinite",
                                        animationDelay: `${delay}s`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div
                style={{
                    padding: "12px 12px 16px",
                    borderTop: "1px solid var(--border-subtle)",
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-end",
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        padding: "8px 8px 8px 14px",
                        transition: "border-color 0.2s",
                    }}
                    onFocusCapture={(e) => {
                        e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-glow)";
                    }}
                    onBlurCapture={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        disabled={!canSend}
                        placeholder={canSend ? "Ask a question… (Enter to send)" : "Analyzing repository…"}
                        rows={1}
                        style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            resize: "none",
                            color: "var(--text)",
                            fontSize: 13,
                            lineHeight: 1.6,
                            padding: "4px 0",
                            minHeight: 26,
                            maxHeight: 120,
                        }}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!canSend || !inputValue.trim()}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: "none",
                            background:
                                canSend && inputValue.trim()
                                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                                    : "var(--surface)",
                            color: canSend && inputValue.trim() ? "white" : "var(--text-muted)",
                            cursor: canSend && inputValue.trim() ? "pointer" : "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "all 0.2s",
                            boxShadow:
                                canSend && inputValue.trim()
                                    ? "0 4px 12px rgba(99,102,241,0.3)"
                                    : "none",
                        }}
                    >
                        <Send size={14} />
                    </button>
                </div>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, textAlign: "center" }}>
                    Shift+Enter for new line · Powered by OpenAI RAG
                </p>
            </div>
        </div>
    );
}
