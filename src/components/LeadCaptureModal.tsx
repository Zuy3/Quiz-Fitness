/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, User, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { LeadData, QuizResultProfile } from '../types/quiz';

interface LeadCaptureModalProps {
  profile: QuizResultProfile;
  initialLead?: LeadData;
  onSuccess: (lead: LeadData) => void;
  onAdvanceToOffer?: (partialLead?: LeadData) => void;
}

export interface LeadValidationResult {
  valid: boolean;
  error: string | null;
}

export function validateEmailFormat(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

export function validateLeadFields(name: string, email: string): LeadValidationResult {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName || trimmedName.length < 2) {
    return {
      valid: false,
      error: 'Por favor, informe seu nome completo ou primeiro nome.',
    };
  }

  if (!trimmedEmail || !validateEmailFormat(trimmedEmail)) {
    return {
      valid: false,
      error: 'Por favor, informe um endereço de e-mail válido.',
    };
  }

  return { valid: true, error: null };
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  profile,
  initialLead,
  onSuccess,
  onAdvanceToOffer,
}) => {
  const [name, setName] = useState(initialLead?.name || '');
  const [email, setEmail] = useState(initialLead?.email || '');
  const [consent, setConsent] = useState(initialLead?.marketingConsent ?? false);
  const [formError, setFormError] = useState<string | null>(null);
  const hasAdvancedRef = useRef(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAdvancedRef.current) return;

    setFormError(null);

    const validation = validateLeadFields(name, email);
    if (!validation.valid) {
      setFormError(validation.error);
      return;
    }

    const lead: LeadData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      marketingConsent: consent,
    };

    hasAdvancedRef.current = true;
    // Avança imediatamente sem aguardar a sincronização em segundo plano
    onSuccess(lead);
  };

  const handleDirectAdvance = () => {
    if (hasAdvancedRef.current) return;
    hasAdvancedRef.current = true;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const hasPartialData = Boolean(trimmedName || trimmedEmail);

    const partialLead: LeadData | undefined = hasPartialData
      ? {
          name: trimmedName,
          email: trimmedEmail,
          marketingConsent: consent,
        }
      : undefined;

    if (onAdvanceToOffer) {
      onAdvanceToOffer(partialLead);
    } else if (partialLead && validateLeadFields(name, email).valid) {
      onSuccess(partialLead);
    } else {
      onSuccess({
        name: trimmedName,
        email: trimmedEmail,
        marketingConsent: false,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-lg mx-auto px-4 py-6 sm:py-8"
    >
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-sm text-left">
        {/* Top Lock Badge */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#15803D] mb-3">
          <Lock className="w-4 h-4" />
          <span>Acesso Pessoal & Protegido</span>
        </div>

        {/* Headline */}
        <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#1A3E31] uppercase leading-tight mb-2">
          Onde devemos enviar o seu resumo e plano de 7 dias?
        </h3>

        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
          Preencha seus dados abaixo para receber as orientações do seu perfil (<strong>{profile.badge}</strong>) e acessar a oferta especial do método.
        </p>

        {/* Error notification if any */}
        {formError && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl p-3 mb-4 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="lead-name-input"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
            >
              Seu Primeiro Nome
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="lead-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Ex.: Mariana"
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="lead-email-input"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
            >
              Seu Melhor E-mail
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="lead-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:bg-white transition-all"
              />
            </div>
            <span className="text-[11px] text-stone-500 block mt-1">
              Enviaremos o resumo detalhado para esta caixa de entrada.
            </span>
          </div>

          {/* Explicit Separate Consent Checkbox (LGPD compliant, optional for viewing the offer) */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                id="lead-consent-checkbox"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-[#15803D] rounded border-stone-300 focus:ring-[#15803D] cursor-pointer"
              />
              <span className="text-xs text-stone-600 leading-snug">
                Concordo em receber dicas gratuitas de alimentação, novidades e ofertas de <strong>@zuy_silva! emagrecer</strong> por e-mail. Posso cancelar minha inscrição a qualquer momento com 1 clique.{' '}
                <span className="text-stone-400">(Opcional)</span>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-black text-lg uppercase tracking-wider py-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <span>Liberar Acesso ao Plano de 7 Dias</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        </form>

        {/* Direct Advance Option without blocking */}
        <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span className="text-[11px] text-stone-500">
            Já concluiu seu diagnóstico e quer ir direto?
          </span>
          <button
            type="button"
            onClick={handleDirectAdvance}
            className="text-xs font-bold text-[#1A3E31] hover:text-[#15803D] underline underline-offset-2 transition-colors cursor-pointer py-1 px-2"
          >
            Avançar para a Oferta
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 text-center mt-3">
          <Check className="w-3.5 h-3.5 text-[#15803D]" />
          <span>Privacidade respeitada • Sem spam • Dados protegidos</span>
        </div>
      </div>
    </motion.div>
  );
};
