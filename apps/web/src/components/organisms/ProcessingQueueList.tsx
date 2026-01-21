'use client';

import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SyncIcon from '@mui/icons-material/Sync';

interface Playlist {
  id: string;
  youtube_id: string;
  title: string;
  video_count: number;
}

export default function ProcessingQueueList({ initialPlaylists }: { initialPlaylists: Playlist[] }) {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleSync = async (playlistId: string) => {
    setSyncingId(playlistId);
    setProgress(10);
    
    // Action 7.4 & 7.5: Trigger API sync (to be implemented in next step)
    // For now, simulated progress
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setSyncingId(null);
          return 0;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 500);
  };

  return (
    <Box>
      <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        {initialPlaylists.map((playlist) => (
          <ListItem 
            key={playlist.id} 
            divider
            secondaryAction={
              <Button 
                startIcon={<SyncIcon />}
                disabled={syncingId !== null}
                onClick={() => handleSync(playlist.id)}
              >
                Sync
              </Button>
            }
          >
            <ListItemText 
              primary={playlist.title} 
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption">{playlist.video_count} videos</Typography>
                  {syncingId === playlist.id && (
                    <LinearProgress variant="determinate" value={progress} sx={{ mt: 1, borderRadius: 1 }} />
                  )}
                </Box>
              } 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
