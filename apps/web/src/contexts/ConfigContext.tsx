'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useMediaQuery } from '@mui/material';
import { ThemeDirection, ThemeI18n, Themes } from '@/config';

export interface ConfigContextValue {
  currentTheme: Themes;
  themeDirection: ThemeDirection;
  miniDrawer: boolean;
  i18n: ThemeI18n;
  onChangeDirection: (direction: ThemeDirection) => void;
  onChangeMiniDrawer: (miniDrawer: boolean) => void;
  // Extra for hex-rag-dss responsive requirements
  isLeftPinned: boolean;
  isRightPinned: boolean;
  setLeftPinned: (pinned: boolean) => void;
  setRightPinned: (pinned: boolean) => void;
}

export const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const [themeDirection, setThemeDirection] = useState<ThemeDirection>(ThemeDirection.LTR);
  const [miniDrawer, setMiniDrawer] = useState<boolean>(false);
  const [isLeftPinned, setLeftPinned] = useState(!isMobile);
  const [isRightPinned, setRightPinned] = useState(!isMobile);

  const onChangeDirection = (direction: ThemeDirection) => setThemeDirection(direction);
  const onChangeMiniDrawer = (value: boolean) => setMiniDrawer(value);

  // Sync pinning with screen size
  useEffect(() => {
    if (isMobile) {
      setLeftPinned(false);
      setRightPinned(false);
    } else {
      setLeftPinned(true);
      setRightPinned(true);
    }
  }, [isMobile]);

  const value = useMemo(() => ({
    currentTheme: Themes.THEME_HOSTING,
    themeDirection,
    miniDrawer,
    i18n: ThemeI18n.EN,
    onChangeDirection,
    onChangeMiniDrawer,
    isLeftPinned,
    isRightPinned,
    setLeftPinned,
    setRightPinned
  }), [themeDirection, miniDrawer, isLeftPinned, isRightPinned]);

  return (
    <ConfigContext.Provider value={value}>
      <div dir={themeDirection} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </ConfigContext.Provider>
  );
}

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
};