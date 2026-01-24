import { getSupabase } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/rag/embed';
import { callLLM } from '@/lib/llm/openrouter';
import { COMPARISON_MATRIX_PROMPT } from '@/lib/intelligence/prompts';

const removeStopwords = (text: string) => {
  const stopwords = ['vs', 'comparison', 'and', 'or', 'the', 'a', 'an', 'is', 'to', 'for', 'of', 'in', 'on', 'with'];
  return text.split(' ').filter(w => !stopwords.includes(w.toLowerCase())).join(' ');
};

export interface MatrixRow {
  criteria: string;
  altA: string;
  altB: string;
}

export interface ComparisonMatrixResult {
  summary: string;
  matrix: MatrixRow[];
  contrasting_viewpoints: string[];
  gaps_identified: string[];
  raw?: string;
  error?: string;
}

/**
 * Comparison Matrix Generator (Action 12.2)
 * Analyzes two alternatives using RAG-sourced context.
 */
export const generateComparisonMatrix = async (
  alternativeA: string, 
  alternativeB: string
): Promise<ComparisonMatrixResult> => {
  const supabase = await getSupabase();
  // 1. Fetch context for both alternatives using vector search
  let searchQuery = `${alternativeA} vs ${alternativeB} comparison`;
  const embedding = await generateEmbedding(searchQuery);

  const { data: initialMatches, error } = await supabase.rpc('match_hybrid_search', {
    query_text: searchQuery,
    query_embedding: embedding,
    match_threshold: 0.4,
    match_count: 15,
    rrf_k: 60
  });

  let matches = initialMatches;

  // Self-Correction: Retry with stripped stopwords if low yield
  if (matches && matches.length < 2) {
    console.log('Hybrid search low yield, retrying with stopword removal...');
    searchQuery = removeStopwords(searchQuery);
    const retry = await supabase.rpc('match_hybrid_search', {
      query_text: searchQuery,
      query_embedding: embedding, // Keep original semantic intent
      match_threshold: 0.3, // Slightly lower threshold
      match_count: 15,
      rrf_k: 60
    });
    
    if (!retry.error && retry.data) {
      matches = retry.data;
    }
  }

  if (error) {
    console.error('Comparison context fetch error:', error);
    throw new Error('Failed to fetch context for comparison');
  }

  const context = (matches || []).map((m: { content: string }) => m.content).join('\n---\n');

  // High Impact: RAG Context Safeguard (Truncate to 4000 chars)
  let safeContext = context;
  if (safeContext.length > 4000) {
    safeContext = safeContext.substring(0, 4000) + '... [Context Truncated]';
  }

  // 2. Build and run the comparison prompt
  const prompt = COMPARISON_MATRIX_PROMPT
    .replace('{{alternativeA}}', alternativeA)
    .replace('{{alternativeB}}', alternativeB)
    .replace('{{context}}', safeContext);

  const systemPrompt = "You are an elite architectural consultant helping a user make high-stakes technical decisions.";

  const rawResponse = await callLLM(prompt, systemPrompt);

  try {
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return {
        ...data,
        raw: rawResponse
      };
    }
    return { 
      summary: "Failed to parse structured matrix", 
      matrix: [], 
      contrasting_viewpoints: [], 
      gaps_identified: [], 
      raw: rawResponse,
      error: 'No JSON found'
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'JSON parsing failed';
    console.error('Failed to parse comparison matrix JSON:', err);
    return { 
      summary: "Error generating matrix", 
      matrix: [], 
      contrasting_viewpoints: [], 
      gaps_identified: [], 
      raw: rawResponse, 
      error: message
    };
  }
};
