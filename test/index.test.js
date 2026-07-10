import { test, expect } from '@jest/globals';
import { Marked } from 'marked';
import fs from 'fs';
import { markedGithubEmoji } from '../index.js';

// Read the same dict the plugin loads, so expected values track the real data.
const dict = JSON.parse(fs.readFileSync('emojis.json', 'utf-8'));
const smile = dict['smile']; // stable native emoji
const urlCode = Object.keys(dict).find(k => String(dict[k]).startsWith('http'));
const urlValue = dict[urlCode];

// Fresh instance per render so option variants don't leak between tests.
const render = (md, options) => new Marked(markedGithubEmoji(options)).parse(md).trim();

test('renders a native emoji in a paragraph', () => {
  expect(render(':smile:')).toBe(`<p>${smile}</p>`);
});

test('renders emoji inline among surrounding text', () => {
  expect(render('hello :smile: world')).toBe(`<p>hello ${smile} world</p>`);
});

test('renders multiple emoji in one line', () => {
  expect(render(':smile: and :smile:')).toBe(`<p>${smile} and ${smile}</p>`);
});

test('renders emoji inside a heading', () => {
  expect(render('# :smile:')).toBe(`<h1>${smile}</h1>`);
});

test('renders emoji inside a list item', () => {
  expect(render('- :smile:')).toBe(`<ul>\n<li>${smile}</li>\n</ul>`);
});

test('renders emoji nested inside emphasis', () => {
  expect(render('**:smile:**')).toBe(`<p><strong>${smile}</strong></p>`);
});

test('leaves an unknown shortcode untouched', () => {
  expect(render(':definitely_not_an_emoji_xyz:')).toBe('<p>:definitely_not_an_emoji_xyz:</p>');
});

test('leaves a shortcode with no closing colon untouched', () => {
  expect(render('a :smile b')).toBe('<p>a :smile b</p>');
});

test('renders a custom image asset as an img with alt/title/class', () => {
  const html = render(`:${urlCode}:`);
  expect(html).toMatch(/^<p><img /);
  expect(html).toContain(`src="${urlValue}"`);
  expect(html).toContain(`alt=":${urlCode}:"`);
  expect(html).toContain(`title=":${urlCode}:"`);
  expect(html).toContain('class="gh-emoji"');
});

test('honors custom className and style options', () => {
  const html = render(`:${urlCode}:`, { className: 'x', style: 'color:red' });
  expect(html).toContain('class="x"');
  expect(html).toContain('style="color:red"');
});
