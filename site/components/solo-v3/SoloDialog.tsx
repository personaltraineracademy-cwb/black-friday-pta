'use client'
/**
 * Pop-up de captura das páginas individuais (v3): MESMO comportamento do pop-up da página-mãe
 * (components/LeadModalDialog.tsx), com o texto do professor e a seleção de noites da copy:
 *   título e botão do professor · "Noite do <prof> (data, hora)" já marcada · "Quero assistir também às noites…" opcional.
 *
 * Acessibilidade: <dialog> nativo (foco preso, ESC, inert no resto) · foco no título · rótulos visíveis ·
 * aria-invalid + aria-describedby · erro com fio 2 px + ✕ + "Erro:" (nunca só cor) · alvos >= 48 px · campos >= 16 px.
 * Fechar NÃO apaga o que foi digitado (o estado fica no componente, que permanece montado).
 * Envio: igual à mãe (POST JSON; 2ª tentativa no-cors com o mesmo event_id; sem endpoint = demo).
 */
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import type { NightId } from '@/lib/nights'
import type { SoloCopy } from '@/lib/solo-v3'
import { config } from '@/lib/config'
import { formatMobile, isValidMobile, toDigits, toInternational } from '@/lib/phone'
import { newEventId, track } from '@/lib/analytics'
import { UI } from '@/lib/ui-text'

export interface SoloDialogProps {
  open: boolean
  noite: NightId
  copy: SoloCopy
  origem?: string
  getOpener: () => HTMLElement | null
  onClose: () => void
}

type FieldId = 'nome' | 'whats' | 'email'
type Values = Record<FieldId, string>
type Errors = Partial<Record<FieldId, string>>
type Status = 'idle' | 'sending' | 'ok' | 'fail'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid']

function validateField(id: FieldId, value: string): string {
  if (id === 'nome') return value.trim().length >= 2 ? '' : UI.errors.nome
  if (id === 'whats') return isValidMobile(toDigits(value)) ? '' : UI.errors.whats
  return value.trim() === '' || EMAIL.test(value.trim()) ? '' : UI.errors.email
}

function readUtm(): Record<string, string> {
  const out: Record<string, string> = {}
  const q = new URLSearchParams(window.location.search)
  for (const k of UTM_KEYS) {
    const v = q.get(k)
    if (v) out[k] = v.slice(0, 200)
  }
  return out
}

async function postLead(payload: Record<string, unknown>): Promise<{ ok: boolean; status?: number; demo?: boolean }> {
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

function IconX() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M2 2l12 12M14 2 2 14" />
    </svg>
  )
}

export default function SoloDialog({ open, noite, copy, origem, getOpener, onClose }: SoloDialogProps) {
  const uid = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const okTitleRef = useRef<HTMLHeadingElement>(null)
  const inputs = useRef<Partial<Record<FieldId, HTMLInputElement | null>>>({})
  const honeypot = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState<Values>({ nome: '', whats: '', email: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [fails, setFails] = useState(0)
  const [minha, setMinha] = useState(true) // "Noite do <prof>": já vem marcada
  const [outras, setOutras] = useState(false)

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      ;(status === 'ok' ? okTitleRef.current : titleRef.current)?.focus()
    } else if (!open && d.open) {
      d.close()
    }
    // `status` só decide onde pôr o foco na abertura
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (status === 'ok') okTitleRef.current?.focus()
  }, [status])

  const m = copy.modal
  const fields = m.campos
  const hasData = values.nome !== '' || values.whats !== '' || values.email !== ''

  const setValue = (id: FieldId, v: string) => {
    setValues((s) => ({ ...s, [id]: v }))
    if (errors[id] && validateField(id, v) === '') setErrors((e) => ({ ...e, [id]: '' }))
  }

  const onBlur = (id: FieldId) => {
    let v = values[id]
    if (id === 'whats') {
      const d = toDigits(v)
      if (isValidMobile(d)) {
        v = formatMobile(d)
        setValues((s) => ({ ...s, whats: v }))
      }
    }
    if (v.trim() !== '') {
      const msg = validateField(id, v)
      setErrors((e) => ({ ...e, [id]: msg }))
      if (msg) track('erro', { campo: id, tipo: 'invalido' })
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return
    const next: Errors = {}
    for (const f of fields) {
      const msg = validateField(f.id, values[f.id])
      if (msg) next[f.id] = msg
    }
    setErrors(next)
    const firstBad = fields.find((f) => next[f.id])
    if (firstBad) {
      track('erro', { campo: firstBad.id, tipo: 'invalido' })
      inputs.current[firstBad.id]?.focus()
      return
    }
    if (honeypot.current?.value) {
      setStatus('ok')
      return
    }

    setStatus('sending')
    const digits = toDigits(values.whats)
    const eventId = newEventId()
    track('envio_tentado', { origem: origem ?? null, noite }, eventId)
    const result = await postLead({
      event_id: eventId,
      nome: values.nome.trim(),
      whatsapp: toInternational(digits),
      whatsapp_formatado: formatMobile(digits),
      email: values.email.trim(),
      noite,
      noite_marcada: minha,
      quer_outras_noites: outras,
      origem: origem ?? null,
      pagina: window.location.pathname,
      utm: readUtm(),
      consentimento: m.consentimento,
      enviado_em: new Date().toISOString(),
    })
    if (result.ok) {
      setStatus('ok')
      setFails(0)
      track('envio_ok', { origem: origem ?? null, noite, demo: result.demo ?? false }, eventId)
    } else {
      setStatus('fail')
      setFails((n) => n + 1)
      track('envio_falha', { status: result.status ?? 0 }, eventId)
    }
  }

  const groupExternal = /^https?:/i.test(config.groupUrl)
  const titleId = `${uid}-t`

  return (
    <dialog
      ref={dialogRef}
      className="pta-dialog"
      aria-labelledby={titleId}
      data-lenis-prevent=""
      data-demo={config.demoMode || undefined}
      {...({ closedby: 'closerequest' } as object)}
      onClick={(e) => {
        if (e.target === e.currentTarget && !hasData) dialogRef.current?.close()
      }}
      onClose={() => {
        track('modal_fechado', { com_dados: hasData })
        onClose()
        getOpener()?.focus()
      }}
    >
      <div className="pta-dialog__in">
        {status === 'ok' ? (
          <div className="pta-ok">
            <div className="pta-ok__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <h2 ref={okTitleRef} tabIndex={-1} className="pta-dialog__title" id={titleId}>
              {m.sucesso_titulo}
            </h2>
            <p className="pta-ok__text" role="status" aria-live="polite">
              {m.sucesso_texto}
            </p>
            <a
              className="pta-btn"
              href={config.groupUrl}
              {...(groupExternal ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
              onClick={() => track('grupo_clique', { origem: origem ?? null })}
            >
              {m.sucesso_botao}
            </a>
            <div style={{ marginTop: 'var(--g2)' }}>
              <button type="button" className="pta-btn pta-btn--ghost" onClick={() => dialogRef.current?.close()}>
                {UI.close}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="pta-dialog__head">
              <h2 ref={titleRef} tabIndex={-1} className="pta-dialog__title" id={titleId}>
                {m.titulo}
              </h2>
              <button type="button" className="pta-dialog__close" aria-label={UI.close} onClick={() => dialogRef.current?.close()}>
                <IconX />
              </button>
            </div>

            <form className="pta-form" noValidate onSubmit={onSubmit}>
              {fields.map((f) => {
                const err = errors[f.id]
                const id = `${uid}-${f.id}`
                const errId = `${id}-e`
                return (
                  <div className="pta-field" key={f.id}>
                    <label htmlFor={id}>{f.rotulo}</label>
                    <input
                      ref={(el) => {
                        inputs.current[f.id] = el
                      }}
                      id={id}
                      name={f.id}
                      className="pta-input"
                      type={f.tipo}
                      inputMode={f.id === 'whats' ? 'tel' : f.id === 'email' ? 'email' : 'text'}
                      autoComplete={f.id === 'nome' ? 'name' : f.id === 'whats' ? 'tel-national' : 'email'}
                      placeholder={UI.placeholders[f.id === 'whats' ? 'whats' : f.id]}
                      required={!f.opcional}
                      aria-invalid={err ? true : undefined}
                      aria-describedby={err ? errId : undefined}
                      value={values[f.id]}
                      onChange={(e) => setValue(f.id, e.target.value)}
                      onBlur={() => onBlur(f.id)}
                      onFocus={() => track('campo_focado', { campo: f.id })}
                    />
                    {err && (
                      <p className="pta-error" id={errId}>
                        <IconX />
                        <span>
                          <b>{UI.errorPrefix}</b> {err}
                        </span>
                      </p>
                    )}
                  </div>
                )
              })}

              <fieldset className="so-noites">
                <legend className="sr-only">{copy.produto.professor}</legend>
                <label className="so-check">
                  <input type="checkbox" checked={minha} onChange={(e) => setMinha(e.target.checked)} />
                  <span className="so-check__box" aria-hidden="true" />
                  <span>{copy.formulario.selecao_noite}</span>
                </label>
                <label className="so-check">
                  <input type="checkbox" checked={outras} onChange={(e) => setOutras(e.target.checked)} />
                  <span className="so-check__box" aria-hidden="true" />
                  <span>{copy.formulario.opcional_outras_noites}</span>
                </label>
              </fieldset>

              <input
                ref={honeypot}
                className="pta-hp"
                type="text"
                name="empresa_site"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <p className="pta-consent">{m.consentimento}</p>

              <div>
                <button type="submit" className="pta-btn pta-btn--block" disabled={status === 'sending'}>
                  <span>{status === 'sending' ? UI.sending : m.botao}</span>
                  {status === 'sending' && <span className="pta-spinner" aria-hidden="true" />}
                </button>
              </div>

              <div className="pta-status" aria-live="polite">
                {status === 'sending' ? UI.sending : null}
              </div>
              {status === 'fail' && (
                <div className="pta-error" role="alert">
                  <IconX />
                  <span>
                    <b>{UI.errorPrefix}</b> {UI.network}
                  </span>
                </div>
              )}
              {status === 'fail' && fails >= 2 && (
                <a
                  className="pta-btn pta-btn--ghost"
                  href={config.groupUrl}
                  {...(groupExternal ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
                  onClick={() => track('grupo_clique', { origem: origem ?? null, via: 'fallback' })}
                >
                  {UI.groupAnyway}
                </a>
              )}
            </form>
          </>
        )}
      </div>
    </dialog>
  )
}
