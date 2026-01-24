import { listPlaylists } from '@/lib/youtube/playlists';
import { getSupabase } from '@/lib/supabase';
import PlaylistsView, { LoginRequiredView, ConnectionRequiredView, ErrorView } from '@/sections/admin/playlists/PlaylistsView';

export const dynamic = 'force-dynamic';

export default async function AdminPlaylistsPage() {
  try {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <LoginRequiredView />;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('youtube_tokens')
      .eq('user_email', user.email)
      .single();

    if (profileError || !profile?.youtube_tokens) return <ConnectionRequiredView />;

    const playlists = await listPlaylists(profile.youtube_tokens);

    return <PlaylistsView playlists={playlists} />;
  } catch (error: unknown) {
    console.error('AdminPlaylistsPage Error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return <ErrorView message={message} />;
  }
}
