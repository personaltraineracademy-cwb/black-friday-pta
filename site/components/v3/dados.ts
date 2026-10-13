/**
 * Dados derivados da copy para a v3 · Placar. NENHUM texto novo de venda aqui: tudo sai de lib/copy.ts
 * (única fonte) ou de lib/ui-text.ts. As únicas exceções estão marcadas com "ROTULO" e explicadas em
 * docs/v3-decisoes.md.
 */
import { copy, NIGHT_META, type NightId } from '@/lib/copy'
import { withBase } from '@/lib/url'

/** "Black PTA ao Vivo · 9, 10 e 11/11 · 20h30"  ->  "9, 10 e 11/11 · 20h30" (a logo já diz o nome da campanha). */
const partes = copy.barra.texto.split(' · ')
export const QUANDO = partes.length > 1 ? partes.slice(1).join(' · ') : copy.barra.texto
/** "20h30" (último trecho) — usado em cada cartão de noite. */
export const HORA = partes[partes.length - 1] ?? ''

/** ROTULO: título da seção do FAQ não existe em content/pagina-mae.copy.json (só as perguntas). */
export const TITULO_FAQ = 'Perguntas frequentes'

export interface NoiteV3 {
  id: NightId
  n: number
  dia: string
  prof: string
  primeiro: string
  pos: string
  bio: string
  cor: 'azul' | 'vermelho' | 'roxo'
}

export const NOITES: readonly NoiteV3[] = copy.noites.cards.map((c) => ({
  id: c.foto,
  n: NIGHT_META[c.foto].n,
  dia: c.noite,
  prof: c.prof,
  primeiro: c.prof.split(' ')[0] ?? c.prof,
  pos: c.pos,
  bio: c.bio,
  cor: NIGHT_META[c.foto].color,
}))

/** Fotos da v3 (public/img/v3). `ph` = altura da foto / altura do painel colorido (ajustado à mão, rostos do mesmo tamanho). */
export const FOTOS: Record<NightId, { ph: number; w1: number; h1: number; w2: number }> = {
  andre: { ph: 0.72, w1: 578, h1: 742, w2: 1027 },
  walter: { ph: 0.94, w1: 562, h1: 789, w2: 999 },
  carlos: { ph: 0.86, w1: 610, h1: 831, w2: 1084 },
}

export const img = (name: string) => withBase(`/img/v3/${name}.webp`)
