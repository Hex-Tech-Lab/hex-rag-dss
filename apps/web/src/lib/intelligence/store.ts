import { supabase } from '../supabase';

/**
 * Store Video Intelligence (Action 8.5)
 * Persists extraction results and entities.
 */
export const storeIntelligence = async (videoId: string, intelligence: any) => {
  // 1. Save core intelligence
  const { error: intelError } = await supabase
    .from('video_intelligence')
    .upsert({
      video_id: videoId,
      executive_summary: intelligence.executive_overview || '',
      header_intelligence: intelligence.header_intelligence || {},
      sentiment_analysis: intelligence.sentiment_analysis || {},
      priority_insights: intelligence.priority_insights || [],
      implementation_systems: intelligence.implementation_systems || [],
      power_quotes: intelligence.power_quotes || [],
      semantic_layer: intelligence.semantic_layer || {},
      raw_extraction: JSON.stringify(intelligence)
    }, { onConflict: 'video_id' });

  if (intelError) throw intelError;

  // 2. Extract and save entities (Action 8.4)
  const entities = intelligence.entity_database || [];
  for (const entity of entities) {
    const { data: entityData } = await supabase
      .from('entities')
      .upsert({
        type: entity.type || 'concept',
        name: entity.name,
        normalized_name: entity.name.toLowerCase(),
        metadata: entity.metadata || {}
      }, { onConflict: 'type,normalized_name' })
      .select()
      .single();

    if (entityData) {
      await supabase.from('entity_mentions').insert({
        entity_id: entityData.id,
        video_id: videoId,
        context: intelligence.executive_overview || ''
      });
    }
  }
};
