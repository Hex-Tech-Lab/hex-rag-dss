'use client';

import { ReactNode, useEffect } from 'react';

// @mui
import { useMediaQuery } from '@mui/material';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
// @ts-expect-error - legacy SaasAble component
import Drawer from './Drawer';
// @ts-expect-error - legacy SaasAble component
import Header from './Header';
// @ts-expect-error - legacy SaasAble component
import Breadcrumbs from '@/components/@extended/Breadcrumbs';
// @ts-expect-error - legacy SaasAble component
import Loader from '@/components/Loader';
import { handlerDrawerOpen, useGetMenuMaster } from '@/states/menu';
import { useConfig } from '@/contexts/ConfigContext';
import { DRAWER_WIDTH } from '@/config';
import { useHasMounted } from '@/hooks/useHasMounted';

// New Mobile components
import BottomNav from '@/components/organisms/navigation/BottomNav';

/***************************  ADMIN LAYOUT - TYPES  ***************************/

interface Props {
  children: ReactNode;
}

/***************************  ADMIN LAYOUT  ***************************/

export default function DashboardLayout({ children }: Props) {
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const { themeDirection } = useConfig();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  // We keep JS media queries for 'logic' (like drawer auto-close) but NOT for 'rendering' existence
  const downXL = useMediaQuery((theme: any) => theme.breakpoints.down('xl'), { noSsr: true });

  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Stack direction="row" width={1}>
      <Header />
      
      {/* Sidebar: Always render, hide via CSS on mobile */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Drawer />
      </Box>
      
      <Box 
        component="main" 
        sx={{ 
          width: { xs: '100%', md: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)` }, 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 },
          minHeight: '100vh',
          bgcolor: 'grey.50',
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          pb: { xs: '80px', md: 3 } // Space for bottom nav
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 54, sm: 46, md: 76 } }} />
        <Box
          sx={{
            py: 0.4,
            px: 1.5,
            mx: { xs: -2, sm: -3 },
            display: { xs: 'block', md: 'none' },
            borderBottom: 1,
            borderColor: 'divider',
            mb: 2
          }}
        >
          <Breadcrumbs />
        </Box>
        <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
          {children}
        </Container>
      </Box>

      {/* Mobile Bar: Always render, hide via CSS on desktop */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <MobileControlBar />
      </Box>
    </Stack>
  );
}
