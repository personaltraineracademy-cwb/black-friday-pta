/**
 * v1 · Sala de controle — rótulos de INTERFACE e ajudantes de texto.
 *
 * Aqui NÃO há texto de venda (esse vem só de lib/copy.ts). Aqui ficam:
 *  - os indexadores neutros das seções do arquétipo "sala de controle" ("(01) Roteiro"…);
 *  - as unidades do relógio (Dias · Horas · Min · Seg), que o lib/ui-text.ts não tem;
 *  - funções puras que derivam a forma visual a partir da copy (quebra do H1, número + legenda, palavra sem quebra).
 */
import { config } from '@/lib/config'
import { copy } from '@/lib/copy'
import { buildNights, formatHour } from '@/lib/event'
import { UNIDADES } from './unidades'

export const ROTULOS = {
  secoes: {
    roteiro: '(01) Roteiro',
    programacao: '(02) Programação',
    condicao: '(03) Condição Black',
    bonus: '(04) Bônus',
    pta: '(05) PTA',
    duvidas: '(06) Dúvidas',
  },
  /** título da seção de dúvidas (a copy só traz as perguntas) */
  faqTitulo: 'Perguntas frequentes',
  antes: 'Antes',
  pos: 'Pós',
  unidades: UNIDADES,
} as const

const nights = buildNights(config.eventStart)

/** "20h30" da 1ª noite e "22h30" do fim dela (a janela das aulas, a mesma nas 3 noites). */
export const HORA_INICIO = formatHour(nights[0]!.start)
export const HORA_FIM = formatHour(nights[0]!.end)
/** "Noite 1 · Seg 9/11 · 20h30": a hora vem das datas reais do evento. */
export const horaDaNoite = (i: number): string => formatHour(nights[i]!.start)

/** Linha de data da dobra: a barra da copy sem o nome da campanha ("9, 10 e 11/11 · 20h30"). O nome fica só na logo. */
export function dataLinha(): string {
  const partes = copy.barra.texto.split(' · ')
  return partes.length > 1 ? partes.slice(1).join(' · ') : copy.barra.texto
}

/**
 * H1 em 3 linhas, como no desenho aprovado: "A MAIOR BLACK / FRIDAY DA EDUCAÇÃO / FÍSICA … JÁ COMEÇOU!".
 * A quebra vem DEPOIS da 3ª e da 6ª palavra; o tamanho da fonte se ajusta à coluna (v1.css, cqi) para a 3ª linha caber.
 */
export function palavrasDoH1(): { palavra: string; quebra: boolean }[] {
  const ws = copy.hero.h1.split(/\s+/)
  return ws.map((palavra, i) => ({ palavra, quebra: i === 2 || i === 5 }))
}

/** Parte um texto em [antes, palavra, depois] para impedir a quebra de linha dentro da palavra. */
export function emTresPartes(texto: string, palavra: string): [string, string, string] | null {
  const i = texto.indexOf(palavra)
  if (i < 0) return null
  return [texto.slice(0, i), palavra, texto.slice(i + palavra.length)]
}

/** "+10.000 alunos formados" -> { n: "+10.000", legenda: "alunos formados" }; sem número no começo -> só legenda. */
export function numeroELegenda(item: string): { n: string | null; legenda: string } {
  const m = /^(\+?\d[\d.,]*)\s+(.+)$/.exec(item)
  return m ? { n: m[1]!, legenda: m[2]! } : { n: null, legenda: item }
}

/** Os numerais da condição ("1" e "2") saem do próprio título da copy. */
export function numeraisDaCondicao(): string[] {
  return copy.pague1leve2.titulo.match(/\d+/g) ?? []
}
