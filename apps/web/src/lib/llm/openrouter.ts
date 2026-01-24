import { env } from '@/lib/env';

/**
 * OpenRouter Client (Action 8.1)
 * Requirement: Access to LLMs for intelligence extraction.
 */
export const callLLM = async (prompt: string, systemPrompt: string = "") => {
  const apiKey = env.OPENROUTER_API_KEY;
  const model = "anthropic/claude-3.5-sonnet"; // Default high-quality model

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://hex-rag-dss.vercel.app", // Optional
      "X-Title": "hex-rag-dss"
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  if (data.error) {
    console.error('OpenRouter API Error:', data.error);
    throw new Error(`OpenRouter API Error: ${data.error.message || JSON.stringify(data.error)}`);
  }
  if (!data.choices || data.choices.length === 0) {
    console.error('OpenRouter No Choices:', data);
    throw new Error('OpenRouter returned no choices');
  }
  return data.choices[0].message.content;
};
