'use client';

import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { supabase } from '@/lib/supabase';

interface Playlist {
  id: string;
  title: string;
  description: string;
  videoCount: number;
  thumbnail: string;
}

export default function PlaylistSelector({ initialPlaylists }: { initialPlaylists: Playlist[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const togglePlaylist = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSync = async () => {
    setLoading(true);
    const selectedMetadata = initialPlaylists.filter(p => selectedIds.includes(p.id));
    
    // Action 6.4: Save to Supabase
    for (const p of selectedMetadata) {
      await supabase.from('playlists').upsert({
        youtube_id: p.id,
        title: p.title,
        description: p.description,
        video_count: p.videoCount,
        last_synced_at: new Date().toISOString()
      });
    }
    
    setLoading(false);
    alert('Playlists selected for indexing!');
  };

  return (
    <Box>
      <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, mb: 4 }}>
        {initialPlaylists.map((playlist) => (
          <ListItem 
            key={playlist.id} 
            divider
            secondaryAction={
              <Checkbox 
                edge="end" 
                onChange={() => togglePlaylist(playlist.id)}
                checked={selectedIds.includes(playlist.id)}
              />
            }
          >
            <ListItemAvatar>
              <Avatar src={playlist.thumbnail} variant="rounded" />
            </ListItemAvatar>
            <ListItemText 
              primary={playlist.title} 
              secondary={`${playlist.videoCount} videos`} 
            />
          </ListItem>
        ))}
      </List>
      
      <Button 
        variant="contained" 
        size="large" 
        fullWidth 
        disabled={selectedIds.length === 0 || loading}
        onClick={handleSync}
      >
        {loading ? 'Saving...' : `Index ${selectedIds.length} Playlists`}
      </Button>
    </Box>
  );
}
