import { getYouTubeClient } from './oauth';

/**
 * Fetch Video Metadata (US-004)
 * Retrieves videos for a specific playlist.
 */
export const fetchPlaylistVideos = async (playlistId: string, tokens: any) => {
  const youtube = getYouTubeClient(tokens);
  
  const response = await youtube.playlistItems.list({
    part: ['snippet', 'contentDetails'],
    playlistId: playlistId,
    maxResults: 50
  });

  return response.data.items?.map(item => ({
    youtubeId: item.contentDetails?.videoId!,
    title: item.snippet?.title || 'Untitled',
    channelName: item.snippet?.videoOwnerChannelTitle || '',
    channelId: item.snippet?.videoOwnerChannelId || '',
    publishedAt: item.snippet?.publishedAt || '',
    thumbnailUrl: item.snippet?.thumbnails?.high?.url || ''
  })) || [];
};
