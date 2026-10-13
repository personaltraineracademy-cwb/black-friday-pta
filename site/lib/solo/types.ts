/**
 * Tipos da copy das páginas individuais (content/solo/<prof>.copy.json = cópia literal de
 * testes/black-pta/sistema/pagina-solo.<prof>.copy.json). Nada de texto de venda fora desses JSON.
 */
import type { NightId } from '@/lib/nights'

export type SoloId = NightId

export interface SoloModalField {
  id: 'nome' | 'whats' | 'email'
  rotulo: string
  tipo: 'text' | 'tel' | 'email'
  mascara?: string
  opcional?: boolean
}

export interface SoloModal {
  titulo: string
  campos: SoloModalField[]
  botao: string
  consentimento: string
  sucesso_titulo: string
  sucesso_texto: string
  sucesso_botao: string
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
  modal: SoloModal
}
