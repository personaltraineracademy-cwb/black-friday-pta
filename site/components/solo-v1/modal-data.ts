import type { ModalOverride } from '@/lib/modal-copy'
import type { SoloCopy } from '@/lib/solo/copy'
import { SOLO_COR } from '@/lib/solo/copy'
import type { SoloId } from '@/lib/solo/types'

/** O que a página registra para o pop-up: título/botão do professor + "noite já marcada" + "outras noites". */
export function modalData(id: SoloId, c: SoloCopy): ModalOverride {
  return {
    modal: c.modal,
    selecao_noite: c.formulario.selecao_noite,
    outras_noites: c.formulario.opcional_outras_noites,
    cor: SOLO_COR[id].hex,
  }
}
