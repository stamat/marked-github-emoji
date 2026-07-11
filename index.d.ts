import type { MarkedExtension } from 'marked';

export interface MarkedGithubEmojiOptions {
  /** CSS class for `<img>` fallback elements. Default: `"gh-emoji"`. */
  className?: string;
  /** Inline style for `<img>` fallback elements. Default: `"height: 1.25em; vertical-align: text-top;"`. */
  style?: string;
  /** Replaces the bundled dictionary entirely. Values are native emoji strings or image URLs. */
  dictionary?: Record<string, string>;
  /** Extra shortcodes merged on top of the dictionary; overrides entries with the same name. */
  emojis?: Record<string, string>;
}

export function markedGithubEmoji(options?: MarkedGithubEmojiOptions): MarkedExtension;
