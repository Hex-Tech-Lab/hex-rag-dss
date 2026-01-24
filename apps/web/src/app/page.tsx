import DashboardLayout from '@/layouts/AdminLayout';
import DashboardViewClient from '@/sections/dashboard/DashboardViewClient';
import { ScraperFinding } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * 10x Resilient Landing Page
 * Completely decoupled from SSR scraper failures.
 */
export default async function Home() {
  // Stable Fallback Findings for the Triage Feed
  const fallbackFindings: ScraperFinding[] = [
    { 
      bucket: 'Remaining Risks', 
      message: 'GitHub connectivity status: OFFLINE. Live triage feed will refresh once tokens are validated.', 
      tool: 'System', 
      type: 'infrastructure', 
      severity: 'low' 
    },
    { 
      bucket: 'Potential Blockers', 
      message: 'Database RRF score column ambiguity resolved in migration #4.', 
      tool: 'Audit', 
      type: 'performance', 
      severity: 'medium' 
    }
  ];

  return (
    <DashboardLayout>
      <DashboardViewClient initialFindings={fallbackFindings} />
    </DashboardLayout>
  );
}