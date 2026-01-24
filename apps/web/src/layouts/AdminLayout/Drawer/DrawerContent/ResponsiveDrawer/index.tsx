'use client';

// @mui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
// @ts-expect-error - legacy SaasAble component
import menuItems from '@/menu';
// @ts-expect-error - legacy SaasAble component
import NavGroup from './NavGroup';
import { NavItem } from '@/types/menu';

/***************************  DRAWER CONTENT - RESPONSIVE DRAWER  ***************************/

export default function ResponsiveDrawer() {
  const navGroups = menuItems.items.map((item: NavItem, index: number) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id || index} item={item} />;
      default:
        return (
          <Typography key={index} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ py: 1 }}>{navGroups}</Box>;
}
