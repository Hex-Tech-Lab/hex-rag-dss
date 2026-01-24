import { getSupabase } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/rag/embed';

export interface VectorSearchResult {
  results: unknown[];
  decisions: unknown[];
}

/**
 * Vector Search Utility (Action 9.3 & 10.5)
 * Performs RAG search and prioritizes "New Truths" (Decisions).
 */
export const vectorSearch = async (query: string, limit: number = 10): Promise<VectorSearchResult> => {
  const supabase = await getSupabase();
  const embedding = await generateEmbedding(query);

  // 1. Check for relevant active decisions (Action 10.5)
  const { data: decisions } = await supabase
    .from('decisions')
    .select('*')
    .eq('is_active', true)
    .ilike('topic', `%${query}%`)
    .limit(3);

  // 2. Perform hybrid search for video chunks (Vector + Keyword)
  const { data: results, error } = await supabase.rpc('match_hybrid_search', {
    query_text: query,
    query_embedding: embedding,
    match_threshold: 0.4,
    match_count: limit,
    rrf_k: 60
  });

  if (error) {
    console.error('Vector search error:', error);
    return { results: [], decisions: decisions || [] };
  }

  return {
    results: results || [],
    decisions: decisions || []
  };
};
