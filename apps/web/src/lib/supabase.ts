import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
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
 * Server-side Supabase client factory.
 * Uses dynamic import to avoid breaking client-side builds with 'next/headers'.
 */
export const createClient = async () => {
  if (typeof window !== 'undefined') {
    return createBrowserClient();
  }
  const { createClient: createServerClient } = await import('./supabase-ssr/server');
  return createServerClient();
}

/**
 * Utility to get the appropriate Supabase client (Server or Browser).
 */
export const getSupabase = async () => {
  return await createClient();
}

// Deprecated singleton
// @ts-expect-error - Planned removal
export const supabase = null as unknown;
