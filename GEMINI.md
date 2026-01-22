# hex-rag-dss Context

## Project Overview
**hex-rag-dss** is a RAG-powered Decision Support System (DSS) designed to transform YouTube content into actionable intelligence. It serves as a "SecondBrain Nucleus," enabling users to extract insights from video playlists, identify knowledge gaps, and record timestamped decisions ("new truths").

The immediate goal is to help decide development methodologies (e.g., Freedom System vs. OpenSpec) by processing relevant YouTube content.

## Tech Stack
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript 5.x (Strict Mode)
*   **UI Library:** Material UI (MUI) v6.4.3
*   **Database:** Supabase (PostgreSQL + pgvector)
*   **Auth:** Supabase Auth (likely via YouTube/Google OAuth integration)
*   **AI/RAG:** OpenRouter (LLM), pgvector (Embeddings), `text-embedding-3-large`
*   **External APIs:** YouTube Data API (metadata, captions), Brave Search (grounding)
*   **Package Manager:** pnpm (Monorepo structure)

## Architecture
The project follows a monorepo structure:
*   **`apps/web`**: The main Next.js application.
    *   `src/app`: Next.js App Router pages and layouts.
    *   `src/components`: UI components (Atomic design: atoms, molecules, organisms).
    *   `src/lib`: Core business logic and integrations.
        *   `youtube/`: OAuth, playlist discovery, transcript extraction.
        *   `intelligence/`: LLM prompting and extraction logic.
        *   `rag/`: Vector search, embeddings, and store logic.
        *   `decisions/`: Logic for recording "new truths".
*   **`packages/shared`**: Shared code (if any).
*   **`docs/`**: Project documentation, including the PRD (`hex-rag-dss-prd-v1_0.md`) and Freedom System artifacts.

## Key Development Workflows

### 1. Building and Running
*   **Dev Server:** `pnpm dev` (runs `next dev` in `apps/web`)
*   **Build:** `pnpm build` (runs `next build` in `apps/web`)
*   **Lint:** `pnpm lint`

### 2. Database Management
*   Schema is managed via Supabase migrations in `apps/web/supabase/migrations`.
*   **Key Tables:** `playlists`, `videos`, `video_intelligence`, `embeddings`, `decisions`, `entities`.

### 3. "Freedom System" Methodology
The project aims to follow a structured development workflow inspired by the "Freedom System":
1.  **User Stories:** defined in `docs/user-stories.md` (derived from `docs/project-description.md` or PRD).
2.  **Schema:** defined in `docs/database-schema.md` (derived from stories).
3.  **Phases:** defined in `docs/project-phases.md`.
*   *Note: Always check `docs/` for the latest "truth" before starting major features.*

## Critical Files
*   `docs/hex-rag-dss-prd-v1_0.md`: **The Project Bible.** Contains the full spec, schema, and prompt strategies.
*   `apps/web/src/lib/intelligence/extract.ts`: Core logic for the 16-section video intelligence extraction.
*   `apps/web/src/lib/rag/search.ts`: Vector search implementation.
*   `apps/web/src/app/page.tsx`: Main entry point ("What do you want to know today?").

## Guidelines for AI Agents
*   **Strict Typing:** Always use TypeScript interfaces. Check `apps/web/src/types` (or infer from usage) for shared types.
*   **MUI Components:** Prefer MUI components (`@mui/material`) over raw HTML/CSS.
*   **Server Actions:** Use Next.js Server Actions for backend mutations and data fetching where appropriate.
*   **Supabase Client:** Use the singleton instance from `apps/web/src/lib/supabase.ts`.
*   **No Assumptions:** Verify library versions (MUI v6, Next.js 15) before suggesting deprecated APIs.
