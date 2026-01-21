import { github_list_pull_requests, github_pull_request_read } from '@/lib/mcp-wrappers'; // Conceptual wrappers
import { sonarcloud_issues } from '@/lib/mcp-wrappers';

interface ScraperFinding {
  type: 'code_quality' | 'security' | 'performance';
  tool: 'sonar' | 'snyk' | 'coderabbit';
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
  const pr = await github_pull_request_read({ owner, repo, pullNumber: prNumber, method: 'get' });
  const comments = await github_pull_request_read({ owner, repo, pullNumber: prNumber, method: 'get_comments' });
  const files = await github_pull_request_read({ owner, repo, pullNumber: prNumber, method: 'get_files' });

  const findings: ScraperFinding[] = [];

  // 2. Integrate SonarCloud Findings (Action 12.3.2)
  const sonarIssues = await sonarcloud_issues({ 
    projects: [`${owner}_${repo}`],
    types: ['BUG', 'VULNERABILITY', 'CODE_SMELL']
  });

  // Map Sonar issues to findings
  if (sonarIssues && Array.isArray(sonarIssues)) {
    sonarIssues.forEach((issue: any) => {
      findings.push({
        type: issue.type === 'VULNERABILITY' ? 'security' : 'code_quality',
        tool: 'sonar',
        message: issue.message,
        file: issue.component,
        line: issue.line,
        severity: mapSeverity(issue.severity)
      });
    });
  }

  // 3. Process CodeRabbit and other tool comments
  comments.forEach((comment: any) => {
    const body = comment.body.toLowerCase();
    if (body.includes('coderabbit') || body.includes('review')) {
      findings.push({
        type: 'code_quality',
        tool: 'coderabbit',
        message: comment.body,
        severity: 'medium'
      });
    }
  });

  return {
    pr_number: prNumber,
    title: pr.title,
    author: pr.user.login,
    findings,
    summary: {
      total: findings.length,
      security: findings.filter(f => f.type === 'security').length,
      quality: findings.filter(f => f.type === 'code_quality').length
    }
  };
}

function mapSeverity(severity: string): any {
  const map: Record<string, string> = {
    'BLOCKER': 'critical',
    'CRITICAL': 'critical',
    'MAJOR': 'high',
    'MINOR': 'medium',
    'INFO': 'low'
  };
  return map[severity] || 'low';
}
