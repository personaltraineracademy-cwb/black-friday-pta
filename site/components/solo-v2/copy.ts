/**
 * Copy FINAL das páginas individuais (André, Walter, Carlos) — única fonte de texto comercial.
 * Fonte: content/solo/<prof>.copy.json (cópia de testes/black-pta/sistema/pagina-solo.<prof>.copy.json).
 * Tudo que estava entre colchetes e as orientações ficam em pagina-solo.pendencias.md e NUNCA entram na página.
 * Os campos `_fonte` e `_evitar` do JSON são metadados e não são usados.
 */
import andre from '@/content/solo/andre.copy.json'
import walter from '@/content/solo/walter.copy.json'
import carlos from '@/content/solo/carlos.copy.json'

export type SoloId = 'andre' | 'walter' | 'carlos'

export interface ModalCampo {
  id: 'nome' | 'whats' | 'email'
  rotulo: string
  tipo: 'text' | 'tel' | 'email'
  mascara?: string
  opcional?: boolean
}

export interface SoloCopy {
  produto: { id: string; nome_pos: string; professor: string; nome_curto: string; noite: string; data: string; hora: string }
  barra: { texto: string; botao: string }
  hero: { eyebrow: string; h1: string; destaque: string; sub: string; cta: string; selos: string[] }
  formulario: { campos: string[]; selecao_noite: string; opcional_outras_noites: string; botao: string }
  como_funciona: { titulo: string; passos: { t: string; d: string }[] }
  na_noite: { titulo: string; itens: string[] }
  professor: { nome: string; bio: string }
  pos: { titulo: string; itens: string[] }
  pague1leve2: { titulo: string; intro: string; opcoes: string[]; nota: string; pagamento: string }
  bonus: { titulo: string; itens: string[] }
  prova: { itens: string[] }
  faq: { q: string; a: string }[]
  cta_final: { titulo: string; botao: string }
  rodape: string[]
  modal: {
    titulo: string
    campos: ModalCampo[]
    botao: string
    consentimento: string
    sucesso_titulo: string
    sucesso_texto: string
    sucesso_botao: string
  }
}

export const SOLO: Record<SoloId, SoloCopy> = {
  andre: andre as unknown as SoloCopy,
  walter: walter as unknown as SoloCopy,
  carlos: carlos as unknown as SoloCopy,
}

/** Cor do produto (tokens da marca). Só em área grande ou texto >= 72 px. */
export const COR_PRODUTO: Record<SoloId, string> = { andre: '#007BFF', walter: '#E8341C', carlos: '#934EFF' }

/** "Black PTA ao Vivo com André Albuquerque · Seg 9/11 · 20h30" -> partes. */
export function barraPartes(c: SoloCopy): { marca: string; dia: string; hora: string } {
  const [marca = '', dia = '', hora = ''] = c.barra.texto.split(' · ')
  return { marca, dia, hora }
}
