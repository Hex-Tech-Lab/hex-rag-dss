'use client';

// @mui
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
// @ts-expect-error
import Notification from './Notification';
// @ts-expect-error
import Profile from './Profile';
// @ts-expect-error
import SearchBar from './SearchBar';
// @ts-expect-error
import Breadcrumbs from '@/components/@extended/Breadcrumbs';
// @ts-expect-error
import ThemeModeSwitcher from './ThemeModeSwitcher';
import YouTubeStatus from './YouTubeStatus';

/***************************  HEADER CONTENT  ***************************/

export default function HeaderContent() {
  return (
    <>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: { xs: 'flex-end', md: 'space-between' }, gap: 2, width: 1 }}>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Breadcrumbs />
        </Box>
        <Stack direction="row" sx={{ alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          <YouTubeStatus />
          <SearchBar />
          <ThemeModeSwitcher />
          <Notification />
          <Profile />
        </Stack>
      </Stack>
    </>
  );
}
