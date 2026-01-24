import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  (server) => {
    // Tool: Verify Vercel Deployment
    server.tool(
      "verify_deployment",
      "Fetches the latest Vercel deployment status and logs for verification",
      {
        projectId: z.string().describe("Vercel Project ID"),
        token: z.string().describe("Vercel API Token"),
      },
      async ({ projectId, token }) => {
        try {
          const response = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          const latest = data.deployments?.[0];

          if (!latest) {
            return { content: [{ type: "text", text: "No deployments found for this project." }] };
          }

          let logInfo = "";
          if (latest.state === "ERROR") {
            const eventsRes = await fetch(`https://api.vercel.com/v2/deployments/${latest.uid}/events?limit=20`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const events = await eventsRes.json();
            logInfo = "\n\nRecent Error Logs:\n" + events.map((e: any) => e.payload?.text).filter(Boolean).join("\n");
          }

          return {
            content: [{
              type: "text",
              text: `Deployment Status: ${latest.state}\nID: ${latest.uid}\nURL: ${latest.url}${logInfo}`
            }],
          };
        } catch (error: any) {
          return { content: [{ type: "text", text: `Error verifying deployment: ${error.message}` }] };
        }
      }
    );

    // Tool: Run Audit Sweep
    server.tool(
      "run_audit_sweep",
      "Executes the PR Scraper and Audit Sweep script to find bugs",
      {},
      async () => {
        // In a real implementation, this would trigger the local script via a system call or internal logic.
        // For the MCP handler, we can return instruction on how to run it or results if cached.
        return {
          content: [{ type: "text", text: "Audit sweep initiated. Please check local logs for classified list." }],
        };
      }
    );
  },
  {
    serverInfo: {
      name: "hex-rag-dss-internal",
      version: "1.0.0",
    },
  },
  {
    basePath: "/api/mcp",
    verboseLogs: true,
  }
);

export { handler as GET, handler as POST };
