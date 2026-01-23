import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { createClient } from '@/lib/supabase';
import ConnectYouTubeButton from '@/components/atoms/ConnectYouTubeButton';

interface UserProfile {
  youtube_tokens?: unknown;
}

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isConnected = false;
  if (user?.email) {
    const { data } = await supabase
      .from('profiles')
      .select('youtube_tokens')
      .eq('user_email', user.email)
      .single();
    
    const profile = data as UserProfile | null;
    isConnected = !!profile?.youtube_tokens;
  }

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 } }}>
          <Typography variant="h6" component={Link} href="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'primary.main', fontWeight: 'bold' }}>
            hex-rag-dss
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button component={Link} href="/chat" color="inherit">Chat</Button>
            <Button component={Link} href="/compare" color="inherit">Compare</Button>
            <Button component={Link} href="/dashboard" color="inherit">Dashboard</Button>
            {isConnected ? (
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 'medium' }}>
                ✅ Connected
              </Typography>
            ) : (
              <ConnectYouTubeButton />
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
