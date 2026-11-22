/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, ShieldCheck, HeartPulse, ArrowRight, Check, Star } from 'lucide-react';
import julianaAvatar from '../assets/images/juliana_avatar_1794766612592.jpg';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [avatarError, setAvatarError] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center"
    >
      {/* Top Tag matching V Shred reference style */}
      <div className="inline-flex items-center gap-2 bg-[#E8F3EE] text-[#1A3E31] text-[11px] sm:text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5 border border-[#1A3E31]/10">
        <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
        <span>Avaliação Rápida de 60 Segundos</span>
      </div>

      {/* Main Punchy Heading */}
      <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-[#1A3E31] text-center leading-[1.08] tracking-tight uppercase mb-5">
        Descubra o que está provocando a sensação de{' '}
        <span className="text-[#15803D] underline decoration-[#15803D]/30 underline-offset-4">
          inchaço e peso
        </span>{' '}
        no seu abdômen.
      </h1>

      {/* Educational Box (Why we do this) */}
      <div className="w-full bg-[#FAF4F0] border-l-4 border-[#D97757] rounded-r-xl p-4 sm:p-5 mb-7 text-left shadow-xs">
        <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
          Esta avaliação revela por que muitas mulheres adultas acordam bem, mas terminam o dia com a barriga estufada e roupas apertadas — e como organizar refeições simples para recuperar a leveza em <strong>7 dias</strong>.
        </p>
      </div>

      {/* Quick Trust Highlights */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-stone-200/80 shadow-xs">
          <Clock className="w-5 h-5 text-[#15803D] shrink-0" />
          <span className="text-xs font-semibold text-stone-700">Leva apenas 1 minuto</span>
        </div>
        <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-stone-200/80 shadow-xs">
          <HeartPulse className="w-5 h-5 text-[#15803D] shrink-0" />
          <span className="text-xs font-semibold text-stone-700">8 perguntas diretas</span>
        </div>
        <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-stone-200/80 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-[#15803D] shrink-0" />
          <span className="text-xs font-semibold text-stone-700">Resumo personalizado</span>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="w-full sm:w-auto min-w-[280px] bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-extrabold text-lg sm:text-xl uppercase tracking-wider py-4 px-8 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Iniciar Questionário</span>
        <ArrowRight className="w-5 h-5 stroke-[2.5]" />
      </motion.button>

      {/* Micro Social Proof on Start Screen */}
      <div className="w-full bg-white/80 rounded-2xl p-4 border border-stone-200/80 mt-10 shadow-xs flex items-center gap-3.5">
        {avatarError ? (
          <div className="w-12 h-12 rounded-full bg-[#E8F3EE] text-[#1A3E31] font-bold text-sm flex items-center justify-center shrink-0 border border-[#1A3E31]/10">
            JM
          </div>
        ) : (
          <img
            src={julianaAvatar}
            alt="Foto de perfil de Juliana M."
            referrerPolicy="no-referrer"
            onError={() => setAvatarError(true)}
            className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-[#15803D]/25 shadow-2xs bg-[#E8F3EE]"
          />
        )}
        <div className="text-left text-xs sm:text-sm">
          <div className="flex items-center gap-0.5 text-amber-400 mb-1" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400" />
            ))}
          </div>
          <p className="text-stone-700 italic leading-relaxed">
            &ldquo;Eu acordava bem e terminava a tarde com a barriga estufada e a roupa marcando. Responder o quiz revelou o erro na minha rotina — nos primeiros dias do plano de 7 dias já senti a cintura mais livre.&rdquo;
          </p>
          <p className="text-[#1A3E31] font-bold text-xs mt-1.5 uppercase tracking-wide">
            Juliana M., 38 anos <span className="font-normal text-stone-500 lowercase">• leitora verificada</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6 text-[11px] text-stone-500">
        <span className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-[#15803D]" /> Seguro & confidencial
        </span>
        <span className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-[#15803D]" /> Sem perguntas invasivas
        </span>
      </div>
    </motion.div>
  );
};
