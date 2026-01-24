import { Box, Stack } from '@mui/material';
import TriageSidebar from '@/components/organisms/dashboard/TriageSidebar';
import ChatCommandCenter from '@/components/organisms/dashboard/ChatCommandCenter';
import ComparisonPanel from '@/components/organisms/dashboard/ComparisonPanel';
import { scrapePRData } from '@/lib/github/scraper';
import DashboardLayout from '@/layouts/AdminLayout';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let findings: any[] = [];
  try {
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