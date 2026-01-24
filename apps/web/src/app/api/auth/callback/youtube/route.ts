import { NextRequest, NextResponse } from 'next/server';
import { getTokens } from '@/lib/youtube/oauth';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const tokens = await getTokens(code);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.redirect(new URL('/auth/login?error=missing_email', request.url));
    }

    const userEmail = user.email;
    
    // Store tokens in profiles table (Action 5.3)
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        user_email: userEmail, 
        youtube_tokens: tokens,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_email' });

    if (error) throw error;

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error: unknown) {
    console.error('OAuth Callback Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
