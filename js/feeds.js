import { safeText } from './utils.js';

const $ = window.jQuery;
export const FEED_PAGE_SIZE = 8;

let feedItems = [];
let visibleCount = FEED_PAGE_SIZE;

export function getVisibleFeedItems(items, count) {
  return items.slice(0, count);
}

export function getNextVisibleCount(currentCount, totalCount) {
  return Math.min(currentCount + FEED_PAGE_SIZE, totalCount);
}

export function initFeed() {
  $('#refreshFeed').on('click', loadFeed);
  $('#loadMoreFeed').on('click', () => {
    visibleCount = getNextVisibleCount(visibleCount, feedItems.length);
    renderFeed();
  });
  loadFeed();
}

function renderFeed() {
  const visibleItems = getVisibleFeedItems(feedItems, visibleCount);
  const cards = visibleItems.map((item) => {
    const details = item.data
      ? Object.entries(item.data).slice(0, 3).map(([key, value]) => `${key}: ${value}`).join(' · ')
      : 'No additional product details';

    return `<article class="api-card" data-aos="fade-up">
      <small>Live API object</small>
      <h3>${safeText(item.name)}</h3>
      <p>${safeText(details)}</p>
      <span class="api-id">${safeText(item.id)}</span>
    </article>`;
  }).join('');

  $('#apiContent').hide().html(cards).fadeIn(350);
  $('#feedStatus')
    .removeClass('is-error')
    .html(`<i class="bi bi-broadcast-pin"></i> ${feedItems.length} objects received. Showing ${visibleItems.length}.`);
  $('#loadMoreFeed').prop('hidden', visibleItems.length >= feedItems.length);
  window.AOS?.refresh();
}

function setFeedItems(items) {
  feedItems = Array.isArray(items) ? items : [];
  visibleCount = Math.min(FEED_PAGE_SIZE, feedItems.length);
  renderFeed();
}

function loadFeed() {
  $('#feedStatus')
    .removeClass('is-error')
    .html('<span class="spinner-border spinner-border-sm"></span> Connecting to api.restful-api.dev…');
  $('#refreshFeed').prop('disabled', true);
  $('#loadMoreFeed').prop('hidden', true);

  $.ajax({
    url: 'https://api.restful-api.dev/objects',
    method: 'GET',
    dataType: 'json',
    timeout: 12000
  })
    .done(setFeedItems)
    .fail(function (_xhr, status) {
      feedItems = [];
      visibleCount = FEED_PAGE_SIZE;
      $('#feedStatus')
        .addClass('is-error')
        .html(`<i class="bi bi-exclamation-triangle"></i> Could not load the REST data (${safeText(status)}). Check your connection and retry.`);
      $('#apiContent').html('');
      $('#loadMoreFeed').prop('hidden', true);
    })
    .always(() => $('#refreshFeed').prop('disabled', false));
}
