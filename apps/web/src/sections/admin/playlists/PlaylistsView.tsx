'use client';

import { Container, Typography, Alert, AlertTitle, Box, Button } from '@mui/material';
import Link from 'next/link';
import PlaylistSelector from '@/components/organisms/PlaylistSelector';

interface Props {
  playlists: any[];
}

export default function PlaylistsView({ playlists }: Props) {
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

export function ErrorView({ message }: { message: string }) {
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

export function LoginRequiredView() {
  return (
    <Container sx={{ py: 8 }}>
      <Alert severity="warning" sx={{ borderRadius: 2 }}>
        <AlertTitle>Login Required</AlertTitle>
        Please sign in to access the admin dashboard.
      </Alert>
    </Container>
  );
}

export function ConnectionRequiredView() {
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
