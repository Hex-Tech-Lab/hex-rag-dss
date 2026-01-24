'use client';

import { useMemo, useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// @project
// @ts-expect-error - legacy SaasAble component
import AppBarStyled from './AppBarStyled';
// @ts-expect-error - legacy SaasAble component
import HeaderContent from './HeaderContent';
// @ts-expect-error - legacy SaasAble component
import { handlerDrawerOpen, useGetMenuMaster } from '@/states/menu';
import { DRAWER_WIDTH } from '@/config';
import SettingsDrawer from '@/components/organisms/settings/SettingsDrawer';

// @assets
import { IconLayoutSidebarRightCollapse, IconMenu2, IconSettings } from '@tabler/icons-react';

/***************************  ADMIN LAYOUT - HEADER  ***************************/

export default function Header() {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  // Memoized header content to avoid unnecessary re-renders
  const headerContent = useMemo(() => <HeaderContent />, []);

  // Common header content
  const mainHeader = (
    <Toolbar sx={{ minHeight: { xs: 68, md: 76 }, px: { xs: 2, sm: 3 } }}>
      <IconButton
        aria-label="open drawer"
        onClick={() => handlerDrawerOpen(!drawerOpen)}
        size="small"
        color="secondary"
        variant="outlined"
        sx={{ 
          display: { xs: 'inline-flex', lg: !drawerOpen ? 'inline-flex' : 'none' }, 
          mr: 2 
        }}
      >
        {!drawerOpen && !downLG && <IconLayoutSidebarRightCollapse size={20} />}
        {downLG && <IconMenu2 size={20} />}
      </IconButton>
      <Box sx={{ flexGrow: 1 }} />
      {headerContent}
      
      <Tooltip title="Settings">
        <IconButton
          onClick={() => setSettingsOpen(true)}
          size="small"
          sx={{ 
            color: 'text.primary', 
            bgcolor: 'grey.100',
            borderRadius: 1,
            ml: 1.5
          }}
        >
          <IconSettings size={20} />
        </IconButton>
      </Tooltip>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Toolbar>
  );

  // AppBar props, including styles that vary based on drawer state and screen size
  const appBar = {
    color: 'inherit' as const,
    position: 'fixed' as const,
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200,
      width: { xs: '100%', lg: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : 1 },
      bgcolor: 'background.paper'
    }
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={drawerOpen} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
}