/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  onRestart?: () => void;
  showRestart?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRestart, showRestart = false }) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-30 transition-all">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1A3E31] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
            ZS
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-[#1A3E31] text-base leading-tight tracking-tight uppercase">
              @zuy_silva! <span className="text-[#15803D] font-normal lowercase text-xs sm:text-sm">emagrecer</span>
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium">
              Hábitos, Bem-Estar & Desinchaço
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#1A3E31] bg-[#E8F3EE] px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Método 7 Dias</span>
          </div>

          {showRestart && onRestart && (
            <button
              onClick={onRestart}
              className="text-xs font-medium text-stone-500 hover:text-[#1A3E31] hover:underline transition-colors px-2 py-1"
              title="Recomeçar o questionário"
            >
              Reiniciar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
