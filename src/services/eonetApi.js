const EONET_EVENTS_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';
const REQUEST_TIMEOUT_MS = 15000;
const DEFAULT_EVENT_LIMIT = 24;
const DEFAULT_LOOKBACK_DAYS = 30;

export const EVENT_CATEGORIES = [
  { id: 'all', label: 'All Events' },
  { id: 'landslides', label: 'Landslides' },
  { id: 'wildfires', label: 'Wildfires' },
  { id: 'severeStorms', label: 'Severe Storms' },
];

export function getCategoryLabel(categoryId) {
  return (
    EVENT_CATEGORIES.find((category) => category.id === categoryId)?.label ||
    categoryId
  );
}

export async function fetchEonetEvents(categoryId = 'all', options = {}) {
  const params = new URLSearchParams({
    status: 'open',
    limit: String(options.limit ?? DEFAULT_EVENT_LIMIT),
    days: String(options.days ?? DEFAULT_LOOKBACK_DAYS),
  });

  if (categoryId !== 'all') {
    params.set('category', categoryId);
  }

  const controller = new AbortController();
  let didTimeout = false;
  const timeoutId = window.setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  const abortRequest = () => controller.abort();

  if (options.signal?.aborted) {
    abortRequest();
  } else {
    options.signal?.addEventListener('abort', abortRequest, { once: true });
  }

  let response;

  try {
    response = await fetch(`${EONET_EVENTS_URL}?${params}`, {
      signal: controller.signal,
    });
  } catch (error) {
    if (didTimeout) {
      throw new Error('EONET request timed out. Please try again.', {
        cause: error,
      });
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
    options.signal?.removeEventListener('abort', abortRequest);
  }

  if (!response.ok) {
    throw new Error(`EONET request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload.events) ? payload.events : [];
}
