/***************************  CORE TYPES  ***************************/

export type TriageBucket = 'Critical' | 'High Impact' | 'Potential Blockers' | 'Remaining Risks';

export interface IntelligenceEntry {
  id: string;
  video_id: string;
  header_intelligence: Record<string, unknown>;
  executive_summary: string;
  sentiment_analysis: Record<string, unknown>;
  priority_insights: unknown[];
  implementation_systems: unknown[];
  power_quotes: unknown[];
  semantic_layer: Record<string, unknown>;
  raw_extraction: string;
  extracted_at: string;
}

export interface ScraperFinding {
  bucket: TriageBucket;
  type: 'code_quality' | 'security' | 'performance' | 'infrastructure' | 'logic';
  tool: 'sonar' | 'snyk' | 'coderabbit' | 'manual' | 'triage' | 'System' | 'Audit';
  message: string;
  file?: string;
  line?: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}