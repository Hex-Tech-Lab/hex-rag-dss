import { z } from 'zod';

/**
 * 10x Resilient Environment Validation
 * Separates Public (Client-Safe) and Server (Secret) variables.
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverSchema = z.object({
  YOUTUBE_CLIENT_ID: z.string().min(1),
  YOUTUBE_CLIENT_SECRET: z.string().min(1),
  YOUTUBE_REDIRECT_URI: z.string().url(),
  OPENROUTER_API_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

const isServer = typeof window === 'undefined';

// Validate Public Variables (Always)
const parsedPublic = publicSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (!parsedPublic.success) {
  const errors = parsedPublic.error.flatten().fieldErrors;
  console.error('❌ Public Environment Variable Validation Failed:', errors);
  if (isServer || process.env.NODE_ENV === 'production') {
    throw new Error(`Missing Public ENV: ${Object.keys(errors).join(', ')}`);
  }
}

// Validate Server Variables (Only on Server)
let parsedServer: any = { success: true, data: {} };
if (isServer) {
  parsedServer = serverSchema.safeParse({
    YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REDIRECT_URI: process.env.YOUTUBE_REDIRECT_URI,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!parsedServer.success) {
    const errors = parsedServer.error.flatten().fieldErrors;
    console.error('❌ Server Environment Variable Validation Failed:', errors);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing Server ENV: ${Object.keys(errors).join(', ')}`);
    }
  }
}

export const env = {
  ...(parsedPublic.success ? parsedPublic.data : {}),
  ...(parsedServer.success ? parsedServer.data : {}),
} as z.infer<typeof publicSchema> & z.infer<typeof serverSchema>;
