import fs from 'fs';
import path from 'path';

const API_URL = 'https://api.github.com/emojis';
// gemoji is the canonical source GitHub generates its emoji list from. Its
// filenames strip ZWJ (200d) and variation selectors (fe0f), so we can't
// reconstruct ZWJ sequences (👩‍❤️‍💋‍👨) or tell flags apart from the URL alone.
const GEMOJI_URL = 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json';
const OUTPUT_PATH = path.join(process.cwd(), 'emojis.json');

// Fallback for GitHub emoji not yet in gemoji. Lossy: no ZWJ/fe0f, breaks
// ZWJ sequences. gemoji is preferred whenever it has the shortcode.
function urlToEmoji(url) {
  // GitHub unicode paths look like: .../unicode/1f604.png or .../unicode/1f1e6-1f1e9.png
  if (!url.includes('/unicode/')) {
    return null; // Keep original URL for custom assets like :octocat:
  }

  try {
    const filename = url.split('/').pop().split('?')[0]; // Gets "1f1e6-1f1e9.png"
    const hexCodes = filename.split('.')[0].split('-'); // Gets ["1f1e6", "1f1e9"]
    
    // Map individual hex string structures to native character points
    const codePoints = hexCodes.map(hex => parseInt(hex, 16));
    return String.fromCodePoint(...codePoints);
  } catch (error) {
    console.error(`Failed parsing code points for URL: ${url}`, error);
    return null;
  }
}

async function generateDict() {
  console.log('🔄 Fetching latest emojis from GitHub API...');
  
  try {
    const headers = { 'User-Agent': 'marked-github-emoji-builder' };
    const [response, gemojiResponse] = await Promise.all([
      fetch(API_URL, { headers }),
      fetch(GEMOJI_URL, { headers }),
    ]);

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }
    if (!gemojiResponse.ok) {
      throw new Error(`gemoji responded with status ${gemojiResponse.status}`);
    }

    // Canonical alias -> native emoji (correct ZWJ sequences, flags, keycaps).
    const gemojiByAlias = {};
    for (const entry of await gemojiResponse.json()) {
      for (const alias of entry.aliases) gemojiByAlias[alias] = entry.emoji;
    }

    const githubEmojis = await response.json();
    const processedEmojis = {};

    for (const [shortcode, url] of Object.entries(githubEmojis)) {
      // Prefer canonical gemoji; fall back to lossy URL parse for emoji not yet
      // in gemoji; keep the asset URL for custom images (:octocat: etc.).
      processedEmojis[shortcode] = gemojiByAlias[shortcode] || urlToEmoji(url) || url;
    }

    // Write out the clean dictionary file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(processedEmojis, null, 2), 'utf-8');
    console.log(`✅ Dictionary successfully compiled! Saved to: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('❌ Build script encountered an error:', error.message);
    process.exit(1);
  }
}

generateDict();