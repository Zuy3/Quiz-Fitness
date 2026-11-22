/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizOption {
  id: string;
  label: string;
  profileTag?: 'retencao' | 'digestao_lenta' | 'estresse_rotina' | 'habitos_gerais';
  weight?: number;
}

export interface QuizQuestion {
  id: number;
  category: string;
  title: string;
  highlightWord?: string;
  whyWeAsk: string;
  options: QuizOption[];
  microProof?: {
    avatarText: string;
    quote: string;
    author: string;
  };
}

export interface UserAnswers {
  [questionId: number]: string; // questionId -> optionId
}

export interface QuizResultProfile {
  score: number;
  title: string;
  badge: string;
  summary: string;
  pillars: {
    title: string;
    description: string;
    icon: string;
  }[];
  recommendationFocus: string;
}

export interface LeadData {
  name: string;
  email: string;
  marketingConsent: boolean;
}

export type LeadSyncStatus =
  | 'idle'
  | 'pending'
  | 'completed'
  | 'failed'
  | 'skipped_no_consent';

export interface LeadSyncDiagnostic {
  status: LeadSyncStatus;
  label: string;
  advancedToOffer: boolean;
  timestamp: string;
  isConfigPending?: boolean;
  error?: string;
}

export type QuizStep = 
  | 'intro'
  | 'questions'
  | 'analyzing'
  | 'diagnosis'
  | 'lead_capture'
  | 'offer';
