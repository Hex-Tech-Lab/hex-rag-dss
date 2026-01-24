# User Instructions

## SECTION 0: MANDATORY CORE PROTOCOLS

1. **Checklist & To-Do Workflow:**
   - BEFORE executing any task, you MUST generate a **Task To-Do List**.
   - DURING execution, you MUST maintain a **Checklist** and check off items as they are verified.
   - VERIFY 10x: Never report success until you have verified the outcome via the appropriate MCP tool (e.g., Playwright for UI, Vercel for builds).

2. **MCP Tool Priority:**
   - ALWAYS use specialized MCP tools FIRST (e.g., `sourcerer` for global searches, `context7` for docs).
   - FALLBACK: Only use general shell commands (e.g., `grep`, `curl`) if the primary MCP tool fails.

3. **Memory Synchronization:**
   - Read `@modelcontextprotocol/server-memory` at the start of EVERY turn to ensure cross-agent alignment.
   - Update memory with "new truths" before ending the turn.

## 0. MANDATORY TOOL INITIALIZATION
**Before processing ANY user request, you must execute the following checks:**
1.  **Memory Check:** Read `@modelcontextprotocol/server-memory`. Sync with the shared project brain.
2.  **Context Verification:** Use `Context7` to verify environment variables (do not hallucinate API keys).
3.  **Code Insight:** If touching code, run `CodeRabbit` FIRST to understand the repo state.
4.  **Debug Mode:** If the user mentions "error" or "crash," query `Sentry` and `Vercel` logs immediately.

## CORE OPERATING PROTOCOLS (NON-NEGOTIABLE)

1. **MCP First & Always:**
   - **Context7:** MUST use `context7_query` for EVERY technical lookup (libraries, docs, errors). Never guess.
   - **Memory:** MUST use `memory_read` at the start of every task and `memory_write` to save state at the end.
   - **Sequential Thinking:** MUST use `sequentialthinking` for every complex request to plan steps before acting.

2. **5-Point Confirmation:**
   - Every final response must use the 5-Point Protocol: 5 bullet points, 7-15 words each, summarizing status and next steps.

3. **Tool Health Check:**
   - At the start of every session, run a silent check. If an MCP fails (e.g., CodeGen), acknowledge it and proceed with alternatives; do not loop.

4. **Package Management:**
   - STRICTLY use `pnpm` for project dependencies.
   - STRICTLY use `pnpm dlx` (Node) or `uvx` (Python) for temporary tools. NEVER use `npx`.

CONFIRM: "Protocols Updated: Context7/Memory/Sequential mandatory. PNPM enforced. 5-Point Protocol active."

## MCP PROTOCOL: DOCUMENTATION FIRST
- NEVER guess about integration syntax.
- ALWAYS use the 'context7' tool to query documentation for Sentry, Sonar, Next.js, or any other library BEFORE writing config files.
- Example: 'context7_query(query='how to configure snyk mcp')' before installing Snyk.

## CONFLICT RESOLUTION PROTOCOL
- **Memory** is the single source of truth for *decisions*.
- **Git** is the single source of truth for *code*.
- **Supabase** is the single source of truth for *data*.
- **Conflict Rule:** IF Memory and Git conflict -> Git wins (Code is Reality).

## AGENT SUPPORT
- **AGENTS.md** is the primary protocol for **Gemini (GC)**, **OpenCode (OC)**, and other general agents.
- **CLAUDE.md** contains specialized protocols for **Claude Code (CC)**.

