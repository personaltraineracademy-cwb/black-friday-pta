/**
 * Máquina de estados do evento (pura, sem dependências: roda no navegador e nos testes do Node).
 *
 * Honestidade: o estado vem de datas REAIS (ISO com -03:00; o Brasil não tem horário de verão desde 2019).
 * Nunca mostra "00 dias", nunca reinicia sozinho, nunca inventa prazo ou vaga.
 *
 * Estados:
 *   before   antes do dia da 1ª noite                         -> "Falta para a noite 1" (dias + H:M:S)
 *   today    no dia da 1ª noite, antes do início              -> "Hoje · noite 1"
 *   live     dentro da janela de uma noite                    -> "Ao vivo agora · noite N"
 *   between  depois de uma noite, antes da próxima            -> "Próxima: noite N" (ou "Hoje" no dia dela)
 *   ended    depois da última noite                           -> "Transmissão encerrada"
 */

export type EventStateKey = 'before' | 'today' | 'live' | 'between' | 'ended'

export interface Night {
  /** 1, 2 ou 3 */
  n: number
  /** início, em ms desde a época */
  start: number
  /** fim, em ms desde a época */
  end: number
}

export interface EventSnapshot {
  state: EventStateKey
  /** Noite atual (live) ou a próxima (before/today/between). null só em `ended`. */
  night: Night | null
  /** ms até o início da noite `night` (before/today/between). null em live/ended. */
  msToStart: number | null
  /** ms desde o início da noite atual (live). null nos demais. */
  msIntoNight: number | null
  /** true quando a próxima noite acontece hoje (today, ou between no dia dela). */
  isToday: boolean
}

export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR
export const NIGHT_DURATION = 2 * HOUR // 20h30 às 22h30 (copy: "das 20h30 às 22h30")
const BRASILIA_OFFSET = 3 * HOUR // UTC-3 fixo

/** Monta as noites a partir do início da 1ª (ISO). Noite n começa em start + (n-1) dias. */
export function buildNights(startIso: string, count = 3, duration = NIGHT_DURATION): Night[] {
  const first = Date.parse(startIso)
  if (Number.isNaN(first)) throw new Error(`Data inválida: ${startIso}`)
  return Array.from({ length: count }, (_, i) => {
    const start = first + i * DAY
    return { n: i + 1, start, end: start + duration }
  })
}

/** "AAAA-MM-DD" no horário de Brasília. */
export function brasiliaDay(ms: number): string {
  return new Date(ms - BRASILIA_OFFSET).toISOString().slice(0, 10)
}

export function getEventSnapshot(now: number, nights: readonly Night[]): EventSnapshot {
  const first = nights[0]
  if (!first) throw new Error('Sem noites')
  for (const night of nights) {
    if (now >= night.start && now < night.end) {
      return { state: 'live', night, msToStart: null, msIntoNight: now - night.start, isToday: true }
    }
  }
  for (let i = 0; i < nights.length; i += 1) {
    const night = nights[i]!
    if (now < night.start) {
      const afterPrevious = i > 0 && now >= nights[i - 1]!.end
      const sameDay = brasiliaDay(now) === brasiliaDay(night.start)
      const state: EventStateKey = afterPrevious ? 'between' : sameDay ? 'today' : 'before'
      return { state, night, msToStart: night.start - now, msIntoNight: null, isToday: sameDay }
    }
  }
  return { state: 'ended', night: null, msToStart: null, msIntoNight: null, isToday: false }
}

export interface Parts {
  d: number
  h: number
  m: number
  s: number
}

/** Quebra uma duração em dias/horas/minutos/segundos (nunca negativa). */
export function splitDuration(ms: number): Parts {
  const total = Math.max(0, Math.floor(ms / SECOND))
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  }
}

const two = (n: number): string => String(Math.floor(n)).padStart(2, '0')

/** "HH:MM:SS" (horas acumulam além de 24 só se `d` for 0; com dias use `parts.d` à parte). */
export function formatClock(p: Parts): string {
  return `${two(p.h)}:${two(p.m)}:${two(p.s)}`
}

/** Tempo no ar: "HH:MM:SS" acumulado. */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / SECOND))
  return `${two(Math.floor(total / 3600))}:${two(Math.floor((total % 3600) / 60))}:${two(total % 60)}`
}

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const

/** "seg, 9/11" no horário de Brasília. */
export function formatDay(ms: number): string {
  const d = new Date(ms - BRASILIA_OFFSET)
  return `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()}/${d.getUTCMonth() + 1}`
}

/** "20h30" no horário de Brasília. */
export function formatHour(ms: number): string {
  const d = new Date(ms - BRASILIA_OFFSET)
  const h = d.getUTCHours()
  const m = d.getUTCMinutes()
  return m === 0 ? `${h}h` : `${h}h${two(m)}`
}

/** Rótulo curto de uma noite como na copy: "Seg 9/11". */
export function formatNightLabel(ms: number): string {
  const d = new Date(ms - BRASILIA_OFFSET)
  const wd = WEEKDAYS[d.getUTCDay()]!
  return `${wd.charAt(0).toUpperCase()}${wd.slice(1)} ${d.getUTCDate()}/${d.getUTCMonth() + 1}`
}
