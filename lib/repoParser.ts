import type { FileNode } from "@/types/repo";

const MAX_FILES = 50;

const EXCLUDED_DIRECTORIES = [
    "node_modules",
    "dist",
    "build",
    ".git",
    ".next",
    "coverage",
    "__pycache__",
    ".venv",
    "vendor",
];

const INCLUDED_EXTENSIONS = new Set([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".py",
    ".go",
]);

/**
 * Filter a flat file list to only relevant source files.
 *
 * Rules:
 *  - Exclude paths that contain any of the EXCLUDED_DIRECTORIES segments
 *  - Only keep files with INCLUDED_EXTENSIONS
 *  - Cap result at MAX_FILES (50)
 */
export function filterRelevantFiles(files: FileNode[]): FileNode[] {
    return files
        .filter((file) => {
            // Reject files inside excluded directories
            const segments = file.path.split("/");
            const inExcluded = segments.some((seg) =>
                EXCLUDED_DIRECTORIES.includes(seg)
            );
            if (inExcluded) return false;

            // Reject files without a supported extension
            const lastSegment = segments[segments.length - 1];
            const dotIndex = lastSegment.lastIndexOf(".");
            if (dotIndex === -1) return false;
            const ext = lastSegment.slice(dotIndex).toLowerCase();

            return INCLUDED_EXTENSIONS.has(ext);
        })
        .slice(0, MAX_FILES);
}
