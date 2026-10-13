'use client'
import { useState, type ReactNode } from 'react'
import { UI } from '@/lib/ui-text'
import { copy } from '@/lib/copy'
import { formatClock, formatDay, formatElapsed, formatHour, getEventSnapshot, splitDuration, type EventSnapshot, type EventStateKey } from '@/lib/event'
import { useEventState } from '@/lib/use-event-state'

/**
 * Relógio honesto do evento — 5 estados a partir das datas reais (lib/event.ts):
 *   before · today · live · between · ended
 *
 * Regras (pesquisa 18 §5.1, paginas-de-captura.md §3):
 *  - NUNCA "00 dias". Dias só aparecem quando >= 1; depois vira H:M:S.
 *  - Texto atualizado 1x por segundo. O timecode é aria-hidden; a frase (aria-live="polite") só muda quando o
 *    ESTADO muda: leitor de tela não anuncia a cada segundo.
 *  - Botão "Congelar" (WCAG 2.2.2) para quem não quer o número mudando.
 *  - Antes de hidratar (e sem JS) mostra `fallback` (padrão: a linha de data da copy), sem salto de layout.
 *  - `?agora=ISO` na URL simula o relógio (QA). Para outro aspecto, use CSS sobre `.pta-cd`/`[data-state]`.
 */
export interface CountdownProps {
  /** texto estático antes de hidratar / sem JS */
  fallback?: ReactNode
  showFreeze?: boolean
  className?: string
  /** relógio FIXO (ISO com -03:00): mostra um estado específico, sem andar. Para o /kit e testes visuais. */
  at?: string
}

interface View {
  state: EventStateKey
  label: string
  big: { value: string; unit: string } | null
  tc: string | null
  caption: string | null
  phrase: string
}

function buildView(now: number, snapshot: EventSnapshot): View {
  const S = UI.clockStates
  const { state, night, msToStart, msIntoNight, isToday } = snapshot
  if (state === 'ended' || !night) {
    return { state, label: S.endedLabel, big: null, tc: null, caption: null, phrase: S.ended }
  }
  if (state === 'live') {
    return {
      state,
      label: S.liveLabel(night.n),
      big: null,
      tc: formatElapsed(msIntoNight ?? now - night.start),
      caption: S.captionLive,
      phrase: S.live(night.n),
    }
  }
  const parts = splitDuration(msToStart ?? 0)
  const label = state === 'before' ? S.beforeLabel(night.n) : isToday ? S.todayLabel(night.n) : S.betweenLabel(night.n)
  const phrase = isToday && state !== 'before' ? S.startsTodayAt(formatHour(night.start)) : S.startsAt(`${formatDay(night.start)}, às ${formatHour(night.start)}`)
  const big = state === 'before' && parts.d >= 1 ? { value: String(parts.d), unit: parts.d === 1 ? S.day : S.days } : null
  return { state, label, big, tc: formatClock(parts), caption: S.captionCountdown, phrase }
}

export function Countdown({ fallback, showFreeze = true, className, at }: CountdownProps) {
  const clock = useEventState()
  const [frozenTc, setFrozenTc] = useState<string | null>(null)
  const fixed = at ? Date.parse(at) : Number.NaN
  const hasFixed = !Number.isNaN(fixed)
  const nowMs = hasFixed ? fixed : clock.now
  const snapshot = hasFixed ? getEventSnapshot(fixed, clock.nights) : clock.snapshot

  if (nowMs === null || snapshot === null) {
    return (
      <section className={['pta-cd', className].filter(Boolean).join(' ')} data-state="static" aria-label={UI.clock}>
        <p className="pta-cd__phrase">{fallback ?? copy.barra.texto}</p>
      </section>
    )
  }

  const v = buildView(nowMs, snapshot)
  const tc = frozenTc ?? v.tc

  return (
    <section className={['pta-cd', className].filter(Boolean).join(' ')} data-state={v.state} aria-label={UI.clock}>
      <p className="pta-cd__state">
        <span className="pta-cd__dot" aria-hidden="true" />
        <span>{v.label}</span>
      </p>
      {v.big && (
        <p className="pta-cd__big" aria-hidden="true">
          <span>{v.big.value}</span>
          <small className="pta-cd__unit">{v.big.unit}</small>
        </p>
      )}
      {tc !== null && (
        <p className="pta-cd__tc" aria-hidden="true">
          {tc}
          {v.caption && <small className="pta-cd__unit block">{v.caption}</small>}
        </p>
      )}
      <p className="pta-cd__phrase" role="status" aria-live="polite">
        {v.big ? `${v.big.value} ${v.big.unit}. ` : ''}
        {v.phrase}
      </p>
      {showFreeze && tc !== null && (
        <div className="pta-cd__ctrl">
          <button
            type="button"
            className="pta-btn pta-btn--ghost"
            aria-pressed={frozenTc !== null}
            onClick={() => setFrozenTc((f) => (f === null ? v.tc : null))}
          >
            {frozenTc !== null ? UI.resumeClock : UI.freezeClock}
          </button>
        </div>
      )}
    </section>
  )
}
