/**
 * Manifesto das fotos (public/img). Todas P&B reais dos professores, com alfa (recorte), normalizadas:
 * mesmo tamanho de rosto, mesma curva, corte na mesma linha. NUNCA pessoa gerada por IA.
 *
 * trio-larga   1600x674  3 lado a lado (desktop)         trio-compacta 1100x674  sobrepostos (mobile)
 * <id>-n-900   900x1300  individual normalizada          <id>-pb-720|1280  P&B recortada (proporção original)
 * <id>-recorte-720|1280  recorte com alfa (proporção original)
 */
import type { NightId } from './nights'
import { withBase } from './url'

export interface PhotoFile {
  src: string
  w: number
  h: number
}

const f = (name: string, w: number, h: number): PhotoFile => ({ src: withBase(`/img/${name}.webp`), w, h })

export const TRIO = {
  larga: [f('trio-larga-900', 900, 379), f('trio-larga-1600', 1600, 674)],
  compacta: [f('trio-compacta-640', 640, 392), f('trio-compacta-1100', 1100, 674)],
  pb: [f('trio-pb-900', 900, 703), f('trio-pb-1600', 1600, 1250)],
} as const

export const PROF = {
  andre: { n: f('andre-n-900', 900, 1300), pb: [f('andre-pb-720', 720, 936), f('andre-pb-1280', 1280, 1664)], recorte: [f('andre-recorte-720', 720, 964), f('andre-recorte-1280', 1280, 1714)] },
  walter: { n: f('walter-n-900', 900, 1300), pb: [f('walter-pb-720', 720, 1026), f('walter-pb-1280', 1280, 1824)], recorte: [f('walter-recorte-720', 720, 964), f('walter-recorte-1280', 1280, 1714)] },
  carlos: { n: f('carlos-n-900', 900, 1300), pb: [f('carlos-pb-720', 720, 995), f('carlos-pb-1280', 1280, 1769)], recorte: [f('carlos-recorte-720', 720, 964), f('carlos-recorte-1280', 1280, 1714)] },
} as const satisfies Record<NightId, unknown>

/** srcset a partir de uma lista de arquivos. */
export const srcSet = (files: readonly PhotoFile[]): string => files.map((p) => `${p.src} ${p.w}w`).join(', ')
