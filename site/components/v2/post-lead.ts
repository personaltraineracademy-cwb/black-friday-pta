/**
 * Envio do formulário (POST JSON) — mesma regra do pop-up compartilhado (components/LeadModalDialog.tsx):
 * timeout de 8 s; se o navegador bloquear a resposta (CORS) ou a rede falhar, 2ª tentativa `no-cors`
 * (text/plain com o MESMO JSON e o MESMO event_id: o servidor deduplica). Sem endpoint = modo demo.
 */
import { config } from '@/lib/config'

export interface PostResult {
  ok: boolean
  status?: number
  demo?: boolean
}

export async function postLead(payload: Record<string, unknown>): Promise<PostResult> {
  const endpoint = config.leadEndpoint
  if (!endpoint) {
    await new Promise((r) => setTimeout(r, 700)) // demo: simula a rede
    return { ok: true, demo: true }
  }
  const body = JSON.stringify(payload)
  const attempt = async (init: RequestInit): Promise<Response> => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    try {
      return await fetch(endpoint, { method: 'POST', body, signal: ctrl.signal, keepalive: true, ...init })
    } finally {
      clearTimeout(timer)
    }
  }
  try {
    const res = await attempt({ headers: { 'content-type': 'application/json' } })
    return { ok: res.ok, status: res.status }
  } catch {
    try {
      await attempt({ mode: 'no-cors', headers: { 'content-type': 'text/plain;charset=UTF-8' } })
      return { ok: true, status: 0 }
    } catch {
      return { ok: false, status: 0 }
    }
  }
}
