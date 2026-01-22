# Architecture Gap Analysis (MVP 0.0)

**Reference Blueprint**: `SKILL.md` (Deferred)
**Current Status**: MVP 0.0 Baseline Deployed to Frankfurt (FRA1).

## System Alignment

| Feature Category | Freedom System Status | Blueprint Alignment | Notes |
| :--- | :--- | :--- | :--- |
| **Data Layer** | Supabase (PostgreSQL + pgvector) | High | Native vector support enabled. |
| **Intelligence** | OpenRouter (LLM) + 16-Section Prompt | High | Structured extraction logic in place. |
| **Search** | RAG (match_embeddings RPC) | Medium | Threshold and count logic implemented. |
| **Integrations** | YouTube, GitHub, Sonar, Sentry | High | Multi-tool ecosystem via MCPs. |
| **Deployment** | Vercel (Edge/Serverless) | High | Regional alignment to FRA1 complete. |

## Identified Gaps (Pre-Audit)
1. **Dynamic Re-ranking**: Current RAG relies on pure cosine similarity; blueprint may suggest cross-encoders.
2. **Context Window Management**: Scraper and Comparison modules need explicit token counting for high-PR volumes.
3. **Hybrid Search**: Potential move to Keyword (FTS) + Vector hybrid search for better recall.

## Roadmap
- [ ] Upload and ingest `SKILL.md` for full comparison.
- [ ] Implement "Decision Recording" persistence in FRA1.
- [ ] Refactor Scraper to use Snyk/Sonar MCPs for automated tagging.
