import { NextRequest, NextResponse } from "next/server";
import { parseRepoUrl } from "@/lib/github";
import { embedText, searchSimilarChunks } from "@/lib/embeddings";
import { answerRepoQuestion } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { repoUrl, question } = body;

        if (!repoUrl || typeof repoUrl !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid 'repoUrl' in request body." },
                { status: 400 }
            );
        }

        if (!question || typeof question !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid 'question' in request body." },
                { status: 400 }
            );
        }

        // Parse owner and repo from URL
        let owner: string, repo: string;
        try {
            ({ owner, repo } = parseRepoUrl(repoUrl));
        } catch (err) {
            return NextResponse.json(
                { error: err instanceof Error ? err.message : "Invalid repository URL." },
                { status: 400 }
            );
        }

        const repoIdentifier = `${owner}/${repo}`;

        // Embed the user's question
        let questionEmbedding: number[];
        try {
            questionEmbedding = await embedText(question);
        } catch (err) {
            return NextResponse.json(
                {
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to embed question.",
                },
                { status: 502 }
            );
        }

        // Search Supabase for similar code chunks
        let contextChunks;
        try {
            contextChunks = await searchSimilarChunks(repoIdentifier, questionEmbedding, 5);
        } catch (err) {
            return NextResponse.json(
                {
                    error:
                        err instanceof Error
                            ? err.message
                            : "Vector search failed.",
                },
                { status: 502 }
            );
        }

        if (contextChunks.length === 0) {
            return NextResponse.json(
                {
                    error:
                        "No indexed content found for this repository. Please analyze the repository first to build the vector index.",
                },
                { status: 404 }
            );
        }

        // Generate an answer from OpenAI using the retrieved context
        let answer: string;
        try {
            answer = await answerRepoQuestion(question, contextChunks);
        } catch (err) {
            return NextResponse.json(
                { error: err instanceof Error ? err.message : "AI chat failed." },
                { status: 502 }
            );
        }

        return NextResponse.json({ answer });
    } catch (err) {
        console.error("[/api/repo/chat] Unexpected error:", err);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
