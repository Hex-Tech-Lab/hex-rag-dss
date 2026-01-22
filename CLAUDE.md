# Claude Code (CC) Agent Protocols

## 0. MANDATORY TOOL INITIALIZATION
**Before processing any request, you must execute the following checks:**

1.  **Memory Check:** Sync with project decisions via `Memory` MCP.
2.  **Architecture Check:** Use `Supabase` tool to verify DB Schema and extensions (e.g., `pgvector`) before proposing migrations.
3.  **Deployment Check:** Use `Vercel` tool to check deployment status and regional settings (e.g., `fra1`) before marking a task complete.
4.  **Context Verification:** Use `Context7` to verify cloud environment variables and secrets.

## CORE OPERATING PROTOCOLS
- STRICTLY use `pnpm dlx` for temporary CLI tools.
- ALWAYS query `Context7` before changing cloud configuration.
- DOCUMENT every infrastructure change in `docs/ARCHITECTURE_SOTA.md`.

## CONFLICT RESOLUTION PROTOCOL
- **Memory** is the single source of truth for *decisions*.
- **Git** is the single source of truth for *code*.
- **Supabase** is the single source of truth for *data*.
- **Conflict Rule:** IF Memory and Git conflict -> Git wins (Code is Reality).
