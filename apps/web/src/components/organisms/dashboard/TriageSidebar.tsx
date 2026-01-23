'use client';

import { Box, Typography, List, ListItem, ListItemText, Chip, Paper, Divider } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Finding {
  bucket: 'Critical' | 'High Impact' | 'Potential Blockers' | 'Remaining Risks';
  message: string;
  tool: string;
}

const getBucketColor = (bucket: string) => {
  switch (bucket) {
    case 'Critical': return 'error';
    case 'High Impact': return 'secondary';
    case 'Potential Blockers': return 'warning';
    default: return 'info';
  }
};

const getBucketIcon = (bucket: string) => {
  switch (bucket) {
    case 'Critical': return <ErrorIcon fontSize="small" />;
    case 'High Impact': return <WarningIcon fontSize="small" />;
    case 'Potential Blockers': return <InfoIcon fontSize="small" />;
    default: return <CheckCircleIcon fontSize="small" />;
  }
};

export default function TriageSidebar({ findings }: { findings: Finding[] }) {
  return (
    <Box sx={{ height: '100%', overflowY: 'auto', p: 2, borderRight: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Triage Feed
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        Live 4-Bucket Audit Findings
      </Typography>
      
      <List spacing={2}>
        {findings.map((f, i) => (
          <Paper key={i} variant="outlined" sx={{ mb: 2, p: 1.5, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getBucketIcon(f.bucket)}
              <Chip 
                label={f.bucket} 
                size="small" 
                color={getBucketColor(f.bucket) as any} 
                variant="filled"
                sx={{ fontWeight: 'bold', fontSize: '0.65rem' }}
              />
            </Box>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
              {f.message}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Source: {f.tool}
            </Typography>
          </Paper>
        ))}
      </List>
    </Box>
  );
}
