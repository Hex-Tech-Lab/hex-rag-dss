export interface IntelligenceOutput {
  header_intelligence: Record<string, any>;
  strategic_context: string;
  executive_overview: string;
  sentiment_analysis: Record<string, any>;
  content_map: any[];
  priority_insights: string[];
  comparison_tables: any[];
  qa_extraction: any[];
  implementation_systems: any[];
  entity_database: { type: string; name: string; metadata: any }[];
  power_quotes: string[];
  semantic_layer: Record<string, any>;
  discovery_pathways: string[];
  scenario_analysis: string;
  forward_intelligence: string;
  risk_disclosures: string;
  raw?: string;
  error?: string;
}
