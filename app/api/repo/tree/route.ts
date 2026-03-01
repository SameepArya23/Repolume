import { NextRequest, NextResponse } from "next/server";
import { parseRepoUrl, fetchRepoTree } from "@/lib/github";
import type { FileNode } from "@/types/repo";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const repoUrl = searchParams.get("repoUrl");

        if (!repoUrl) {
            return NextResponse.json(
                { error: "Missing 'repoUrl' query parameter." },
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

        // Fetch the full file tree
        let tree: FileNode[];
        try {
            tree = await fetchRepoTree(owner, repo);
        } catch (err) {
            return NextResponse.json(
                {
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to fetch repository tree.",
                },
                { status: 502 }
            );
        }

        return NextResponse.json({
            owner,
            repo,
            totalFiles: tree.length,
            tree,
        });
    } catch (err) {
        console.error("[/api/repo/tree] Unexpected error:", err);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
