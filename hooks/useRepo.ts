import { useQuery, useMutation } from "@tanstack/react-query";
import { analyzeRepo, getRepoTree, explainFile } from "@/services/api";

/** Trigger a full AI analysis of a repository */
export function useAnalyzeRepo() {
    return useMutation({
        mutationFn: (repoUrl: string) => analyzeRepo(repoUrl),
    });
}

/** Fetch the file tree for a repository */
export function useRepoTree(repoUrl: string | null) {
    return useQuery({
        queryKey: ["repo-tree", repoUrl],
        queryFn: () => getRepoTree(repoUrl!),
        enabled: !!repoUrl,
        staleTime: 5 * 60 * 1000,
    });
}

/** Fetch (and cache) the AI analysis result for a repository */
export function useRepoAnalysis(repoUrl: string | null) {
    return useQuery({
        queryKey: ["repo-analysis", repoUrl],
        queryFn: () => analyzeRepo(repoUrl!),
        enabled: !!repoUrl,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 1,
    });
}

/** Fetch AI explanation for a specific file */
export function useExplainFile(repoUrl: string | null, path: string | null) {
    return useQuery({
        queryKey: ["file-explain", repoUrl, path],
        queryFn: () => explainFile(repoUrl!, path!),
        enabled: !!repoUrl && !!path,
        staleTime: 15 * 60 * 1000,
    });
}
