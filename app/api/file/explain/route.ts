import { NextRequest, NextResponse } from "next/server";
import { parseRepoUrl, fetchFileContent } from "@/lib/github";
import { explainFile } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { repoUrl, path } = body;

        if (!repoUrl || typeof repoUrl !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid 'repoUrl' in request body." },
                { status: 400 }
            );
        }

        if (!path || typeof path !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid 'path' in request body." },
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

        // Fetch file content from GitHub
        let content: string | null;
        try {
            content = await fetchFileContent(owner, repo, path);
        } catch (err) {
            return NextResponse.json(
                {
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to fetch file from GitHub.",
                },
                { status: 502 }
            );
        }

        if (content === null) {
            return NextResponse.json(
                { error: `File not found or too large to analyze: ${path}` },
                { status: 404 }
            );
        }

        // Generate AI explanation for the file
        let result: { summary: string };
        try {
            result = await explainFile(path, content);
        } catch (err) {
            return NextResponse.json(
                { error: err instanceof Error ? err.message : "AI explanation failed." },
                { status: 502 }
            );
        }

        return NextResponse.json(result);
    } catch (err) {
        console.error("[/api/file/explain] Unexpected error:", err);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
