/**
 * Split a code string into chunks of approximately `size` characters.
 *
 * We attempt to split on newlines to avoid cutting mid-line.
 * Each chunk will be at most `size` characters long.
 */
export function chunkCode(code: string, size = 1000): string[] {
    if (!code || code.trim().length === 0) return [];

    const chunks: string[] = [];
    const lines = code.split("\n");

    let currentChunk = "";

    for (const line of lines) {
        const lineWithNewline = line + "\n";

        if (currentChunk.length + lineWithNewline.length > size) {
            if (currentChunk.trim().length > 0) {
                chunks.push(currentChunk.trimEnd());
            }
            currentChunk = lineWithNewline;
        } else {
            currentChunk += lineWithNewline;
        }
    }

    // Push the last remaining chunk
    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trimEnd());
    }

    return chunks;
}
