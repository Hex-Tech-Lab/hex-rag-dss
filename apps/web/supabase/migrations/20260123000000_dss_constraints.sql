-- Migration: Add Decision and Constraint logic to Hex-RAG-DSS
BEGIN;

-- 1. Create a Global Constraints table
CREATE TABLE IF NOT EXISTS public.constraints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_video_id UUID REFERENCES public.videos(id),
    category TEXT NOT NULL, -- e.g., 'Budget', 'Latency', 'TechStack'
    description TEXT NOT NULL,
    constraint_value JSONB, -- Stores specific logic like { "max": 200, "unit": "ms" }
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create a Decisions table (The "New Truth" Layer)
CREATE TABLE IF NOT EXISTS public.decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id),
    rationale TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'active', 'overridden', 'deprecated'
    metadata JSONB, -- Stores provenance data
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMIT;
