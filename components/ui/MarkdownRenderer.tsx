"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { clsx } from "clsx";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export default function MarkdownRenderer({
    content,
    className,
}: MarkdownRendererProps) {
    return (
        <div
            className={clsx(
                "prose prose-invert max-w-none text-[var(--text)] leading-relaxed",
                "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-[var(--text)] [&_h1]:mb-3 [&_h1]:mt-5",
                "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[var(--text)] [&_h2]:mb-2 [&_h2]:mt-5",
                "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[var(--text-dim)] [&_h3]:mb-2 [&_h3]:mt-4",
                "[&_p]:text-[var(--text-dim)] [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-3",
                "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1",
                "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1",
                "[&_li]:text-[var(--text-dim)] [&_li]:text-sm",
                "[&_strong]:text-[var(--text)] [&_strong]:font-semibold",
                "[&_em]:text-[var(--text-dim)] [&_em]:italic",
                "[&_a]:text-[var(--primary)] [&_a]:underline hover:[&_a]:text-[var(--primary-hover)]",
                "[&_blockquote]:border-l-2 [&_blockquote]:border-[var(--primary)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--text-muted)] [&_blockquote]:italic",
                "[&_hr]:border-[var(--border)] [&_hr]:my-4",
                "[&_table]:w-full [&_table]:border-collapse",
                "[&_th]:border [&_th]:border-[var(--border)] [&_th]:p-2 [&_th]:text-left [&_th]:text-xs [&_th]:text-[var(--text-dim)] [&_th]:bg-[var(--surface)]",
                "[&_td]:border [&_td]:border-[var(--border)] [&_td]:p-2 [&_td]:text-sm [&_td]:text-[var(--text-dim)]",
                className
            )}
        >
            <ReactMarkdown
                components={{
                    code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isBlock = match != null;
                        return isBlock ? (
                            <SyntaxHighlighter
                                style={oneDark as Record<string, React.CSSProperties>}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    margin: "12px 0",
                                    borderRadius: "10px",
                                    fontSize: "13px",
                                    border: "1px solid var(--border)",
                                    background: "#1a1f2e",
                                }}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            <code
                                className={className}
                                style={{
                                    background: "var(--surface)",
                                    color: "#a5b4fc",
                                    padding: "1px 6px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    border: "1px solid var(--border)",
                                }}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
