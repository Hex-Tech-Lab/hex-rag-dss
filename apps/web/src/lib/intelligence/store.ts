import { getSupabase } from '@/lib/supabase';

/**
 * Store Video Intelligence (Action 8.5)
 * Persists extraction results and entities.
 */
export const storeIntelligence = async (videoId: string, intelligence: Record<string, unknown>) => {
  const supabase = await getSupabase();
  // 1. Save core intelligence
  const { error: intelError } = await supabase
    .from('video_intelligence')
    .upsert({
      video_id: videoId,
      executive_summary: (intelligence.executive_overview as string) || '',
      header_intelligence: (intelligence.header_intelligence as Record<string, unknown>) || {},
      sentiment_analysis: (intelligence.sentiment_analysis as Record<string, unknown>) || {},
      priority_insights: (intelligence.priority_insights as unknown[]) || [],
      implementation_systems: (intelligence.implementation_systems as unknown[]) || [],
      power_quotes: (intelligence.power_quotes as unknown[]) || [],
      semantic_layer: (intelligence.semantic_layer as Record<string, unknown>) || {},
      raw_extraction: JSON.stringify(intelligence)
    }, { onConflict: 'video_id' });

  if (intelError) throw intelError;

  // 2. Extract and save entities (Action 8.4)
  const entities = (intelligence.entity_database as { type: string; name: string; metadata: unknown }[]) || [];
  for (const entity of entities) {
    const { data: entityData } = await supabase
      .from('entities')
      .upsert({
        type: entity.type || 'concept',
        name: entity.name,
        normalized_name: entity.name.toLowerCase(),
        metadata: (entity.metadata as Record<string, unknown>) || {}
      }, { onConflict: 'type,normalized_name' })
      .select()
      .single();

    if (entityData) {
      await supabase.from('entity_mentions').insert({
        entity_id: entityData.id,
        video_id: videoId,
        context: (intelligence.executive_overview as string) || ''
      });
    }
  }
};
