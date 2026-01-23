/**
 * Enhanced PR Scraper (Action 12.3)
 * Ported from hex-test-drive-man and refactored for hex-rag-dss MCPs.
 * 4-Bucket Standard: Critical, High Impact, Potential Blockers, Remaining Risks.
 */
// @ts-expect-error - Conceptual wrappers
import { github_pull_request_read } from '@/lib/mcp-wrappers'; 
// @ts-expect-error - Conceptual wrappers
import { sonarcloud_issues } from '@/lib/mcp-wrappers';

type Bucket = 'Critical' | 'High Impact' | 'Potential Blockers' | 'Remaining Risks';

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
 */
export async function scrapePRData(owner: string, repo: string, prNumber: number) {
  // 1. Fetch PR details and comments using GitHub MCP
  const pr = await (github_pull_request_read as (args: Record<string, unknown>) => Promise<{ title: string; user: { login: string } }>)({ owner, repo, pullNumber: prNumber, method: 'get' });
  const comments = await (github_pull_request_read as (args: Record<string, unknown>) => Promise<{ body: string }[]>)({ owner, repo, pullNumber: prNumber, method: 'get_comments' });

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
    
    // Evaluation in priority order to emit at most one finding per comment
    if (body.includes('coderabbit') || body.includes('review')) {
      const type = body.includes('security') ? 'security' : 'code_quality';
      findings.push({
        bucket: classifyBucket(type, 'medium', comment.body),
        type,
        tool: 'coderabbit',
        message: comment.body,
        severity: 'medium'
      });
    } else if (body.includes('triage') || body.includes('hybrid search') || body.includes('ranking')) {
      findings.push({
        bucket: 'High Impact',
        type: 'logic',
        tool: 'manual',
        message: comment.body,
        severity: 'high'
      });
    } else if (body.includes('vercel') || body.includes('supabase') || body.includes('.env') || body.includes('desync')) {
      findings.push({
        bucket: 'Potential Blockers',
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
        critical: findings.filter(f => f.bucket === 'Critical').length,
        high_impact: findings.filter(f => f.bucket === 'High Impact').length,
        potential_blockers: findings.filter(f => f.bucket === 'Potential Blockers').length,
        remaining_risks: findings.filter(f => f.bucket === 'Remaining Risks').length
      },
      security: findings.filter(f => f.type === 'security').length,
      quality: findings.filter(f => f.type === 'code_quality').length
    }
  };
}

function classifyBucket(type: string, severity: string, message: string): Bucket {
  const msg = message.toLowerCase();
  
  // 1. Critical: Critical errors as defined by CodeRabbit/Sourcery
  if (severity === 'critical' || msg.includes('critical error') || type === 'security') {
    return 'Critical';
  }
  
  // 2. High Impact: High-impact issues as defined by CodeRabbit/Sourcery
  if (severity === 'high' || msg.includes('high impact') || msg.includes('logic gap')) {
    return 'High Impact';
  }
  
  // 3. Potential Blockers: Any error, complexity, or impact that could block system functionality
  if (msg.includes('block') || msg.includes('fail') || msg.includes('vulnerability') || msg.includes('desync') || msg.includes('infrastructure')) {
    return 'Potential Blockers';
  }
  
  // 4. Remaining Risks: Medium to trivial impact/risk
  return 'Remaining Risks';
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
