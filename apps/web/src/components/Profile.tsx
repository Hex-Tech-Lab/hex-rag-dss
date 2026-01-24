'use client';

import { ReactNode } from 'react';

// @mui
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

// @icons
import { IconPhoto } from '@tabler/icons-react';

/***************************  PROFILE - TYPES  ***************************/

interface Props {
  avatar?: AvatarProps;
  title: string;
  caption?: string;
  label?: ReactNode;
  sx?: SxProps<Theme>;
  titleProps?: TypographyProps;
  captionProps?: TypographyProps;
  placeholderIfEmpty?: boolean;
}

/***************************  PROFILE  ***************************/

export default function Profile({ 
  avatar, 
  title, 
  caption, 
  label, 
  sx, 
  titleProps, 
  captionProps, 
  placeholderIfEmpty 
}: Props) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 0.75, width: 'fit-content', ...sx }}>
      {(avatar?.src || placeholderIfEmpty) && (
        <Avatar
          {...avatar}
          alt="profile"
          sx={{ ...avatar?.sx, ...(placeholderIfEmpty && { fontSize: 20, '& svg': { width: 26, height: 26 } }) }}
        >
          {!avatar?.src && placeholderIfEmpty && <IconPhoto stroke={1} />}
        </Avatar>
      )}
      <Stack sx={{ gap: 0.25 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
          <Typography variant="subtitle2" {...titleProps} sx={{ color: 'text.primary', whiteSpace: 'nowrap', ...titleProps?.sx }}>
            {title || (placeholderIfEmpty && 'N/A')}
          </Typography>
          {label}
        </Stack>
        <Typography variant="caption" {...captionProps} sx={{ color: 'grey.700', ...captionProps?.sx }}>
          {caption || (placeholderIfEmpty && '---')}
        </Typography>
      </Stack>
    </Stack>
  );
}