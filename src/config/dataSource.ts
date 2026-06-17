/**
 * Data source toggles for development preview.
 *
 * USE_PROTOTYPE_DATA — when false, UI sections with no API (polls, sentiment,
 * AI insights, articles, etc.) are hidden so only live API data is visible.
 *
 * Flip this back to true when you want the full demo experience again.
 */
export const USE_PROTOTYPE_DATA = true;

export const isApiPreviewMode = !USE_PROTOTYPE_DATA;
