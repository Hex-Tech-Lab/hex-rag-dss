import { google } from 'googleapis';
import { env } from '@/lib/env';

/**
 * YouTube OAuth Client Scaffolding (US-001)
 * Requirement: Connect YouTube account to discover playlists.
 */

export const oauth2Client = new google.auth.OAuth2(
  env.YOUTUBE_CLIENT_ID,
  env.YOUTUBE_CLIENT_SECRET,
  env.YOUTUBE_REDIRECT_URI
);

export const getAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
};

export const getTokens = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const getYouTubeClient = (tokens: unknown) => {
  oauth2Client.setCredentials(tokens as Parameters<typeof oauth2Client.setCredentials>[0]);
  return google.youtube({ version: 'v3', auth: oauth2Client });
};
