'use client'
/**
 * Anfitrião do pop-up das páginas individuais (solo v2). Mesmo contrato do DossieModalHost da v2: qualquer
 * [data-open-modal] abre, SÓ por clique, foco volta ao botão. Escuta `window` na fase de captura e interrompe o clique
 * antes do provedor do layout, então só um pop-up abre. O <dialog> é React.lazy e aquecido em idle (0 KB no JS inicial).
 */
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { SoloId } from './copy'
import { whenIdle } from '@/lib/idle'
import { track } from '@/lib/analytics'

const loadDialog = () => import('./SoloModalDialog')
const SoloModalDialog = lazy(loadDialog)

interface State {
  mounted: boolean
  open: boolean
  origem?: string
}

export function SoloModalHost({ prof }: { prof: SoloId }) {
  const [state, setState] = useState<State>({ mounted: false, open: false })
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-open-modal], [data-open-solo]')
      if (!el) return
      e.preventDefault()
      e.stopPropagation() // captura em window: o provedor do layout (document) não vê este clique
      opener.current = el
      const origem = el.dataset.origem
      track('cta_clique', { origem: origem ?? null })
      setState({ mounted: true, open: true, origem })
      track('modal_aberto', { origem: origem ?? null, noite: prof })
    }
    window.addEventListener('click', onClick, true)
    return () => window.removeEventListener('click', onClick, true)
  }, [prof])

  useEffect(() => whenIdle(() => void loadDialog(), 1500), [])

  const onClose = useCallback(() => setState((s) => ({ ...s, open: false })), [])

  if (!state.mounted) return null
  return (
    <Suspense fallback={null}>
      <SoloModalDialog
        prof={prof}
        open={state.open}
        origem={state.origem}
        getOpener={() => opener.current}
        onClose={onClose}
      />
    </Suspense>
  )
}
