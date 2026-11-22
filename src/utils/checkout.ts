/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const OFFICIAL_HOTMART_CHECKOUT_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_HOTMART_CHECKOUT_URL) ||
  'https://pay.hotmart.com/T93171913Y?checkoutMode=10';

/**
 * Builds the official Hotmart checkout URL, appending all incoming UTM and traffic parameters.
 * Maps utm_source -> src and utm_campaign -> sck for Hotmart's native sales analytics.
 * Preserves checkoutMode=10 and all URL query parameters.
 */
export function buildCheckoutUrl(customParams: Record<string, string> = {}): string {
  try {
    const url = new URL(OFFICIAL_HOTMART_CHECKOUT_URL);

    // 1. Read existing params from current window location if available
    let sourceValue: string | null = null;
    let campaignValue: string | null = null;

    if (typeof window !== 'undefined' && window.location.search) {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        // Avoid overwriting checkoutMode unless explicitly desired
        if (lowerKey !== 'checkoutmode') {
          url.searchParams.set(key, value);
        }
        if (lowerKey === 'utm_source') sourceValue = value;
        if (lowerKey === 'utm_campaign') campaignValue = value;
        if (lowerKey === 'src') sourceValue = value;
      });
    }

    // 2. Map UTMs to Hotmart's native tracking parameters (src and sck)
    if (sourceValue && !url.searchParams.has('src')) {
      url.searchParams.set('src', sourceValue);
    }
    if (campaignValue && !url.searchParams.has('sck')) {
      url.searchParams.set('sck', campaignValue);
    }

    // 3. Append custom params (e.g. prefilling buyer's name/email on Hotmart)
    Object.entries(customParams).forEach(([k, v]) => {
      if (v && v.trim()) {
        url.searchParams.set(k, v.trim());
      }
    });

    // Ensure checkoutMode=10 is strictly preserved as required
    url.searchParams.set('checkoutMode', '10');

    return url.toString();
  } catch (error) {
    console.error('[Checkout] Error parsing checkout URL:', error);
    return OFFICIAL_HOTMART_CHECKOUT_URL;
  }
}
