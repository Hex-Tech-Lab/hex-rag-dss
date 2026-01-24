-- Upgrade embeddings to 3072 dimensions for text-embedding-3-large
ALTER TABLE public.embeddings ALTER COLUMN embedding TYPE vector(3072);

-- Drop and recreate the RPC function with new dimension
DROP FUNCTION IF EXISTS public.match_embeddings(vector(1024), float, int);

CREATE OR REPLACE FUNCTION public.match_embeddings (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.content,
    e.metadata,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM public.embeddings e
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
