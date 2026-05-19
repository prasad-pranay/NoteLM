import axios from 'axios';
import * as cheerio from 'cheerio';
import { YoutubeTranscript } from 'youtube-transcript';

/**
 * Extract text content from a website URL.
 * @param {string} url 
 * @returns {Promise<{title: string, content: string}>}
 */
export const parseWebsite = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(data);

    // Remove script and style elements
    $('script, style, nav, footer, header').remove();

    const title = $('title').text() || url;
    const content = $('body').text().replace(/\s+/g, ' ').trim();

    return { title, content };
  } catch (error) {
    console.error(`Failed to parse website ${url}:`, error.message);
    throw new Error(`Could not fetch website content: ${error.message}`);
  }
};

/**
 * Extract transcript from a YouTube video.
 * @param {string} url 
 * @returns {Promise<{title: string, content: string, youtubeId: string}>}
 */
export const parseYouTube = async (url) => {
  try {
    const videoId = extractYoutubeId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');

    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    const content = transcriptItems.map(item => item.text).join(' ');

    // Note: Fetching video title would require YouTube API key, which we might not have.
    // For now, we'll just use the URL or a placeholder.
    return { 
      title: `YouTube Video: ${videoId}`, 
      content, 
      youtubeId: videoId 
    };
  } catch (error) {
    console.error(`Failed to parse YouTube video ${url}:`, error.message);
    throw new Error(`Could not fetch YouTube transcript: ${error.message}`);
  }
};

/**
 * Helper to extract video ID from various YouTube URL formats.
 */
function extractYoutubeId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export default { parseWebsite, parseYouTube };
