/**
 * Data source toggles for development preview.
 *
 * USE_MOCK_FALLBACKS — when false, API service returns empty results instead
 * of mockMatches fallbacks when the World Cup API is unavailable.
 *
 * USE_PROTOTYPE_DATA — when false, UI sections with no API (polls, sentiment,
 * AI insights, articles, etc.) are hidden so only live API data is visible.
 *
 * Flip these back to true when you want the full demo experience again.
 */
export const USE_MOCK_FALLBACKS = true;
export const USE_PROTOTYPE_DATA = true;

export const isApiPreviewMode = !USE_MOCK_FALLBACKS || !USE_PROTOTYPE_DATA;
