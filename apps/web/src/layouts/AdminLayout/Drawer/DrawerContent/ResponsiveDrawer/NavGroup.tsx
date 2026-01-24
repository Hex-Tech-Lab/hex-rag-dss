'use client';

// @mui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

// @project
// @ts-expect-error - legacy SaasAble component
import NavCollapse from './NavCollapse';
// @ts-expect-error - legacy SaasAble component
import NavItem from './NavItem';
import { NavItem as NavItemType } from '@/types/menu';

/***************************  RESPONSIVE DRAWER - GROUP - TYPES  ***************************/

interface Props {
  item: NavItemType;
}

/***************************  RESPONSIVE DRAWER - GROUP  ***************************/

export default function NavGroup({ item }: Props) {
  const renderNavItem = (menuItem: NavItemType) => {
    // Render items based on the type
    switch (menuItem.type) {
      case 'collapse':
        return <NavCollapse key={menuItem.id} item={menuItem} />;
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  };

  return (
    <List
      component="div"
      subheader={
        item.title && (
          <Typography component="div" variant="caption" sx={{ mb: 0.75, color: 'grey.700', px: 2 }}>
            {item.title}
          </Typography>
        )
      }
      sx={{ '&:not(:first-of-type)': { pt: 1, borderTop: '1px solid', borderColor: 'divider' }, px: 0 }}
    >
      {item.children?.map((menuItem) => renderNavItem(menuItem))}
    </List>
  );
}
