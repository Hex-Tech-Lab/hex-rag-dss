import { supabase } from '../supabase';
import { generateEmbedding } from '../rag/embed';
import { callLLM } from '../llm/openrouter';
import { COMPARISON_MATRIX_PROMPT } from './prompts';

/**
 * Comparison Matrix Generator (Action 12.2)
 * Analyzes two alternatives using RAG-sourced context.
 */
export const generateComparisonMatrix = async (alternativeA: string, alternativeB: string) => {
  // 1. Fetch context for both alternatives using vector search
  const searchQuery = `${alternativeA} vs ${alternativeB} comparison`;
  const embedding = await generateEmbedding(searchQuery);

  const { data: matches, error } = await supabase.rpc('match_embeddings', {
    query_embedding: embedding,
    match_threshold: 0.4,
    match_count: 15
  });

  if (error) {
    console.error('Comparison context fetch error:', error);
    throw new Error('Failed to fetch context for comparison');
  }

  const context = (matches || []).map((m: any) => m.content).join('\n---\n');

  // 2. Build and run the comparison prompt
  const prompt = COMPARISON_MATRIX_PROMPT
    .replace('{{alternativeA}}', alternativeA)
    .replace('{{alternativeB}}', alternativeB)
    .replace('{{context}}', context);

  const systemPrompt = "You are an elite architectural consultant helping a user make high-stakes technical decisions.";

  const rawResponse = await callLLM(prompt, systemPrompt);

  try {
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { raw: rawResponse };
  } catch (error) {
    console.error('Failed to parse comparison matrix JSON:', error);
    return { raw: rawResponse, error: 'JSON parsing failed' };
  }
};
