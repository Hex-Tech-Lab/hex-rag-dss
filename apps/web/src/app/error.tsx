'use client';

import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <Container sx={{ py: 8 }}>
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        <AlertTitle>Something went wrong!</AlertTitle>
        <Typography variant="body1" gutterBottom>
          An unexpected server-side exception occurred.
        </Typography>
        {error.digest && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'monospace' }}>
            Error Digest: {error.digest}
          </Typography>
        )}
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => reset()}
          >
            Try again
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.location.href = '/'}
          >
            Go to Home
          </Button>
        </Box>
      </Alert>
    </Container>
  );
}
