/**
 * Textos da versão v2 (Dossiê) que NÃO existem em content/pagina-mae.copy.json e que o desenho aprovado usa.
 * São rótulos de composição (o "documento"), não promessa nem preço. Se a copy da cliente passar a ter estes
 * campos, troque aqui por `copy.*` e apague daqui. Tudo o mais vem de lib/copy.ts e lib/ui-text.ts.
 */
import { copy, nightCard, NIGHT_IDS, type NightId } from '@/lib/copy'

/** Título da seção em que a tarja se abre (design aprovado: "Valor" / "Ao vivo"). */
export const VALOR_TITULO = 'Valor'
export const VALOR_CAMPO = 'Ao vivo'
/** Título da seção de perguntas (a copy tem as perguntas, não o título). */
export const FAQ_TITULO = 'Perguntas'
/** Rótulo do ingresso miniatura do pop-up (quem assina o ingresso). */
export const TITULAR = 'Titular'
/** Trecho do passo 3 que a tarja inline cobre e abre ao rolar. */
export const PASSO_TARJA = 'os valores'

const SEMANA: Record<string, string> = {
  Seg: 'segunda-feira',
  Ter: 'terça-feira',
  Qua: 'quarta-feira',
  Qui: 'quinta-feira',
  Sex: 'sexta-feira',
}

/** "Seg 9/11" -> "segunda-feira" (alt da foto). */
export function weekdayOf(noite: string): string {
  return SEMANA[noite.split(' ')[0] ?? ''] ?? noite
}

/** "Black PTA ao Vivo · 9, 10 e 11/11 · 20h30" -> { brand, dias, hora }. */
export function eventLine(): { brand: string; dias: string; hora: string } {
  const [brand = '', dias = '', hora = ''] = copy.barra.texto.split(' · ')
  return { brand, dias, hora }
}

/** "André Albuquerque, Walter Krause e Carlos Garon" */
export function profsList(): string {
  const names = NIGHT_IDS.map((id: NightId) => nightCard(id).prof)
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}` : (names[0] ?? '')
}
