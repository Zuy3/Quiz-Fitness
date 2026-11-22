/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Star,
  ShieldCheck,
  BookOpen,
  Coffee,
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import ebookBundleImg from '../assets/images/ebook_bundle_ptbr_1794771423036.jpg';
import bonusShotsCoverImg from '../assets/images/bonus_shots_cover_1794772129415.jpg';
import bonusSosCoverImg from '../assets/images/bonus_sos_cover_1794772131054.jpg';
import bonusChecklistCoverImg from '../assets/images/bonus_checklist_cover_1794772130472.jpg';
import garantiaSealImg from '../assets/images/garantia_7_dias_v2_1794773600282.jpg';
import { QuizResultProfile, LeadData } from '../types/quiz';
import { buildCheckoutUrl } from '../utils/checkout';
import { trackEvent } from '../utils/analytics';
import { SocialProofCarousel } from './SocialProofCarousel';

interface OfferScreenProps {
  profile: QuizResultProfile;
  lead?: LeadData;
  onOpenPrivacy: () => void;
}

const FAQS = [
  {
    q: 'Como vou receber o ebook após a compra?',
    a: 'O envio é imediato! Assim que o seu pagamento for processado pela Hotmart, você receberá um e-mail com o link exclusivo para baixar o ebook em PDF no seu celular, tablet ou computador.',
  },
  {
    q: 'É um livro físico ou digital?',
    a: 'É um livro digital completo em formato PDF de alta resolução, otimizado para leitura confortável na tela do celular ou para impressão se você preferir.',
  },
  {
    q: 'Os ingredientes do cardápio são caros ou difíceis de achar?',
    a: 'De forma alguma! O método foi desenhado para a realidade brasileira: alimentos comuns, saudáveis e econômicos encontrados em qualquer feira de bairro ou supermercado comum.',
  },
  {
    q: 'Eu vou passar fome durante esses 7 dias?',
    a: 'Não! O objetivo do Barriga Chapada em 7 Dias não é restrição calórica severa, mas sim a combinação estratégica de alimentos que combatem a fermentação e estimulam o trânsito digestivo de forma leve e saciante.',
  },
  {
    q: 'Como funciona a garantia de 7 dias da Hotmart?',
    a: 'O seu risco é absolutamente zero. Você tem 7 dias corridos para experimentar o método. Se por qualquer motivo você não gostar do conteúdo, basta solicitar o reembolso na plataforma Hotmart com 1 clique e todo o seu dinheiro será devolvido.',
  },
  {
    q: 'O pagamento é seguro?',
    a: 'Sim, 100% seguro. O processamento é realizado pela Hotmart, a maior e mais confiável plataforma de produtos digitais da América Latina, com criptografia de ponta a ponta.',
  },
];

const BONUS_ITEMS = [
  {
    id: 'bonus-shots',
    number: 1,
    title: 'Guia Rápido de Shots e Sucos Matinais',
    description:
      'Receitas práticas de shots e sucos matinais antioxidantes para estimular a digestão logo ao acordar.',
    originalValue: 'R$ 19,90',
    imageSrc: bonusShotsCoverImg,
    imageAlt: 'Capa do Guia Rápido de Shots e Sucos Matinais',
  },
  {
    id: 'bonus-sos',
    number: 2,
    title: 'Roteiro SOS de Desinchaço Pós-Fim de Semana',
    description:
      'Passo a passo simples do que comer e beber na segunda-feira para recuperar a leveza sem restrições extremas.',
    originalValue: 'R$ 24,90',
    imageSrc: bonusSosCoverImg,
    imageAlt: 'Capa do Roteiro SOS de Desinchaço Pós-Fim de Semana',
  },
  {
    id: 'bonus-checklist',
    number: 3,
    title: 'Checklist Diário Imprimível de Hábitos Leves',
    description:
      'Folha prática de acompanhamento diário para organizar água, refeições, chás e constância durante os 7 dias.',
    originalValue: 'R$ 14,90',
    imageSrc: bonusChecklistCoverImg,
    imageAlt: 'Capa do Checklist Diário Imprimível de Hábitos Leves',
  },
];

export const OfferScreen: React.FC<OfferScreenProps> = ({
  profile,
  lead,
  onOpenPrivacy,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [bundleImageError, setBundleImageError] = useState(false);
  const [guaranteeSealError, setGuaranteeSealError] = useState(false);
  const [brokenBonusCovers, setBrokenBonusCovers] = useState<Record<string, boolean>>({});

  const checkoutUrl = buildCheckoutUrl(
    lead ? { name: lead.name, email: lead.email } : {}
  );

  const handleCheckoutClick = () => {
    trackEvent('CheckoutClicado', {
      product: 'Barriga Chapada em 7 Dias',
      price: 29.9,
      profile: profile.badge,
    });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full pb-28">
      {/* Top Personalized Diagnostic Banner */}
      <div className="w-full bg-[#1A3E31] text-white py-3 px-4 text-center">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span>
            Perfil Diagnosticado: <strong>{profile.badge}</strong> ({profile.score}/100)
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-7 sm:py-8">
        {/* Top Editorial Callout Card (modeled on V Shred offer header) */}
        <div className="w-full bg-gradient-to-br from-[#1A3E31] via-[#133025] to-[#0B1D16] rounded-3xl px-6 py-7 sm:py-8 text-white text-center shadow-lg mb-5 relative overflow-hidden border border-[#234E3E]">
          <div className="absolute -top-16 right-0 w-56 h-56 bg-[#D97757]/15 rounded-full blur-3xl pointer-events-none" />
          <p className="relative z-10 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Condição Especial do Diagnóstico</span>
          </p>
          <h2 className="relative z-10 font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase leading-[1.06] tracking-tight max-w-md mx-auto">
            Recupere a leveza e o conforto que você sempre desejou.
          </h2>
          <div className="relative z-10 w-10 h-0.5 bg-[#D97757] mx-auto mt-4 rounded-full" />
        </div>

        {/* Main Bundle Offer Showcase Card (modeled on V Shred dark product stack) */}
        <div className="w-full bg-gradient-to-b from-[#0E241C] via-[#0B1E17] to-[#081611] rounded-3xl p-5 sm:p-8 text-white text-center shadow-xl mb-8 relative overflow-hidden border border-[#234E3E]">
          {/* Studio ambient light */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-80 h-64 bg-[#16A34A]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white leading-[1.02] uppercase tracking-tight mb-2">
              Barriga Chapada em 7 Dias
              <span className="block text-emerald-400 mt-0.5">+ 3 Bônus Grátis</span>
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mb-5">
              O guia prático para desinchar a região abdominal com alimentos comuns, combinações inteligentes e leitura direta no celular.
            </p>

            {/* Realistic Multi-Device Digital Bundle Mockup */}
            {bundleImageError ? (
              <div className="w-56 sm:w-64 bg-gradient-to-br from-stone-50 to-white text-[#1A3E31] rounded-2xl p-5 shadow-2xl border-4 border-white/20 mb-5">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#15803D] mb-1">
                  Ebook Digital • Formato PDF
                </div>
                <div className="font-heading font-black text-2xl uppercase leading-none mb-1 text-[#1A3E31]">
                  Barriga Chapada
                </div>
                <div className="font-heading font-extrabold text-lg text-[#15803D] uppercase mb-3">
                  Em 7 Dias
                </div>
                <div className="w-full h-20 bg-[#E8F3EE] rounded-xl flex flex-col items-center justify-center p-2 border border-[#1A3E31]/10">
                  <BookOpen className="w-7 h-7 text-[#15803D] mb-1" />
                  <span className="text-[10px] font-bold text-stone-600 uppercase">
                    Método de @zuy_silva!
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-xl mx-auto mb-5 relative">
                <div className="rounded-2xl overflow-hidden bg-[#0F281F] shadow-2xl border border-white/10">
                  <img
                    src={ebookBundleImg}
                    alt="Visualização digital do método Barriga Chapada em 7 Dias e bônus exclusivos em celular e tablets"
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() => setBundleImageError(true)}
                    className="w-full h-auto block select-none"
                  />
                </div>
              </div>
            )}

            {/* Stars rating */}
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
              <span className="text-white text-xs sm:text-sm font-bold ml-1.5">
                4.9 / 5.0 (Mais de 2.400 leitoras)
              </span>
            </div>

            {/* High-Contrast Price Anchor */}
            <div className="mb-6 flex flex-col items-center">
              <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 text-sm sm:text-base">
                <span className="text-stone-400 line-through font-medium">
                  De R$ 97,00
                </span>
                <span className="text-stone-200 font-medium">por apenas</span>
                <span className="text-emerald-400 font-heading font-black text-3xl sm:text-4xl tracking-tight">
                  R$ 29,90 hoje.
                </span>
              </div>
              <span className="text-stone-300 text-xs font-medium mt-1">
                à vista no Pix ou 3x de R$ 10,50 no cartão • Acesso imediato em PDF
              </span>
            </div>

            {/* 2-Column Crisp White Deliverable Chips (modeled on V Shred bundle checklist) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-6 text-left">
              {[
                'Cronograma Alimentar de 7 Dias',
                'Guia de Chás Digestivos e Diuréticos',
                'Lista de Supermercado Econômica',
                'Tabela de Substituições Rápidas',
                'Bônus: Shots e Sucos Matinais',
                'Bônus: Roteiro SOS + Checklist Diário',
              ].map((item) => (
                <div
                  key={item}
                  className="bg-white text-[#1A3E31] rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2.5 border border-white/80"
                >
                  <span className="w-5 h-5 rounded-full bg-[#E8F3EE] text-[#15803D] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <span className="text-xs sm:text-sm font-bold leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Primary CTA Button */}
            <motion.a
              href={checkoutUrl}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckoutClick}
              className="w-full max-w-md bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-black text-lg sm:text-xl uppercase tracking-wider py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer no-underline"
            >
              <span>Obter Acesso Imediato</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </motion.a>

            <span className="text-[11px] text-stone-300 mt-3">
              Acesso instantâneo por e-mail • Garantia incondicional de 7 dias Hotmart
            </span>
          </div>
        </div>

        {/* What is Inside the Ebook */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs mb-8 text-left">
          <h3 className="font-heading font-black text-2xl text-[#1A3E31] uppercase mb-4">
            O Que Você Vai Encontrar Dentro do Ebook:
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#E8F3EE] flex items-center justify-center text-[#15803D] shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A3E31]">
                  Cronograma Alimentar Passo a Passo de 7 Dias
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Cardápio completo, fácil de seguir e montado com café da manhã, almoço, lanches e jantar com combinações pensadas para desinchar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#E8F3EE] flex items-center justify-center text-[#15803D] shrink-0 mt-0.5">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A3E31]">
                  Guia Prático de Chás Digestivos e Diuréticos Naturais
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Receitas certeiras de infusões naturais que estimulam a digestão e reduzem o estufamento, sem amargor e com ingredientes comuns.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#E8F3EE] flex items-center justify-center text-[#15803D] shrink-0 mt-0.5">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A3E31]">
                  Lista de Supermercado Econômica e Descomplicada
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Tudo que você precisa comprar em uma folha prática, sem precisar gastar dinheiro com produtos exóticos ou ingredientes difíceis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#E8F3EE] flex items-center justify-center text-[#15803D] shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A3E31]">
                  Tabela de Substituições Rápidas
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Para você nunca ficar perdida se precisar comer fora de casa ou se faltar algum alimento na despensa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Exclusive Bonuses (modeled on high-converting visual deliverable cards) */}
        <div className="bg-[#FAF4F0] rounded-3xl p-5 sm:p-7 border border-[#D97757]/30 mb-8 text-left">
          <div className="inline-block bg-[#D97757] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Inclusos Gratuitamente Hoje
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#1A3E31] uppercase leading-tight mb-5">
            + 3 Bônus Especiais Para Potencializar Seus Resultados:
          </h3>

          <div className="space-y-4">
            {BONUS_ITEMS.map((bonus) => (
              <article
                key={bonus.id}
                className="bg-white rounded-2xl border-2 border-[#16A34A]/55 overflow-hidden shadow-xs"
              >
                <div className="p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4">
                  {/* Visual Mini-Cover Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-stone-200/90 bg-[#E8F3EE] shrink-0 shadow-2xs">
                    {brokenBonusCovers[bonus.id] ? (
                      <div className="w-full h-full flex items-center justify-center text-[#15803D] font-heading font-black text-xl">
                        {bonus.number}
                      </div>
                    ) : (
                      <img
                        src={bonus.imageSrc}
                        alt={bonus.imageAlt}
                        loading="eager"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setBrokenBonusCovers((prev) => ({ ...prev, [bonus.id]: true }))
                        }
                        className="w-full h-full object-cover block select-none"
                      />
                    )}
                  </div>

                  {/* Title, Benefit Copy & BRL Value Anchoring */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading font-black text-base sm:text-lg text-[#1A3E31] leading-snug mb-1">
                      {bonus.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-2.5">
                      {bonus.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-stone-400 line-through font-medium">
                        De {bonus.originalValue}
                      </span>
                      <span className="inline-flex items-center bg-[#16A34A] text-white text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md">
                        ↓ 100% OFF
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-[#15803D]">
                        Grátis hoje (R$ 0,00)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Inclusion Confirmation Strip */}
                <div className="bg-[#E8F3EE] px-4 py-2.5 border-t border-[#16A34A]/25 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-sm bg-[#16A34A] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span className="text-xs font-semibold text-[#1A3E31]">
                    Liberado gratuitamente com o seu plano de 7 dias
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* For Whom It Is & Is NOT (Clarity & Honesty) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
          <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#15803D] uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Para quem foi feito:</span>
            </div>
            <ul className="text-xs sm:text-sm text-stone-700 space-y-2">
              <li className="flex items-start gap-1.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Mulheres que acordam com a barriga lisa e sofrem com estufamento no final do dia.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Quem busca um roteiro de 7 dias com alimentos comuns e acessíveis.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Quem não aguenta mais passar fome em dietas malucas e restritivas.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-rose-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
              <XCircle className="w-4 h-4" />
              <span>Para quem NÃO é:</span>
            </div>
            <ul className="text-xs sm:text-sm text-stone-700 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span>Quem procura remédios, pílulas mágicas ou promessas irreais de queimar 10kg em uma semana.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span>Quem não está disposta a fazer pequenas substituições saudáveis na rotina.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span>Quem busca tratamento médico para patologias clínicas específicas.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Carrossel de Prova Social (exibe apenas cartões e comentários reais autorizados) */}
        <SocialProofCarousel />

        {/* 7-Day Unconditional Guarantee (High-Trust Risk-Reversal Card) */}
        <section
          aria-label="Garantia incondicional de 7 dias"
          className="bg-gradient-to-b from-[#0E241C] via-[#0B1E17] to-[#081611] rounded-3xl p-6 sm:p-8 border border-[#C8A45D]/40 text-white mb-8 shadow-xl relative overflow-hidden"
        >
          {/* Warm gold + emerald subtle studio glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#C8A45D]/12 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left mb-6">
            {/* Custom 3D Metallic Guarantee Medallion */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shrink-0 bg-[#0E241C] flex items-center justify-center shadow-2xl">
              {guaranteeSealError ? (
                <div className="w-32 h-32 rounded-full bg-[#16A34A]/15 border-2 border-[#C8A45D] flex flex-col items-center justify-center text-[#C8A45D]">
                  <ShieldCheck className="w-10 h-10 mb-1" />
                  <span className="font-heading font-black text-sm uppercase">7 Dias</span>
                </div>
              ) : (
                <img
                  src={garantiaSealImg}
                  alt="Selo oficial de Garantia Incondicional de 7 Dias Risco Zero"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => setGuaranteeSealError(true)}
                  className="w-full h-full object-cover block select-none"
                />
              )}
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#E5C67A] mb-1.5">
                Proteção Total Hotmart • Risco Zero
              </p>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase leading-tight mb-2.5">
                Experimente por 7 dias sem risco algum
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                Baixe o e-book completo, teste as combinações alimentares, os chás digestivos e os 3 bônus na sua rotina. Se por qualquer motivo você sentir que o guia não valeu muito mais que <strong className="text-white">R$ 29,90</strong>, devolvemos <strong className="text-emerald-300">100% do seu dinheiro</strong>.
              </p>
            </div>
          </div>

          {/* 3-Step Risk-Reversal Transparency Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-left">
            <div className="bg-white/6 border border-white/10 rounded-2xl p-3.5">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-300 mb-1">
                1. Acesso na Hora
              </div>
              <p className="text-xs text-stone-200 leading-relaxed">
                Receba o PDF e os 3 bônus no seu e-mail em segundos após confirmar no Pix ou cartão.
              </p>
            </div>
            <div className="bg-white/6 border border-white/10 rounded-2xl p-3.5">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-300 mb-1">
                2. Teste na Prática
              </div>
              <p className="text-xs text-stone-200 leading-relaxed">
                Aplique o cronograma de 7 dias no celular com alimentos simples do dia a dia.
              </p>
            </div>
            <div className="bg-white/6 border border-white/10 rounded-2xl p-3.5">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-300 mb-1">
                3. Reembolso 1 Clique
              </div>
              <p className="text-xs text-stone-200 leading-relaxed">
                Não era o que esperava? Solicite o estorno direto pela Hotmart, sem burocracia.
              </p>
            </div>
          </div>

          {/* Guarantee Action CTA + Security Badges */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.a
              href={checkoutUrl}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckoutClick}
              className="w-full max-w-md bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-black text-base sm:text-lg uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer no-underline"
            >
              <span>Testar com Risco Zero por R$ 29,90</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </motion.a>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-stone-300 mt-3.5">
              <span className="inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Compra Protegida Hotmart
              </span>
              <span className="inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Pix ou Cartão em até 3x
              </span>
              <span className="inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> 100% Reembolsável em 7 dias
              </span>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs mb-8 text-left">
          <h3 className="font-heading font-black text-2xl text-[#1A3E31] uppercase mb-4 text-center">
            Perguntas Frequentes
          </h3>

          <div className="divide-y divide-stone-200/80">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-3 font-bold text-xs sm:text-sm text-[#1A3E31] hover:text-[#15803D] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <Minus className="w-4 h-4 text-[#15803D] shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-2">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Big CTA Button */}
        <div className="text-center mb-8">
          <motion.a
            href={checkoutUrl}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckoutClick}
            className="w-full max-w-md bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-black text-xl uppercase tracking-wider py-4.5 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer no-underline"
          >
            <span>Quero Meu Ebook por R$ 29,90</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </motion.a>
          <div className="flex items-center justify-center gap-2 text-xs text-stone-500 mt-2">
            <Check className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Acesso liberado imediatamente após a confirmação</span>
          </div>
        </div>

        {/* Footer info & Privacy links */}
        <footer className="text-center text-xs text-stone-500 pt-6 border-t border-stone-200">
          <p className="mb-2">
            © {new Date().getFullYear()} @zuy_silva! emagrecer. Todos os direitos reservados.
          </p>
          <p className="text-[11px] text-stone-400 max-w-md mx-auto leading-relaxed mb-3">
            Este produto digital é de caráter estritamente educativo e voltado à promoção de hábitos saudáveis. Não substitui orientações médicas ou nutricionais individualizadas.
          </p>
          <button
            onClick={onOpenPrivacy}
            className="text-xs text-stone-600 hover:text-[#1A3E31] underline cursor-pointer"
          >
            Termos de Uso e Política de Privacidade (LGPD)
          </button>
        </footer>
      </div>

      {/* Sticky Bottom Bar for Mobile Conversion */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 py-2.5 px-4 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold text-stone-500 leading-none">
              Valor Promocional
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-heading font-black text-xl sm:text-2xl text-[#1A3E31] leading-none">
                R$ 29,90
              </span>
              <span className="text-[10px] text-stone-500 font-medium">à vista</span>
            </div>
          </div>

          <a
            href={checkoutUrl}
            onClick={handleCheckoutClick}
            className="bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-black text-sm sm:text-base uppercase tracking-wider py-3 px-5 sm:px-7 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 no-underline"
          >
            <span>Comprar Agora</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>
      </div>
    </div>
  );
};
