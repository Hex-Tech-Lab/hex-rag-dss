'use client';

import { forwardRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

// @mui
import { useTheme, SxProps, Theme } from '@mui/material/styles';
import Card, { CardProps } from '@mui/material/Card';

/***************************  MAIN CARD - TYPES  ***************************/

export interface MainCardProps extends Omit<CardProps, 'sx'> {
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

/***************************  MAIN CARD  ***************************/

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(({ children, sx = {}, ...others }, ref) => {
  const theme = useTheme();

  const defaultSx: SxProps<Theme> = {
    p: { xs: 1.75, sm: 2.25, md: 3 },
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 4,
    // @ts-expect-error - legacy SaasAble component - custom shadows from SaasAble
    boxShadow: theme.customShadows?.section || theme.shadows[1],
    position: 'relative',
    bgcolor: theme.palette.background.paper
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        ref={ref} 
        elevation={0} 
        sx={{ ...defaultSx, ...(Array.isArray(sx) ? sx : [sx]) }} 
        {...others}
      >
        {children}
      </Card>
    </motion.div>
  );
});

MainCard.displayName = 'MainCard';

export default MainCard;
