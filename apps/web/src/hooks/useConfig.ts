import { use } from 'react';

// @project
import { ConfigContext, ConfigContextValue } from '@/contexts/ConfigContext';

/***************************  HOOKS - CONFIG  ***************************/

/**
 * Custom hook to access the application's configuration context.
 *
 * This hook provides an easy way to consume the `ConfigContext`,
 * which typically contains application-wide settings like themes,
 * layouts, or other configurable options.
 *
 * @returns {ConfigContextValue} The value provided by the `ConfigContext`.
 * Ensure that the component using this hook is wrapped with a `ConfigProvider`.
 */

export default function useConfig(): ConfigContextValue {
  const context = use(ConfigContext);

  if (!context) throw new Error('useConfig must be used inside ConfigProvider');

  return context;
}
