'use client';

import { Box } from '@mui/material';
import TriageFeedClient from '@/sections/dashboard/TriageFeedClient';
import ChatCommandCenter from '@/components/organisms/dashboard/ChatCommandCenter';
import ComparisonPanel from '@/components/organisms/dashboard/ComparisonPanel';
import { ScraperFinding } from '@/types';

interface Props {
  initialFindings: ScraperFinding[];
}

export default function DashboardViewClient({ initialFindings }: Props) {
  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)', overflow: 'hidden', bgcolor: 'grey.50', mx: -3, mb: -3 }}>
      {/* Pane 1: Triage Feed (Left) */}
      <Box sx={{ width: '320px', flexShrink: 0, bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider' }}>
        <TriageFeedClient initialFindings={initialFindings} />
      </Box>

      {/* Pane 2: Command Center (Center) */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: '400px' }}>
        <ChatCommandCenter />
      </Box>

      {/* Pane 3: Intelligence Matrix (Right) */}
      <Box sx={{ width: '380px', flexShrink: 0, bgcolor: 'background.paper', borderLeft: '1px solid', borderColor: 'divider' }}>
        <ComparisonPanel />
      </Box>
    </Box>
  );
}
