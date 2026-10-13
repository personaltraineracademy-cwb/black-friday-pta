/**
 * Páginas individuais da v3 (André · Walter · Carlos): copy FINAL por professor.
 *
 * Fonte única de texto: content/solo/<prof>.copy.json (cópia de testes/black-pta/sistema/pagina-solo.<prof>.copy.json).
 * Notas de orientação e pendências ficam em content/solo/PENDENCIAS.md e NUNCA entram na página.
 * Os campos `_fonte` e `_evitar` do JSON são metadados: não são exportados daqui.
 */
import andre from '@/content/solo/andre.copy.json'
import walter from '@/content/solo/walter.copy.json'
import carlos from '@/content/solo/carlos.copy.json'
import type { NightId } from './nights'

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
    campos: { id: 'nome' | 'whats' | 'email'; rotulo: string; tipo: 'text' | 'tel' | 'email'; mascara?: string; opcional?: boolean }[]
    botao: string
    consentimento: string
    sucesso_titulo: string
    sucesso_texto: string
    sucesso_botao: string
  }
}

function limpa(raw: Record<string, unknown>): SoloCopy {
  const { _fonte: _f, _evitar: _e, ...resto } = raw
  void _f
  void _e
  return resto as unknown as SoloCopy
}

export const SOLO: Record<NightId, SoloCopy> = {
  andre: limpa(andre),
  walter: limpa(walter),
  carlos: limpa(carlos),
}

/** Rótulo de interface da noite (não é texto de venda): "Noite 1". */
export const NOITE_N: Record<NightId, 1 | 2 | 3> = { andre: 1, walter: 2, carlos: 3 }

/** "Black PTA ao Vivo com André Albuquerque · Seg 9/11 · 20h30"  ->  { quem, quando: "Seg 9/11 · 20h30" }. */
export function barra(c: SoloCopy): { quem: string; quando: string } {
  const partes = c.barra.texto.split(' · ')
  return { quem: partes[0] ?? c.barra.texto, quando: partes.slice(1).join(' · ') }
}
