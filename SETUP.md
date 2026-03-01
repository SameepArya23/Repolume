# Setup Guide

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with pgvector enabled
- An [OpenAI](https://platform.openai.com) API key
- A [GitHub](https://github.com/settings/tokens) Personal Access Token

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and set each value:

```env
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=ghp_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

| Variable | Where to get it |
|---|---|
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `GITHUB_TOKEN` | [github.com/settings/tokens](https://github.com/settings/tokens) — needs `repo:read` scope |
| `SUPABASE_URL` | Settings → API in your Supabase dashboard |
| `SUPABASE_ANON_KEY` | Settings → API → `anon public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → `service_role` (keep secret!) |

---

## 3. Connect Supabase & Run Migrations

### Option A — Supabase Dashboard (easiest)
1. Open your Supabase project
2. Go to **SQL Editor**
3. Paste and run the contents of `supabase/migrations/001_repo_embeddings.sql`

### Option B — Supabase CLI
```bash
npx supabase db push
```

---

## 4. Start the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

---

## 5. Verify Setup

Test the tree endpoint with a public repo:

```bash
curl "http://localhost:3000/api/repo/tree?repoUrl=https://github.com/vercel/next.js"
```

You should get a JSON response with the file tree.

---

## Notes

- The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security and is only used server-side in API routes. Never expose it to the browser.
- The GitHub token increases API rate limits from 60 to 5000 requests/hour. It's optional but highly recommended.
- Analysis results are cached in memory for 24 hours per repository. Restart the dev server to clear the cache.
