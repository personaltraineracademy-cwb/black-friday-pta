'use client'
/**
 * Hooks do relógio do evento (cliente).
 *
 * No servidor (build estático) e durante a hidratação o estado é `null`/`ready:false`: o HTML estático
 * mostra um texto neutro e o relógio real aparece só depois de montar. Assim nunca há descompasso entre
 * o HTML gerado no build e a hora de quem abre a página.
 *
 * Simulação para QA: `?agora=2026-11-10T21:00:00-03:00` na URL faz o relógio andar a partir dessa hora.
 * (Só muda a tela de quem abriu o link; não altera nada no servidor.)
 */
import { useSyncExternalStore } from 'react'
import { config } from './config'
import { buildNights, getEventSnapshot, type EventSnapshot, type EventStateKey, type Night } from './event'

export const NIGHTS: readonly Night[] = buildNights(config.eventStart)

let offset: number | null = null
function clockOffset(): number {
  if (offset !== null) return offset
  offset = 0
  try {
    const q = new URLSearchParams(window.location.search).get('agora')
    const t = q ? Date.parse(q) : Number.NaN
    if (!Number.isNaN(t)) offset = t - Date.now()
  } catch {
    /* sem window: ignora */
  }
  return offset
}

/** Hora atual (ms), já com a simulação `?agora=` aplicada. */
export function nowMs(): number {
  return Date.now() + clockOffset()
}

const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  timer ??= setInterval(() => listeners.forEach((l) => l()), 1000)
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0 && timer !== undefined) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

const secondNow = (): number => Math.floor(nowMs() / 1000)

export interface EventClock {
  ready: boolean
  /** Segundo atual (ms arredondado para baixo ao segundo). null antes de montar. */
  now: number | null
  snapshot: EventSnapshot | null
  nights: readonly Night[]
}

/** Estado completo; re-renderiza 1x por segundo. Use `useEventKey` se só precisar da troca de estado. */
export function useEventState(): EventClock {
  const sec = useSyncExternalStore(subscribe, secondNow, () => null)
  if (sec === null) return { ready: false, now: null, snapshot: null, nights: NIGHTS }
  const now = sec * 1000
  return { ready: true, now, snapshot: getEventSnapshot(now, NIGHTS), nights: NIGHTS }
}

const keyNow = (): EventStateKey => getEventSnapshot(nowMs(), NIGHTS).state

/** Só a chave do estado (before | today | live | between | ended); re-renderiza apenas quando ela muda. */
export function useEventKey(): EventStateKey | null {
  return useSyncExternalStore(subscribe, keyNow, () => null)
}
