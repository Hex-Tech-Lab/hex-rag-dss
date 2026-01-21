import { NextRequest, NextResponse } from 'next/server';
import { getTokens } from '@/lib/youtube/oauth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const tokens = await getTokens(code);
    
    // Store tokens in profiles table (Action 5.3)
    // For MVP 0.0, we use a fixed email or simple identifier
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        user_email: 'primary@user.com', 
        youtube_tokens: tokens,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_email' });

    if (error) throw error;

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
