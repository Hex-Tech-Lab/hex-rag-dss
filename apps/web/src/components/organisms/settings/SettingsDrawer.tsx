'use client';

import { 
  Drawer, 
  Box, 
  Typography, 
  Stack, 
  IconButton, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Switch,
  Tooltip
} from '@mui/material';
import { 
  IconX, 
  IconSun, 
  IconMoon, 
  IconLanguage, 
  IconLayoutSidebarLeftExpand, 
  IconLayoutSidebarRightExpand,
  IconCircleFilled,
  IconQuestionMark,
  IconMail
} from '@tabler/icons-react';
import { useConfig } from '@/contexts/ConfigContext';
import { ThemeDirection } from '@/config';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDrawer({ open, onClose }: Props) {
  const { 
    themeDirection,
    onChangeDirection, 
    isLeftPinned, 
    setLeftPinned, 
    isRightPinned, 
    setRightPinned 
  } = useConfig();

  const isRTL = themeDirection === ThemeDirection.RTL;

  const handleToggleRTL = () => {
    onChangeDirection(isRTL ? ThemeDirection.LTR : ThemeDirection.RTL);
  };

  return (
    <Drawer
      anchor={isRTL ? 'left' : 'right'}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 360 }, bgcolor: 'background.paper', p: 0 }
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
        <Typography variant="h5" fontWeight="bold">Settings</Typography>
        <IconButton onClick={onClose} size="small">
          <IconX size={20} />
        </IconButton>
      </Stack>

      <Divider />

      <Box sx={{ overflowY: 'auto', p: 2 }}>
        {/* Layout Section */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, mt: 1 }}>Layout & Direction</Typography>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton onClick={handleToggleRTL}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <IconLanguage size={22} color="#606BDF" />
              </ListItemIcon>
              <ListItemText primary="RTL Support (Arabic)" secondary={isRTL ? 'Enabled' : 'Disabled'} />
              <Switch checked={isRTL} edge="end" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setLeftPinned(!isLeftPinned)}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <IconLayoutSidebarLeftExpand size={22} color="#AE6600" />
              </ListItemIcon>
              <ListItemText primary="Pin Triage Feed" secondary={isLeftPinned ? 'Pinned' : 'Floating'} />
              <Switch checked={isLeftPinned} edge="end" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setRightPinned(!isRightPinned)}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <IconLayoutSidebarRightExpand size={22} color="#22892F" />
              </ListItemIcon>
              <ListItemText primary="Pin Intelligence Matrix" secondary={isRightPinned ? 'Pinned' : 'Floating'} />
              <Switch checked={isRightPinned} edge="end" />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Theme Section */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, mt: 3 }}>Appearance</Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Tooltip title="Light Mode">
            <IconButton sx={{ bgcolor: 'grey.100', color: 'primary.main', borderRadius: 2, p: 2, flex: 1 }}>
              <IconSun size={24} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Dark Mode (Coming Soon)">
            <IconButton disabled sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2, flex: 1 }}>
              <IconMoon size={24} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Presets */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Color Preset</Typography>
        <Stack direction="row" spacing={1.5}>
          {['#606BDF', '#DE3730', '#AE6600', '#22892F'].map((color) => (
            <IconButton key={color} sx={{ p: 0.5, border: '2px solid', borderColor: 'transparent', '&:hover': { borderColor: 'divider' } }}>
              <IconCircleFilled size={28} color={color} />
            </IconButton>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Support Section */}
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <IconQuestionMark size={22} color="#008394" />
              </ListItemIcon>
              <ListItemText primary="Help & Documentation" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <IconMail size={22} color="#5A5C78" />
              </ListItemIcon>
              <ListItemText primary="Contact Support" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}