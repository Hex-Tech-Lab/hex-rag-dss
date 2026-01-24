import DashboardView from '@/sections/dashboard/DashboardView';
import { scrapePRData } from '@/lib/github/scraper';

export const dynamic = 'force-dynamic';

/**
 * Three-Pane Intelligence Dashboard (Action 2.1)
 */
export default async function DashboardPage() {
  // 1. Scrape latest PR data for the Triage Feed in parallel
  let findings: any[] = [];
  try {
    const auditPRs = [4, 3, 2, 1];
    const prDataPromises = auditPRs.map(prNum => 
      scrapePRData('Hex-Tech-Lab', 'hex-rag-dss', prNum).catch(() => ({ findings: [] }))
    );
    
    const results = await Promise.all(prDataPromises);
    findings = results.flatMap(r => r.findings);
  } catch (error) {
    console.error('Failed to populate triage feed:', error);
  }

  // Fallback findings if nothing could be scraped
  if (findings.length === 0) {
    findings = [
      { bucket: 'Remaining Risks', message: 'GitHub audit feed initializing or rate-limited.', tool: 'System' }
    ];
  }

  return <DashboardView findings={findings} />;
}