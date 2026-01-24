-- Upgrade Hybrid Search RPC to 3072 dimensions
DROP FUNCTION IF EXISTS public.match_hybrid_search(text, vector(1024), float, int, int);

CREATE OR REPLACE FUNCTION public.match_hybrid_search(
  query_text TEXT,
  query_embedding VECTOR(3072),
  match_threshold FLOAT,
  match_count INT,
  rrf_k INT DEFAULT 60
) RETURNS TABLE (id UUID, content TEXT, similarity FLOAT) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  WITH vec AS (
    SELECT e.id, ROW_NUMBER() OVER (ORDER BY e.embedding <=> query_embedding) as r 
    FROM public.embeddings e 
    WHERE 1 - (e.embedding <=> query_embedding) > match_threshold 
    LIMIT match_count * 2
  ),
  kw AS (
    SELECT e.id, ROW_NUMBER() OVER (ORDER BY ts_rank_cd(e.fts, plainto_tsquery('english', query_text)) DESC) as r 
    FROM public.embeddings e 
    WHERE e.fts @@ plainto_tsquery('english', query_text) 
    LIMIT match_count * 2
  )
  SELECT 
    COALESCE(v.id, k.id) as id, 
    e.content, 
    (COALESCE(1.0 / (rrf_k + v.r), 0) + COALESCE(1.0 / (rrf_k + k.r), 0)) as similarity
  FROM vec v 
  FULL OUTER JOIN kw k ON v.id = k.id 
  JOIN public.embeddings e ON COALESCE(v.id, k.id) = e.id
  ORDER BY similarity DESC 
  LIMIT match_count;
END; $$;
