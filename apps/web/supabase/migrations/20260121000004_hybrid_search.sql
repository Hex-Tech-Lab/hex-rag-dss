-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Add Keyword Search Column (tsvector)
ALTER TABLE embeddings ADD COLUMN IF NOT EXISTS fts tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;
CREATE INDEX IF NOT EXISTS embeddings_fts_idx ON embeddings USING GIN (fts);

-- 3. RRF Hybrid Search Function (Vector + Keyword Fusion)
CREATE OR REPLACE FUNCTION match_hybrid_search(
  query_text TEXT,
  query_embedding VECTOR(1024),
  match_threshold FLOAT,
  match_count INT,
  rrf_k INT DEFAULT 60
) RETURNS TABLE (id UUID, content TEXT, similarity FLOAT) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  WITH vec AS (SELECT id, ROW_NUMBER() OVER (ORDER BY embedding <=> query_embedding) as r FROM embeddings WHERE 1-(embedding<=>query_embedding)>match_threshold LIMIT match_count*2),
       kw  AS (SELECT id, ROW_NUMBER() OVER (ORDER BY ts_rank_cd(fts, plainto_tsquery('english', query_text)) DESC) as r FROM embeddings WHERE fts @@ plainto_tsquery('english', query_text) LIMIT match_count*2)
  SELECT COALESCE(v.id, k.id) as id, e.content, (COALESCE(1.0/(rrf_k+v.r),0)+COALESCE(1.0/(rrf_k+k.r),0)) as similarity
  FROM vec v FULL OUTER JOIN kw k ON v.id=k.id JOIN embeddings e ON COALESCE(v.id,k.id)=e.id
  ORDER BY similarity DESC LIMIT match_count;
END; $$;
