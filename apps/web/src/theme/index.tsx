'use client';

import { useMemo, ReactNode } from 'react';

// @mui
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// @project
import { CSS_VAR_PREFIX } from '@/config';
// @ts-expect-error - legacy SaasAble component
import CustomShadows from './custom-shadows';
import { buildPalette } from './palette';
// @ts-expect-error - legacy SaasAble component
import componentsOverride from './overrides';
import typography from './typography';

import useConfig from '@/hooks/useConfig';

/***************************  DEFAULT THEME - MAIN  ***************************/

interface Props {
  children: ReactNode;
}

export default function ThemeCustomization({ children }: Props) {
  const { themeDirection } = useConfig();

  const palette = useMemo(() => buildPalette(), []);

  const theme = useMemo(() => {
    const t = createTheme({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1440
        }
      },
      direction: themeDirection,
      colorSchemes: {
        light: {
          palette: palette.light as any,
          customShadows: CustomShadows(palette.light)
        },
        dark: {
          palette: palette.light as any, // Temporary fallback to light palette for dark mode
          customShadows: CustomShadows(palette.light)
        }
      },
      cssVariables: {
        cssVarPrefix: CSS_VAR_PREFIX,
        colorSchemeSelector: 'data-color-scheme'
      },
      typography: typography()
    });

    t.components = componentsOverride(t);
    return t;
  }, [themeDirection, palette]);

  return (
    <ThemeProvider disableTransitionOnChange theme={theme} defaultMode="light">
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}