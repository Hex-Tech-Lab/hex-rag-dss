# hex-rag-dss PRD v1.0
## RAG-Powered Decision Support System (SecondBrain Nucleus)

**Version**: 1.0 | **Status**: READY FOR APPROVAL | **Timeline**: 48h Hard Deadline
**Author**: Claude Code (CC) | **Stakeholder**: Kelly B.

---

## 1. EXECUTIVE SUMMARY

### 1.1 Vision
hex-rag-dss is the nucleus of SecondBrain - a RAG-powered Decision Support System that transforms scattered YouTube content into actionable intelligence. It enables timestamped decisions that become "new truths" while maintaining full knowledge provenance.

### 1.2 Immediate Goal
**48-Hour MVP**: Functional system to help decide development methodology (Freedom System vs OpenSpec) by processing MCP + AI/SaaS YouTube playlists (~50-100 videos).

### 1.3 Core Value Proposition
- **What you know**: Extracted intelligence from your video library
- **What you don't know**: Explicit gaps with search suggestions
- **What you've decided**: Timestamped "new truths" that guide future queries
- **What's changed**: Topic-level staleness detection with web grounding

---

## 2. TECH STACK (MCP-First Architecture)

### 2.1 Application Stack (Mirrors hex-test-drive)
| Component | Technology | Version | Rationale |
|-----------|------------|---------|-----------|
| Framework | Next.js | 15.x | App Router, Server Actions |
| UI | React | 19.x | Latest stable |
| Language | TypeScript | 5.7.3 | Strict mode |
| Components | MUI | 6.4.3 | NOT v7 (breaking) |
| State | Zustand | 5.0.3 | Primitive selectors only |
| Database | Supabase | 2.50.0 | Postgres + pgvector |
| Vectors | pgvector | Built-in | 1024 dimensions |
| Embeddings | text-embedding-3-large | 1024 dims | ~$0.00013/1K tokens |

### 2.2 MCP Server Architecture
| Function | MCP Server | Cost | Purpose |
|----------|------------|------|---------|
| YouTube | mcp-server-youtube | Free | Playlist discovery, metadata, captions |
| Search | mcp-server-brave-search | Free 2K/mo | Web grounding for topic updates |
| Database | mcp-server-supabase | Free | CRUD, migrations, queries |
| Deployment | mcp-server-vercel | Free | Deploy, preview, logs |
| VCS | mcp-server-github | Free | Commits, PRs, issues |
| Docs | context7 | Free | Library documentation lookup |

### 2.3 Infrastructure (All Free Tier)
| Service | Tier | Limits | Project |
|---------|------|--------|---------|
| Supabase | Free #2 | 500MB, 50K MAU | NEW: hex-rag-dss |
| Vercel | Hobby | 100GB-h/mo | NEW: hex-rag-dss |
| OpenRouter | Pay-per-use | ~$0.10 for MVP | Embeddings |
| Brave Search | Free | 2,000 queries/mo | Grounding |

---

## 3. DATABASE SCHEMA

### 3.1 Core Tables

```sql
-- YouTube Sources
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

-- Extracted Intelligence
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

-- Entity + Relationships (Knowledge Graph Light)
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

-- Vector Embeddings
CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT, -- 'video_chunk' | 'insight' | 'quote' | 'decision'
  source_id UUID,
  content TEXT,
  embedding vector(1024),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops);

-- Sessions & Decisions
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
```

### 3.2 Key Queries

```sql
-- Find relevant decisions for a topic
SELECT * FROM decisions
WHERE is_active = TRUE
AND topic ILIKE '%' || $query || '%'
ORDER BY decided_at DESC;

-- Topic staleness check
SELECT
  e.name as topic,
  MAX(v.published_at) as newest_video,
  COUNT(DISTINCT v.id) as video_count
FROM entities e
JOIN entity_mentions em ON e.id = em.entity_id
JOIN videos v ON em.video_id = v.id
WHERE e.type = 'concept'
GROUP BY e.name
HAVING MAX(v.published_at) < NOW() - INTERVAL '30 days';
```

---

## 4. USER STORIES

### 4.1 MVP 0.0 (48h Delivery)

**US-001**: As a user, I want to connect my YouTube account via OAuth so the system can discover my playlists.
- Acceptance: OAuth flow completes, playlists listed

**US-002**: As a user, I want to select playlists and specify date ranges for processing so I control what gets indexed.
- Acceptance: Multi-select UI, date picker, queue visualization

**US-003**: As a user, I want to see real-time progress as videos are processed so I know the system is working.
- Acceptance: Progress bars per playlist, estimated completion

**US-004**: As a user, I want transcripts automatically extracted from videos so I don't need manual input.
- Acceptance: YouTube captions fetched, fallback to AssemblyAI noted

**US-005**: As a user, I want comprehensive intelligence extracted using the 16-section prompt so I get maximum value.
- Acceptance: Full extraction stored, viewable per video

**US-006**: As a user, I want to ask "What do you want to know today?" and get RAG-powered responses.
- Acceptance: Vector search, source attribution, confidence scores

**US-007**: As a user, I want to see comparison matrices when asking about alternatives (e.g., OpenSpec vs Freedom System).
- Acceptance: Side-by-side table, weighted criteria, recommendation

**US-008**: As a user, I want explicit gaps shown when the system lacks information, with search suggestions.
- Acceptance: "I found 2 partial matches..." + "Search web?" button

**US-009**: As a user, I want to record decisions as "new truths" that inform future queries.
- Acceptance: Decision saved, surfaces first in related queries

**US-010**: As a user, I want a chat interface to discuss topics and refine my understanding.
- Acceptance: Session persistence, message history, sources panel

### 4.2 MVP 0.5 (Week 2)
- US-011: Playlist auto-sync on schedule
- US-012: New video notifications with preview
- US-013: Topic-level staleness detection
- US-014: Batch web grounding for stale topics

### 4.3 MVP 1.0 (Week 3-4)
- US-015: Full knowledge graph visualization
- US-016: Codebase indexing (hex-test-drive integration)
- US-017: Multi-modal input (PDF, audio, text paste)
- US-018: Decision version history with revert

---

## 5. FEATURE MATRIX

| Feature | MVP 0.0 | MVP 0.5 | MVP 1.0 | MVP 1.5 |
|---------|:-------:|:-------:|:-------:|:-------:|
| YouTube OAuth | ✅ | ✅ | ✅ | ✅ |
| Playlist Discovery | ✅ | ✅ | ✅ | ✅ |
| Selective Sync (date range) | ✅ | ✅ | ✅ | ✅ |
| Progress Visualization | ✅ | ✅ | ✅ | ✅ |
| YouTube Captions Extraction | ✅ | ✅ | ✅ | ✅ |
| 16-Section Intelligence Extract | ✅ | ✅ | ✅ | ✅ |
| Vector Search (RAG) | ✅ | ✅ | ✅ | ✅ |
| Entity Extraction | ✅ | ✅ | ✅ | ✅ |
| Entity Relationships | ✅ | ✅ | ✅ | ✅ |
| Decision Recording | ✅ | ✅ | ✅ | ✅ |
| Session Persistence | ✅ | ✅ | ✅ | ✅ |
| Gap Detection + Search Suggest | ✅ | ✅ | ✅ | ✅ |
| Comparison Matrices | ✅ | ✅ | ✅ | ✅ |
| Scheduled Playlist Sync | ❌ | ✅ | ✅ | ✅ |
| New Video Notifications | ❌ | ✅ | ✅ | ✅ |
| Topic Staleness Detection | ❌ | ✅ | ✅ | ✅ |
| Auto Web Grounding | ❌ | ✅ | ✅ | ✅ |
| Knowledge Graph Viz | ❌ | ❌ | ✅ | ✅ |
| Codebase Indexing | ❌ | ❌ | ✅ | ✅ |
| Multi-modal Input | ❌ | ❌ | ✅ | ✅ |
| Decision Versioning | ❌ | ❌ | ✅ | ✅ |
| Google OAuth | ❌ | ❌ | ❌ | ✅ |
| SaaS Multi-tenant | ❌ | ❌ | ❌ | ✅ |

---

## 6. UI ARCHITECTURE

### 6.1 Screen Hierarchy

```
/                         → Home: "What do you want to know today?"
/session/[id]             → Session Detail (main interaction)
/admin/playlists          → Playlist Management + Sync
/admin/processing         → Processing Queue + Progress
/video/[id]               → Single Video Intelligence View
/decisions                → Decision Log (New Truths)
/entities                 → Entity Explorer (Knowledge Graph Light)
```

### 6.2 Home Screen Layout
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  hex-rag-dss          [Search] [Decisions] [Admin]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                  What do you want to know today?            │
│                  ┌─────────────────────────────────────┐    │
│                  │  Type your question...              │    │
│                  └─────────────────────────────────────┘    │
│                                                             │
│  Recent Sessions:                                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ OpenSpec vs  │ │ MCP Server   │ │ RAG Best     │        │
│  │ Freedom      │ │ Selection    │ │ Practices    │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│  Active Decisions (New Truths):                             │
│  • "Use Freedom System 8-step for spec generation" (Jan 20) │
│  • "Brave Search MCP for web grounding" (Jan 20)            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Session Detail Layout
```
┌─────────────────────────────────────────────────────────────┐
│  [Back]  Session: OpenSpec vs Freedom System    [New Truth] │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┬───────────────┐│
│  │  ACTION CARDS                           │ KEY INSIGHTS  ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │               ││
│  │  │Conf: 85%│ │Sources:4│ │Decide   │   │ • Freedom has ││
│  │  └─────────┘ └─────────┘ └─────────┘   │   less bloat  ││
│  ├─────────────────────────────────────────┤ • DB Schema   ││
│  │  FOCUS VIDEO                            │   is key      ││
│  │  ┌─────────────────────────────────┐   │ • OpenSpec    ││
│  │  │  [Thumbnail]  Povilas Korop     │   │   = overkill  ││
│  │  │  Spec-Driven Development...     │   │               ││
│  │  └─────────────────────────────────┘   │ ENTITIES:     ││
│  │                                         │ • Povilas K.  ││
│  │  SUMMARY                                │ • OpenSpec    ││
│  │  The analysis deconstructs emerging... │ • Claude Code ││
│  │                                         │               ││
│  ├─────────────────────────────────────────┴───────────────┤│
│  │  CHAT                                                    ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │ You: What's the main argument against OpenSpec?     │││
│  │  │ AI: Based on the video, the key critique is...      │││
│  │  │     [Source: 13:37] "It's a two-edged sword..."     │││
│  │  └─────────────────────────────────────────────────────┘││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │  Type your message...                        [Send] │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 7. FREEDOM SYSTEM INTEGRATION

**Source**: https://github.com/LaravelDaily/Laravel-New-Project-AI-Spec-Workflow

### 7.1 The 8-Step Workflow (Official)

1. **Initial Project Analysis** → Evaluate requirements, select tech stack
2. **Framework Installation** → Initialize project with chosen stack
3. **AI Guidelines** → Configure `.ai/guidelines` for project context
4. **Context7 Setup** → Capture package documentation
5. **Project Description** → Create `docs/project-description.md` with scope + tech decisions
6. **User Stories** → Run prompt → `docs/user-stories.md` (with clarifying questions)
7. **Database Schema** → Run prompt → `docs/database-structure.md` (DBML format)
8. **Project Phases** → Run prompt → `docs/project-phases.md` (numbered tasks)

### 7.2 Official Prompts (From LaravelDaily Repo)

**User Stories Prompt** (prompt-user-stories.md):
```
Read @docs/project-description.md and generate user stories.

ASK CLARIFYING QUESTIONS FIRST:
- How many user roles exist?
- Which features are MVP-critical vs nice-to-have?
- Key business constraints (timeline, budget, compliance)?
- Primary happy path for users?

Save result to @docs/user-stories.md
```

**Database Schema Prompt** (prompt-database-structure.md):
```
Create DBML database schema from @docs/user-stories.md and @docs/project-description.md.

KEY RULES:
- Avoid database-level enums (use string + PHP Enum comments)
- Prevent conflicts with framework default tables (users, jobs)
- Use spatie/laravel-medialibrary for file handling
- Document column purposes

Save to @docs/database-schema.md
```

**Project Phases Prompt** (prompt-project-phases.md):
```
Create project phases from:
- @docs/user-stories.md
- @docs/project-description.md
- @docs/database-schema.md

OUTPUT FORMAT:
- Phase 1, Phase 2, etc.
- Numbered tasks: 1.1, 1.2, 5.3
- Mark already-completed tasks
- Prefer Controllers over Livewire unless interactivity required

Save to @docs/project-phases.md
```

### 7.3 hex-rag-dss Implementation

The RAG system will embed these prompts as slash commands:
- `/freedom/init` - Interview → generate project-description.md
- `/freedom/stories` - Run user stories prompt with clarifying questions
- `/freedom/schema` - Generate DBML schema (THE UNIFYING TRUTH)
- `/freedom/phases` - Create numbered task list
- `/freedom/execute [phase.task]` - Implement specific task, mark complete

---

## 8. PROCESSING PIPELINE

### 8.1 Video Processing Flow

```
1. YouTube OAuth → Fetch playlists
2. User selects playlists + date ranges
3. For each video:
   a. Fetch metadata (title, channel, duration, published_at)
   b. Check if video exists (dedup across playlists)
   c. Extract transcript (YouTube captions first)
   d. If captions unavailable/low-quality → flag for AssemblyAI
   e. Apply "Ultimate Content Intelligence" prompt
   f. Extract entities (people, tools, concepts)
   g. Detect relationships between entities
   h. Generate embeddings (1024 dims)
   i. Store all artifacts
4. Update processing progress in real-time
```

### 8.2 Query Flow

```
1. User asks question
2. Generate query embedding
3. Vector search → top 10 relevant chunks
4. Check active decisions for topic → surface first
5. Detect knowledge gaps (confidence < threshold)
6. If gaps: "I found X partial matches but no definitive answer. [Search web?]"
7. Generate response with source attribution
8. Offer to record decision if conclusive
```

---

## 9. IMPLEMENTATION PHASES

### 9.1 MVP 0.0 (48h) - Task Breakdown

**Hour 0-4: Infrastructure**
- [ ] Create GitHub repo: hex-rag-dss
- [ ] Create Supabase project (free tier #2)
- [ ] Configure MCPs: youtube, supabase, brave, vercel, github
- [ ] Initialize Next.js 15 project with MUI 6.4.3
- [ ] Deploy to Vercel (empty shell)

**Hour 4-12: Data Layer**
- [ ] Run database migrations (schema above)
- [ ] Implement YouTube OAuth flow
- [ ] Build playlist discovery + listing
- [ ] Create video sync with date range filter
- [ ] Build transcript extraction (YouTube captions)

**Hour 12-24: Intelligence Extraction**
- [ ] Integrate OpenRouter for embeddings
- [ ] Implement 16-section extraction prompt
- [ ] Build entity extraction pipeline
- [ ] Create relationship detection
- [ ] Store embeddings in pgvector

**Hour 24-36: UI**
- [ ] Home screen: "What do you want to know today?"
- [ ] Admin: Playlist management + sync
- [ ] Processing: Queue with progress bars
- [ ] Video: Single video intelligence view
- [ ] Session: Chat interface with sources

**Hour 36-48: RAG + Polish**
- [ ] Implement vector search
- [ ] Build decision recording ("new truths")
- [ ] Add gap detection + search suggestions
- [ ] Comparison matrix generation
- [ ] Test end-to-end with MCP + AI/SaaS playlists

---

## 10. VERIFICATION PLAN

### 10.1 Functional Tests
1. **OAuth**: Can connect YouTube account and list playlists
2. **Sync**: Can process 10 videos with progress indication
3. **Search**: Query returns relevant results with sources
4. **Decision**: Can record decision, appears in future queries
5. **Gap**: Query with no matches shows "search web?" suggestion

### 10.2 Quality Gates
- [ ] TypeScript strict mode passes
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] Vercel deployment live
- [ ] Can answer "Should I use OpenSpec or Freedom System?" with sources

---

## 11. RISK REGISTER

| Risk | Impact | Mitigation |
|------|--------|------------|
| YouTube OAuth without GCP | High | Use mcp-server-youtube which handles auth independently |
| Transcript quality low | Medium | Fallback flag for AssemblyAI (defer to MVP 0.5) |
| 48h deadline slip | High | Ruthless scope cut: entities+relationships last, UI polish last |
| Embedding costs spike | Low | 100 videos × ~5K tokens = ~$0.07 total |
| MCP server incompatibility | Medium | Test each MCP in isolation first |

---

## 12. COST PROJECTION

| Item | MVP 0.0 | Monthly (Light Use) |
|------|---------|---------------------|
| Supabase | $0 | $0 (free tier) |
| Vercel | $0 | $0 (hobby) |
| OpenRouter Embeddings | ~$0.10 | ~$1-5 |
| Brave Search | $0 | $0 (2K/mo free) |
| AssemblyAI (if needed) | $0 | ~$5 |
| **Total** | **~$0.10** | **~$1-10** |

---

## 13. SUCCESS CRITERIA

MVP 0.0 is successful when:
1. [ ] User can OAuth with YouTube and see playlists
2. [ ] User can sync MCP + AI/SaaS playlists (50-100 videos)
3. [ ] User can ask "What's the Freedom System 8-step workflow?" and get accurate answer with video sources
4. [ ] User can record "Use Freedom System for hex-test-drive" as a decision
5. [ ] Decision appears first when asking related questions later
6. [ ] System explicitly shows gaps when knowledge is insufficient

---

## APPENDIX A: Ultimate Content Intelligence Prompt

*[Full 16-section prompt captured - see Section 5 of original interview]*

Key sections: Header Intelligence, Strategic Context, Executive Overview, Sentiment Analysis, Content Map (Acts), Priority Insights, Comparison Tables, Q&A Extraction, Implementation Systems, Entity Database, Power Quotes, Semantic Layer, Discovery Pathways, Scenario Analysis, Forward Intelligence, Risk Disclosures.

---

## APPENDIX B: Freedom System Prompt Template

```markdown
Look at the file `docs/project-description.md` and work out user stories for the project.

Ask me clarifying questions to improve the result.

Save result in the file `docs/user-stories.md`.

Below you will see an example project description and example user stories from it.
Please mimic similar structure and depth of details.

## Example Project Description ##
[Include domain-specific example]

## Example User Stories ##
[Include 5-10 example user stories]
```

---

## APPENDIX C: Critical Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Home screen "What do you want to know today?" |
| `src/app/session/[id]/page.tsx` | Session detail with chat |
| `src/app/admin/playlists/page.tsx` | Playlist management |
| `src/lib/youtube/oauth.ts` | YouTube OAuth flow |
| `src/lib/youtube/transcript.ts` | Transcript extraction |
| `src/lib/intelligence/extract.ts` | 16-section extraction |
| `src/lib/rag/search.ts` | Vector search implementation |
| `src/lib/decisions/record.ts` | Decision ("new truth") logic |
| `supabase/migrations/*.sql` | Database schema |

---

**END OF PRD v1.0**

Ready for implementation upon approval.
