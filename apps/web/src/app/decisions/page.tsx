import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { supabase } from '@/lib/supabase';

/**
 * Decision Log Screen (Action 10.2)
 * Lists all "New Truths" recorded in the system.
 */
export default async function DecisionsPage() {
  const { data: decisions } = await supabase
    .from('decisions')
    .select('*')
    .eq('is_active', true)
    .order('decided_at', { ascending: false });

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Decision Log (New Truths)
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Chronological record of timestamped decisions that guide future intelligence queries.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {decisions && decisions.length > 0 ? (
          decisions.map((decision) => (
            <Box 
              key={decision.id} 
              sx={{ 
                p: 3, 
                bgcolor: 'background.paper', 
                borderRadius: 2, 
                boxShadow: 1,
                borderLeft: 6,
                borderColor: 'primary.main'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {decision.topic}
                </Typography>
                <Chip 
                  label={new Date(decision.decided_at).toLocaleDateString()} 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                {decision.decision}
              </Typography>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Rationale:
              </Typography>
              <Typography variant="body2" color="text.primary">
                {decision.rationale}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 8 }}>
            No decisions recorded yet. Start a session to define "New Truths".
          </Typography>
        )}
      </Box>
    </Container>
  );
}
