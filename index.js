// Static import of the generated dict (emojis.js is emitted by
// "npm run generate-dict" alongside emojis.json). No fs/path/url usage,
// so the package works in browsers and bundlers as well as Node.
import githubEmojiMap from './emojis.js';

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