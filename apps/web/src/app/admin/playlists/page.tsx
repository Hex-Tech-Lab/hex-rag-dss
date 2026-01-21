import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { listPlaylists } from '@/lib/youtube/playlists';
import { supabase } from '@/lib/supabase';
import PlaylistSelector from '@/components/organisms/PlaylistSelector';

export default async function AdminPlaylistsPage() {
  const { data: profile } = await supabase
    .from('profiles')
    .select('youtube_tokens')
    .eq('user_email', 'primary@user.com')
    .single();

  if (!profile?.youtube_tokens) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5">Please connect your YouTube account first.</Typography>
      </Container>
    );
  }

  const playlists = await listPlaylists(profile.youtube_tokens);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        YouTube Playlists
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Select the playlists you want to index into hex-rag-dss.
      </Typography>

      <PlaylistSelector initialPlaylists={playlists} />
    </Container>
  );
}
