# marked-github-emoji

A lightweight, zero-dependency `marked` extension to parse GitHub-style shortcodes into native system emojis.

Cause I just want emoji shortcodes that I'm used to in my MDs...

`emojis.json` emoji dictionary is generated directly from `https://api.github.com/emojis` and `https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json` using the `npm run generate-dict` script.

## Installation

```bash
npm install marked-github-emoji
```

## Usage

```javascript
import { marked } from "marked";
import { markedGithubEmoji } from "marked-github-emoji";

marked.use(markedGithubEmoji());

const html = marked.parse("Hello :rocket: :+1:");
// <p>Hello 🚀 👍</p>
```

Hi! :wave: Bye! :wave:

## License

MIT
