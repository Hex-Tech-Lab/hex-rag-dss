import { extractIntelligence } from '../lib/intelligence/extract';
import { storeIntelligence } from '../lib/intelligence/store';
import { storeEmbeddings } from '../lib/rag/store';
import { createServiceClient } from '../lib/supabase';
import { execSync } from 'child_process';

async function ingestVideo(videoId: string) {
  console.log(`🚀 Starting ingestion for video: ${videoId}`);
  
  try {
    const supabase = createServiceClient();

    // 1. Fetch Transcript via uvx fallback (Robust)
    console.log(`--- Fetching transcript for ${videoId} via uvx fallback...`);
    let transcript = '';
    try {
      const output = execSync(`uvx --from youtube-transcript-api youtube_transcript_api ${videoId}`, { encoding: 'utf-8' });
      // The output is a string representation of a Python list of lists of dicts: [[{...}]]
      // We'll use a simple regex to extract the 'text' fields since it's not pure JSON
      const textMatches = output.match(/'text':\s*'([^']*)'/g);
      if (textMatches) {
        transcript = textMatches.map(m => m.match(/'text':\s*'([^']*)'/)![1]).join(' ');
      }
    } catch (err) {
      console.error('Transcript fetch error:', err);
      throw err;
    }
    
    if (!transcript || transcript.length === 0) {
      throw new Error('Transcript is empty. Video might not have captions or is restricted.');
    }
    console.log(`✅ Transcript fetched (${transcript.length} chars)`);

    // 2. Check/Create Video Record
    console.log('--- Ensuring video record exists...');
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .upsert({
        youtube_id: videoId,
        title: 'Spec-Driven Development vs Freedom System (Ingested via Robust CLI)',
        channel_name: 'LaravelDaily',
        transcript: transcript,
        processed_at: new Date().toISOString()
      }, { onConflict: 'youtube_id' })
      .select()
      .single();

    if (videoError) throw videoError;
    console.log(`✅ Video record ready: ${video.id}`);

    // 3. Extract Intelligence
    console.log('--- Extracting intelligence (LLM)...');
    const intelligence = await extractIntelligence(transcript);
    console.log('✅ Intelligence extracted');

    // 4. Store Intelligence & Entities
    console.log('--- Storing intelligence and entities...');
    await storeIntelligence(video.id, intelligence, supabase);
    console.log('✅ Intelligence stored');

    // 5. Generate and Store Embeddings
    console.log('--- Generating and storing embeddings...');
    await storeEmbeddings(video.id, 'video_chunk', transcript, { video_id: video.id }, supabase);
    console.log('✅ Embeddings stored');

    console.log('🎉 Ingestion complete!');
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
  }
}

const videoId = 'd3Glwdf_xA8';
ingestVideo(videoId);