import { Box, Stack } from '@mui/material';
import TriageSidebar from '@/components/organisms/dashboard/TriageSidebar';
import ChatCommandCenter from '@/components/organisms/dashboard/ChatCommandCenter';
import ComparisonPanel from '@/components/organisms/dashboard/ComparisonPanel';
import { scrapePRData } from '@/lib/github/scraper';
import DashboardLayout from '@/layouts/AdminLayout';
import { ScraperFinding } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * Three-Pane Intelligence Dashboard (Action UI-001)
 * Pane 1: Triage Feed (Findings)
 * Pane 2: Command Center (RAG Chat)
 * Pane 3: Intelligence Matrix (Comparisons)
 */
export default async function Home() {
  // 1. Scrape latest PR data for the Triage Feed (Parallelized)
  let findings: ScraperFinding[] = [];
  try {
    // Audit the most recent PRs to populate the feed
    const auditPRs = [4, 3];
    const results = await Promise.all(
      auditPRs.map(pr => scrapePRData('Hex-Tech-Lab', 'hex-rag-dss', pr))
    );
    findings = results.flatMap(data => data.findings as ScraperFinding[]);
  } catch (error) {
    console.error('Failed to populate triage feed:', error);
    findings = [
      { bucket: 'Remaining Risks', message: 'GitHub connectivity status: OFFLINE. Showing cached/mock findings.', tool: 'System', type: 'infrastructure', severity: 'low' },
      { bucket: 'Potential Blockers', message: 'Database RRF score column ambiguity resolved in migration #4.', tool: 'Audit', type: 'performance', severity: 'medium' }
    ];
  }

  return (
    <DashboardLayout>
      <Stack direction="row" spacing={3} sx={{ height: 'calc(100vh - 140px)', overflow: 'hidden' }}>
        {/* Pane 1: Triage Feed (Left) */}
        <Box sx={{ width: '320px', flexShrink: 0, height: '100%' }}>
          <TriageSidebar findings={findings} />
        </Box>

        {/* Pane 2: Command Center (Center) */}
        <Box sx={{ flexGrow: 1, height: '100%', minWidth: '400px' }}>
          <ChatCommandCenter />
        </Box>

        {/* Pane 3: Intelligence Matrix (Right) */}
        <Box sx={{ width: '380px', flexShrink: 0, height: '100%' }}>
          <ComparisonPanel />
        </Box>
      </Stack>
    </DashboardLayout>
  );
}
