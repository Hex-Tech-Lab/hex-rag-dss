'use server';

import { createClient } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/rag/embed';
import { callLLM } from '@/lib/llm/openrouter';

export async function askQuestion(query: string) {
  try {
    const supabase = await createClient();
    
    // 1. Generate Embedding
    const embedding = await generateEmbedding(query);

    // 2. Hybrid Search
    const { data: matches, error } = await supabase.rpc('match_hybrid_search', {
      query_text: query,
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: 10
    });

    if (error) throw error;

    const context = (matches || []).map((m: any) => m.content).join('\n---\n');

    // 3. LLM Contextualization
    const systemPrompt = `
      You are hex-rag-dss, a Decision Support System. 
      Use the provided context from indexed YouTube videos to answer the user's question.
      If the information is not in the context, be honest and suggest a web search.
      Always cite your sources if possible.
      Format your response in Markdown.
      DO NOT ask if the user wants to see a matrix unless you have already provided a detailed answer.
    `;

    const prompt = `
      CONTEXT:
      ${context}

      USER QUESTION:
      ${query}
    `;

    const response = await callLLM(prompt, systemPrompt);
    return { content: response };
  } catch (error) {
    console.error('Chat Action Error:', error);
    return { error: 'Failed to retrieve data from the intelligence pipeline.' };
  }
}
