'use client';

// @mui
import { useColorScheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// @assets
import { IconMoon, IconSun } from '@tabler/icons-react';

/***************************  HEADER - THEME MODE SWITCHER  ***************************/

export default function ThemeModeSwitcher() {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  return (
    <Tooltip title={mode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}>
      <IconButton
        color="secondary"
        size="small"
        onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        aria-label="toggle theme mode"
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
      >
        {mode === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
      </IconButton>
    </Tooltip>
  );
}