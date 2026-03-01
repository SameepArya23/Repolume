import { NextRequest, NextResponse } from "next/server";
import { parseRepoUrl, fetchRepoTree, fetchFileContent } from "@/lib/github";
import { filterRelevantFiles } from "@/lib/repoParser";
import { explainRepo } from "@/lib/ai";
import { getCached, setCached, repoCacheKey } from "@/lib/cache";
import type { RepoAnalysis } from "@/types/repo";

export const runtime = "nodejs";

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

        // Check 24-hour cache
        const cacheKey = repoCacheKey(owner, repo);
        const cached = getCached<RepoAnalysis>(cacheKey);
        if (cached) {
            return NextResponse.json(cached, {
                headers: { "X-Cache": "HIT" },
            });
        }

        // Fetch repo tree
        let allFiles;
        try {
            allFiles = await fetchRepoTree(owner, repo);
        } catch (err) {
            return NextResponse.json(
                { error: err instanceof Error ? err.message : "Failed to fetch repository tree." },
                { status: 502 }
            );
        }

        // Filter to relevant source files (≤50)
        const relevantFiles = filterRelevantFiles(allFiles);

        if (relevantFiles.length === 0) {
            return NextResponse.json(
                { error: "No analyzable source files found in this repository." },
                { status: 422 }
            );
        }

        // Fetch all file contents in parallel
        const fetchResults = await Promise.allSettled(
            relevantFiles.map(async (file) => {
                const content = await fetchFileContent(owner, repo, file.path);
                return { path: file.path, content };
            })
        );

        const filesContent: Record<string, string> = {};
        for (const result of fetchResults) {
            if (result.status === "fulfilled" && result.value.content) {
                filesContent[result.value.path] = result.value.content;
            }
        }

        if (Object.keys(filesContent).length === 0) {
            return NextResponse.json(
                { error: "Could not fetch content for any source files." },
                { status: 502 }
            );
        }

        // Generate AI explanation
        let analysis: RepoAnalysis;
        try {
            analysis = await explainRepo(filesContent);
        } catch (err) {
            return NextResponse.json(
                { error: err instanceof Error ? err.message : "AI analysis failed." },
                { status: 502 }
            );
        }

        // Cache the result for 24 hours
        setCached(cacheKey, analysis);

        return NextResponse.json(analysis, {
            headers: { "X-Cache": "MISS" },
        });
    } catch (err) {
        console.error("[/api/repo/analyze] Unexpected error:", err);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
