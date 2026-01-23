import { createClient } from '@/lib/supabase';
import { Container, Typography, Grid, Paper, Box, Card, CardContent, Chip, Divider } from '@mui/material';

export const dynamic = 'force-dynamic';

interface IntelligenceEntry {
  id: string;
  extracted_at: string;
  executive_summary: string;
  header_intelligence: {
    title?: string;
    author?: string;
  };
  raw_extraction?: string;
  videos?: {
    title: string;
    youtube_id: string;
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Fetch latest intelligence
  const { data, error } = await supabase
    .from('video_intelligence')
    .select('*, videos(title, youtube_id)')
    .order('extracted_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Dashboard Data Fetch Error:', error);
  }

  const intelligenceEntries = (data as unknown as IntelligenceEntry[]) || [];

  // 2. Fetch finding counts (Mocked)
  const stats = {
    critical: 2,
    highImpact: 5,
    risks: 8
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Intelligence Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        High-level summary of processed intelligence and system findings.
      </Typography>

      {/* 3-Bucket Summary */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderLeft: '6px solid', borderLeftColor: 'error.main' }}>
            <Typography variant="h3" color="error" fontWeight="bold">{stats.critical}</Typography>
            <Typography variant="h6">Critical Blockers</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderLeft: '6px solid', borderLeftColor: 'secondary.main' }}>
            <Typography variant="h3" color="secondary" fontWeight="bold">{stats.highImpact}</Typography>
            <Typography variant="h6">High Impact Decisions</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderLeft: '6px solid', borderLeftColor: 'warning.main' }}>
            <Typography variant="h3" color="warning.main" fontWeight="bold">{stats.risks}</Typography>
            <Typography variant="h6">Potential Risks</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Latest Video Intelligence
      </Typography>

      <Grid container spacing={3}>
        {intelligenceEntries.map((entry) => {
          const intel = entry.header_intelligence;
          return (
            <Grid item xs={12} key={entry.id}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {entry.videos?.title || 'Untitled Video'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Author: {intel?.author || 'Unknown'} | Extracted: {new Date(entry.extracted_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip label="Processed" color="success" size="small" variant="outlined" />
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                        Strategic Context
                      </Typography>
                      <Typography variant="body2">
                        {entry.raw_extraction ? 'Extracted Context Available' : 'No context provided.'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="secondary" fontWeight="bold" gutterBottom>
                        Executive Overview
                      </Typography>
                      <Typography variant="body2">
                        {entry.executive_summary || 'No summary available.'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
