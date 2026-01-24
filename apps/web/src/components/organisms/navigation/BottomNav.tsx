'use client';

import { useState } from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { 
  IconLayoutSidebarLeftExpand, 
  IconMessageChatbot, 
  IconColumns, 
  IconSettings 
} from '@tabler/icons-react';
import { useConfig } from '@/contexts/ConfigContext';
import SettingsDrawer from '@/components/organisms/settings/SettingsDrawer';

export default function BottomNav() {
  const [value, setValue] = useState(1); // Default to Chat
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isRTL } = useConfig();

  return (
    <>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1300 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            if (newValue === 3) {
              setSettingsOpen(true);
            } else {
              setValue(newValue);
            }
          }}
          sx={{
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            height: 70,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              padding: '12px 0',
            },
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }}
        >
          <BottomNavigationAction label="Triage" icon={<IconLayoutSidebarLeftExpand size={22} />} />
          <BottomNavigationAction label="Chat" icon={<IconMessageChatbot size={22} />} />
          <BottomNavigationAction label="Matrix" icon={<IconColumns size={22} />} />
          <BottomNavigationAction label="Settings" icon={<IconSettings size={22} />} />
        </BottomNavigation>
      </Paper>
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}