'use client';

import { Fragment, useState, MouseEvent } from 'react';

// @mui
import { keyframes, useTheme } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
// @ts-expect-error - legacy SaasAble component
import EmptyNotification from '@/components/header/empty-state/EmptyNotification';
import MainCard from '@/components/MainCard';
// @ts-expect-error - legacy SaasAble component
import NotificationItem from '@/components/NotificationItem';
// @ts-expect-error - legacy SaasAble component
import SimpleBar from '@/components/third-party/SimpleBar';

// @assets
import { IconBell, IconCode, IconChevronDown, IconGitBranch, IconNote, IconGps } from '@tabler/icons-react';

const swing = keyframes`
  20% { transform: rotate(15deg) scale(1); }
  40% { transform: rotate(-10deg) scale(1.05); }
  60% { transform: rotate(5deg) scale(1.1); }
  80% { transform: rotate(-5deg) scale(1.05); }
  100% { transform: rotate(0deg) scale(1); }
`;

/***************************  HEADER - NOTIFICATION - TYPES  ***************************/

interface NotificationData {
  avatar: any;
  badge?: React.ReactNode;
  title: string;
  subTitle: string;
  dateTime: string;
  isSeen?: boolean;
}

/***************************  HEADER - NOTIFICATION  ***************************/

export default function Notification() {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [innerAnchorEl, setInnerAnchorEl] = useState<null | HTMLElement>(null);
  const [allRead, setAllRead] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const open = Boolean(anchorEl);
  const innerOpen = Boolean(innerAnchorEl);
  const id = open ? 'notification-action-popper' : undefined;
  const innerId = innerOpen ? 'notification-inner-popper' : undefined;
  const buttonStyle = { borderRadius: 2, p: 1 };

  const listcontent = ['All notification', 'Users', 'Account', 'Language', 'Role & Permission', 'Setting'];

  const [notifications, setNotifications] = useState<NotificationData[]>([
    {
      avatar: { alt: 'Travis Howard', src: '/assets/images/users/avatar-1.png' },
      badge: <IconCode size={14} />,
      title: 'New Feature Deployed · Code Review Needed',
      subTitle: 'Brenda Skiles',
      dateTime: 'Jul 9'
    },
    {
      avatar: <IconGitBranch />,
      title: 'New Branch Created - "feature-user-auth"',
      subTitle: 'Michael Carter',
      dateTime: 'Jul 10',
      isSeen: true
    },
    {
      avatar: <IconGitBranch />,
      title: 'Pull Request Opened "fix-dashboard-bug"',
      subTitle: 'Sophia Green',
      dateTime: 'Jul 11'
    }
  ]);

  const [notifications2, setNotifications2] = useState<NotificationData[]>([
    {
      avatar: { alt: 'Travis Howard', src: '/assets/images/users/avatar-1.png' },
      badge: <IconCode size={14} />,
      title: 'Code Review Requested · Feature Deployment',
      subTitle: 'Brenda Skiles',
      dateTime: 'Jul 9'
    },
    {
      avatar: <IconGps />,
      title: 'Unusual Login Attempt [Verify Activity]',
      subTitle: 'Security Alert',
      dateTime: 'Jul 24'
    }
  ]);

  const handleActionClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleInnerActionClick = (event: MouseEvent<HTMLElement>) => {
    setInnerAnchorEl(innerAnchorEl ? null : event.currentTarget);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isSeen: true })));
    setNotifications2((prev) => prev.map((n) => ({ ...n, isSeen: true })));
    setAllRead(true);
  };

  const handleClearAll = () => {
    setNotifications([]);
    setNotifications2([]);
    setShowEmpty(true);
  };

  return (
    <>
      <IconButton
        color="secondary"
        size="small"
        onClick={handleActionClick}
        aria-label="show notifications"
        sx={{ 
          border: '1px solid', 
          borderColor: 'divider',
          ...(notifications.length !== 0 && !allRead && { '& svg': { animation: `${swing} 1s ease infinite` } })
        }}
      >
        <Badge
          color="error"
          variant="dot"
          invisible={allRead || notifications.length === 0}
          slotProps={{
            badge: { sx: { height: 6, minWidth: 6, top: 4, right: 4, border: `1px solid ${theme.palette.background.default}` } }
          }}
        >
          <IconBell size={16} />
        </Badge>
      </IconButton>
      <Popper
        placement="bottom-end"
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
      >
        {({ TransitionProps }) => (
          <Fade in={open} {...TransitionProps}>
            <MainCard
              sx={{
                borderRadius: 2,
                // @ts-expect-error - legacy SaasAble component
                boxShadow: theme.customShadows?.tooltip || theme.shadows[1],
                width: 1,
                minWidth: { xs: 352, sm: 240 },
                maxWidth: { xs: 352, md: 420 },
                p: 0
              }}
            >
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <div>
                  <CardHeader
                    sx={{ p: 1 }}
                    title={
                      <Stack direction="row" sx={{ gap: 1, justifyContent: 'space-between' }}>
                        <Button
                          color="secondary"
                          size="small"
                          sx={{ typography: 'h6' }}
                          endIcon={<IconChevronDown size={16} />}
                          onClick={handleInnerActionClick}
                        >
                          All Notification
                        </Button>
                        <Popper
                          placement="bottom-start"
                          id={innerId}
                          open={innerOpen}
                          anchorEl={innerAnchorEl}
                          transition
                        >
                          {({ TransitionProps }) => (
                            <Fade in={innerOpen} {...TransitionProps}>
                              <MainCard sx={{ borderRadius: 2, boxShadow: theme.shadows[8], minWidth: 156, p: 0.5 }}>
                                <ClickAwayListener onClickAway={() => setInnerAnchorEl(null)}>
                                  <List disablePadding>
                                    {listcontent.map((item, index) => (
                                      <ListItemButton key={index} sx={buttonStyle} onClick={() => setInnerAnchorEl(null)}>
                                        <ListItemText>{item}</ListItemText>
                                      </ListItemButton>
                                    ))}
                                  </List>
                                </ClickAwayListener>
                              </MainCard>
                            </Fade>
                          )}
                        </Popper>
                        {!showEmpty && (
                          <Button color="primary" size="small" onClick={handleMarkAllAsRead} disabled={allRead}>
                            Mark All as Read
                          </Button>
                        )}
                      </Stack>
                    }
                  />
                  {showEmpty ? (
                    <EmptyNotification />
                  ) : (
                    <Fragment>
                      <CardContent sx={{ px: 0.5, py: 2, '&:last-child': { pb: 2 } }}>
                        <SimpleBar sx={{ maxHeight: 405, height: 1 }}>
                          <List disablePadding>
                            <ListSubheader disableSticky sx={{ color: 'text.disabled', typography: 'caption', py: 0.5, px: 1, mb: 0.5 }}>
                              Last 7 Days
                            </ListSubheader>
                            {notifications.map((notification, index) => (
                              <ListItemButton key={index} sx={buttonStyle}>
                                <NotificationItem
                                  avatar={notification.avatar}
                                  {...(notification.badge && { badgeAvatar: { children: notification.badge } })}
                                  title={notification.title}
                                  subTitle={notification.subTitle}
                                  dateTime={notification.dateTime}
                                  isSeen={notification.isSeen}
                                />
                              </ListItemButton>
                            ))}
                            <ListSubheader
                              disableSticky
                              sx={{ color: 'text.disabled', typography: 'caption', py: 0.5, px: 1, mb: 0.5, mt: 1.5 }}
                            >
                              Older
                            </ListSubheader>
                            {notifications2.map((notification, index) => (
                              <ListItemButton key={index} sx={buttonStyle}>
                                <NotificationItem
                                  avatar={notification.avatar}
                                  {...(notification.badge && { badgeAvatar: { children: notification.badge } })}
                                  title={notification.title}
                                  subTitle={notification.subTitle}
                                  dateTime={notification.dateTime}
                                  isSeen={notification.isSeen}
                                />
                              </ListItemButton>
                            ))}
                          </List>
                        </SimpleBar>
                      </CardContent>
                      <CardActions sx={{ p: 1 }}>
                        <Button fullWidth color="error" onClick={handleClearAll}>
                          Clear all
                        </Button>
                      </CardActions>
                    </Fragment>
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
