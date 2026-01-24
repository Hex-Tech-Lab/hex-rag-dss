import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

/**
 * Client-side Supabase client for use in Client Components.
 * Safe to import anywhere.
 */
export const createBrowserClient = () =>
  createSupabaseBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

/**
 * Service-side Supabase client for background tasks and scripts.
 * Uses Service Role key - BYPASSES RLS.
 * Lazy getter pattern to prevent early env dependency.
 */
let serviceClient: SupabaseClient | null = null;

export const getServiceClient = () => {
  if (serviceClient) return serviceClient;

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service client');
  }
  
  serviceClient = createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  return serviceClient;
}

// Backward compatibility alias
export const createServiceClient = getServiceClient;

/**
 * Server-side Supabase client factory.
 * Uses dynamic import to avoid breaking client-side builds with 'next/headers'.
 */
export const createClient = async () => {
  if (typeof window !== 'undefined') {
    return createBrowserClient();
  }
  // @ts-expect-error - legacy SaasAble component
  const { createClient: createServerClient } = await import('./supabase-ssr/server');
  return createServerClient();
}

/**
 * Utility to get the appropriate Supabase client (Server or Browser).
 * Standardizes lazy access.
 */
export const getSupabase = async () => {
  return await createClient();
}
