# hex-rag-dss Handover Summary

## Session Context
- **Date**: January 21, 2026
- **Started In**: hex-test-drive-man (incorrect folder)
- **Target Project**: hex-rag-dss (greenfield RAG-Powered Decision Support System)
- **Goal**: Transfer session and continue in correct directory
- **Mode**: Switched from plan to build (file changes and commands permitted)

## Project Overview
- **Name**: hex-rag-dss
- **Vision**: RAG-powered Decision Support System nucleus for SecondBrain
- **Immediate Goal**: 48h MVP to decide methodology (Freedom System vs OpenSpec) using MCP + AI/SaaS YouTube playlists
- **Value Props**: Extracted intelligence, knowledge gaps, timestamped decisions, provenance
- **Tech Stack**: Next.js 15, React 19, TypeScript strict, MUI 6.4.3 (no Tailwind), Supabase pgvector, OpenRouter embeddings
- **Infrastructure**: Free tier (Supabase #2, Vercel Hobby, OpenRouter pay-per-use, Brave Search 2K/mo)
- **Key Features**: YouTube OAuth, playlist sync, 16-section intelligence extraction, RAG search, decision recording, gap detection

## Database Schema (Key Tables)
- playlists, videos, video_playlists
- video_intelligence (16-section output)
- entities, entity_mentions, entity_relationships
- embeddings (1024 dims, ivfflat index)
- sessions, session_messages, decisions (active decisions surface first)

## User Stories (MVP 0.0 Priority)
- US-001: YouTube OAuth + playlist discovery
- US-002: Selective sync with date ranges
- US-003: Real-time progress visualization
- US-004: Transcript extraction (YouTube captions + AssemblyAI fallback)
- US-005: 16-section intelligence extraction
- US-006: RAG-powered queries ("What do you want to know today?")
- US-007: Comparison matrices for alternatives
- US-008: Explicit gap detection + search suggestions
- US-009: Decision recording as "new truths"
- US-010: Chat interface with sources

## MCP Server Configuration
- **File**: ~/.config/opencode/opencode.json (created successfully)
- **Servers Configured**: github, git, supabase, context7, sentry, filesystem, sequentialthinking, memory, playwright, codegen, vercel, testsprite, brave-search
- **Purpose**: Autonomous environment interaction for GitHub, Supabase, docs, search, deploy
- **Status**: File written; /mcp command requires session restart to activate

## Step-by-Step Plan (Current Status)
1. **MCP Config**: ✅ Completed (file created)
2. **GitHub Repo Creation**: Pending - Use github MCP to create public hex-rag-dss repo
3. **Project Initialization**: Pending - Clone repo, init Next.js 15 + MUI 6.4.3 + MUI X
4. **Supabase/Vercel Setup**: Pending - Create projects, link via MCP
5. **Database Migrations**: Pending - Run schema from PRD
6. **Core Features**: Pending - YouTube OAuth, processing pipeline
7. **UI/RAG**: Pending - Screens, vector search, decisions
8. **Review Tools**: Pending - Enable CodeRabbit, Sourcery, Snyk, Sentry for public repo
9. **Testing**: Pending - End-to-end with sample data

## Instructions Draft (Final Version)
- **Identity**: OC (GKF1), 0.1% expert full-stack architect
- **Core Rules**: Challenge illogical paths, ask ≤1 question if <95% confident
- **Communication**: TOC sections + bullets (7-15 words), direct, expert assumptions
- **Quality**: Verify 10x → Plan 10x → Execute 1x, flag off-track work
- **Git**: Fetch/checkout/pull main, branch per feature, PR + audit
- **Tech**: pnpm/MUI/Supabase/TypeScript strict, GitHub source of truth
- **Workflow**: Session ends with branch/commit/push/PR; review tools auto-run
- **Docs**: Update PERFORMANCE_LOG.md + agent MD post-work

## MUI Strategy
- **Source**: MUI Treasury for layouts/patterns, MUI X (MIT) for data tables/dates
- **Structure**: Atomic design (atoms/molecules/organisms)
- **Theme**: Single source in theme.ts
- **Docs**: Enable context7 MCP for MUI 6.4.3 docs
- **Init Command**: /init --prd "US-001 + Database Schema; install @mui/material etc."

## Review Tools Integration
- **Tools**: CodeRabbit, Sourcery, Snyk, Sentry (auto-run on PRs)
- **Setup**: Configure for public repo (free tier)
- **Workflow**: PR triggers reviews, apply fixes in loops
- **Loop**: Code → Review → Fix → PR → Audit → Merge → Next

## Critical Resolutions
- **Exclusive Focus**: Work solely on hex-rag-dss; grab PR scraper from hex-test-drive-man later via GitHub
- **Repo Visibility**: Public for free review tools
- **MCP Priority**: Use servers for autonomous interaction; fallback to CLI/API
- **Supabase**: Use REST API (SQL not direct initially)
- **Bootstrapping**: Zero dollars; free tiers only

## Session Transfer Instructions
1. **Navigate to Correct Directory**: cd /home/kellyb_dev/projects/hex-rag-dss
2. **Restart OpenCode Session**: Run opencode in hex-rag-dss folder
3. **Resume with Summary**: Paste this summary as initial context
4. **Verify MCP**: Run /mcp to confirm tools loaded
5. **Continue Plan**: Proceed from Step 2 (GitHub repo creation)

## Next Immediate Actions
- Transfer to hex-rag-dss directory
- Restart session
- Confirm MCP tools via /mcp
- Create public GitHub repo using github MCP
- Clone and initialize Next.js project

**End of Handover Summary - Ready for Transfer**