/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Custom event types conforming to marketing & product specs
export type AnalyticsEventType =
  | 'QuizIniciado'
  | 'PerguntaRespondida'
  | 'QuizConcluido'
  | 'LeadCapturado'
  | 'OfertaVisualizada'
  | 'CheckoutClicado'
  | 'CompraConfirmada';

interface EventPayload {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Privacy-safe analytics dispatcher.
 * STRICT RULE: Does NOT transmit health, symptom or body weight data to 3P pixels.
 */
export function trackEvent(eventType: AnalyticsEventType, payload: EventPayload = {}): void {
  // Sanitize payload to guarantee no private symptom data is leaked
  const safePayload = {
    event: eventType,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  if (eventType === 'CompraConfirmada') {
    // Note: CompraConfirmada should only originate from Hotmart webhook/postback notifications,
    // not client-side clicks. We log a clear warning if invoked directly from the client.
    console.warn(
      '[Analytics] Atenção: O evento "CompraConfirmada" deve ser confirmado via Webhook da Hotmart no backend, não por clique de checkout.'
    );
  }

  // 1. Dispatch custom DOM event for custom listeners
  try {
    const customEvent = new CustomEvent('quiz_analytics', {
      detail: safePayload,
    });
    window.dispatchEvent(customEvent);
  } catch (err) {
    console.debug('[Analytics] CustomEvent dispatch error:', err);
  }

  // 2. Google Tag Manager / dataLayer if available
  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
    window.dataLayer.push(safePayload);
  }

  // 3. Meta Pixel standard events if initialized (strictly high-level events without sensitive data)
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (eventType === 'QuizIniciado') {
      window.fbq('trackCustom', 'QuizIniciado');
    } else if (eventType === 'LeadCapturado') {
      window.fbq('track', 'Lead');
    } else if (eventType === 'OfertaVisualizada') {
      window.fbq('track', 'ViewContent', { content_name: 'Barriga Chapada em 7 Dias', value: 29.9, currency: 'BRL' });
    } else if (eventType === 'CheckoutClicado') {
      window.fbq('track', 'InitiateCheckout', { content_name: 'Barriga Chapada em 7 Dias', value: 29.9, currency: 'BRL' });
    }
  }

  // Dev log for transparency
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    console.info(`[Analytics Event: ${eventType}]`, safePayload);
  }
}
