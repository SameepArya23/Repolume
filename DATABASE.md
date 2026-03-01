# Database Reference

## Overview

The application uses **Supabase** (PostgreSQL + pgvector) to store and search code embeddings for the RAG chat feature.

---

## Schema

### `repo_embeddings`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key, auto-generated |
| `repo` | `text` | Repository identifier (`owner/repo`) |
| `path` | `text` | File path within the repository |
| `chunk` | `text` | Raw code chunk (~1000 characters) |
| `embedding` | `vector(1536)` | OpenAI text-embedding-3-small output |

### Indexes

| Name | Type | Purpose |
|---|---|---|
| `repo_embeddings_embedding_idx` | IVFFlat cosine | Fast approximate nearest-neighbor search |
| `repo_embeddings_repo_idx` | B-tree | Fast filtering by repository before similarity search |

---

## How Embeddings Are Stored

1. After a repository is analyzed, each source file is split into ~1000-character chunks using `lib/chunker.ts`
2. Each chunk is embedded with OpenAI `text-embedding-3-small` (1536 dimensions)
3. The chunk + embedding are inserted into `repo_embeddings` via `storeEmbedding()` in `lib/embeddings.ts`

---

## How Similarity Search Works

When a user asks a question via `POST /api/repo/chat`:

1. The question is embedded using `text-embedding-3-small`
2. The `match_documents` Postgres function is called via Supabase RPC
3. It computes cosine similarity between the query and all stored embeddings **scoped to the same repo**
4. The top 5 most similar chunks are returned as context for GPT-4.1-mini

```sql
-- Called via supabase.rpc('match_documents', { ... })
select path, chunk, 1 - (embedding <=> query_embedding) as similarity
from repo_embeddings
where repo = match_repo
order by embedding <=> query_embedding
limit match_count;
```

---

## Running the Migration

### Via Supabase Dashboard
1. Go to **SQL Editor** in your Supabase project
2. Paste the contents of `supabase/migrations/001_repo_embeddings.sql`
3. Click **Run**

### Via Supabase CLI
```bash
npx supabase db push
```

---

## Resetting the Database

To clear all stored embeddings for a fresh start:

```sql
-- Delete all embeddings for a specific repo
delete from repo_embeddings where repo = 'owner/repo';

-- Delete all embeddings entirely
truncate table repo_embeddings;
```

To drop and recreate the table from scratch:

```sql
drop table if exists repo_embeddings;
drop function if exists match_documents;
```

Then re-run `001_repo_embeddings.sql`.
