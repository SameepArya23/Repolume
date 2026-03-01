# AI Codebase Explainer

An AI-powered backend that analyzes GitHub repositories and explains their architecture, purpose, and code — using **OpenAI GPT-4.1-mini** and **Supabase vector search**.

Built with **Next.js 16 App Router**, **TypeScript**, and the **Node runtime**.

---

## Architecture

```
app/api/
├── repo/
│   ├── analyze/route.ts  ← POST: Full repo AI analysis
│   ├── tree/route.ts     ← GET:  File tree
│   └── chat/route.ts     ← POST: RAG chat
└── file/
    └── explain/route.ts  ← POST: Single file explanation

lib/
├── github.ts       ← GitHub API utilities
├── ai.ts           ← OpenAI GPT-4.1-mini integration
├── repoParser.ts   ← File filtering logic
├── chunker.ts      ← Code chunking for embeddings
├── embeddings.ts   ← text-embedding-3-small + Supabase vector ops
├── supabase.ts     ← Supabase client singleton
└── cache.ts        ← 24-hour in-memory cache

types/
└── repo.ts         ← Shared TypeScript interfaces

supabase/
└── migrations/
    └── 001_repo_embeddings.sql ← DB schema + RPC function
```

---

## API Endpoints

### `POST /api/repo/analyze`
Analyzes a GitHub repository and returns an AI-generated explanation.

**Request:**
```json
{ "repoUrl": "https://github.com/vercel/next.js" }
```
**Response:**
```json
{
  "overview": "...",
  "architecture": "...",
  "techStack": ["Next.js", "TypeScript", "React"]
}
```

---

### `GET /api/repo/tree`
Returns the repository's file tree.

**Request:** `GET /api/repo/tree?repoUrl=https://github.com/vercel/next.js`

**Response:**
```json
{
  "owner": "vercel",
  "repo": "next.js",
  "totalFiles": 342,
  "tree": [{ "path": "README.md", "type": "blob" }]
}
```

---

### `POST /api/file/explain`
Explains a specific file in a repository.

**Request:**
```json
{ "repoUrl": "https://github.com/vercel/next.js", "path": "packages/next/src/server/app-render/app-render.tsx" }
```
**Response:**
```json
{ "summary": "This file is responsible for..." }
```

---

### `POST /api/repo/chat`
Chat with a repository using Retrieval-Augmented Generation (RAG).

> ⚠️ Requires the repository to be indexed in Supabase first.

**Request:**
```json
{ "repoUrl": "https://github.com/vercel/next.js", "question": "How does middleware work?" }
```
**Response:**
```json
{ "answer": "Based on the codebase, middleware is handled by..." }
```

---

## Performance Features

- **Parallel file fetching** via `Promise.all`
- **File filtering**: excludes `node_modules`, `dist`, `build`, `.git`
- **Extension whitelist**: `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`
- **Size limit**: files > 200 KB are skipped
- **File cap**: max 50 files analyzed
- **Code chunking**: ~1000 char chunks for embedding
- **24-hour cache**: repo analysis cached in memory

---

## Setup

See [SETUP.md](./SETUP.md) for full instructions.

```bash
npm install
cp .env.local.example .env.local
# Fill in your .env.local, then:
npm run dev
```
