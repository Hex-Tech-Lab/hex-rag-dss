import { Box } from '@mui/material';
import TriageSidebar from '@/components/organisms/dashboard/TriageSidebar';
import ChatCommandCenter from '@/components/organisms/dashboard/ChatCommandCenter';
import ComparisonPanel from '@/components/organisms/dashboard/ComparisonPanel';
import { scrapePRData } from '@/lib/github/scraper';

export const dynamic = 'force-dynamic';

/**
 * Three-Pane Intelligence Dashboard (Action UI-001)
 * Pane 1: Triage Feed (Findings)
 * Pane 2: Command Center (RAG Chat)
 * Pane 3: Intelligence Matrix (Comparisons)
 */
export default async function Home() {
  // 1. Scrape latest PR data for the Triage Feed
  let findings: any[] = [];
  try {
    // Audit the most recent PRs to populate the feed
    const auditPRs = [4, 3];
    for (const pr of auditPRs) {
      const data = await scrapePRData('Hex-Tech-Lab', 'hex-rag-dss', pr);
      findings = [...findings, ...data.findings];
    }
  } catch (error) {
    console.error('Failed to populate triage feed:', error);
    findings = [
      { bucket: 'Remaining Risks', message: 'GitHub connectivity status: OFFLINE. Showing cached/mock findings.', tool: 'System' },
      { bucket: 'Potential Blockers', message: 'Database RRF score column ambiguity resolved in migration #4.', tool: 'Audit' }
    ];
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', bgcolor: '#f4f6f8' }}>
      {/* Pane 1: Triage Feed (Left) */}
      <Box sx={{ width: '320px', flexShrink: 0, bgcolor: 'white', borderRight: '1px solid', borderColor: 'divider' }}>
        <TriageSidebar findings={findings} />
      </Box>

      {/* Pane 2: Command Center (Center) */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: '400px' }}>
        <ChatCommandCenter />
      </Box>

      {/* Pane 3: Intelligence Matrix (Right) */}
      <Box sx={{ width: '380px', flexShrink: 0, bgcolor: 'white', borderLeft: '1px solid', borderColor: 'divider' }}>
        <ComparisonPanel />
      </Box>
    </Box>
  );
}
