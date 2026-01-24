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
  const hasMounted = useHasMounted();
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const { themeDirection } = useConfig();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'), { noSsr: true });
  const downXL = useMediaQuery((theme: any) => theme.breakpoints.down('xl'), { noSsr: true });

  useEffect(() => {
    if (hasMounted) {
      handlerDrawerOpen(!downXL);
    }
  }, [downXL, hasMounted]);

  if (menuMasterLoading || !hasMounted) return <Loader />;

  return (
    <Stack direction="row" width={1}>
      <Header />
      {!isMobile && <Drawer />}
      
      <Box 
        component="main" 
        sx={{ 
          width: isMobile ? '100%' : `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)`, 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 },
          minHeight: '100vh',
          bgcolor: 'grey.50',
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          pb: isMobile ? '80px' : 3 // Space for bottom nav
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

      {isMobile && <BottomNav />}
    </Stack>
  );
}
