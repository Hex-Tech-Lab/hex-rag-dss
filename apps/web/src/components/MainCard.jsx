'use client';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// @mui
import Card from '@mui/material/Card';

/***************************  MAIN CARD  ***************************/

export default function MainCard({ children, sx = {}, ref, ...others }) {
  const defaultSx = (theme) => ({
    p: { xs: 1.75, sm: 2.25, md: 3 },
    border: `1px solid ${theme.vars.palette.divider}`,
    borderRadius: 4,
    boxShadow: theme.vars.customShadows.section,
    position: 'relative'
  });

  const combinedSx = (theme) => ({
    ...defaultSx(theme),
    ...(typeof sx === 'function' ? sx(theme) : sx)
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card ref={ref} elevation={0} sx={combinedSx} {...others}>
        {children}
      </Card>
    </motion.div>
  );
}

MainCard.propTypes = { children: PropTypes.any, sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), ref: PropTypes.any };