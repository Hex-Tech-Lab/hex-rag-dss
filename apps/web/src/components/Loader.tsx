'use client';

// @mui
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

/***************************  LOADER  ***************************/

export default function Loader() {
  if (typeof window === 'undefined') return null;

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, zIndex: 2001, width: '100%' }}>
      <LinearProgress variant="indeterminate" color="primary" />
    </Box>
  );
}