-- Add user ownership columns if missing
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Enable RLS
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

-- Policy for Decisions
DROP POLICY IF EXISTS "Isolation: Select Own Decisions" ON decisions;
CREATE POLICY "Isolation: Select Own Decisions" ON decisions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Isolation: Insert Own Decisions" ON decisions;
CREATE POLICY "Isolation: Insert Own Decisions" ON decisions FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Isolation: Update Own Decisions" ON decisions;
CREATE POLICY "Isolation: Update Own Decisions" ON decisions FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Isolation: Delete Own Decisions" ON decisions;
CREATE POLICY "Isolation: Delete Own Decisions" ON decisions FOR DELETE USING (auth.uid() = user_id);

-- Policy for Sessions
DROP POLICY IF EXISTS "Isolation: Select Own Sessions" ON sessions;
CREATE POLICY "Isolation: Select Own Sessions" ON sessions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Isolation: Insert Own Sessions" ON sessions;
CREATE POLICY "Isolation: Insert Own Sessions" ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Isolation: Update Own Sessions" ON sessions;
CREATE POLICY "Isolation: Update Own Sessions" ON sessions FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Isolation: Delete Own Sessions" ON sessions;
CREATE POLICY "Isolation: Delete Own Sessions" ON sessions FOR DELETE USING (auth.uid() = user_id);

-- Policy for Playlists
DROP POLICY IF EXISTS "Isolation: Select Own Playlists" ON playlists;
CREATE POLICY "Isolation: Select Own Playlists" ON playlists FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Isolation: Insert Own Playlists" ON playlists;
CREATE POLICY "Isolation: Insert Own Playlists" ON playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Isolation: Update Own Playlists" ON playlists;
CREATE POLICY "Isolation: Update Own Playlists" ON playlists FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Isolation: Delete Own Playlists" ON playlists;
CREATE POLICY "Isolation: Delete Own Playlists" ON playlists FOR DELETE USING (auth.uid() = user_id);
