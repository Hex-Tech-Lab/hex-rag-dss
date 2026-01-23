import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import ConnectYouTubeButton from '@/components/atoms/ConnectYouTubeButton';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    // Action 5.5: Check connection status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('youtube_tokens')
      .eq('user_email', 'primary@user.com')
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows found"
      throw profileError;
    }

    const isConnected = !!profile?.youtube_tokens;

    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            hex-rag-dss
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center">
            RAG-Powered Decision Support System (SecondBrain Nucleus)
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button variant="contained" component={Link} href="/chat">
              Start Research Chat
            </Button>
            <Button variant="outlined" component={Link} href="/compare">
              Comparison Matrix
            </Button>
            <Button variant="text" component={Link} href="/admin/playlists">
              Manage Playlists
            </Button>
          </Stack>

          <Box sx={{ mt: 4 }}>
            {isConnected ? (
              <Typography variant="body1" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                ✅ YouTube Connected
              </Typography>
            ) : (
              <ConnectYouTubeButton />
            )}
          </Box>
        </Box>
      </Container>
    );
  } catch (error: unknown) {
    console.error('Home Page Error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';

    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Configuration or Connection Error</Typography>
          <Typography variant="body2">{message}</Typography>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            Please ensure all environment variables are correctly configured in Vercel.
          </Typography>
        </Alert>
      </Container>
    );
  }
}
