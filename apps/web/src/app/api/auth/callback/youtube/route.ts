import { NextRequest, NextResponse } from 'next/server';
import { getTokens, oauth2Client } from '@/lib/youtube/oauth';
import { createClient } from '@/lib/supabase';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const tokens = await getTokens(code);
    
    // Fetch user info from Google to get the email
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    oauth2Client.setCredentials(tokens);
    const userInfo = await oauth2.userinfo.get();
    const userEmail = userInfo.data.email;

    if (!userEmail) {
      return NextResponse.redirect(new URL('/?error=missing_email', request.url));
    }

    const supabase = await createClient();
    
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
