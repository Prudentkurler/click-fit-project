import { safeText } from './utils.js';

const $ = window.jQuery;

export function initFeed() {
  $('#refreshFeed').on('click', loadFeed);
  loadFeed();
}

function renderFeed(items) {
  const cards = items.slice(0, 8).map((item) => {
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
    .html(`<i class="bi bi-broadcast-pin"></i> ${items.length} objects received. Showing the first ${Math.min(items.length, 8)}.`);
  window.AOS?.refresh();
}

function loadFeed() {
  $('#feedStatus')
    .removeClass('is-error')
    .html('<span class="spinner-border spinner-border-sm"></span> Connecting to api.restful-api.dev…');
  $('#refreshFeed').prop('disabled', true);

  $.ajax({
    url: 'https://api.restful-api.dev/objects',
    method: 'GET',
    dataType: 'json',
    timeout: 12000
  })
    .done(renderFeed)
    .fail(function (_xhr, status) {
      $('#feedStatus')
        .addClass('is-error')
        .html(`<i class="bi bi-exclamation-triangle"></i> Could not load the REST data (${safeText(status)}). Check your connection and retry.`);
      $('#apiContent').html('');
    })
    .always(() => $('#refreshFeed').prop('disabled', false));
}
