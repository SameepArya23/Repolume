import OpenAI from "openai";
import { getSupabaseClient } from "./supabase";
import type { SimilarChunk } from "@/types/repo";

const EMBEDDING_MODEL = "text-embedding-3-small";

let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
    if (openaiInstance) return openaiInstance;
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("Missing OPENAI_API_KEY environment variable.");
    }
    openaiInstance = new OpenAI({ apiKey });
    return openaiInstance;
}

/**
 * Embed a text string using OpenAI text-embedding-3-small.
 * Returns a floating-point vector.
 */
export async function embedText(text: string): Promise<number[]> {
    const openai = getOpenAI();
    const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: text.slice(0, 8000), // Guard against token limits
    });
    return response.data[0].embedding;
}

/**
 * Store a single code chunk and its embedding in the Supabase repo_embeddings table.
 */
export async function storeEmbedding(
    repo: string,
    path: string,
    chunk: string,
    embedding: number[]
): Promise<void> {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("repo_embeddings").insert({
        repo,
        path,
        chunk,
        embedding,
    });

    if (error) {
        throw new Error(`Failed to store embedding for ${path}: ${error.message}`);
    }
}

/**
 * Search for code chunks similar to a query embedding, scoped to a specific repo.
 * Uses the `match_documents` Postgres RPC function.
 */
export async function searchSimilarChunks(
    repo: string,
    queryEmbedding: number[],
    limit = 5
): Promise<SimilarChunk[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.rpc("match_documents", {
        query_embedding: queryEmbedding,
        match_repo: repo,
        match_count: limit,
    });

    if (error) {
        throw new Error(`Vector search failed: ${error.message}`);
    }

    return (data ?? []) as SimilarChunk[];
}
