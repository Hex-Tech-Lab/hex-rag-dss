'use client';

import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { ComparisonMatrixResult } from '@/lib/intelligence/compare';

interface Props {
  data: ComparisonMatrixResult;
  altA: string;
  altB: string;
}

export default function ComparisonView({ data, altA, altB }: Props) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Comparison Matrix
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {altA} vs {altB}
      </Typography>

      {data.summary && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="h6" gutterBottom>Executive Summary</Typography>
          <Typography variant="body1">{data.summary}</Typography>
        </Paper>
      )}

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Criteria</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{altA}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{altB}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.matrix?.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: 'medium' }}>{row.criteria}</TableCell>
                <TableCell>{row.altA}</TableCell>
                <TableCell>{row.altB}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="secondary">Contrasting Viewpoints</Typography>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            {data.contrasting_viewpoints?.map((vp, i) => (
              <ListItem key={i}>
                <ListItemText primary={vp} />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="warning.main">Knowledge Gaps</Typography>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            {data.gaps_identified?.map((gap, i) => (
              <ListItem key={i}>
                <ListItemText primary={gap} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
}
