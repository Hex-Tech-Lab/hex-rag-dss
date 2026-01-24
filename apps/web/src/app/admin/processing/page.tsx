import { getSupabase } from '@/lib/supabase';
import ProcessingView from '@/sections/admin/processing/ProcessingView';

export const dynamic = 'force-dynamic';

export default async function AdminProcessingPage() {
  const supabase = await getSupabase();
  // Fetch synced playlists
  const { data: playlists } = await supabase
    .from('playlists')
    .select('*')
    .order('created_at', { ascending: false });

  return <ProcessingView playlists={playlists || []} />;
}