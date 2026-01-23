import { getYouTubeClient } from './oauth';

/**
 * YouTube Playlist Discovery (US-002)
 * Fetches the current user's playlists.
 */
export const listPlaylists = async (tokens: unknown) => {
  try {
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
  } catch (error: unknown) {
    console.error('YouTube API Error (listPlaylists):', error);
    
    // Handle specific YouTube API errors
    const err = error as { response?: { status: number }; errors?: { reason: string }[]; message?: string };
    
    if (err.response?.status === 401) {
      throw new Error('YouTube session expired. Please reconnect your account.');
    }
    
    if (err.errors?.some(e => e.reason === 'quotaExceeded')) {
      throw new Error('YouTube API quota exceeded. Please try again later.');
    }

    throw new Error(`YouTube API Error: ${err.message || 'Unknown error'}`);
  }
};

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  videoCount: number;
  thumbnail: string;
}
