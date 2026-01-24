'use client';

// @next
import NextLink from 'next/link';

// @mui
import { useTheme, SxProps, Theme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

// @project
// @ts-expect-error - legacy SaasAble component
import LogoMain from './LogoMain';
// @ts-expect-error - legacy SaasAble component
import LogoIcon from './LogoIcon';
import { APP_DEFAULT_PATH } from '@/config';
import { generateFocusStyle } from '@/utils/generateFocusStyle';

/***************************  LOGO SECTION - TYPES  ***************************/

interface Props {
  isIcon?: boolean;
  sx?: SxProps<Theme>;
  to?: string;
}

/***************************  MAIN - LOGO  ***************************/

export default function LogoSection({ isIcon, sx, to }: Props) {
  const theme = useTheme();

  return (
    <NextLink href={!to ? APP_DEFAULT_PATH : to} passHref legacyBehavior>
      <ButtonBase 
        disableRipple 
        sx={{ 
          ...sx, 
          // @ts-expect-error - legacy SaasAble component
          '&:focus-visible': generateFocusStyle(theme.palette.primary.main) 
        }} 
        aria-label="logo"
      >
        {isIcon ? <LogoIcon /> : <LogoMain />}
      </ButtonBase>
    </NextLink>
  );
}
