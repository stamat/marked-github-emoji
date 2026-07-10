import type { MarkedExtension } from 'marked';

export interface MarkedGithubEmojiOptions {
  /** CSS class for `<img>` fallback elements. Default: `"gh-emoji"`. */
  className?: string;
  /** Inline style for `<img>` fallback elements. Default: `"height: 1.25em; vertical-align: text-top;"`. */
  style?: string;
}

export function markedGithubEmoji(options?: MarkedGithubEmojiOptions): MarkedExtension;
