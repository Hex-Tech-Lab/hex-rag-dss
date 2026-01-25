'use client';

import { useState, useRef } from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, IconButton, Box, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { IconHome, IconList, IconMicrophone, IconSettings, IconUser, IconLink, IconFileUpload } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';

export default function MobileControlBar() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    longPressTimer.current = setTimeout(() => {
      e.preventDefault();
      const touch = e.touches[0];
      setContextMenu({ mouseX: touch.clientX, mouseY: touch.clientY });
    }, 800); // 800ms for long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleVoiceTap = () => {
    if (contextMenu) return; // Don't trigger if menu opened
    
    // Native Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      if (!isRecording) {
        recognition.start();
        setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice Input:', transcript);
          // Dispatch event or update global state
        };
      } else {
        recognition.stop();
        setIsRecording(false);
      }
    } else {
      alert('Speech recognition not supported');
    }
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1300 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          if (newValue !== 2) setValue(newValue); // Don't highlight center button
        }}
        sx={{ height: 80, pb: 2 }}
      >
        <BottomNavigationAction label="Home" icon={<IconHome />} />
        <BottomNavigationAction label="Queue" icon={<IconList />} />
        
        <Box sx={{ position: 'relative', top: -20 }}>
          <IconButton
            size="large"
            sx={{
              bgcolor: isRecording ? 'error.main' : 'primary.main',
              color: 'white',
              width: 56,
              height: 56,
              boxShadow: 6,
              '&:hover': { bgcolor: isRecording ? 'error.dark' : 'primary.dark' }
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleVoiceTap}
          >
            <IconMicrophone size={32} />
          </IconButton>
        </Box>

        <BottomNavigationAction label="Settings" icon={<IconSettings />} />
        <BottomNavigationAction label="Profile" icon={<IconUser />} />
      </BottomNavigation>

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon><IconLink size={20} /></ListItemIcon>
          <ListItemText>Paste URL</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon><IconFileUpload size={20} /></ListItemIcon>
          <ListItemText>Upload File</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
}
