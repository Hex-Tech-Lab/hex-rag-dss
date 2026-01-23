import { supabase } from '@/lib/supabase';

/**
 * Record Decision (Action 10.1)
 * Requirement: Create "New Truths" that guide future queries.
 */
export const recordDecision = async (
  topic: string, 
  decision: string, 
  rationale: string, 
  sources: unknown = [],
  supersedesId?: string
) => {
  // If superseding, deactivate old decision
  if (supersedesId) {
    await supabase
      .from('decisions')
      .update({ is_active: false })
      .eq('id', supersedesId);
  }

  const { data, error } = await supabase
    .from('decisions')
    .insert({
      topic,
      decision,
      rationale,
      sources,
      supersedes_decision_id: supersedesId,
      is_active: true,
      decided_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
