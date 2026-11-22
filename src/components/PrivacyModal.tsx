/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl z-10 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#15803D]" />
                <h3 className="font-heading font-black text-lg text-[#1A3E31] uppercase">
                  Privacidade & Termos de Uso
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto text-left text-xs sm:text-sm text-stone-700 space-y-4 leading-relaxed">
              <div>
                <h4 className="font-bold text-[#1A3E31] mb-1">1. Sobre o Projeto @zuy_silva! emagrecer</h4>
                <p>
                  O quiz interativo e os materiais educativos disponibilizados sob a marca @zuy_silva! emagrecer têm como finalidade informar, entreter e estimular hábitos saudáveis e conscientes de alimentação e rotina.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#1A3E31] mb-1">2. Não Constitui Consulta ou Tratamento Médico</h4>
                <p>
                  As perguntas do questionário e as sugestões apresentadas não configuram diagnóstico médico, avaliação clínica ou prescrição nutricional individualizada. Caso você tenha condições médicas pré-existentes, consulte um profissional de saúde qualificado.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#1A3E31] mb-1">3. Coleta e Proteção de Dados (LGPD)</h4>
                <p>
                  Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), coletamos apenas o seu nome e e-mail com o seu consentimento explícito, para envio do resumo do questionário e de conteúdos correlatos.
                </p>
                <p className="mt-1">
                  Não comercializamos, não alugamos e não compartilhamos seus dados com terceiros para fins não autorizados. Você pode cancelar sua inscrição a qualquer momento clicando no link de descadastramento presente em qualquer e-mail enviado.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#1A3E31] mb-1">4. Garantia e Processamento de Pagamentos</h4>
                <p>
                  O produto digital &ldquo;Barriga Chapada em 7 Dias&rdquo; é comercializado através da plataforma Hotmart (checkout oficial). O comprador tem direito à garantia legal e incondicional de 7 dias para cancelamento e estorno integral do valor pago diretamente no ambiente da Hotmart.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                onClick={onClose}
                className="bg-[#1A3E31] hover:bg-[#15803D] text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Entendi e Concordo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
