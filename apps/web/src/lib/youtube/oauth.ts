import { google } from 'googleapis';

/**
 * YouTube OAuth Client Scaffolding (US-001)
 * Requirement: Connect YouTube account to discover playlists.
 */

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

export const getAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.force-ssl'
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
