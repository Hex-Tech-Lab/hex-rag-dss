'use client';

import Button from '@mui/material/Button';
import YouTubeIcon from '@mui/icons-material/YouTube';

/**
 * ConnectYouTubeButton Atom (Action 5.4)
 * Triggers the auth flow via /api/auth/youtube
 */
export default function ConnectYouTubeButton() {
  const handleConnect = () => {
    window.location.href = '/api/auth/youtube';
  };

  return (
    <Button
      variant="contained"
      color="error"
      startIcon={<YouTubeIcon />}
      onClick={handleConnect}
      sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
    >
      Connect YouTube Account
    </Button>
  );
}
