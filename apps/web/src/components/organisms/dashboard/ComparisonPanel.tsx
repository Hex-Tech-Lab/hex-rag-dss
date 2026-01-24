'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

interface ComparisonData {
  summary: string;
  matrix: { criteria: string; altA: string; altB: string }[];
  contrasting_viewpoints: string[];
  gaps_identified: string[];
}

export default function ComparisonPanel({ data }: { data?: ComparisonData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!data) {
    return (
      <Box sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid', borderColor: 'divider' }}>
        <CompareArrowsIcon sx={{ fontSize: 48, color: 'divider', mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          No active comparison. Use chat to generate a matrix.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', p: 2, borderLeft: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CompareArrowsIcon color="secondary" />
        <Typography variant="h6" fontWeight="bold">
          Intelligence Matrix
        </Typography>
      </Box>

      {data.summary && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'secondary.light', color: 'secondary.contrastText', borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold">Executive Summary</Typography>
          <Typography variant="body2">{data.summary}</Typography>
        </Paper>
      )}

      {data.matrix && data.matrix.length > 0 && (
        <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Criteria</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>A</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>B</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.matrix.map((row, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>{row.criteria}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.altA}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.altB}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Contrasting Viewpoints</Typography>
      <Divider sx={{ mb: 1 }} />
      <List dense sx={{ mb: 3 }}>
        {data.contrasting_viewpoints?.map((vp, i) => (
          <ListItem key={i} sx={{ px: 0 }}>
            <ListItemText primary={vp} primaryTypographyProps={{ fontSize: '0.75rem' }} />
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Knowledge Gaps</Typography>
      <Divider sx={{ mb: 1 }} />
      <List dense>
        {data.gaps_identified?.map((gap, i) => (
          <ListItem key={i} sx={{ px: 0 }}>
            <ListItemText primary={gap} primaryTypographyProps={{ fontSize: '0.75rem' }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
