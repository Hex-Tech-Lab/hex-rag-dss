import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { listPlaylists } from '@/lib/youtube/playlists';
import { supabase } from '@/lib/supabase';
import PlaylistSelector from '@/components/organisms/PlaylistSelector';

export const dynamic = 'force-dynamic';

export default async function AdminPlaylistsPage() {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('youtube_tokens')
      .eq('user_email', 'primary@user.com')
      .single();

    if (profileError || !profile?.youtube_tokens) {
      return (
        <Container sx={{ py: 8 }}>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <AlertTitle>YouTube Connection Required</AlertTitle>
            Please connect your YouTube account first to manage playlists.
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" component={Link} href="/" size="small">
                Return Home to Connect
              </Button>
            </Box>
          </Alert>
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
  } catch (error: unknown) {
    console.error('AdminPlaylistsPage Error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <AlertTitle>Application Error</AlertTitle>
          {message}
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" component={Link} href="/" size="small">
              Back to Home
            </Button>
          </Box>
        </Alert>
      </Container>
    );
  }
}
