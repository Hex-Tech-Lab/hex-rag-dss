import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ConnectYouTubeButton from '@/components/atoms/ConnectYouTubeButton';
import { supabase } from '@/lib/supabase';

export default async function Home() {
  // Action 5.5: Check connection status
  const { data: profile } = await supabase
    .from('profiles')
    .select('youtube_tokens')
    .eq('user_email', 'primary@user.com')
    .single();

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
}
