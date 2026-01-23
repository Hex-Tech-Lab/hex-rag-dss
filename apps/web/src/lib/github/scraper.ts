/**
 * TODO: Post-deploy - Implement concrete classifications for 3-Bucket system:
 * 1. Critical: Security vulnerabilities (Snyk/Sonar) and build-breakers.
 * 2. High Impact: Logic gaps in Triage Agent or Hybrid Search fusion.
 * 3. Potential Blockers: Infrastructure desyncs (Vercel/Supabase).
 */
// @ts-expect-error - Conceptual wrappers
import { github_pull_request_read } from '@/lib/mcp-wrappers'; 
// @ts-expect-error - Conceptual wrappers
import { sonarcloud_issues } from '@/lib/mcp-wrappers';

type Bucket = 'Critical Blockers' | 'High Impact Decisions' | 'Potential Risks';

interface ScraperFinding {
  bucket: Bucket;
  type: 'code_quality' | 'security' | 'performance' | 'infrastructure' | 'logic';
  tool: 'sonar' | 'snyk' | 'coderabbit' | 'manual' | 'triage';
  message: string;
  file?: string;
  line?: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Enhanced PR Scraper (Action 12.3)
 * Ported from hex-test-drive-man and refactored for hex-rag-dss MCPs.
 */
export async function scrapePRData(owner: string, repo: string, prNumber: number) {
  // 1. Fetch PR details and comments using GitHub MCP
  // Note: Using conceptual function calls that map to your MCP tools
  const pr = await (github_pull_request_read as (args: Record<string, unknown>) => Promise<{ title: string; user: { login: string } }>)({ owner, repo, pullNumber: prNumber, method: 'get' });
  const comments = await (github_pull_request_read as (args: Record<string, unknown>) => Promise<{ body: string }[]>)({ owner, repo, pullNumber: prNumber, method: 'get_comments' });
  // const files = await (github_pull_request_read as any)({ owner, repo, pullNumber: prNumber, method: 'get_files' });

  const findings: ScraperFinding[] = [];

  // 2. Integrate SonarCloud Findings (Action 12.3.2)
  const sonarIssues = await (sonarcloud_issues as (args: Record<string, unknown>) => Promise<{ type: string; message: string; component: string; line: number; severity: string }[]>)({ 
    projects: [`${owner}_${repo}`],
    types: ['BUG', 'VULNERABILITY', 'CODE_SMELL']
  });

  // Map Sonar issues to findings
  if (sonarIssues && Array.isArray(sonarIssues)) {
    sonarIssues.forEach((issue: { type: string; message: string; component: string; line: number; severity: string }) => {
      const type = issue.type === 'VULNERABILITY' ? 'security' : 'code_quality';
      const severity = mapSeverity(issue.severity);
      findings.push({
        bucket: classifyBucket(type, severity, issue.message),
        type,
        tool: 'sonar',
        message: issue.message,
        file: issue.component,
        line: issue.line,
        severity
      });
    });
  }

  // 3. Process CodeRabbit and other tool comments
  comments.forEach((comment: { body: string }) => {
    const body = comment.body.toLowerCase();
    if (body.includes('coderabbit') || body.includes('review')) {
      const type = body.includes('security') ? 'security' : 'code_quality';
      findings.push({
        bucket: classifyBucket(type, 'medium', comment.body),
        type,
        tool: 'coderabbit',
        message: comment.body,
        severity: 'medium'
      });
    }

    // Logic for High Impact Decisions (Triage/Hybrid Search gaps)
    if (body.includes('triage') || body.includes('hybrid search') || body.includes('ranking')) {
      findings.push({
        bucket: 'High Impact Decisions',
        type: 'logic',
        tool: 'manual',
        message: comment.body,
        severity: 'high'
      });
    }

    // Logic for Potential Risks (Infrastructure)
    if (body.includes('vercel') || body.includes('supabase') || body.includes('env') || body.includes('desync')) {
      findings.push({
        bucket: 'Potential Risks',
        type: 'infrastructure',
        tool: 'manual',
        message: comment.body,
        severity: 'medium'
      });
    }
  });

  return {
    pr_number: prNumber,
    title: (pr as { title: string }).title,
    author: (pr as { user: { login: string } }).user.login,
    findings,
    summary: {
      total: findings.length,
      buckets: {
        critical: findings.filter(f => f.bucket === 'Critical Blockers').length,
        high_impact: findings.filter(f => f.bucket === 'High Impact Decisions').length,
        potential_risks: findings.filter(f => f.bucket === 'Potential Risks').length
      },
      security: findings.filter(f => f.type === 'security').length, quality: findings.filter(f => f.type === 'code_quality').length
    }
  };
}

function classifyBucket(type: string, severity: string, message: string): Bucket {
  const msg = message.toLowerCase();
  
  // 1. Critical: Security vulnerabilities (Snyk/Sonar) and build-breakers
  if (type === 'security' || severity === 'critical' || msg.includes('vulnerability') || msg.includes('exploit') || msg.includes('build fail')) {
    return 'Critical Blockers';
  }
  
  // 2. High Impact: Logic gaps in Triage Agent or Hybrid Search fusion
  if (msg.includes('triage') || msg.includes('hybrid search') || msg.includes('fusion') || msg.includes('logic gap') || msg.includes('ranking')) {
    return 'High Impact Decisions';
  }
  
  // 3. Potential Risks: Infrastructure desyncs (Vercel/Supabase)
  if (msg.includes('vercel') || msg.includes('supabase') || msg.includes('env') || msg.includes('desync') || msg.includes('infrastructure')) {
    return 'Potential Risks';
  }
  
  return 'Potential Risks';
}

function mapSeverity(severity: string): 'critical' | 'high' | 'medium' | 'low' {
  const map: Record<string, string> = {
    'BLOCKER': 'critical',
    'CRITICAL': 'critical',
    'MAJOR': 'high',
    'MINOR': 'medium',
    'INFO': 'low'
  };
  return map[severity] || 'low';
}
