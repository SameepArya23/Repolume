import OpenAI from "openai";
import type { RepoAnalysis, SimilarChunk } from "@/types/repo";

const CHAT_MODEL = "gpt-4.1-mini";

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
 * Given a map of file paths to their content, ask OpenAI to produce a
 * comprehensive architectural explanation of the repository.
 */
export async function explainRepo(
    filesContent: Record<string, string>
): Promise<RepoAnalysis> {
    const openai = getOpenAI();

    const filesSummary = Object.entries(filesContent)
        .map(([path, content]) => `### ${path}\n\`\`\`\n${content.slice(0, 1500)}\n\`\`\``)
        .join("\n\n");

    const prompt = `You are a senior software architect reviewing a codebase.

Below are the source files from a repository. Analyze them carefully and provide a structured explanation.

${filesSummary}

Respond with valid JSON in exactly this format (no markdown wrapping, pure JSON):
{
  "overview": "<2-3 sentence description of the project purpose and what it does>",
  "architecture": "<3-5 sentence explanation of the code architecture, patterns used, how components interact>",
  "techStack": ["<technology 1>", "<technology 2>", "..."]
}`;

    const response = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content ?? "{}";

    try {
        const parsed = JSON.parse(raw);
        return {
            overview: parsed.overview ?? "",
            architecture: parsed.architecture ?? "",
            techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
        };
    } catch {
        throw new Error("Failed to parse AI response as JSON.");
    }
}

/**
 * Ask OpenAI to summarize a single file.
 */
export async function explainFile(
    path: string,
    content: string
): Promise<{ summary: string }> {
    const openai = getOpenAI();

    const prompt = `You are a senior software engineer. Explain the following file concisely.

File: ${path}

\`\`\`
${content.slice(0, 6000)}
\`\`\`

Respond with valid JSON in exactly this format (no markdown wrapping, pure JSON):
{
  "summary": "<A clear, concise explanation of what this file does, its purpose, exports, and any key patterns used. 3-6 sentences.>"
}`;

    const response = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content ?? "{}";

    try {
        const parsed = JSON.parse(raw);
        return { summary: parsed.summary ?? "" };
    } catch {
        throw new Error("Failed to parse AI file explanation as JSON.");
    }
}

/**
 * Answer a question about a repository given relevant code chunks as context.
 */
export async function answerRepoQuestion(
    question: string,
    contextChunks: SimilarChunk[]
): Promise<string> {
    const openai = getOpenAI();

    const context = contextChunks
        .map((c, i) => `### Chunk ${i + 1} — ${c.path}\n\`\`\`\n${c.chunk}\n\`\`\``)
        .join("\n\n");

    const prompt = `You are a senior software engineer. A developer is asking a question about a codebase.

Use the following relevant code snippets as context to answer accurately.

${context}

Question: ${question}

Respond with valid JSON in exactly this format (no markdown wrapping, pure JSON):
{
  "answer": "<A clear, helpful answer based on the code context above. Be specific and reference the relevant files/code when applicable.>"
}`;

    const response = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content ?? "{}";

    try {
        const parsed = JSON.parse(raw);
        return parsed.answer ?? "";
    } catch {
        throw new Error("Failed to parse AI chat response as JSON.");
    }
}
