import { YoutubeTranscript } from 'youtube-transcript';

/**
 * Extract Transcript (US-004)
 * Fetches captions from a YouTube video.
 */
export const extractTranscript = async (videoId: string) => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return {
      text: transcript.map(item => item.text).join(' '),
      source: 'youtube_captions'
    };
  } catch (error) {
    console.error('Failed to fetch transcript:', error);
    return {
      text: '',
      source: 'unavailable'
    };
  }
};
