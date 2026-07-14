const $ = window.jQuery;

export function safeText(value) {
  return $('<div>').text(value == null ? 'Not supplied' : String(value)).html();
}
