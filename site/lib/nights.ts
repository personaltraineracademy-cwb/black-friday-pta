/**
 * Identidade das 3 noites (sem texto): chaves, ordem e cor do produto.
 * Fica fora de lib/copy.ts de propósito: quem só precisa das chaves (ex.: o provedor do pop-up, que roda em
 * toda página) não puxa o JSON da copy inteiro para o JavaScript inicial.
 */
export type NightId = 'andre' | 'walter' | 'carlos'

export const NIGHT_IDS: readonly NightId[] = ['andre', 'walter', 'carlos'] as const

/** Cor do produto de cada noite. Texto pequeno nunca nas cores de noite (só áreas grandes ou >= 72 px). */
export const NIGHT_META: Record<NightId, { n: 1 | 2 | 3; color: 'azul' | 'vermelho' | 'roxo'; hex: string }> = {
  andre: { n: 1, color: 'azul', hex: '#007BFF' }, // Biomecânica
  walter: { n: 2, color: 'vermelho', hex: '#E8341C' }, // Bodybuilding e Estética Corporal
  carlos: { n: 3, color: 'roxo', hex: '#934EFF' }, // Treinamento Feminino
}
