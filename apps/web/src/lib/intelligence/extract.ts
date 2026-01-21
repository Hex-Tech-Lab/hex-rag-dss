import { callLLM } from '../llm/openrouter';
import { ULTIMATE_INTELLIGENCE_PROMPT } from './prompts';

/**
 * Intelligence Extraction Pipeline (Action 8.3)
 * Processes a transcript through the 16-section prompt.
 */
export const extractIntelligence = async (transcript: string) => {
  const prompt = ULTIMATE_INTELLIGENCE_PROMPT.replace('{{transcript}}', transcript);
  const systemPrompt = "You are an expert intelligence analyst specializing in technical content extraction.";

  const rawResponse = await callLLM(prompt, systemPrompt);
  
  try {
    // Attempt to parse JSON from the response
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { raw: rawResponse };
  } catch (error) {
    console.error('Failed to parse intelligence JSON:', error);
    return { raw: rawResponse, error: 'JSON parsing failed' };
  }
};
