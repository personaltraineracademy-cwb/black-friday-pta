/**
 * Texto do pop-up por página. O <dialog> é um só (LeadModalDialog, carregado sob demanda) e usa a copy da
 * página-mãe; uma página individual registra aqui o texto do professor (título, botão, seleção da noite,
 * "quero assistir também às outras noites") e o <dialog> passa a usá-lo. Sem registro = copy da mãe, intacta.
 */
import type { ModalField } from './copy'

export interface ModalOverride {
  modal: {
    titulo: string
    campos: ModalField[]
    botao: string
    consentimento: string
    sucesso_titulo: string
    sucesso_texto: string
    sucesso_botao: string
  }
  /** "Noite do André (Seg 9/11, 20h30)": a noite já marcada */
  selecao_noite: string
  /** "Quero assistir também às noites do …": opcional */
  outras_noites: string
  /** cor do produto (a página que registrou) */
  cor?: string
}

let atual: ModalOverride | null = null

export function setModalOverride(v: ModalOverride | null): void {
  atual = v
}

export function getModalOverride(): ModalOverride | null {
  return atual
}
