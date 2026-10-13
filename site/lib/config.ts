/**
 * Configuração em tempo de build (variáveis NEXT_PUBLIC_*).
 *
 * No build estático (`output: 'export'`) esses valores são GRAVADOS no JavaScript.
 * Mudou uma variável -> `npm run build` de novo e reenvie `out/`.
 * Atenção: o Next só troca `process.env.NEXT_PUBLIC_X` quando o nome aparece escrito por inteiro
 * (não use process.env[nome]).
 */

const DEFAULT_EVENT_START = '2026-11-09T20:30:00-03:00'
const DEFAULT_GROUP_URL = '#grupo-whatsapp'

const clean = (value: string | undefined, fallback: string): string => {
  const t = (value ?? '').trim()
  return t === '' ? fallback : t
}

const startRaw = clean(process.env.NEXT_PUBLIC_EVENT_START, DEFAULT_EVENT_START)
const startValid = !Number.isNaN(Date.parse(startRaw))
if (!startValid && process.env.NODE_ENV !== 'production') {
  console.warn(`[config] NEXT_PUBLIC_EVENT_START inválida ("${startRaw}"). Usando ${DEFAULT_EVENT_START}.`)
}

const leadEndpoint = clean(process.env.NEXT_PUBLIC_LEAD_ENDPOINT, '')

export const config = {
  /** URL que recebe o POST JSON do formulário. Vazio = modo demo (simula sucesso, não envia nada). */
  leadEndpoint,
  /** true quando não há endpoint: o formulário só simula o sucesso. */
  demoMode: leadEndpoint === '',
  /** Link do grupo do WhatsApp mostrado no estado de sucesso. */
  groupUrl: clean(process.env.NEXT_PUBLIC_GROUP_URL, DEFAULT_GROUP_URL),
  /** Início da 1ª noite (ISO com -03:00). As noites 2 e 3 são +1 e +2 dias. */
  eventStart: startValid ? startRaw : DEFAULT_EVENT_START,
  /** URL pública final, sem barra no fim. */
  siteUrl: clean(process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000').replace(/\/+$/, ''),
  /** Lenis (rolagem suave) no desktop. */
  smoothScroll: process.env.NEXT_PUBLIC_SMOOTH_SCROLL === '1',
  /** Pede aos buscadores para não indexar (padrão nas páginas de comparação). */
  noindex: process.env.NEXT_PUBLIC_NOINDEX !== '0',
} as const

export type SiteConfig = typeof config
