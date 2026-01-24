import { callLLM } from '@/lib/llm/openrouter';
import { ULTIMATE_INTELLIGENCE_PROMPT } from '@/lib/intelligence/prompts';
import { triageIntelligence, TriageResult } from '@/lib/intelligence/triage';
import { IntelligenceOutput } from '@/lib/intelligence/types';

export interface ExtractionResult extends Partial<IntelligenceOutput> {
  triage?: TriageResult;
  raw: string;
  error?: string;
}

/**
 * Intelligence Extraction Pipeline (Action 8.3)
 * Processes a transcript through the 16-section prompt and triage.
 */
export const extractIntelligence = async (transcript: string): Promise<ExtractionResult> => {
  // High Impact: Safeguard (Truncate to 40000 chars for large transcripts)
  const safeTranscript = transcript.length > 40000 
    ? transcript.substring(0, 40000) + '... [Transcript Truncated]'
    : transcript;

  const prompt = ULTIMATE_INTELLIGENCE_PROMPT.replace('{{transcript}}', safeTranscript);
  const systemPrompt = "You are an expert intelligence analyst specializing in technical content extraction. Output ONLY valid JSON.";

  const rawResponse = await callLLM(prompt, systemPrompt);
  
  try {
    // Attempt to parse JSON from the response
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('No JSON found in LLM response');
      return { raw: rawResponse, error: 'No structured data found' };
    }

    const content: IntelligenceOutput = JSON.parse(jsonMatch[0]);
    
    // Step 2: The Active Triage Agent integration
    const triage = await triageIntelligence(content);

    return {
      ...content,
      triage,
      raw: rawResponse
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'JSON parsing failed';
    console.error('Failed to parse intelligence JSON:', error);
    return { raw: rawResponse, error: message };
  }
};
