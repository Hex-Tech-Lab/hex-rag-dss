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
  return data.choices[0].message.content;
};
