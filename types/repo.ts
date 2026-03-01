// Core TypeScript types for the AI Codebase Explainer

export interface RepoAnalysis {
  overview: string;
  architecture: string;
  techStack: string[];
}

export interface FileNode {
  path: string;
  type: "blob" | "tree";
  size?: number;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree" | "commit";
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

export interface CodeChunk {
  repo: string;
  path: string;
  chunk: string;
  embedding?: number[];
}

export interface EmbeddingRow {
  id: string;
  repo: string;
  path: string;
  chunk: string;
  embedding: number[];
}

export interface SimilarChunk {
  path: string;
  chunk: string;
  similarity: number;
}

export interface ParsedRepo {
  owner: string;
  repo: string;
}
