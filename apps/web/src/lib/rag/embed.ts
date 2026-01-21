/**
 * OpenRouter Embedding Client (Action 9.1)
 * Requirement: Generate 1024-dim embeddings.
 */
export const generateEmbedding = async (text: string) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = "openai/text-embedding-3-large"; // 1024 dimensions

  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      input: text.replace(/\n/g, ' ')
    })
  });

  const data = await response.json();
  return data.data[0].embedding;
};
