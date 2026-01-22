import { callLLM } from '@/lib/llm/openrouter';
import { ULTIMATE_INTELLIGENCE_PROMPT } from '@/lib/intelligence/prompts';
import { triageIntelligence } from '@/lib/intelligence/triage';
import { IntelligenceOutput } from '@/lib/intelligence/types';

/**
 * Intelligence Extraction Pipeline (Action 8.3)
 * Processes a transcript through the 16-section prompt and triage.
 */
export const extractIntelligence = async (transcript: string) => {
  const prompt = ULTIMATE_INTELLIGENCE_PROMPT.replace('{{transcript}}', transcript);
  const systemPrompt = "You are an expert intelligence analyst specializing in technical content extraction.";

  const rawResponse = await callLLM(prompt, systemPrompt);
  
  try {
    // Attempt to parse JSON from the response
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { raw: rawResponse };
    }

    const content: IntelligenceOutput = JSON.parse(jsonMatch[0]);
    
    // Step 2: The Active Triage Agent integration
    const triage = await triageIntelligence(content);

    return {
      ...content,
      triage,
      raw: rawResponse
    };
  } catch (error) {
    console.error('Failed to parse intelligence JSON:', error);
    return { raw: rawResponse, error: 'JSON parsing failed' };
  }
};
