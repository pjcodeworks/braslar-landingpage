/**
 * Qualidades para `next/image`. Valores têm de existir em `next.config.ts` → `images.qualities`.
 * Fotos de produto e hero usam o máximo (100); miniaturas e cartões mantêm 96 para equilibrar peso.
 */
export const IMAGE_QUALITY = {
  max: 100,
  /** Miniaturas da galeria de produto. */
  productThumb: 96,
  /** Cartões de listagem e blocos «linhas». */
  listing: 96,
} as const;
