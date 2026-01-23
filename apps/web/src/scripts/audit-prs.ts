
import { scrapePRData } from '../lib/github/scraper';

async function runAudit() {
  const owner = 'Hex-Tech-Lab';
  const repo = 'hex-rag-dss';
  const prs = [1, 2, 3, 4];

  console.log('--- 10x Auditor & Sweep Audit Run ---');
  for (const prNum of prs) {
    console.log(`\nAuditing PR #${prNum}...`);
    try {
      const result = await scrapePRData(owner, repo, prNum);
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.error(`Failed to audit PR #${prNum}:`, e);
    }
  }
}

runAudit();
