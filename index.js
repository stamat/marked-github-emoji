import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Read the generated JSON file synchronously during module initialization.
// Resolve relative to this module so the bundled dict is found no matter what
// the consumer's cwd is.
const dictPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'emojis.json');
let githubEmojiMap = {};

try {
  githubEmojiMap = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));
} catch {
  console.warn('⚠️ [marked-github-emoji]: Could not load emojis.json. Run "npm run generate-dict" first.');
}

export function markedGithubEmoji(options = {}) {
  // Allow users to easily customize image element classes or styles via options
  const className = options.className || 'gh-emoji';
  const imgStyle = options.style || 'height: 1.25em; vertical-align: text-top;';

  return {
    extensions: [{
      name: 'githubEmoji',
      level: 'inline',
      // Tell marked to search for the start of a potential shortcode syntax
      start(src) { const i = src.indexOf(':'); return i < 0 ? undefined : i; },
      tokenizer(src) {
        // Match exact GitHub shortcode criteria: :shortcode_name:
        const rule = /^:([a-zA-Z0-9_\-+]+):/;
        const match = rule.exec(src);
        
        if (match) {
          const shortcode = match[1];
          const value = githubEmojiMap[shortcode];
          
          if (value) {
            // Determine if the value is a remote URL or an actual native emoji character
            const isUrl = value.startsWith('http://') || value.startsWith('https://');
            
            return {
              type: 'githubEmoji',
              raw: match[0],
              shortcode,
              value,
              isUrl
            };
          }
        }
      },
      renderer(token) {
        if (token.isUrl) {
          // Clean fallback render for branding/custom assets that don't have unicode characters
          return `<img class="${className}" src="${token.value}" alt=":${token.shortcode}:" title=":${token.shortcode}:" style="${imgStyle}" />`;
        }
        
        // Return native emoji text directly
        return token.value;
      }
    }]
  };
}