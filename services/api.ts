import axios from "axios";
import type { RepoAnalysis, FileNode } from "@/types/repo";

const http = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
    timeout: 120_000, // AI analysis can take time
});

// ── Helper: extract error message ──────────────────────────────────────────
function extractError(err: unknown): string {
    if (axios.isAxiosError(err)) {
        return err.response?.data?.error ?? err.message;
    }
    if (err instanceof Error) return err.message;
    return "An unexpected error occurred.";
}

// ── API Functions ───────────────────────────────────────────────────────────

/** POST /api/repo/analyze — trigger full AI analysis of a repo */
export async function analyzeRepo(repoUrl: string): Promise<RepoAnalysis> {
    try {
        const { data } = await http.post<RepoAnalysis>("/repo/analyze", { repoUrl });
        return data;
    } catch (err) {
        throw new Error(extractError(err));
    }
}

export interface RepoTreeResponse {
    owner: string;
    repo: string;
    totalFiles: number;
    tree: FileNode[];
}

/** GET /api/repo/tree?repoUrl=... — fetch file tree */
export async function getRepoTree(repoUrl: string): Promise<RepoTreeResponse> {
    try {
        const { data } = await http.get<RepoTreeResponse>("/repo/tree", {
            params: { repoUrl },
        });
        return data;
    } catch (err) {
        throw new Error(extractError(err));
    }
}

export interface FileExplanation {
    summary: string;
}

/** POST /api/file/explain — get AI explanation of a specific file */
export async function explainFile(
    repoUrl: string,
    path: string
): Promise<FileExplanation> {
    try {
        const { data } = await http.post<FileExplanation>("/file/explain", {
            repoUrl,
            path,
        });
        return data;
    } catch (err) {
        throw new Error(extractError(err));
    }
}

export interface ChatResponse {
    answer: string;
}

/** POST /api/repo/chat — send a question about the repo */
export async function chatWithRepo(
    repoUrl: string,
    question: string
): Promise<ChatResponse> {
    try {
        const { data } = await http.post<ChatResponse>("/repo/chat", {
            repoUrl,
            question,
        });
        return data;
    } catch (err) {
        throw new Error(extractError(err));
    }
}

// ── URL encoding helpers (repoUrl ↔ repoId in route) ───────────────────────
// Uses browser-native btoa/atob — avoids Buffer polyfill "base64url" limitation.

export function encodeRepoId(repoUrl: string): string {
    // btoa encodes to standard base64; swap chars to make it URL-safe
    return btoa(unescape(encodeURIComponent(repoUrl)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export function decodeRepoId(repoId: string): string {
    // Reverse URL-safe swaps, restore padding, then decode
    const base64 = repoId.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "==".slice(0, (4 - (base64.length % 4)) % 4);
    return decodeURIComponent(escape(atob(padded)));
}
