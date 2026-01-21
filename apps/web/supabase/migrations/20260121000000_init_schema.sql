-- 1. YouTube Sources
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_count INT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  channel_name TEXT,
  channel_id TEXT,
  duration_seconds INT,
  published_at TIMESTAMPTZ,
  thumbnail_url TEXT,
  transcript TEXT,
  transcript_source TEXT, -- 'youtube_captions' | 'assemblyai' | 'whisper'
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE video_playlists (
  video_id UUID REFERENCES videos(id),
  playlist_id UUID REFERENCES playlists(id),
  position INT,
  PRIMARY KEY (video_id, playlist_id)
);

-- 2. Extracted Intelligence
CREATE TABLE video_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) UNIQUE,
  header_intelligence JSONB,
  executive_summary TEXT,
  sentiment_analysis JSONB,
  priority_insights JSONB,
  implementation_systems JSONB,
  power_quotes JSONB,
  semantic_layer JSONB,
  raw_extraction TEXT, -- Full 16-section output
  extracted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Entity + Relationships (Knowledge Graph Light)
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'person' | 'tool' | 'concept' | 'framework' | 'company'
  name TEXT NOT NULL,
  normalized_name TEXT, -- Lowercase, deduplicated
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(type, normalized_name)
);

CREATE TABLE entity_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id),
  video_id UUID REFERENCES videos(id),
  context TEXT, -- Surrounding text
  timestamp_seconds INT, -- Video timestamp
  confidence FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE entity_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_a_id UUID REFERENCES entities(id),
  relationship_type TEXT, -- 'recommends' | 'criticizes' | 'created' | 'compares_to'
  entity_b_id UUID REFERENCES entities(id),
  source_video_id UUID REFERENCES videos(id),
  confidence FLOAT,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vector Embeddings
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT, -- 'video_chunk' | 'insight' | 'quote' | 'decision'
  source_id UUID,
  content TEXT,
  embedding vector(1024),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops);

-- 5. Sessions & Decisions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  domain_filter TEXT[], -- Optional: ['tech', 'health']
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  role TEXT, -- 'user' | 'assistant'
  content TEXT,
  sources JSONB, -- Referenced videos, entities
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  topic TEXT NOT NULL,
  decision TEXT NOT NULL,
  rationale TEXT,
  confidence FLOAT,
  sources JSONB, -- Videos, entities that informed decision
  domain TEXT,
  supersedes_decision_id UUID REFERENCES decisions(id), -- Version chain
  is_active BOOLEAN DEFAULT TRUE,
  decided_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON decisions(topic, is_active);

-- 6. Vector Search RPC
CREATE OR REPLACE FUNCTION match_embeddings (
  query_embedding vector(1024),
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
  FROM embeddings e
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
