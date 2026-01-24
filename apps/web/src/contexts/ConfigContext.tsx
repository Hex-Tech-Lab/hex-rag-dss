'use client';

import { createContext, useMemo, ReactNode } from 'react';

// @project
import config, { Config } from '@/config';
import useLocalStorage from '@/hooks/useLocalStorage';

/***************************  CONFIG CONTEXT - TYPES  ***************************/

export interface ConfigContextValue {
  state: Config;
  setState: (state: Config) => void;
  setField: (field: keyof Config, value: unknown) => void;
  resetState: () => void;
}

/***************************  CONFIG CONTEXT  ***************************/

export const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

/***************************  CONFIG PROVIDER  ***************************/

interface Props {
  children: ReactNode;
}

export function ConfigProvider({ children }: Props) {
  const { state, setState, setField, resetState } = useLocalStorage('sass-able-react-mui-admin-next-free', config);

  const memoizedValue = useMemo(() => ({ state, setState, setField, resetState }), [state, setField, setState, resetState]);

  return <ConfigContext.Provider value={memoizedValue}>{children}</ConfigContext.Provider>;
}
