'use client';

import { Fragment, useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
// @ts-expect-error - legacy SaasAble component
import EmptySearch from '@/components/header/empty-state/EmptySearch';
import MainCard from '@/components/MainCard';
// @ts-expect-error - legacy SaasAble component
import NotificationItem from '@/components/NotificationItem';
// @ts-expect-error - legacy SaasAble component
import { AvatarSize } from '@/enum';

// @assets
import { IconCommand, IconSearch } from '@tabler/icons-react';

/***************************  HEADER - SEARCH DATA  ***************************/

const profileData = [
  { alt: 'Applicant Warner', src: '/assets/images/users/avatar-1.png', title: 'Applicant Warner', subTitle: 'Admin' },
  { alt: 'Applicant Aweoa', src: '/assets/images/users/avatar-2.png', title: 'Applicant Aweoa', subTitle: 'Admin' }
];

const listContent = [
  { title: 'Role', items: ['Applicant', 'App User'] },
  { title: 'Files', items: ['Applicant', 'Applicant'] }
];

/***************************  HEADER - SEARCH BAR  ***************************/

export default function SearchBar() {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  const buttonStyle = { borderRadius: 2, p: 1 };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEmptySearch, setIsEmptySearch] = useState(true);
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPopper = () => {
    setAnchorEl(inputRef.current);
    setIsPopperOpen(true);
  };

  const handleActionClick = () => {
    if (isPopperOpen) {
      setIsPopperOpen(false);
      setAnchorEl(null);
    } else {
      openPopper();
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isEmpty = event.target.value.trim() === '';
    setIsEmptySearch(isEmpty);

    if (!isPopperOpen && !isEmpty) {
      openPopper();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isPopperOpen) {
      openPopper();
    } else if (event.key === 'Escape' && isPopperOpen) {
      setIsPopperOpen(false);
      setAnchorEl(null);
    } else if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      if (!isPopperOpen) {
        openPopper();
      }
    }
  };

  const renderSubheader = (title: string, withMarginTop = false) => (
    <ListSubheader sx={{ color: 'text.disabled', typography: 'caption', py: 0.5, px: 1, mb: 0.5, ...(withMarginTop && { mt: 1.5 }) }}>
      {title}
    </ListSubheader>
  );

  const renderListItem = (item: string, index: number) => (
    <ListItemButton key={index} sx={buttonStyle} onClick={handleActionClick}>
      <ListItemText primary={item} />
    </ListItemButton>
  );

  useEffect(() => {
    const handleGlobalKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        if (document.activeElement !== inputRef.current) {
          openPopper();
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  return (
    <>
      <OutlinedInput
        inputRef={inputRef}
        placeholder="Search here"
        startAdornment={
          <InputAdornment position="start">
            <IconSearch />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Stack direction="row" sx={{ gap: 0.25, opacity: 0.8, alignItems: 'center', color: 'grey.600', '& svg': { color: 'inherit' } }}>
              <IconCommand />
              <Typography variant="caption">+ K</Typography>
            </Stack>
          </InputAdornment>
        }
        aria-describedby="Search"
        slotProps={{ input: { 'aria-label': 'search' } }}
        onClick={handleActionClick}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        sx={{ minWidth: { xs: 170, sm: 240 } }}
      />
      <Popper
        placement="bottom"
        id={isPopperOpen ? 'search-action-popper' : undefined}
        open={isPopperOpen}
        anchorEl={anchorEl}
        transition
        popperOptions={{
          modifiers: [{ name: 'offset', options: { offset: [downSM ? 20 : 0, 8] } }]
        }}
      >
        {({ TransitionProps }) => (
          <Fade in={isPopperOpen} {...TransitionProps}>
            <MainCard
              sx={{
                borderRadius: 2,
                // @ts-expect-error - legacy SaasAble component
                boxShadow: theme.customShadows?.tooltip || theme.shadows[1],
                width: 1,
                minWidth: { xs: 352, sm: 240 },
                maxWidth: { xs: 352, md: 420 },
                p: 0.5
              }}
            >
              <ClickAwayListener
                onClickAway={() => {
                  setIsPopperOpen(false);
                  setAnchorEl(null);
                }}
              >
                <div>
                  {isEmptySearch ? (
                    <EmptySearch />
                  ) : (
                    <List disablePadding>
                      {renderSubheader('Users')}
                      {profileData.map((user, index) => (
                        <ListItemButton sx={buttonStyle} key={index} onClick={handleActionClick}>
                          <NotificationItem
                            avatar={{ alt: user.alt, src: user.src, size: AvatarSize.XS }}
                            title={user.title}
                            subTitle={user.subTitle}
                          />
                        </ListItemButton>
                      ))}
                      {listContent.map((list, index) => (
                        <Fragment key={index}>
                          {renderSubheader(list.title, true)}
                          {list.items.map((item, idx) => renderListItem(item, idx))}
                        </Fragment>
                      ))}
                    </List>
                  )}
                </div>
              </ClickAwayListener>
            </MainCard>
          </Fade>
        )}
      </Popper>
    </>
  );
}
