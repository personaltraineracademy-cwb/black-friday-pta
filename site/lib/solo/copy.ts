/**
 * COPY FINAL das páginas individuais — única fonte de texto de venda (cópias literais dos JSON validados).
 * Os campos `_fonte` e `_evitar` do JSON NÃO são exportados daqui. Orientações/pendências nunca entram na página.
 * Conferência de que as cópias não divergem da fonte: `node scripts/solo-copy-diff.mjs`.
 */
import andre from '@/content/solo/andre.copy.json'
import walter from '@/content/solo/walter.copy.json'
import carlos from '@/content/solo/carlos.copy.json'
import type { SoloCopy, SoloId } from './types'

export type { SoloCopy, SoloId } from './types'

const pick = (raw: Omit<typeof andre, '_fonte' | '_evitar'> | Record<string, unknown>): SoloCopy => {
  const { _fonte: _f, _evitar: _e, ...rest } = raw as Record<string, unknown>
  void _f
  void _e
  return rest as unknown as SoloCopy
}

export const SOLO: Record<SoloId, SoloCopy> = {
  andre: pick(andre),
  walter: pick(walter),
  carlos: pick(carlos),
}

/** Cor do produto de cada professor (a mesma de lib/nights.ts) e o preto/papel que a cor aceita. */
export const SOLO_COR: Record<SoloId, { hex: string; sobre: string }> = {
  andre: { hex: '#007BFF', sobre: '#101010' },
  walter: { hex: '#E8341C', sobre: '#111111' },
  carlos: { hex: '#934EFF', sobre: '#0B0B0B' },
}

/** Dia da noite = 1ª noite (NEXT_PUBLIC_EVENT_START) + deslocamento: André +0, Walter +1, Carlos +2 dias. */
export const SOLO_DIA: Record<SoloId, number> = { andre: 0, walter: 1, carlos: 2 }

/** "Seg 9/11 · 20h30": a barra da copy sem o nome da campanha (o nome fica só na logo). */
export function dataLinha(c: SoloCopy): string {
  const partes = c.barra.texto.split(' · ')
  return partes.length > 1 ? partes.slice(1).join(' · ') : c.barra.texto
}

/** Parte um texto em [antes, trecho, depois] para impedir a quebra de linha dentro do trecho. */
export function emTresPartes(texto: string, trecho: string): [string, string, string] | null {
  const i = texto.indexOf(trecho)
  if (i < 0) return null
  return [texto.slice(0, i), trecho, texto.slice(i + trecho.length)]
}
