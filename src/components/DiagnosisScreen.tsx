/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { QuizResultProfile } from '../types/quiz';
import {
  Droplets,
  Utensils,
  CheckCircle,
  Sparkles,
  Clock,
  BookOpen,
  Heart,
  Moon,
  ShieldCheck,
  ArrowRight,
  Check,
  TrendingUp,
} from 'lucide-react';

interface DiagnosisScreenProps {
  profile: QuizResultProfile;
  onContinue: () => void;
}

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ profile, onContinue }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'droplets':
        return <Droplets className="w-5 h-5 text-[#15803D]" />;
      case 'utensils':
        return <Utensils className="w-5 h-5 text-[#15803D]" />;
      case 'check-circle':
        return <CheckCircle className="w-5 h-5 text-[#15803D]" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-[#15803D]" />;
      case 'clock':
        return <Clock className="w-5 h-5 text-[#15803D]" />;
      case 'book-open':
        return <BookOpen className="w-5 h-5 text-[#15803D]" />;
      case 'heart':
        return <Heart className="w-5 h-5 text-[#15803D]" />;
      case 'moon':
        return <Moon className="w-5 h-5 text-[#15803D]" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#15803D]" />;
    }
  };

  // Classificação dinâmica alinhada ao índice numérico calculado
  const activeTier: 'leve' | 'frequente' | 'elevado' =
    profile.score < 70 ? 'leve' : profile.score < 82 ? 'frequente' : 'elevado';

  const tierDescription =
    activeTier === 'leve'
      ? 'Sinais iniciais perceptíveis no fim do dia, com resposta rápida a ajustes simples de rotina.'
      : activeTier === 'frequente'
        ? 'Desconforto recorrente que já afeta suas roupas e disposição — mas reage muito bem em 7 dias.'
        : 'Sinal claro de sobrecarga digestiva e retenção acumulada. Pequenos ajustes diários trazem alívio perceptível rapidamente.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center text-center"
    >
      {/* Card Principal do Diagnóstico com Gauge Dinâmico */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs mb-6 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 bg-[#FAF4F0] text-[#D97757] text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-[#D97757]/25">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Avaliação Concluída</span>
        </div>

        {/* Medidor Circular */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-3">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-stone-200"
              strokeWidth="9"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className={activeTier === 'elevado' ? 'stroke-[#C85A38]' : 'stroke-[#D97757]'}
              strokeWidth="9"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - profile.score / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading font-black text-3xl text-[#1A3E31] leading-none">
              {profile.score}
            </span>
            <span className="text-[11px] font-bold text-stone-500">/ 100</span>
          </div>
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
          Índice de Sobrecarga e Retenção
        </span>

        {/* Barra de 3 níveis dinâmica */}
        <div className="w-full max-w-xs flex items-center justify-between gap-2 mb-3">
          {[
            { key: 'leve', label: 'Leve' },
            { key: 'frequente', label: 'Frequente' },
            { key: 'elevado', label: 'Elevado' },
          ].map((tier) => {
            const isActive = activeTier === tier.key;
            return (
              <div key={tier.key} className="flex-1 text-center">
                <div
                  className={`h-2 rounded-full mb-1 transition-colors ${
                    isActive
                      ? tier.key === 'elevado'
                        ? 'bg-[#C85A38]'
                        : 'bg-[#D97757]'
                      : 'bg-stone-200'
                  }`}
                />
                <span
                  className={`text-[10px] uppercase font-bold ${
                    isActive
                      ? tier.key === 'elevado'
                        ? 'text-[#C85A38]'
                        : 'text-[#D97757]'
                      : 'text-stone-400'
                  }`}
                >
                  {tier.label}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-stone-500 max-w-sm mb-5 leading-relaxed">
          {tierDescription}
        </p>

        {/* Tag e Título do Perfil */}
        <div className="inline-block bg-[#E8F3EE] text-[#1A3E31] text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3 border border-[#1A3E31]/10">
          Perfil Identificado: {profile.badge}
        </div>

        <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#1A3E31] leading-tight uppercase mb-3">
          {profile.title}
        </h2>

        <p className="text-stone-700 text-sm sm:text-base leading-relaxed text-left sm:text-center">
          {profile.summary}
        </p>
      </div>

      {/* Insight Educativo: Por que soluções genéricas falham */}
      <div className="w-full bg-[#FAF4F0] border-l-4 border-[#D97757] rounded-r-2xl p-4 sm:p-5 mb-6 text-left shadow-2xs">
        <p className="text-[11px] font-black uppercase tracking-widest text-[#D97757] mb-1">
          O Que Acontece na Prática
        </p>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          Quando o incômodo vem de <strong className="text-[#1A3E31]">retenção de líquidos e fermentação</strong>, cortar calorias no desespero ou tomar chás soltos sem ordem não resolve a raiz do estufamento — e você volta a sentir a calça apertar em poucos dias.
        </p>
      </div>

      {/* Os 3 Pilares de Ação */}
      <div className="w-full space-y-3 mb-6 text-left">
        <h3 className="font-heading font-black text-lg sm:text-xl text-[#1A3E31] uppercase px-1">
          Os 3 Pilares do Seu Ajuste de 7 Dias:
        </h3>
        {profile.pillars.map((pillar, idx) => (
          <div
            key={idx}
            className="w-full bg-white p-4 sm:p-4.5 rounded-2xl border border-stone-200/90 shadow-2xs flex items-start gap-3.5"
          >
            <div className="w-11 h-11 rounded-xl bg-[#E8F3EE] flex items-center justify-center shrink-0 border border-[#1A3E31]/10">
              {getIcon(pillar.icon)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#15803D] bg-[#E8F3EE] px-2 py-0.5 rounded-md">
                  Passo 0{idx + 1}
                </span>
                <h4 className="font-bold text-sm sm:text-base text-[#1A3E31]">
                  {pillar.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Linha do Tempo Realista de 7 Dias */}
      <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs mb-6 text-left">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#15803D] mb-2">
          Ritmo Natural em 7 Dias
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70">
            <div className="text-[11px] font-black uppercase text-[#1A3E31] mb-0.5">
              Dias 1 e 2
            </div>
            <p className="text-xs text-stone-600 leading-snug">
              Organização da hidratação e redução dos gatilhos que seguram líquidos.
            </p>
          </div>
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70">
            <div className="text-[11px] font-black uppercase text-[#1A3E31] mb-0.5">
              Dias 3 a 5
            </div>
            <p className="text-xs text-stone-600 leading-snug">
              Combinações digestivas que diminuem o estufamento após as refeições.
            </p>
          </div>
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70">
            <div className="text-[11px] font-black uppercase text-[#1A3E31] mb-0.5">
              Dias 6 e 7
            </div>
            <p className="text-xs text-stone-600 leading-snug">
              Rotina leve consolidada, mais conforto nas roupas e menos cansaço à tarde.
            </p>
          </div>
        </div>
      </div>

      {/* Ponte de Conversão Escura para o Plano Recomendado */}
      <div className="w-full bg-gradient-to-b from-[#0E241C] via-[#0B1E17] to-[#081611] rounded-3xl p-5 sm:p-7 text-white text-left shadow-xl border border-[#234E3E] relative overflow-hidden">
        <div className="absolute -top-16 right-0 w-56 h-56 bg-[#16A34A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">
            Roteiro Recomendado Liberado
          </p>
          <h3 className="font-heading font-black text-2xl sm:text-3xl uppercase leading-tight mb-2.5">
            Seu Plano Prático de 7 Dias Está Pronto
          </h3>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed mb-4">
            <strong className="text-white">Foco para o seu perfil:</strong> {profile.recommendationFocus}
          </p>

          <div className="space-y-2 mb-5 text-xs sm:text-sm text-stone-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sem remédios, shakes caros ou cortes radicais de comida</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Alimentos acessíveis que você encontra em qualquer supermercado</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Guia completo + 3 bônus práticos para ler direto no celular</span>
            </div>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-black text-lg sm:text-xl uppercase tracking-wider py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Liberar Meu Plano de 7 Dias</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </motion.button>

          <p className="text-center text-[11px] text-stone-300 mt-2.5">
            Próximo passo: informe seu e-mail para receber o resumo e ver a oferta especial
          </p>
        </div>
      </div>
    </motion.div>
  );
};
