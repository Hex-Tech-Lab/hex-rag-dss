'use client';

import { useState } from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Paper, Divider } from '@mui/material';
import { IconDatabase, IconTerminal, IconFolder, IconTable } from '@tabler/icons-react';
import ChatCommandCenter from '@/components/organisms/dashboard/ChatCommandCenter';
import ComparisonPanel from '@/components/organisms/dashboard/ComparisonPanel';

interface Props {
  findings: any[];
}

type Mode = 'ingestion' | 'command';

export default function DashboardView({ findings }: Props) {
  const [mode, setMode] = useState<Mode>('ingestion');

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)', overflow: 'hidden', bgcolor: 'grey.50', mx: -3, mb: -3 }}>
      {/* Pane 1: The Navigator (Left) */}
      <Box sx={{ width: '240px', flexShrink: 0, bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider' }}>
        <List>
          <ListItemButton selected={mode === 'ingestion'} onClick={() => setMode('ingestion')}>
            <ListItemIcon><IconDatabase /></ListItemIcon>
            <ListItemText primary="Ingestion Queue" />
          </ListItemButton>
          <ListItemButton selected={mode === 'command'} onClick={() => setMode('command')}>
            <ListItemIcon><IconTerminal /></ListItemIcon>
            <ListItemText primary="Command Center" />
          </ListItemButton>
        </List>
      </Box>

      {/* Pane 2: The Core (Center) */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: '400px', borderRight: '1px solid', borderColor: 'divider' }}>
        {mode === 'ingestion' ? (
          <Box sx={{ display: 'flex', height: '100%' }}>
            {/* Tree View Mock */}
            <Box sx={{ width: '30%', borderRight: '1px solid', borderColor: 'divider', p: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconFolder size={16} /> Playlists
              </Typography>
              <List dense>
                <ListItemButton><ListItemText primary="Hex-RAG-DSS" /></ListItemButton>
                <ListItemButton><ListItemText primary="WhatsApp Exports" /></ListItemButton>
              </List>
            </Box>
            {/* Data Grid Mock */}
            <Box sx={{ flexGrow: 1, p: 2, bgcolor: '#fff' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconTable size={16} /> Video Queue
              </Typography>
              <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
                <Typography color="text.secondary">Drag & Drop YouTube URLs Here</Typography>
              </Paper>
            </Box>
          </Box>
        ) : (
          <ChatCommandCenter />
        )}
      </Box>

      {/* Pane 3: The Helper (Right) */}
      <Box sx={{ width: '380px', flexShrink: 0, bgcolor: 'background.paper' }}>
        {mode === 'ingestion' ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Queue Stats</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2">Pending: 0</Typography>
            <Typography variant="body2">Processing: 0</Typography>
            <Typography variant="body2">Completed: {findings.length}</Typography>
          </Box>
        ) : (
          <ComparisonPanel />
        )}
      </Box>
    </Box>
  );
}
