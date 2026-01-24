import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/rag/embed';
import { chunkText } from '@/lib/rag/chunks';

/**
 * Store Text as Embeddings (Action 9.5)
 * Chunks, embeds, and saves content to Supabase.
 */
export const storeEmbeddings = async (
  sourceId: string, 
  sourceType: string, 
  text: string, 
  metadata: Record<string, unknown> = {}, 
  client?: SupabaseClient
) => {
  const supabase = client || await getSupabase();
  const chunks = chunkText(text);

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);

    const { error } = await supabase.from('embeddings').insert({
      source_id: sourceId,
      source_type: sourceType,
      content: chunk,
      embedding: embedding,
      metadata: metadata
    });

    if (error) {
      console.error('Failed to store embedding chunk:', error);
    }
  }
};
