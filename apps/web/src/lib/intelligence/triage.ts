import { IntelligenceOutput } from '@/lib/intelligence/types';

export interface TriageActionItem {
  type: string;
  content: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface TriageResult {
  actionItems: TriageActionItem[];
  constraints: IntelligenceOutput['entity_database'];
  readyForDecision: boolean;
}

/**
 * The Triage Agent identifies "Decision Points" from the 16-section output.
 * It looks for high-priority insights and scenario analysis.
 */
export async function triageIntelligence(content: IntelligenceOutput): Promise<TriageResult> {
    const actionItems: TriageActionItem[] = [];

    // Logic: If Scenario Analysis contains "Risk", promote to Triage
    if (content.scenario_analysis?.toLowerCase().includes('risk') || content.risk_disclosures) {
        actionItems.push({
            type: 'RISK_ALERT',
            content: content.risk_disclosures || content.scenario_analysis,
            priority: 'HIGH'
        });
    }

    // Logic: Extract entities that look like constraints (e.g., "$50/mo", "Next.js 15")
    const constraints = (content.entity_database || []).filter(entity => 
        entity.type === 'CONSTRAINT' || entity.type === 'REQUIREMENT'
    );

    // Logic: Promote Priority Insights to action items
    if (content.priority_insights && content.priority_insights.length > 0) {
        content.priority_insights.slice(0, 3).forEach(insight => {
            actionItems.push({
                type: 'PRIORITY_INSIGHT',
                content: insight,
                priority: 'MEDIUM'
            });
        });
    }

    return {
        actionItems,
        constraints,
        readyForDecision: actionItems.length > 0
    };
}
