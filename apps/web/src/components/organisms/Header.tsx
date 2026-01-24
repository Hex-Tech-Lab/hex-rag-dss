'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box, Container, Tooltip, Stack } from '@mui/material';
import { CheckCircle, YoutubeLogo } from '@phosphor-icons/react';
import ConnectYouTubeButton from '@/components/atoms/ConnectYouTubeButton';

/***************************  HEADER - TYPES  ***************************/

interface HeaderProps {
  isConnected?: boolean;
}

/***************************  HEADER  ***************************/

export default function Header({ isConnected = false }: HeaderProps) {
  return (
    <AppBar 
      position="fixed" 
      color="inherit" 
      elevation={0} 
      sx={{ 
        borderBottom: '1px solid', 
        borderColor: 'divider', 
        bgcolor: 'background.paper', 
        zIndex: 1201 
      }}
    >
      <Container maxWidth={false}>
        <Toolbar sx={{ px: { xs: 0 }, justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={1.5} component={Link} href="/" sx={{ textDecoration: 'none' }}>
            <Box 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                px: 1.2, 
                py: 0.2, 
                borderRadius: 1.5, 
                fontSize: '0.85rem', 
                fontWeight: 800 
              }}
            >
              HEX
            </Box>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, letterSpacing: -0.5 }}>
              RAG-DSS
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Button component={Link} href="/dashboard" color="inherit" size="small" sx={{ fontWeight: 500 }}>Dashboard</Button>
            <Button component={Link} href="/chat" color="inherit" size="small" sx={{ fontWeight: 500 }}>Chat</Button>
            <Button component={Link} href="/decisions" color="inherit" size="small" sx={{ fontWeight: 500 }}>Log</Button>
            
            <Box sx={{ width: '1px', height: '20px', bgcolor: 'divider', mx: 1 }} />
            
            {isConnected ? (
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
                    borderColor: 'success.light' 
                  }}
                >
                  <YoutubeLogo weight="thin" size={20} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>Connected</Typography>
                  <CheckCircle weight="fill" size={14} />
                </Stack>
              </Tooltip>
            ) : (
              <ConnectYouTubeButton />
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
