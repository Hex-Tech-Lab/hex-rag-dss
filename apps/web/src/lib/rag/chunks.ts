/**
 * Chunking Logic (Action 9.2)
 * Splits text into manageable fragments for embedding.
 */
export const chunkText = (text: string, chunkSize: number = 1000, overlap: number = 200) => {
  const chunks: string[] = [];
  let index = 0;

  while (index < text.length) {
    const chunk = text.slice(index, index + chunkSize);
    chunks.push(chunk);
    index += (chunkSize - overlap);
  }

  return chunks;
};
