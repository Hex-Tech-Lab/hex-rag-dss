# Architectural Documentation: hex-rag-dss (SOTA)

## The Frankfurt Stack
The system is optimized for low latency and compliance within the EU region.
- **Compute**: Vercel deployed in the **FRA1** (Frankfurt) region.
- **Database**: Supabase provisioned in **eu-central-1** (Frankfurt).
- **Connectivity**: Utilizing the **Supabase IPv4 Pooler** (Transaction Mode) for stable serverless connections on port 6543.

## Agentic Search Layer
The core intelligence retrieval utilizes a multi-modal "Hybrid Search" strategy.
- **RPC**: `match_hybrid_search` – Fuses semantic vector similarity (pgvector) with Keyword-based Full-Text Search (FTS).
- **Fusion Algorithm**: Reciprocal Rank Fusion (RRF) with a standard constant `rrf_k = 60`.
- **Self-Correction Logic**: Implemented in `compare.ts`. If the hybrid yield is low (< 2 results), the system automatically retries by:
  1. Stripping common stopwords (vs, comparison, etc.).
  2. Lowering the similarity threshold from 0.4 to 0.3.
  3. Re-executing the query while maintaining original semantic intent.

## The Environment Variable Trap
A critical learning from the infrastructure setup:
- **Desync Risk**: Vercel's automated Supabase integration can desync environment variables if project references or regions change manually.
- **Manual Override**: The `POSTGRES_URL` and `DATABASE_URL` must be manually updated to point to the **pooler host** (e.g., `aws-1-eu-central-1.pooler.supabase.com`) rather than the direct database host to avoid connection exhaustion in serverless functions.
- **Production Keys**: Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are explicitly verified against the active Frankfurt project reference (`fmagztnfcfqpeqmwdsbu`).

## Security & Scoping
- **OAuth**: YouTube integration restricted to `youtube.readonly` to minimize permission footprint.
- **RLS**: Row-Level Security active on `decisions`, `sessions`, and `playlists` tables, enforcing `auth.uid() = user_id`.
