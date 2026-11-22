/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, ImageOff, Pause, Play } from 'lucide-react';
import {
  BEFORE_AFTER_CARDS,
  BeforeAfterCardItem,
  SOCIAL_COMMENT_ITEMS,
  SocialCommentItem,
  getPublishableBeforeAfterCards,
  getPublishableSocialComments,
} from '../data/socialProof';
import commentInstagramImg from '../assets/social/IMG_6599_f1ff0c2e.jpeg';
import commentYoutubeImg from '../assets/social/IMG_7861_daf96356.jpeg';

const COMMENT_IMAGE_ASSETS: Record<string, string> = {
  'social-comment-01': commentInstagramImg,
  'social-comment-02': commentYoutubeImg,
};

interface SocialProofCarouselProps {
  cards?: BeforeAfterCardItem[];
  comments?: SocialCommentItem[];
  autoRotateIntervalMs?: number;
  showBeforeAfter?: boolean;
  showComments?: boolean;
  className?: string;
  /** Uso restrito a testes internos de componente; deve permanecer false em produção. */
  allowPreview?: boolean;
}

export const SocialProofCarousel: React.FC<SocialProofCarouselProps> = ({
  cards = BEFORE_AFTER_CARDS,
  comments = SOCIAL_COMMENT_ITEMS,
  autoRotateIntervalMs = 6000,
  showBeforeAfter = true,
  showComments = true,
  className = 'mb-8',
  allowPreview = false,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const visibleCards = showBeforeAfter
    ? allowPreview
      ? cards
      : getPublishableBeforeAfterCards(cards)
    : [];
  const visibleComments = showComments
    ? allowPreview
      ? comments
      : getPublishableSocialComments(comments)
    : [];

  // Estado do carrossel de Antes e Depois
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Estado do carrossel de Comentários nas redes
  const [commentIndex, setCommentIndex] = useState(0);
  const [commentDirection, setCommentDirection] = useState<1 | -1>(1);
  const [isCommentPaused, setIsCommentPaused] = useState(false);
  const [isCommentInteracting, setIsCommentInteracting] = useState(false);
  const commentTouchStartX = useRef<number | null>(null);

  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const safeIndex = visibleCards.length > 0 ? activeIndex % visibleCards.length : 0;
  const activeCard = visibleCards[safeIndex];

  const safeCommentIndex = visibleComments.length > 0 ? commentIndex % visibleComments.length : 0;
  const activeComment = visibleComments[safeCommentIndex];

  useEffect(() => {
    if (visibleCards.length <= 1 || isPaused || isInteracting || prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % visibleCards.length);
    }, autoRotateIntervalMs);

    return () => window.clearInterval(timer);
  }, [visibleCards.length, isPaused, isInteracting, prefersReducedMotion, autoRotateIntervalMs]);

  useEffect(() => {
    if (
      visibleComments.length <= 1 ||
      isCommentPaused ||
      isCommentInteracting ||
      prefersReducedMotion
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setCommentDirection(1);
      setCommentIndex((prev) => (prev + 1) % visibleComments.length);
    }, autoRotateIntervalMs);

    return () => window.clearInterval(timer);
  }, [
    visibleComments.length,
    isCommentPaused,
    isCommentInteracting,
    prefersReducedMotion,
    autoRotateIntervalMs,
  ]);

  // Se nenhum cartão ou comentário estiver autorizado/preenchido, não renderiza nada publicamente.
  if (visibleCards.length === 0 && visibleComments.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    if (visibleCards.length <= 1) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + visibleCards.length) % visibleCards.length);
  };

  const goToNext = () => {
    if (visibleCards.length <= 1) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % visibleCards.length);
  };

  const goToIndex = (index: number) => {
    if (index === safeIndex) return;
    setDirection(index > safeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    setIsInteracting(true);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = e.changedTouches[0]?.clientX ?? null;
    touchStartX.current = null;
    setIsInteracting(false);

    if (startX === null || endX === null) return;
    const delta = endX - startX;
    if (Math.abs(delta) >= 40) {
      if (delta > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  const goToPreviousComment = () => {
    if (visibleComments.length <= 1) return;
    setCommentDirection(-1);
    setCommentIndex((prev) => (prev - 1 + visibleComments.length) % visibleComments.length);
  };

  const goToNextComment = () => {
    if (visibleComments.length <= 1) return;
    setCommentDirection(1);
    setCommentIndex((prev) => (prev + 1) % visibleComments.length);
  };

  const goToCommentIndex = (index: number) => {
    if (index === safeCommentIndex) return;
    setCommentDirection(index > safeCommentIndex ? 1 : -1);
    setCommentIndex(index);
  };

  const handleCommentTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    commentTouchStartX.current = e.touches[0]?.clientX ?? null;
    setIsCommentInteracting(true);
  };

  const handleCommentTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const startX = commentTouchStartX.current;
    const endX = e.changedTouches[0]?.clientX ?? null;
    commentTouchStartX.current = null;
    setIsCommentInteracting(false);

    if (startX === null || endX === null) return;
    const delta = endX - startX;
    if (Math.abs(delta) >= 40) {
      if (delta > 0) {
        goToPreviousComment();
      } else {
        goToNextComment();
      }
    }
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPreviousComment();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNextComment();
    }
  };

  const markImageBroken = (key: string) => {
    setBrokenImages((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <section className={`space-y-8 ${className}`} aria-label="Prova social de leitoras">
      {visibleCards.length > 0 && activeCard && (
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Galeria de Antes e Depois"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          onFocus={() => setIsInteracting(true)}
          onBlur={() => setIsInteracting(false)}
          className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-2xs text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
        >
          {/* Cabeçalho da seção */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#15803D] mb-1">
                Relatos Autorizados
              </p>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#1A3E31] uppercase leading-none">
                Antes e Depois Reais
              </h3>
            </div>

            {visibleCards.length > 1 && (
              <div className="flex items-center gap-2 text-xs text-stone-500 tabular-nums">
                <span>
                  {safeIndex + 1} / {visibleCards.length}
                </span>
                <button
                  type="button"
                  onClick={() => setIsPaused((prev) => !prev)}
                  disabled={Boolean(prefersReducedMotion)}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-stone-200 text-stone-600 hover:text-[#1A3E31] hover:border-stone-300 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
                  aria-label={isPaused ? 'Retomar rotação automática' : 'Pausar rotação automática'}
                  title={isPaused ? 'Retomar rotação automática' : 'Pausar rotação automática'}
                >
                  {isPaused || prefersReducedMotion ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Área de exibição com suporte a deslize tátil */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={activeCard.id}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: direction * 24 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: direction * -24 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                aria-roledescription="slide"
                aria-label={`Relato ${safeIndex + 1} de ${visibleCards.length}: ${activeCard.name}`}
              >
                {/* Duas metades da mesma imagem exibidas lado a lado, preservando proporção original */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 max-w-[380px] sm:max-w-[420px] mx-auto mb-5">
                  {/* Metade Esquerda: ANTES */}
                  <div
                    className="relative overflow-hidden rounded-2xl bg-stone-100 border border-stone-200/80"
                    style={{
                      aspectRatio: `${activeCard.naturalWidth / 2} / ${activeCard.naturalHeight}`,
                    }}
                  >
                    <span className="absolute top-2.5 left-2.5 z-10 bg-stone-900/85 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                      ANTES
                    </span>

                    {brokenImages[activeCard.id] ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-stone-400">
                        <ImageOff className="w-6 h-6 mb-1.5" />
                        <span className="text-[11px]">Imagem indisponível</span>
                      </div>
                    ) : (
                      <img
                        src={activeCard.imageSrc}
                        alt={`Registro anterior de ${activeCard.name}`}
                        loading={safeIndex === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() => markImageBroken(activeCard.id)}
                        className="w-[200%] max-w-none h-full block select-none"
                        style={{ transform: 'translateX(0%)' }}
                      />
                    )}
                  </div>

                  {/* Metade Direita: DEPOIS */}
                  <div
                    className="relative overflow-hidden rounded-2xl bg-stone-100 border border-stone-200/80"
                    style={{
                      aspectRatio: `${activeCard.naturalWidth / 2} / ${activeCard.naturalHeight}`,
                    }}
                  >
                    <span className="absolute top-2.5 left-2.5 z-10 bg-[#1A3E31]/90 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                      DEPOIS
                    </span>

                    {brokenImages[activeCard.id] ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-stone-400">
                        <ImageOff className="w-6 h-6 mb-1.5" />
                        <span className="text-[11px]">Imagem indisponível</span>
                      </div>
                    ) : (
                      <img
                        src={activeCard.imageSrc}
                        alt={`Registro posterior de ${activeCard.name}`}
                        loading={safeIndex === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() => markImageBroken(activeCard.id)}
                        className="w-[200%] max-w-none h-full block select-none"
                        style={{ transform: 'translateX(-50%)' }}
                      />
                    )}
                  </div>
                </div>

                {/* Depoimento na primeira pessoa e nome autorizado */}
                <div className="max-w-lg mx-auto pt-4 border-t border-stone-200/80 text-center sm:text-left">
                  <blockquote className="text-sm sm:text-base text-stone-700 leading-relaxed mb-2.5">
                    &ldquo;{activeCard.testimonial}&rdquo;
                  </blockquote>
                  <p className="text-xs sm:text-sm font-bold text-[#1A3E31]">
                    {activeCard.name}
                  </p>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Controles manuais de navegação */}
          {visibleCards.length > 1 && (
            <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={goToPrevious}
                className="min-h-[44px] min-w-[44px] px-3 inline-flex items-center justify-center gap-1 rounded-xl border border-stone-200 text-stone-700 hover:text-[#1A3E31] hover:border-stone-300 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
                aria-label="Ver relato anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="flex items-center justify-center gap-1" role="tablist" aria-label="Selecionar relato">
                {visibleCards.map((card, index) => {
                  const isActive = index === safeIndex;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Ir para relato ${index + 1} de ${visibleCards.length}`}
                      onClick={() => goToIndex(index)}
                      className="min-h-[44px] min-w-[24px] px-1 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D] rounded-lg"
                    >
                      <span
                        className={`block h-2 rounded-full transition-all duration-200 ${
                          isActive ? 'w-6 bg-[#1A3E31]' : 'w-2 bg-stone-300 hover:bg-stone-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={goToNext}
                className="min-h-[44px] min-w-[44px] px-3 inline-flex items-center justify-center gap-1 rounded-xl border border-stone-200 text-stone-700 hover:text-[#1A3E31] hover:border-stone-300 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
                aria-label="Ver próximo relato"
              >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Carrossel de Comentários reais nas redes */}
      {visibleComments.length > 0 && activeComment && (
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Carrossel de comentários reais nas redes"
          tabIndex={0}
          onKeyDown={handleCommentKeyDown}
          onMouseEnter={() => setIsCommentInteracting(true)}
          onMouseLeave={() => setIsCommentInteracting(false)}
          onFocus={() => setIsCommentInteracting(true)}
          onBlur={() => setIsCommentInteracting(false)}
          className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-2xs text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#15803D] mb-1">
                Registros Públicos Autorizados
              </p>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-[#1A3E31] uppercase leading-tight">
                Comentários reais nas redes
              </h3>
            </div>

            {visibleComments.length > 1 && (
              <div className="flex items-center gap-2 text-xs text-stone-500 tabular-nums">
                <span>
                  {safeCommentIndex + 1} / {visibleComments.length}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCommentPaused((prev) => !prev)}
                  disabled={Boolean(prefersReducedMotion)}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-stone-200 text-stone-600 hover:text-[#1A3E31] hover:border-stone-300 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
                  aria-label={
                    isCommentPaused
                      ? 'Retomar rotação automática dos comentários'
                      : 'Pausar rotação automática dos comentários'
                  }
                  title={
                    isCommentPaused
                      ? 'Retomar rotação automática dos comentários'
                      : 'Pausar rotação automática dos comentários'
                  }
                >
                  {isCommentPaused || prefersReducedMotion ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>

          <div
            onTouchStart={handleCommentTouchStart}
            onTouchEnd={handleCommentTouchEnd}
            className="overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={activeComment.id}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: commentDirection * 24 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: commentDirection * -24 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                aria-roledescription="slide"
                aria-label={`Comentário ${safeCommentIndex + 1} de ${visibleComments.length}: ${activeComment.platform} ${activeComment.authorHandle}`}
                className="max-w-lg mx-auto rounded-2xl overflow-hidden border border-stone-200/90 bg-stone-50"
              >
                <div
                  className="w-full bg-[#121518] overflow-hidden"
                  style={{
                    aspectRatio: `${activeComment.naturalWidth} / ${activeComment.naturalHeight}`,
                  }}
                >
                  {brokenImages[activeComment.id] ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-stone-400">
                      <ImageOff className="w-6 h-6 mb-1.5" />
                      <span className="text-xs">Captura indisponível</span>
                    </div>
                  ) : (
                    <img
                      src={COMMENT_IMAGE_ASSETS[activeComment.id] || activeComment.imageSrc}
                      alt={activeComment.altText}
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() => markImageBroken(activeComment.id)}
                      className="w-full h-full object-contain block select-none"
                    />
                  )}
                </div>
                <figcaption className="px-4 py-3 text-xs sm:text-sm text-stone-600 flex items-center justify-between gap-2 border-t border-stone-200/80 bg-white">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-[#1A3E31]">{activeComment.platform}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate font-medium text-stone-700">
                      {activeComment.authorHandle}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#15803D] shrink-0">
                    Comentário real
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {visibleComments.length > 1 && (
            <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={goToPreviousComment}
                className="min-h-[44px] min-w-[44px] px-3 inline-flex items-center justify-center gap-1 rounded-xl border border-stone-200 text-stone-700 hover:text-[#1A3E31] hover:border-stone-300 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
                aria-label="Ver comentário anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div
                className="flex items-center justify-center gap-1"
                role="tablist"
                aria-label="Selecionar comentário"
              >
                {visibleComments.map((comment, index) => {
                  const isActive = index === safeCommentIndex;
                  return (
                    <button
                      key={comment.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Ir para comentário ${index + 1} de ${visibleComments.length}`}
                      onClick={() => goToCommentIndex(index)}
                      className="min-h-[44px] min-w-[24px] px-1 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D] rounded-lg"
                    >
                      <span
                        className={`block h-2 rounded-full transition-all duration-200 ${
                          isActive ? 'w-6 bg-[#1A3E31]' : 'w-2 bg-stone-300 hover:bg-stone-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={goToNextComment}
                className="min-h-[44px] min-w-[44px] px-3 inline-flex items-center justify-center gap-1 rounded-xl border border-stone-200 text-stone-700 hover:text-[#1A3E31] hover:border-stone-300 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
                aria-label="Ver próximo comentário"
              >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
