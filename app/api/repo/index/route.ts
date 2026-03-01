import { NextRequest, NextResponse } from "next/server";
import { parseRepoUrl, fetchRepoTree, fetchFileContent } from "@/lib/github";
import { filterRelevantFiles } from "@/lib/repoParser";
import { chunkCode } from "@/lib/chunker";
import { embedText, storeEmbedding } from "@/lib/embeddings";
import { getSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

// Allow up to 5 minutes — indexing can take a while for large repos
export const maxDuration = 300;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { repoUrl } = body;

        if (!repoUrl || typeof repoUrl !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid 'repoUrl' in request body." },
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

        // Delete any existing embeddings for this repo so re-indexing is clean
        const supabase = getSupabaseClient();
        const { error: deleteError } = await supabase
            .from("repo_embeddings")
            .delete()
            .eq("repo", repoIdentifier);

        if (deleteError) {
            console.warn(`[/api/repo/index] Could not clear old embeddings: ${deleteError.message}`);
        }

        // Fetch the full file tree (blobs only for filtering)
        let allFiles;
        try {
            allFiles = await fetchRepoTree(owner, repo);
        } catch (err) {
            return NextResponse.json(
                { error: err instanceof Error ? err.message : "Failed to fetch repository tree." },
                { status: 502 }
            );
        }

        // Filter to relevant source files
        const relevantFiles = filterRelevantFiles(allFiles);

        if (relevantFiles.length === 0) {
            return NextResponse.json(
                { error: "No analyzable source files found in this repository." },
                { status: 422 }
            );
        }

        // Process files sequentially to avoid rate-limiting OpenAI
        let totalChunks = 0;
        let processedFiles = 0;
        const errors: string[] = [];

        for (const file of relevantFiles) {
            try {
                const content = await fetchFileContent(owner, repo, file.path);
                if (!content || content.trim().length === 0) continue;

                const chunks = chunkCode(content, 1000);

                for (const chunk of chunks) {
                    try {
                        const embedding = await embedText(chunk);
                        await storeEmbedding(repoIdentifier, file.path, chunk, embedding);
                        totalChunks++;
                    } catch (embErr) {
                        errors.push(
                            `Embedding failed for ${file.path}: ${embErr instanceof Error ? embErr.message : String(embErr)}`
                        );
                    }
                }

                processedFiles++;
            } catch (fetchErr) {
                errors.push(
                    `Fetch failed for ${file.path}: ${fetchErr instanceof Error ? fetchErr.message : String(fetchErr)}`
                );
            }
        }

        return NextResponse.json({
            success: true,
            repo: repoIdentifier,
            processedFiles,
            totalChunks,
            skippedFiles: relevantFiles.length - processedFiles,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (err) {
        console.error("[/api/repo/index] Unexpected error:", err);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
