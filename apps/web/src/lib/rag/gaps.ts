/**
 * Knowledge Gap Detection (Step 11)
 * Requirement: Explicitly show gaps when system lacks information.
 */

interface SearchResult {
  similarity: number;
}

export interface GapResult {
  isGap: boolean;
  message?: string;
  suggestion?: string;
}

export const detectGaps = (results: SearchResult[], threshold: number = 0.6): GapResult => {
  // If no results or top result is below threshold, it's a gap
  const topResult = results[0];
  
  if (!topResult || topResult.similarity < threshold) {
    return {
      isGap: true,
      message: topResult 
        ? "I found some partial matches, but no definitive answer in your library."
        : "I couldn't find any relevant information in your processed videos.",
      suggestion: "Would you like to search the web for grounding?"
    };
  }

  return { isGap: false };
};
