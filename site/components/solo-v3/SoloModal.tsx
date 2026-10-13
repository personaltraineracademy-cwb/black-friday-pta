'use client'
/**
 * Provedor do pop-up das páginas individuais. Escuta cliques em [data-open-modal] (e [data-solo-open], o botão do
 * cabeçalho, que some no celular) da PRÓPRIA página (na fase de
 * captura, antes do provedor da página-mãe que vive no layout) e abre o pop-up do professor, com o texto dele.
 * Nenhum arquivo compartilhado foi alterado: o provedor da mãe simplesmente não recebe estes cliques.
 *
 * Regras (as mesmas da mãe): abre SÓ por clique · foco no título · ESC fecha · fechar não apaga o digitado ·
 * o foco volta ao botão que abriu. O <dialog> é carregado sob demanda (React.lazy) e aquecido em idle.
 */
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { NightId } from '@/lib/nights'
import type { SoloCopy } from '@/lib/solo-v3'
import { whenIdle } from '@/lib/idle'
import { track } from '@/lib/analytics'

const loadDialog = () => import('./SoloDialog')
const SoloDialog = lazy(loadDialog)

export function SoloModal({ noite, copy }: { noite: NightId; copy: SoloCopy }) {
  const [state, setState] = useState<{ mounted: boolean; open: boolean; origem?: string }>({ mounted: false, open: false })
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-open-modal], [data-solo-open]')
      if (!el || !el.closest('[data-solo]')) return
      e.preventDefault()
      e.stopPropagation() // o provedor da mãe (fase de bolha) não vê este clique
      opener.current = el
      const origem = el.dataset.origem
      track('cta_clique', { origem: origem ?? null })
      track('modal_aberto', { origem: origem ?? null, noite })
      setState({ mounted: true, open: true, origem })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [noite])

  useEffect(() => whenIdle(() => void loadDialog(), 3000), [])

  const close = useCallback(() => setState((s) => ({ ...s, open: false })), [])

  if (!state.mounted) return null
  return (
    <Suspense fallback={null}>
      <SoloDialog
        open={state.open}
        noite={noite}
        copy={copy}
        origem={state.origem}
        getOpener={() => opener.current}
        onClose={close}
      />
    </Suspense>
  )
}
