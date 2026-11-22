/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LeadData, LeadSyncDiagnostic, LeadSyncStatus } from '../types/quiz';

export interface LeadSubmissionResponse {
  success: boolean;
  message?: string;
  isConfigPending?: boolean;
  skippedNoConsent?: boolean;
  error?: string;
}

export const SYNC_STATUS_LABELS: Record<LeadSyncStatus, string> = {
  idle: 'Aguardando envio',
  pending: 'Sincronização pendente',
  completed: 'Sincronização concluída',
  failed: 'Falha na sincronização',
  skipped_no_consent: 'Avanço para a oferta sem inscrição em marketing',
};

const DIAGNOSTIC_STORAGE_KEY = 'zuy_quiz_lead_sync_v1';

export function getWorkerUrl(): string {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAIL_OCTOPUS_WORKER_URL) ||
    (typeof process !== 'undefined' && process.env?.VITE_EMAIL_OCTOPUS_WORKER_URL) ||
    ''
  ).trim();
}

export function isWorkerConfigured(): boolean {
  return Boolean(getWorkerUrl());
}

export function recordLeadSyncDiagnostic(diagnostic: LeadSyncDiagnostic): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify(diagnostic));
    }
  } catch {
    // Ignorar falha de armazenamento em navegação privada restrita
  }

  if (diagnostic.status === 'failed' && diagnostic.error) {
    console.error('[LeadSync] Diagnóstico de falha na sincronização:', {
      status: diagnostic.label,
      error: diagnostic.error,
      timestamp: diagnostic.timestamp,
    });
  }
}

/**
 * Service to transmit captured leads via Cloudflare Worker to EmailOctopus.
 * Ensures zero API keys are exposed to the browser and respects marketing consent.
 */
export async function submitLeadToWorker(
  lead: LeadData,
  profileTag?: string
): Promise<LeadSubmissionResponse> {
  // Respeitar estritamente a ausência de consentimento de marketing (LGPD)
  if (!lead.marketingConsent) {
    return {
      success: false,
      skippedNoConsent: true,
      error: 'Consentimento de marketing não concedido pelo usuário.',
    };
  }

  const workerUrl = getWorkerUrl();

  // Extract non-sensitive UTMs from window if available
  const utmParams: Record<string, string> = {};
  if (typeof window !== 'undefined' && window.location.search) {
    const searchParams = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src'].forEach((param) => {
      const val = searchParams.get(param);
      if (val) utmParams[param] = val;
    });
  }

  // If worker URL is not configured in environment
  if (!workerUrl) {
    return {
      success: false,
      isConfigPending: true,
      error: 'Serviço de envio temporariamente indisponível para sincronização automática.',
    };
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId =
    controller && typeof setTimeout !== 'undefined'
      ? setTimeout(() => controller.abort(), 8000)
      : null;

  try {
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller?.signal,
      body: JSON.stringify({
        name: lead.name.trim(),
        email: lead.email.trim().toLowerCase(),
        consent: lead.marketingConsent,
        tags: [
          'quiz_barriga_chapada_7d',
          profileTag ? `perfil_${profileTag}` : 'perfil_geral',
        ],
        utm: utmParams,
        source: 'quiz_zuy_silva_emagrecer',
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      let errorMsg = `Erro HTTP ${response.status} ao registrar e-mail no servidor.`;
      try {
        const errData = await response.json();
        if (errData?.message || errData?.error) {
          errorMsg = errData.message || errData.error;
        }
      } catch {
        // use default errorMsg
      }
      return {
        success: false,
        error: errorMsg,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Cadastro realizado com sucesso!',
    };
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === 'AbortError';
    return {
      success: false,
      error: isTimeout
        ? 'Tempo limite excedido ao conectar ao servidor de sincronização.'
        : err instanceof Error
          ? err.message
          : 'Falha de conexão com a internet ao sincronizar contato.',
    };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
