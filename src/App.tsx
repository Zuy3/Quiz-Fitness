/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { StartScreen } from './components/StartScreen';
import { QuestionCard } from './components/QuestionCard';
import { AnalyzingScreen } from './components/AnalyzingScreen';
import { DiagnosisScreen } from './components/DiagnosisScreen';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { OfferScreen } from './components/OfferScreen';
import { PrivacyModal } from './components/PrivacyModal';
import { QUIZ_QUESTIONS, calculateQuizProfile } from './data/quizData';
import {
  QuizStep,
  UserAnswers,
  LeadData,
  QuizResultProfile,
  LeadSyncDiagnostic,
} from './types/quiz';
import { trackEvent } from './utils/analytics';
import {
  submitLeadToWorker,
  recordLeadSyncDiagnostic,
  SYNC_STATUS_LABELS,
} from './services/leadService';

const SESSION_STORAGE_KEY = 'zuy_quiz_session_v1';

export default function App() {
  const [step, setStep] = useState<QuizStep>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [profile, setProfile] = useState<QuizResultProfile | null>(null);
  const [lead, setLead] = useState<LeadData | undefined>(undefined);
  const [leadSyncDiagnostic, setLeadSyncDiagnostic] = useState<LeadSyncDiagnostic | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const leadTrackedRef = useRef(false);
  const offerTrackedRef = useRef(false);

  // Restore session from sessionStorage if available
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers && Object.keys(parsed.answers).length > 0) {
          setAnswers(parsed.answers);
        }
        if (typeof parsed.currentQuestionIndex === 'number') {
          setCurrentQuestionIndex(parsed.currentQuestionIndex);
        }
        if (parsed.step) {
          setStep(parsed.step);
        }
        if (parsed.lead) {
          setLead(parsed.lead);
        }
        if (parsed.leadSyncDiagnostic) {
          setLeadSyncDiagnostic(parsed.leadSyncDiagnostic);
        }
      }
    } catch (e) {
      console.warn('[App] Error restoring session:', e);
    }
  }, []);

  // Persist session changes without losing quiz answers or lead data
  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          step,
          currentQuestionIndex,
          answers,
          lead,
          leadSyncDiagnostic,
        })
      );
    } catch (e) {
      console.warn('[App] Error saving session:', e);
    }
  }, [step, currentQuestionIndex, answers, lead, leadSyncDiagnostic]);

  // Recalculate profile whenever answers change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      const calculated = calculateQuizProfile(answers);
      setProfile(calculated);
    }
  }, [answers]);

  const handleStartQuiz = () => {
    trackEvent('QuizIniciado');
    setStep('questions');
    setCurrentQuestionIndex(0);
  };

  const handleSelectOption = (optionId: string) => {
    const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
    const updatedAnswers = { ...answers, [currentQ.id]: optionId };
    setAnswers(updatedAnswers);

    trackEvent('PerguntaRespondida', {
      questionId: currentQ.id,
      category: currentQ.category,
      optionId,
    });

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed all questions
      trackEvent('QuizConcluido', {
        totalAnswers: Object.keys(updatedAnswers).length,
      });
      setStep('analyzing');
    }
  };

  const handleBack = () => {
    if (step === 'questions') {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1);
      } else {
        setStep('intro');
      }
    } else if (step === 'diagnosis') {
      setStep('questions');
      setCurrentQuestionIndex(QUIZ_QUESTIONS.length - 1);
    } else if (step === 'lead_capture') {
      setStep('diagnosis');
    }
  };

  const handleAnalysisComplete = () => {
    setStep('diagnosis');
  };

  const handleContinueFromDiagnosis = () => {
    setStep('lead_capture');
  };

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const activeProfile = profile || calculateQuizProfile(answers);

  const navigateToOfferOnce = (offerMode: 'lead_submit' | 'direct_advance') => {
    if (!offerTrackedRef.current) {
      offerTrackedRef.current = true;
      trackEvent('OfertaVisualizada', {
        profile: activeProfile.badge,
        score: activeProfile.score,
        entryMode: offerMode,
      });
    }
    setStep('offer');
  };

  const updateSyncDiagnostic = (diagnostic: LeadSyncDiagnostic) => {
    setLeadSyncDiagnostic(diagnostic);
    recordLeadSyncDiagnostic(diagnostic);
  };

  const handleLeadSuccess = (capturedLead: LeadData) => {
    setLead(capturedLead);

    if (!leadTrackedRef.current) {
      leadTrackedRef.current = true;
      trackEvent('LeadCapturado', {
        marketingConsent: capturedLead.marketingConsent,
      });
    }

    // Navega imediatamente para a oferta sem bloquear por conta do servidor
    navigateToOfferOnce('lead_submit');

    // Se não houve consentimento de marketing, não inscreve na lista
    if (!capturedLead.marketingConsent) {
      updateSyncDiagnostic({
        status: 'skipped_no_consent',
        label: SYNC_STATUS_LABELS.skipped_no_consent,
        advancedToOffer: true,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Sincronização em segundo plano com o Cloudflare Worker / EmailOctopus
    updateSyncDiagnostic({
      status: 'pending',
      label: SYNC_STATUS_LABELS.pending,
      advancedToOffer: true,
      timestamp: new Date().toISOString(),
    });

    submitLeadToWorker(capturedLead, activeProfile.badge)
      .then((response) => {
        if (response.success) {
          updateSyncDiagnostic({
            status: 'completed',
            label: SYNC_STATUS_LABELS.completed,
            advancedToOffer: true,
            timestamp: new Date().toISOString(),
          });
        } else if (response.isConfigPending) {
          updateSyncDiagnostic({
            status: 'pending',
            label: SYNC_STATUS_LABELS.pending,
            advancedToOffer: true,
            isConfigPending: true,
            error: response.error,
            timestamp: new Date().toISOString(),
          });
        } else if (response.skippedNoConsent) {
          updateSyncDiagnostic({
            status: 'skipped_no_consent',
            label: SYNC_STATUS_LABELS.skipped_no_consent,
            advancedToOffer: true,
            timestamp: new Date().toISOString(),
          });
        } else {
          updateSyncDiagnostic({
            status: 'failed',
            label: SYNC_STATUS_LABELS.failed,
            advancedToOffer: true,
            error: response.error || 'Erro desconhecido ao sincronizar contato.',
            timestamp: new Date().toISOString(),
          });
        }
      })
      .catch((err: unknown) => {
        updateSyncDiagnostic({
          status: 'failed',
          label: SYNC_STATUS_LABELS.failed,
          advancedToOffer: true,
          error: err instanceof Error ? err.message : 'Falha inesperada na sincronização.',
          timestamp: new Date().toISOString(),
        });
      });
  };

  const handleDirectAdvanceToOffer = (partialLead?: LeadData) => {
    if (partialLead) {
      setLead(partialLead);
    }

    updateSyncDiagnostic({
      status: 'skipped_no_consent',
      label: SYNC_STATUS_LABELS.skipped_no_consent,
      advancedToOffer: true,
      timestamp: new Date().toISOString(),
    });

    navigateToOfferOnce('direct_advance');
  };

  const handleRestart = () => {
    if (window.confirm('Deseja realmente reiniciar o questionário do início?')) {
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        sessionStorage.removeItem('zuy_quiz_lead_sync_v1');
      } catch {
        // ignore
      }
      leadTrackedRef.current = false;
      offerTrackedRef.current = false;
      setAnswers({});
      setCurrentQuestionIndex(0);
      setLead(undefined);
      setLeadSyncDiagnostic(null);
      setProfile(null);
      setStep('intro');
    }
  };

  return (
    <div className="min-h-screen bg-dot-pattern flex flex-col justify-between selection:bg-[#15803D] selection:text-white">
      {/* Brand Header */}
      <Header
        onRestart={handleRestart}
        showRestart={step !== 'intro'}
      />

      {/* Progress Bar (Only visible during the questions step) */}
      {step === 'questions' && (
        <ProgressBar
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={QUIZ_QUESTIONS.length}
          onBack={handleBack}
          canGoBack={true}
        />
      )}

      {/* Main Step Flow with Smooth Transitions */}
      <main className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div key="intro" className="w-full">
              <StartScreen onStart={handleStartQuiz} />
            </motion.div>
          )}

          {step === 'questions' && currentQuestion && (
            <motion.div key={`question-${currentQuestion.id}`} className="w-full">
              <QuestionCard
                question={currentQuestion}
                selectedOptionId={answers[currentQuestion.id]}
                onSelectOption={handleSelectOption}
              />
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div key="analyzing" className="w-full">
              <AnalyzingScreen onComplete={handleAnalysisComplete} />
            </motion.div>
          )}

          {step === 'diagnosis' && (
            <motion.div key="diagnosis" className="w-full">
              <DiagnosisScreen
                profile={activeProfile}
                onContinue={handleContinueFromDiagnosis}
              />
            </motion.div>
          )}

          {step === 'lead_capture' && (
            <motion.div key="lead_capture" className="w-full">
              <LeadCaptureModal
                profile={activeProfile}
                initialLead={lead}
                onSuccess={handleLeadSuccess}
                onAdvanceToOffer={handleDirectAdvanceToOffer}
              />
            </motion.div>
          )}

          {step === 'offer' && (
            <motion.div key="offer" className="w-full">
              <OfferScreen
                profile={activeProfile}
                lead={lead}
                onOpenPrivacy={() => setIsPrivacyOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Privacy & Terms Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
