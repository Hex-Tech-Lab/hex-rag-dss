import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  YOUTUBE_CLIENT_ID: z.string().min(1),
  YOUTUBE_CLIENT_SECRET: z.string().min(1),
  YOUTUBE_REDIRECT_URI: z.string().url(),
  OPENROUTER_API_KEY: z.string().min(1),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REDIRECT_URI: process.env.YOUTUBE_REDIRECT_URI,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
});

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;
  const missingKeys = Object.keys(errors).join(', ');
  
  // In a Server Component environment, this will throw during rendering
  // and be caught by the nearest error boundary.
  console.error('❌ Environment Variable Validation Failed:', errors);
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing or invalid environment variables: ${missingKeys}. Please check Vercel Project Settings.`);
  }
}

export const env = parsed.data || {} as z.infer<typeof envSchema>;
