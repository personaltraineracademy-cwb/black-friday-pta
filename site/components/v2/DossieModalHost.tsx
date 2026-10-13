'use client'
/**
 * Anfitrião do pop-up do Dossiê: o mesmo contrato do LeadModalProvider (qualquer [data-open-modal] abre, SÓ por
 * clique, foco volta ao botão), mas abre a VARIANTE da v2 (papel, ingresso miniatura que "imprime" o nome,
 * cortina no sucesso) em vez do pop-up escuro compartilhado.
 *
 * Como convive com o provedor do layout (que escuta `document`): este escuta `window` na FASE DE CAPTURA e
 * interrompe o clique antes dele (stopPropagation), então só um pop-up abre. Fora da v2 nada muda.
 * O <dialog> é carregado sob demanda (React.lazy) e aquecido em idle: 0 KB no JS inicial.
 * Importa só `lib/nights` (sem texto): a copy inteira não entra no JS inicial.
 */
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { NIGHT_IDS, type NightId } from '@/lib/nights'
import { whenIdle } from '@/lib/idle'
import { track } from '@/lib/analytics'

const loadDialog = () => import('./DossieModalDialog')
const DossieModalDialog = lazy(loadDialog)

interface State {
  mounted: boolean
  open: boolean
  noite?: NightId
  origem?: string
}

const asNight = (v: string | undefined): NightId | undefined =>
  v && (NIGHT_IDS as readonly string[]).includes(v) ? (v as NightId) : undefined

export function DossieModalHost() {
  const [state, setState] = useState<State>({ mounted: false, open: false })
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-open-modal]')
      if (!el) return
      e.preventDefault()
      e.stopPropagation() // captura em window: o provedor do layout (document) não vê este clique
      opener.current = el
      const noite = asNight(el.dataset.noite)
      const origem = el.dataset.origem
      track('cta_clique', { origem: origem ?? null })
      setState({ mounted: true, open: true, noite, origem })
      track('modal_aberto', { origem: origem ?? null, noite: noite ?? null })
    }
    window.addEventListener('click', onClick, true)
    return () => window.removeEventListener('click', onClick, true)
  }, [])

  useEffect(() => whenIdle(() => void loadDialog(), 1500), [])

  const onClose = useCallback(() => setState((s) => ({ ...s, open: false })), [])

  if (!state.mounted) return null
  return (
    <Suspense fallback={null}>
      <DossieModalDialog
        open={state.open}
        noite={state.noite}
        origem={state.origem}
        getOpener={() => opener.current}
        onClose={onClose}
      />
    </Suspense>
  )
}
