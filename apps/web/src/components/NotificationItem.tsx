'use client';

import { isValidElement, ReactNode } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
// @ts-expect-error - legacy SaasAble component
import { AvatarSize } from '@/enum';

/***************************  NOTIFICATION - LIST - TYPES  ***************************/

interface Props {
  avatar: any;
  badgeAvatar?: any;
  title: string;
  subTitle?: string;
  dateTime?: string;
  isSeen?: boolean;
}

/***************************  NOTIFICATION - LIST  ***************************/

export default function NotificationItem({ avatar, badgeAvatar, title, subTitle, dateTime, isSeen = false }: Props) {
  const ellipsis = { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' };

  const avatarContent = isValidElement(avatar) ? <Avatar>{avatar}</Avatar> : <Avatar {...avatar} />;

  return (
    <Stack direction="row" sx={{ width: 1, alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
        {badgeAvatar ? (
          <Box>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Avatar
                  sx={{ 
                    border: `1px solid`, 
                    borderColor: 'common.white',
                    // @ts-expect-error - legacy SaasAble component
                    width: 14, height: 14 // fallback for AvatarSize.BADGE
                  }}
                  {...badgeAvatar}
                />
              }
              slotProps={{ badge: { sx: { bottom: '22%' } } }}
            >
              {avatarContent}
            </Badge>
          </Box>
        ) : (
          avatarContent
        )}
      </Stack>
      <Stack sx={{ flexGrow: 1, minWidth: 0, maxWidth: 1, gap: 0.25 }}>
        <Typography variant={isSeen ? 'body2' : 'subtitle2'} {...(isSeen && { color: 'grey.700' })} noWrap sx={ellipsis}>
          {title}
        </Typography>
        {subTitle && (
          <Typography variant="caption" color="text.secondary" noWrap sx={ellipsis}>
            {subTitle}
          </Typography>
        )}
      </Stack>
      {dateTime && (
        <Typography variant="caption" sx={{ marginLeft: 'auto', flexShrink: 0 }} {...(isSeen && { color: 'grey.700' })}>
          {dateTime}
        </Typography>
      )}
    </Stack>
  );
}