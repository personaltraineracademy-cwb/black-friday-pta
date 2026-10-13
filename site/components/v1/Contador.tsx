'use client'
import { useState, type CSSProperties } from 'react'
import { NIGHT_IDS, NIGHT_META } from '@/lib/nights'
import { UI } from '@/lib/ui-text'
import { formatDay, formatHour, splitDuration, type EventSnapshot, type EventStateKey } from '@/lib/event'
import { useEventState } from '@/lib/use-event-state'
import { UNIDADES } from './unidades'

/**
 * Relógio da "sala de controle": ponto REC + timecode com o estado REAL do evento (5 estados, lib/event.ts).
 *
 *  - Nunca "00 dias": dias só quando >= 1; depois vira Horas · Min · Seg.
 *  - Ao vivo: o ponto fica na cor da noite e pisca 5 vezes (WCAG 2.2.2), depois fixo; o timecode conta o tempo no ar.
 *  - Antes de hidratar / sem JS: mostra a linha de data da copy (vinda do servidor em props) e o espaço do relógio
 *    reservado (sem salto de layout).
 *  - Cada dígito que muda "vira" (sobe 35% e acende, 0,32 s): o timecode está vivo, não só trocando texto.
 *  - Botão "Congelar" para quem não quer o número mudando; a frase aria-live só muda quando o ESTADO muda.
 *  - `?agora=2026-11-10T21:00:00-03:00` simula o relógio (QA).
 */
interface Vista {
  estado: EventStateKey
  noite: number | null
  rotulo: string
  frase: string
  digitos: string[] | null
  unidades: string[] | null
}

const dois = (n: number) => String(Math.floor(n)).padStart(2, '0')

function montar(snap: EventSnapshot, now: number): Vista {
  const S = UI.clockStates
  const U = UNIDADES
  const { state, night, msToStart, msIntoNight, isToday } = snap
  if (state === 'ended' || !night) {
    return { estado: 'ended', noite: null, rotulo: S.endedLabel, frase: S.ended, digitos: null, unidades: null }
  }
  if (state === 'live') {
    const ms = msIntoNight ?? now - night.start
    const p = splitDuration(ms)
    return {
      estado: 'live',
      noite: night.n,
      rotulo: S.liveLabel(night.n),
      frase: S.live(night.n),
      digitos: [dois(Math.floor(ms / 3600000)), dois(p.m), dois(p.s)],
      unidades: [U.h, U.m, U.s],
    }
  }
  const p = splitDuration(msToStart ?? 0)
  const rotulo = state === 'before' ? S.beforeLabel(night.n) : isToday ? S.todayLabel(night.n) : S.betweenLabel(night.n)
  const frase =
    isToday && state !== 'before'
      ? S.startsTodayAt(formatHour(night.start))
      : S.startsAt(`${formatDay(night.start)}, às ${formatHour(night.start)}`)
  const comDias = p.d >= 1
  return {
    estado: state,
    noite: night.n,
    rotulo,
    frase,
    digitos: comDias ? [dois(p.d), dois(p.h), dois(p.m)] : [dois(p.h), dois(p.m), dois(p.s)],
    unidades: comDias ? [U.d, U.h, U.m] : [U.h, U.m, U.s],
  }
}

export function Contador({ rotuloEstatico, fraseEstatica }: { rotuloEstatico: string; fraseEstatica: string }) {
  const clock = useEventState()
  const [congelado, setCongelado] = useState<{ digitos: string[]; unidades: string[] } | null>(null)

  const pronto = clock.ready && clock.now !== null && clock.snapshot !== null
  const v = pronto ? montar(clock.snapshot!, clock.now!) : null

  const digitos = congelado?.digitos ?? v?.digitos ?? ['--', '--', '--']
  const unidades = congelado?.unidades ?? v?.unidades ?? [UNIDADES.d, UNIDADES.h, UNIDADES.m]
  const estado = v?.estado ?? 'static'
  const fim = v?.estado === 'ended'
  const corNoite = v?.noite ? NIGHT_META[NIGHT_IDS[v.noite - 1]!].hex : undefined
  const style = corNoite ? ({ ['--c-noite' as string]: corNoite } as CSSProperties) : undefined

  return (
    <div className="v1-tc" data-state={estado} style={style} role="group" aria-label={UI.clock}>
      <div className="v1-tc__estado v1-mono">
        <i className="v1-dot" aria-hidden="true" />
        <span>{v?.rotulo ?? rotuloEstatico}</span>
      </div>
      {!fim && (
        <div className="v1-tc__dig" aria-hidden="true" data-pronto={pronto || undefined}>
          {digitos.map((d, i) => (
            <span className="v1-tc__par" key={i}>
              {i > 0 && <span className="v1-tc__sep">:</span>}
              <span className="v1-tc__cel">
                <b>
                  {/* cada dígito é um nó com chave própria: ao mudar, remonta e "vira" (CSS v1-tick) */}
                  {d.split('').map((ch, k) => (
                    <span className="v1-tc__d" key={`${k}${ch}`}>
                      {ch}
                    </span>
                  ))}
                </b>
                <span className="v1-mono">{unidades[i]}</span>
              </span>
            </span>
          ))}
        </div>
      )}
      {!fim && (
        <button
          type="button"
          className="v1-tc__cong v1-mono"
          aria-pressed={congelado !== null}
          disabled={!pronto}
          onClick={() => setCongelado((c) => (c ? null : { digitos, unidades }))}
        >
          {congelado ? UI.resumeClock : UI.freezeClock}
        </button>
      )}
      <p className="v1-sr" role="status" aria-live="polite">
        {v ? v.frase : fraseEstatica}
      </p>
    </div>
  )
}
