'use client';

import { Container, Typography } from '@mui/material';
import ProcessingQueueList from '@/components/organisms/ProcessingQueueList';

interface Props {
  playlists: any[];
}

export default function ProcessingView({ playlists }: Props) {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Video Processing Queue
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Index videos and extract intelligence from your selected playlists.
      </Typography>

      <ProcessingQueueList initialPlaylists={playlists} />
    </Container>
  );
}
