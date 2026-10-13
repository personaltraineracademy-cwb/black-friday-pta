/**
 * COPY FINAL — única fonte de texto comercial da página.
 *
 * Fonte: content/pagina-mae.copy.json (cópia de testes/black-pta/sistema/pagina-mae.copy.json).
 * Regras: nada fora deste arquivo é "texto de venda". Rótulos de interface neutros (Fechar, Enviando…, Erro:)
 * ficam em lib/ui-text.ts. Notas de orientação/pendências NUNCA entram na página (ver pagina-mae.pendencias.md).
 * Os campos `_fonte` e `_demo` do JSON são metadados: não são exportados daqui de propósito.
 */
import raw from '@/content/pagina-mae.copy.json'
import { NIGHT_IDS, type NightId } from './nights'

export { NIGHT_IDS, NIGHT_META, type NightId } from './nights'

export interface NightCard {
  /** Ex.: "Seg 9/11" */
  noite: string
  prof: string
  bio: string
  /** Nome da pós do professor. */
  pos: string
  /** Chave da foto do professor (arquivo `<foto>-n-900.webp`). */
  foto: NightId
}

export interface ModalField {
  id: 'nome' | 'whats' | 'email'
  rotulo: string
  tipo: 'text' | 'tel' | 'email'
  mascara?: string
  opcional?: boolean
}

export interface Copy {
  barra: { texto: string; botao: string }
  hero: { eyebrow: string; h1: string; destaque: string; sub: string; cta: string; micro: string; selos: string[] }
  como_funciona: { titulo: string; passos: { t: string; d: string }[] }
  noites: { titulo: string; botao_card: string; cards: NightCard[] }
  pague1leve2: { titulo: string; texto: string; opcoes: string[]; nota: string }
  bonus: { titulo: string; itens: string[] }
  por_que: { titulo: string; itens: string[] }
  faq: { q: string; a: string }[]
  cta_final: { titulo: string; botao: string }
  rodape: string
  modal: {
    titulo: string
    campos: ModalField[]
    botao: string
    consentimento: string
    sucesso_titulo: string
    sucesso_texto: string
    sucesso_botao: string
  }
}

function asNight(value: string): NightId {
  if ((NIGHT_IDS as readonly string[]).includes(value)) return value as NightId
  throw new Error(`[copy] noites.cards[].foto inválida: "${value}". Esperado: ${NIGHT_IDS.join(' | ')}`)
}

export const copy: Copy = {
  barra: raw.barra,
  hero: raw.hero,
  como_funciona: raw.como_funciona,
  noites: { ...raw.noites, cards: raw.noites.cards.map((c) => ({ ...c, foto: asNight(c.foto) })) },
  pague1leve2: raw.pague1leve2,
  bonus: raw.bonus,
  por_que: raw.por_que,
  faq: raw.faq,
  cta_final: raw.cta_final,
  rodape: raw.rodape,
  modal: {
    ...raw.modal,
    campos: raw.modal.campos.map((c) => ({ ...c, id: c.id as ModalField['id'], tipo: c.tipo as ModalField['tipo'] })),
  },
}

/** Cartão de uma noite pelo id do professor. */
export function nightCard(id: NightId): NightCard {
  const card = copy.noites.cards.find((c) => c.foto === id)
  if (!card) throw new Error(`[copy] sem cartão para a noite "${id}"`)
  return card
}
