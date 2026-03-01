import type { FileNode, GitHubTreeResponse, ParsedRepo } from "@/types/repo";

const GITHUB_API = "https://api.github.com";
const MAX_FILE_SIZE_BYTES = 200 * 1024; // 200 KB

function getAuthHeaders(): HeadersInit {
    const token = process.env.GITHUB_TOKEN;
    return {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

/**
 * Parse a GitHub URL into owner and repo name.
 * Accepts: https://github.com/owner/repo or https://github.com/owner/repo.git
 */
export function parseRepoUrl(url: string): ParsedRepo {
    try {
        const parsed = new URL(url.trim());

        if (parsed.hostname !== "github.com") {
            throw new Error("URL must be a GitHub repository URL.");
        }

        // pathname: /owner/repo or /owner/repo.git
        const parts = parsed.pathname.replace(/\.git$/, "").split("/").filter(Boolean);

        if (parts.length < 2) {
            throw new Error("Could not parse owner and repo from URL.");
        }

        return { owner: parts[0], repo: parts[1] };
    } catch (err) {
        if (err instanceof Error && err.message.includes("parse")) {
            throw new Error(`Invalid GitHub URL: ${url}`);
        }
        throw err;
    }
}

/**
 * Fetch the complete file tree for a repository.
 * Tries `main` first, then falls back to `master`.
 */
export async function fetchRepoTree(owner: string, repo: string): Promise<FileNode[]> {
    const branches = ["main", "master"];

    for (const branch of branches) {
        const url = `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
        const response = await fetch(url, { headers: getAuthHeaders() });

        if (response.status === 404) continue; // try next branch

        if (!response.ok) {
            const body = await response.text();
            throw new Error(`GitHub API error (${response.status}): ${body}`);
        }

        const data: GitHubTreeResponse = await response.json();
        return data.tree
            .filter((item) => item.type === "blob" || item.type === "tree")
            .map((item) => ({
                path: item.path,
                type: item.type as "blob" | "tree",
                size: item.size,
            }));
    }

    throw new Error(
        `Repository not found or has no main/master branch: ${owner}/${repo}`
    );
}

/**
 * Fetch the raw content of a single file.
 * Returns null if the file is larger than MAX_FILE_SIZE_BYTES or not found.
 */
export async function fetchFileContent(
    owner: string,
    repo: string,
    path: string
): Promise<string | null> {
    const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, { headers: getAuthHeaders() });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        const body = await response.text();
        throw new Error(
            `GitHub API error fetching ${path} (${response.status}): ${body}`
        );
    }

    const data = await response.json();

    // GitHub returns file content as base64-encoded string
    if (data.encoding === "base64" && typeof data.content === "string") {
        if (data.size > MAX_FILE_SIZE_BYTES) {
            console.warn(`Skipping ${path}: file too large (${data.size} bytes)`);
            return null;
        }
        return Buffer.from(data.content, "base64").toString("utf-8");
    }

    return null;
}
