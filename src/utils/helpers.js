/**
 * Utility helpers used across the application.
 */

/**
 * Format a number as Indian Rupees.
 * @param {number} amount
 * @returns {string}  e.g. "₹1,49,999"
 */
export function formatINR(amount) {
  if (!amount && amount !== 0) return '—';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

/**
 * Truncate a string to maxLen, appending ellipsis.
 */
export function truncate(str, maxLen = 60) {
  if (!str) return '';
  return str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;
}

/**
 * Return estimated delivery date string (N days from now).
 */
export function estimatedDelivery(daysAhead = 5) {
  const d = new Date(Date.now() + daysAhead * 86_400_000);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

/**
 * Returns a placeholder image URL.
 */
export function placeholderImg(w = 400, h = 400, text = 'No Image') {
  return `https://placehold.co/${w}x${h}/f0efe9/888?text=${encodeURIComponent(text)}`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce a function.
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
