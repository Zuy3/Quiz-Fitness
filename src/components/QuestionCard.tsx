/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizQuestion } from '../types/quiz';
import { Check, Star } from 'lucide-react';
import julianaAvatar from '../assets/images/juliana_avatar_1794766612592.jpg';
import carlaAvatar from '../assets/images/carla_avatar_1794774637274.jpg';

const MICRO_PROOF_AVATARS: Record<string, string> = {
  JM: julianaAvatar,
  CS: carlaAvatar,
};

interface QuestionCardProps {
  question: QuizQuestion;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
}) => {
  const [internalSelected, setInternalSelected] = useState<string | undefined>(
    selectedOptionId
  );
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [brokenAvatars, setBrokenAvatars] = useState<Record<string, boolean>>({});

  const handleSelect = (optionId: string) => {
    if (isAdvancing) return; // prevent duplicate clicks
    setInternalSelected(optionId);
    setIsAdvancing(true);

    // Natural 250ms delay allowing user to visually see selection before slide
    setTimeout(() => {
      onSelectOption(optionId);
      setIsAdvancing(false);
    }, 240);
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6"
    >
      {/* Category Tag */}
      <div className="text-[11px] font-bold uppercase tracking-wider text-[#15803D] mb-1">
        {question.category}
      </div>

      {/* Main Question Title */}
      <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-[#1A3E31] leading-tight tracking-tight uppercase mb-4">
        {question.title}
      </h2>

      {/* "Why We Ask" box styled directly from the reference prints */}
      <div className="w-full bg-[#FAF4F0] border-l-4 border-[#D97757] rounded-r-xl p-3.5 sm:p-4 mb-6 text-left shadow-2xs">
        <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#D97757] mb-1">
          Por que perguntamos isso?
        </div>
        <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
          {question.whyWeAsk}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {question.options.map((option) => {
          const isSelected = (internalSelected || selectedOptionId) === option.id;

          return (
            <motion.button
              key={option.id}
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelect(option.id)}
              disabled={isAdvancing}
              className={`w-full min-h-[58px] p-4 sm:p-4.5 rounded-2xl text-left flex items-center justify-between gap-4 transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-[#E8F3EE] border-[#15803D] shadow-sm ring-1 ring-[#15803D]'
                  : 'bg-white hover:bg-stone-50/80 border-stone-200/90 shadow-2xs hover:border-stone-300'
              }`}
            >
              <span
                className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${
                  isSelected ? 'text-[#1A3E31]' : 'text-stone-800'
                }`}
              >
                {option.label}
              </span>

              {/* Radio circle matching the reference */}
              <div
                className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-2 border-[#15803D] bg-[#15803D] text-white'
                    : 'border-2 border-stone-300 bg-white'
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Micro-Proof Footer if present on this question */}
      <AnimatePresence>
        {question.microProof && (() => {
          const avatarSrc = MICRO_PROOF_AVATARS[question.microProof.avatarText];
          const showImage = Boolean(avatarSrc) && !brokenAvatars[question.microProof.avatarText];

          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white/95 rounded-2xl p-4 border border-stone-200/90 shadow-xs flex items-center gap-3.5 mt-4"
            >
              {showImage ? (
                <img
                  src={avatarSrc}
                  alt={`Foto de perfil de ${question.microProof.author}`}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setBrokenAvatars((prev) => ({
                      ...prev,
                      [question.microProof!.avatarText]: true,
                    }))
                  }
                  className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-[#15803D]/25 shadow-2xs bg-[#E8F3EE]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#E8F3EE] text-[#1A3E31] font-bold text-xs flex items-center justify-center shrink-0 border border-[#1A3E31]/10">
                  {question.microProof.avatarText}
                </div>
              )}

              <div className="text-left text-xs sm:text-sm min-w-0">
                <div className="flex items-center gap-0.5 text-amber-400 mb-1" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 italic leading-relaxed">
                  &ldquo;{question.microProof.quote}&rdquo;
                </p>
                <p className="text-[#1A3E31] font-bold text-[11px] mt-1.5 uppercase tracking-wide">
                  {question.microProof.author}{' '}
                  <span className="font-normal text-stone-500 lowercase">• leitora verificada</span>
                </p>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </motion.div>
  );
};
