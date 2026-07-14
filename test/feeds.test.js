import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

globalThis.window = {
  jQuery: {}
};

const {
  FEED_PAGE_SIZE,
  getNextVisibleCount,
  getVisibleFeedItems
} = await import('../js/feeds.js');

const items = Array.from({ length: 13 }, (_value, index) => ({
  id: String(index + 1)
}));

test('shows the first eight feed items initially', () => {
  assert.equal(FEED_PAGE_SIZE, 8);
  assert.deepEqual(getVisibleFeedItems(items, FEED_PAGE_SIZE), items.slice(0, 8));
});

test('load more reveals the remaining feed items', () => {
  assert.equal(getNextVisibleCount(8, items.length), 13);
  assert.deepEqual(getVisibleFeedItems(items, 13), items);
});

test('visible count never exceeds the number of feed items', () => {
  assert.equal(getNextVisibleCount(13, items.length), 13);
});
test('feed markup includes the Load more control', async () => {
  const markup = await readFile(new URL('../index.html', import.meta.url), 'utf8');

  assert.match(markup, /id="loadMoreFeed"/);
});
test('hero Explore programs link uses the rectangular button style', async () => {
  const markup = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const heroCta = markup.match(/<a[^>]+aria-label="Explore programs"[^>]*>.*?<\/a>/s)?.[0] || '';

  assert.match(heroCta, /class="[^"]*btn btn-acid btn-lg reveal-up[^"]*"/);
  assert.doesNotMatch(heroCta, /circle-cta/);
});