'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Tooltip, Stack } from '@mui/material';
import { CheckCircle, YoutubeLogo } from '@phosphor-icons/react';
import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';
import ConnectYouTubeButton from '@/components/atoms/ConnectYouTubeButton';

export default function YouTubeStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const supabase = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    async function checkStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('youtube_tokens')
            .eq('user_email', user.email)
            .single();
          
          const tokens = profile?.youtube_tokens as { refresh_token?: string };
          setIsConnected(!!tokens?.refresh_token);
        }
      } catch (err) {
        console.error('YouTube status check failed:', err);
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, [supabase]);

  if (loading) return null;

  return isConnected ? (
    <Tooltip title="YouTube Connected">
      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={0.75} 
        sx={{ 
          color: 'success.main', 
          px: 1.5, 
          py: 0.5, 
          borderRadius: 10, 
          bgcolor: 'success.lighter', 
          border: '1px solid', 
          borderColor: 'success.light',
          display: { xs: 'none', sm: 'flex' }
        }}
      >
        <YoutubeLogo weight="thin" size={20} />
        <Typography variant="caption" sx={{ fontWeight: 700 }}>Connected</Typography>
        <CheckCircle weight="fill" size={14} />
      </Stack>
    </Tooltip>
  ) : (
    <ConnectYouTubeButton />
  );
}
