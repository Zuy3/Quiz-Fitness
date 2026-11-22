/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PLACEHOLDER_NAME = '[NOME AUTORIZADO]';
export const PLACEHOLDER_TESTIMONIAL = '[DEPOIMENTO REAL PENDENTE]';

export interface BeforeAfterCardItem {
  id: string;
  /** Caminho permanente do ficheiro original em /public/assets/aistudio/ */
  imageSrc: string;
  /** Largura original da montagem completa (Antes + Depois lado a lado) */
  naturalWidth: number;
  /** Altura original da imagem */
  naturalHeight: number;
  /** Nome real autorizado da participante */
  name: string;
  /** Depoimento real na primeira pessoa */
  testimonial: string;
  /** Deve ser alterado para `true` apenas após preenchimento de nome e depoimento reais autorizados */
  authorized: boolean;
  /** Referência visual interna para facilitar o preenchimento futuro */
  internalReference: string;
}

export interface SocialCommentItem {
  id: string;
  /** Caminho permanente do print original em /public/assets/aistudio/ */
  imageSrc: string;
  naturalWidth: number;
  naturalHeight: number;
  platform: 'Instagram' | 'YouTube';
  authorHandle: string;
  altText: string;
  /** Deve ser alterado para `true` apenas após confirmação de autorização comercial */
  authorized: boolean;
}

/**
 * 7 Cartões de Antes e Depois — campos editáveis centralizados.
 *
 * IMPORTANTE:
 * - Os ficheiros originais em /public/assets/aistudio/ são preservados sem alterações.
 * - Cada cartão exibe a metade esquerda ("ANTES") e a metade direita ("DEPOIS") separadamente.
 * - Cartões com `authorized: false` ou com textos provisórios NÃO são exibidos publicamente.
 * - Para ativar um cartão após obter autorização: preencha `name`, `testimonial` e mude `authorized` para `true`.
 */
export const BEFORE_AFTER_CARDS: BeforeAfterCardItem[] = [
  {
    id: 'before-after-01',
    imageSrc: '/assets/aistudio/1d8da273ae648a8f3190d23e08e39821_e74dc1cc.jpeg',
    naturalWidth: 1199,
    naturalHeight: 1387,
    name: PLACEHOLDER_NAME,
    testimonial: PLACEHOLDER_TESTIMONIAL,
    authorized: false,
    internalReference: 'Foto 01 — Perfil lateral, sutiã bege rendado e short preto',
  },
  {
    id: 'before-after-02',
    imageSrc: '/assets/aistudio/97fc1627b3371736715ec79fa2aced8b_87f885aa.jpeg',
    naturalWidth: 736,
    naturalHeight: 736,
    name: PLACEHOLDER_NAME,
    testimonial: PLACEHOLDER_TESTIMONIAL,
    authorized: false,
    internalReference: 'Foto 02 — Perfil lateral, top esportivo cinza/preto e calcinha preta',
  },
  {
    id: 'before-after-03',
    imageSrc: '/assets/aistudio/177c0e77cf36975cd832a569fa1a0282_b4fe2060.jpeg',
    naturalWidth: 1200,
    naturalHeight: 1200,
    name: PLACEHOLDER_NAME,
    testimonial: PLACEHOLDER_TESTIMONIAL,
    authorized: false,
    internalReference: 'Foto 03 — Vista frontal no espelho, top preto e legging New Balance',
  },
  {
    id: 'before-after-04',
    imageSrc: '/assets/aistudio/5976e4233c10c6c5458a59c72f6ee753_78c404c8.jpeg',
    naturalWidth: 736,
    naturalHeight: 978,
    name: PLACEHOLDER_NAME,
    testimonial: PLACEHOLDER_TESTIMONIAL,
    authorized: false,
    internalReference: 'Foto 04 — Vista de costas, conjunto preto',
  },
  {
    id: 'before-after-05',
    imageSrc: '/assets/aistudio/c85c2a4a0e1f0f2922f1f42f2e9b83a5_bac2f03d.jpeg',
    naturalWidth: 1199,
    naturalHeight: 1434,
    name: PLACEHOLDER_NAME,
    testimonial: PLACEHOLDER_TESTIMONIAL,
    authorized: false,
    internalReference: 'Foto 05 — Perfil lateral, sutiã preto/floral com henna na mão',
  },
  {
    id: 'before-after-06',
    imageSrc: '/assets/aistudio/c23622bbead7049a621fc43c6d2e6893_3a05f201.jpeg',
    naturalWidth: 720,
    naturalHeight: 682,
    name: PLACEHOLDER_NAME,
    testimonial: PLACEHOLDER_TESTIMONIAL,
    authorized: false,
    internalReference: 'Foto 06 — Perfil lateral em sala com piso cerâmico',
  },
  {
    id: 'before-after-07',
    imageSrc: '/assets/aistudio/d8d0d93e77484e9048a47df3961f9cd5_4d8d9856.jpeg',
    naturalWidth: 736,
    naturalHeight: 627,
    name: PLACEHOLDER_NAME,
    testimonial: PLACEHOLDER_TESTIMONIAL,
    authorized: false,
    internalReference: 'Foto 07 — Vista frontal com short jeans folgado na cintura',
  },
];

/**
 * 2 Comentários reais nas redes sociais (prints aprovados na triagem visual).
 *
 * IMPORTANTE:
 * - Os outros 6 prints anexados foram descartados da exibição conforme análise prévia.
 */
export const SOCIAL_COMMENT_ITEMS: SocialCommentItem[] = [
  {
    id: 'social-comment-01',
    imageSrc: '/assets/aistudio/IMG_6599_f1ff0c2e.jpeg',
    naturalWidth: 1238,
    naturalHeight: 670,
    platform: 'Instagram',
    authorHandle: 'josilene5508',
    altText: 'Print de comentário no Instagram de josilene5508 relatando redução do inchaço abdominal',
    authorized: true,
  },
  {
    id: 'social-comment-02',
    imageSrc: '/assets/aistudio/IMG_7861_daf96356.jpeg',
    naturalWidth: 1284,
    naturalHeight: 806,
    platform: 'YouTube',
    authorHandle: '@ericaferreira1740',
    altText: 'Print de comentário no YouTube de @ericaferreira1740 relatando sensação de desinchaço',
    authorized: true,
  },
];

export function isBeforeAfterCardPublishable(item: BeforeAfterCardItem): boolean {
  if (!item.authorized) return false;
  const cleanName = item.name.trim();
  const cleanTestimonial = item.testimonial.trim();
  if (!cleanName || cleanName.includes(PLACEHOLDER_NAME)) return false;
  if (!cleanTestimonial || cleanTestimonial.includes(PLACEHOLDER_TESTIMONIAL)) return false;
  return Boolean(item.imageSrc.trim());
}

export function isSocialCommentPublishable(item: SocialCommentItem): boolean {
  return item.authorized === true && Boolean(item.imageSrc.trim());
}

export function getPublishableBeforeAfterCards(
  items: BeforeAfterCardItem[] = BEFORE_AFTER_CARDS
): BeforeAfterCardItem[] {
  return items.filter(isBeforeAfterCardPublishable);
}

export function getPublishableSocialComments(
  items: SocialCommentItem[] = SOCIAL_COMMENT_ITEMS
): SocialCommentItem[] {
  return items.filter(isSocialCommentPublishable);
}
