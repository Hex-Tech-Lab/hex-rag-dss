import { Box, Typography } from '@mui/material';
import TriageSidebar from '@/components/organisms/dashboard/TriageSidebar';
import ChatCommandCenter from '@/components/organisms/dashboard/ChatCommandCenter';
import ComparisonPanel from '@/components/organisms/dashboard/ComparisonPanel';
import { scrapePRData } from '@/lib/github/scraper';

export const dynamic = 'force-dynamic';

/**
 * Three-Pane Intelligence Dashboard (Action 2.1)
 */
export default async function DashboardPage() {
  // 1. Scrape latest PR data for the Triage Feed
  let findings: any[] = [];
  try {
    const auditPRs = [4, 3, 2, 1];
    for (const prNum of auditPRs) {
      try {
        const data = await scrapePRData('Hex-Tech-Lab', 'hex-rag-dss', prNum);
        findings = [...findings, ...data.findings];
      } catch (e) {
        // Individual PR scrape failure shouldn't crash the dashboard
      }
    }
  } catch (error) {
    console.error('Failed to populate triage feed:', error);
  }

  // Fallback findings if nothing could be scraped
  if (findings.length === 0) {
    findings = [
      { bucket: 'Remaining Risks', message: 'GitHub audit feed initializing or rate-limited.', tool: 'System' }
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
