/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onBack: () => void;
  canGoBack: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestionIndex,
  totalQuestions,
  onBack,
  canGoBack,
}) => {
  // Endowed progress effect: starts around 12% and finishes at 100%
  const progressPercent = Math.round(
    12 + ((currentQuestionIndex + 1) / totalQuestions) * 88
  );

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-2">
      {/* Top controls: Voltar on left, percentage on right */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors py-1 ${
            canGoBack
              ? 'text-stone-700 hover:text-[#1A3E31] cursor-pointer'
              : 'text-stone-300 cursor-not-allowed'
          }`}
          aria-label="Voltar para a pergunta anterior"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Voltar</span>
        </button>

        <div className="flex items-baseline gap-0.5 font-heading font-extrabold text-[#1A3E31] text-lg sm:text-xl">
          <span>{progressPercent}</span>
          <span className="text-xs font-semibold text-stone-500">%</span>
        </div>
      </div>

      {/* Progress Track & Fill */}
      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#1A3E31] rounded-full"
          initial={{ width: `${progressPercent}%` }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
