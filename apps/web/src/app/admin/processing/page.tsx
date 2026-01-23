import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createClient } from '@/lib/supabase';
import ProcessingQueueList from '@/components/organisms/ProcessingQueueList';

export const dynamic = 'force-dynamic';

export default async function AdminProcessingPage() {
  const supabase = await createClient();
  // Fetch synced playlists
  const { data: playlists } = await supabase
    .from('playlists')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Video Processing Queue
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Index videos and extract intelligence from your selected playlists.
      </Typography>

      <ProcessingQueueList initialPlaylists={playlists || []} />
    </Container>
  );
}
