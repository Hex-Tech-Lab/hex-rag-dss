# User Instructions

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

