import DashboardLayout from '@/layouts/AdminLayout';
import DashboardView from '@/sections/dashboard/DashboardView';
import { scrapePRData } from '@/lib/github/scraper';
import { ScraperFinding } from '@/types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Scrape latest PR data for the Triage Feed
  let findings: ScraperFinding[] = [];
  try {
    const auditPRs = [4, 3];
    const results = await Promise.all(
      auditPRs.map(pr => scrapePRData('Hex-Tech-Lab', 'hex-rag-dss', pr).catch(() => ({ findings: [] })))
    );
    findings = results.flatMap(data => data.findings as ScraperFinding[]);
  } catch (error) {
    console.error('Failed to populate triage feed:', error);
  }

  if (findings.length === 0) {
    findings = [
      { bucket: 'Remaining Risks', message: 'GitHub connectivity status: OFFLINE.', tool: 'System', type: 'infrastructure', severity: 'low' }
    ];
  }

  return (
    <DashboardLayout>
      <DashboardView findings={findings} />
    </DashboardLayout>
  );
}