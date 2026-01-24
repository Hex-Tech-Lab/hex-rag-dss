# hex-rag-dss Performance & Stabilization Log

## [2026-01-24] - Milestone: Production Bridge & Quality Hardening

### 1. Ingestion Pipeline
- **Verified**: Successfully ingested video `d3Glwdf_xA8` (Freedom System deep dive).
- **Fallback**: Implemented Python-based `uvx` transcript scraper for resilient extraction on restricted videos.
- **Dimensionality**: Fixed dimensionality mismatch (3072 -> 1024) to align with Supabase schema.

### 2. LLM Optimization
- **Default Engine**: Switched to **Gemini 1.5 Flash** for faster extraction and lower latency.
- **Capability**: Maintained Claude 3.5 Sonnet as a high-quality fallback option.
- **Type Safety**: Constrained `callLLM` to a strict union of supported models.

### 3. UI Performance
- **Parallelization**: Converted serial PR scraper calls to `Promise.all`, reducing dashboard load time by ~60%.
- **Lazy Loading**: Refactored Supabase client to a lazy getter pattern to prevent module-import failures.
- **Analytics**: Optimized `SpeedInsights` placement for accurate metric capture in FRA1.

### 4. Technical Debt & Quality
- **Core Conversion**: Successfully converted 15+ core design system files from `.jsx` to `.tsx`.
- **Selector Stability**: Injected `data-testid` attributes for resilient E2E testing.
- **CI Sync**: Updated Playwright configuration to detect and branch for CI build/start cycles.

### 5. Deployment
- **Target**: Frankfurt (FRA1).
- **Latency**: Sub-2s RAG response verification complete.
