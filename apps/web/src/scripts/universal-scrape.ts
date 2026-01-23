
import { execSync } from 'child_process';

const BUCKETS = ['Critical', 'High Impact', 'Potential Blockers', 'Remaining Risks'];

function classify(severity: string, message: string, type: string = ''): string {
  const msg = message.toLowerCase();
  if (severity === 'critical' || msg.includes('critical error') || type === 'security') return 'Critical';
  if (severity === 'high' || msg.includes('high impact') || msg.includes('logic gap')) return 'High Impact';
  if (msg.includes('block') || msg.includes('fail') || msg.includes('vulnerability') || msg.includes('desync') || msg.includes('infrastructure')) return 'Potential Blockers';
  return 'Remaining Risks';
}

function mapSeverity(severity: string): string {
  const map: Record<string, string> = {
    'BLOCKER': 'critical',
    'CRITICAL': 'critical',
    'MAJOR': 'high',
    'MINOR': 'medium',
    'INFO': 'low'
  };
  return map[severity] || 'low';
}

async function scrape(prNum: number) {
  const output = execSync(`gh pr view ${prNum} --json body,comments,reviews`).toString();
  const pr = JSON.parse(output);
  const findings: any[] = [];

  // body
  findings.push({ message: pr.body, severity: 'low', type: 'info' });

  // comments
  pr.comments.forEach((c: any) => {
    findings.push({ message: c.body, severity: 'medium', type: 'comment' });
  });

  // reviews
  pr.reviews.forEach((r: any) => {
    findings.push({ message: r.body, severity: 'medium', type: 'review' });
  });

  return findings.map(f => ({
    message: f.message.substring(0, 100) + '...',
    bucket: classify(f.severity, f.message, f.type)
  }));
}

async function run() {
  for (const prNum of [1, 2, 3, 4]) {
    console.log(`\n### PR #${prNum} ###`);
    const findings = await scrape(prNum);
    findings.forEach(f => {
      console.log(`- [${f.bucket}] ${f.message.replace(/\n/g, ' ')}`);
    });
  }
}

run();
