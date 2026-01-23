export interface IntelligenceOutput {
  header_intelligence: Record<string, unknown>;
  strategic_context: string;
  executive_overview: string;
  sentiment_analysis: Record<string, unknown>;
  content_map: unknown[];
  priority_insights: string[];
  comparison_tables: unknown[];
  qa_extraction: unknown[];
  implementation_systems: unknown[];
  entity_database: { type: string; name: string; metadata: unknown }[];
  power_quotes: string[];
  semantic_layer: Record<string, unknown>;
  discovery_pathways: string[];
  scenario_analysis: string;
  forward_intelligence: string;
  risk_disclosures: string;
  raw?: string;
  error?: string;
}
