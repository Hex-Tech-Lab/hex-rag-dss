import { getYouTubeClient } from './oauth';

/**
 * YouTube Playlist Discovery (US-002)
 * Fetches the current user's playlists.
 */
export const listPlaylists = async (tokens: any) => {
  const youtube = getYouTubeClient(tokens);
  
  const response = await youtube.playlists.list({
    part: ['snippet', 'contentDetails'],
    mine: true,
    maxResults: 50
  });

  return response.data.items?.map(item => ({
    id: item.id!,
    title: item.snippet?.title || 'Untitled',
    description: item.snippet?.description || '',
    videoCount: item.contentDetails?.itemCount || 0,
    thumbnail: item.snippet?.thumbnails?.default?.url || ''
  })) || [];
};
