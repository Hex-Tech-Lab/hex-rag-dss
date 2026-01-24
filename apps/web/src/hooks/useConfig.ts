import { useContext } from 'react';

// @project
import { ConfigContext, ConfigContextValue } from '@/contexts/ConfigContext';

/***************************  HOOKS - CONFIG  ***************************/

/**
 * Custom hook to access the application's configuration context.
 */

export default function useConfig(): ConfigContextValue {
  const context = useContext(ConfigContext);

  if (!context) throw new Error('useConfig must be used inside ConfigProvider');

  return context;
}