-- ============================================================
-- 001_repo_embeddings.sql
-- Supabase migration for the AI Codebase Explainer
-- ============================================================

-- Enable the pgvector extension (must be enabled once per project)
create extension if not exists vector;

-- ============================================================
-- Table: repo_embeddings
-- Stores chunked code and their vector embeddings per repository
-- ============================================================
create table if not exists repo_embeddings (
  id          uuid primary key default gen_random_uuid(),
  repo        text not null,       -- e.g. "owner/repo"
  path        text not null,       -- e.g. "src/lib/utils.ts"
  chunk       text not null,       -- raw code chunk (~1000 chars)
  embedding   vector(1536) not null -- text-embedding-3-small dimension
);

-- Index for fast cosine similarity search scoped to a repo
create index if not exists repo_embeddings_embedding_idx
  on repo_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Index for efficient filtering by repo before similarity search
create index if not exists repo_embeddings_repo_idx
  on repo_embeddings (repo);

-- ============================================================
-- RPC Function: match_documents
-- Performs cosine similarity search scoped to a specific repo
-- ============================================================
create or replace function match_documents (
  query_embedding  vector(1536),
  match_repo       text,
  match_count      int default 5
)
returns table (
  path        text,
  chunk       text,
  similarity  float
)
language sql stable
as $$
  select
    repo_embeddings.path,
    repo_embeddings.chunk,
    1 - (repo_embeddings.embedding <=> query_embedding) as similarity
  from repo_embeddings
  where repo_embeddings.repo = match_repo
  order by repo_embeddings.embedding <=> query_embedding
  limit match_count;
$$;
