import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box, Container, Tooltip } from '@mui/material';
import { createClient } from '@/lib/supabase';
import ConnectYouTubeButton from '@/components/atoms/ConnectYouTubeButton';
import { CheckCircle, YoutubeLogo } from '@phosphor-icons/react/dist/ssr';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isConnected = false;
  if (user?.email) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('youtube_tokens')
      .eq('user_email', user.email)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Header Auth Check Error:', error);
    }
    
    const tokens = profile?.youtube_tokens as any;
    isConnected = !!tokens?.refresh_token;
  }

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', zIndex: 1201 }}>
      <Container maxWidth={false}>
        <Toolbar sx={{ px: { xs: 0 }, justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            component={Link} 
            href="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'primary.main', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Box sx={{ bgcolor: 'primary.main', color: 'white', px: 1.2, py: 0.2, borderRadius: 1.5, fontSize: '0.85rem', fontWeight: 800 }}>HEX</Box>
            <Box component="span" sx={{ color: 'text.primary', letterSpacing: -0.5 }}>RAG-DSS</Box>
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button component={Link} href="/dashboard" color="inherit" size="small" sx={{ fontWeight: 500 }}>Dashboard</Button>
            <Button component={Link} href="/chat" color="inherit" size="small" sx={{ fontWeight: 500 }}>Chat</Button>
            <Button component={Link} href="/decisions" color="inherit" size="small" sx={{ fontWeight: 500 }}>Log</Button>
            
            <Box sx={{ width: '1px', height: '20px', bgcolor: 'divider', mx: 1 }} />
            
            {isConnected ? (
              <Tooltip title="YouTube Connected">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'success.main', px: 1.5, py: 0.5, borderRadius: 10, bgcolor: 'success.lighter', border: '1px solid', borderColor: 'success.light' }}>
                  <YoutubeLogo weight="thin" size={20} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>Connected</Typography>
                  <CheckCircle weight="fill" size={14} />
                </Box>
              </Tooltip>
            ) : (
              <ConnectYouTubeButton />
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
