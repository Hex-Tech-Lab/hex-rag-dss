import { supabase } from '../supabase';
import { generateEmbedding } from './embed';
import { chunkText } from './chunks';

/**
 * Store Text as Embeddings (Action 9.5)
 * Chunks, embeds, and saves content to Supabase.
 */
export const storeEmbeddings = async (sourceId: string, sourceType: string, text: string, metadata: Record<string, unknown> = {}) => {
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
