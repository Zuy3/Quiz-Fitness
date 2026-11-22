/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, CheckCircle2, Sparkles } from 'lucide-react';

interface AnalyzingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  'Cruzando histórico de inchaço e horários...',
  'Analisando hábitos de hidratação e retenção hídrica...',
  'Mapeando padrão de fermentação e ritmo digestivo...',
  'Compilando o plano de ação de 7 dias para o seu perfil...',
  'Resumo concluído com sucesso!',
];

export const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Smooth progress increment
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 32); // ~3.2 seconds total

    // Text step updates
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 650);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-md mx-auto px-4 py-12 sm:py-16 flex flex-col items-center text-center"
    >
      {/* Animated Circular Gauge */}
      <div className="relative w-36 h-36 flex items-center justify-center mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-stone-200"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-[#15803D] transition-all duration-100 ease-out"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 42}
            strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading font-black text-3xl text-[#1A3E31]">
            {progress}%
          </span>
          <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
            Processando
          </span>
        </div>
      </div>

      {/* Headline */}
      <h3 className="font-heading font-extrabold text-2xl text-[#1A3E31] uppercase tracking-tight mb-2">
        Analisando Suas Respostas
      </h3>

      <p className="text-stone-500 text-xs sm:text-sm mb-6 max-w-xs">
        Estamos identificando os fatores do seu dia a dia que mais pesam na sensação de inchaço.
      </p>

      {/* Dynamic step checklist */}
      <div className="w-full bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs text-left space-y-3">
        {STEPS.slice(0, 4).map((stepText, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                isDone
                  ? 'text-[#1A3E31] font-semibold'
                  : isCurrent
                  ? 'text-[#15803D] font-bold'
                  : 'text-stone-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-[#15803D] animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-stone-300 shrink-0" />
              )}
              <span className="truncate">{stepText}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-6">
        <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
        <span>Garantia de privacidade e proteção de dados</span>
      </div>
    </motion.div>
  );
};
