'use client';

import { useEffect, ReactNode } from 'react';

// @mui
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// @project
// @ts-expect-error
import Drawer from './Drawer';
// @ts-expect-error
import Header from './Header';
// @ts-expect-error
import { handlerDrawerOpen, useGetMenuMaster } from '@/states/menu';
// @ts-expect-error
import Breadcrumbs from '@/components/@extended/Breadcrumbs';
// @ts-expect-error
import Loader from '@/components/Loader';

import { DRAWER_WIDTH } from '@/config';

/***************************  ADMIN LAYOUT - TYPES  ***************************/

interface Props {
  children: ReactNode;
}

/***************************  ADMIN LAYOUT  ***************************/

export default function DashboardLayout({ children }: Props) {
  const theme = useTheme();
  const { menuMasterLoading } = useGetMenuMaster();

  const downXL = useMediaQuery(theme.breakpoints.down('xl'));

  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Stack direction="row" width={1}>
      <Header />
      <Drawer />
      <Box 
        component="main" 
        sx={{ 
          width: `calc(100% - ${DRAWER_WIDTH}px)`, 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 },
          minHeight: '100vh',
          bgcolor: 'grey.50'
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
        <Container maxWidth={false} sx={{ px: { xs: 0, sm: 2 } }}>
          {children}
        </Container>
      </Box>
    </Stack>
  );
}