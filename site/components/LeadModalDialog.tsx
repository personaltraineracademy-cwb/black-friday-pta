'use client'
/**
 * O <dialog> de captura (carregado sob demanda por LeadModal.tsx — não importe direto).
 *
 * Estados: pronto → inválido (erro inline) → enviando → sucesso | falha (dados mantidos, tentar de novo).
 * Acessibilidade: <dialog> nativo (foco preso, ESC, inert no resto) · foco no título · rótulos visíveis ·
 * aria-invalid + aria-describedby · erro com fio 2 px + ✕ + "Erro:" (nunca só cor) · alvos >= 48 px ·
 * campos >= 16 px (sem zoom no iOS) · aria-live no sucesso.
 *
 * Envio: POST JSON para NEXT_PUBLIC_LEAD_ENDPOINT (timeout 8 s).
 *   1ª tentativa: application/json (CORS). Se o navegador bloquear/ falhar na rede, 2ª tentativa `no-cors`
 *   com text/plain (o servidor recebe o mesmo JSON; a resposta é opaca). O `event_id` é o mesmo nas duas:
 *   o servidor deve deduplicar por ele. Sem endpoint = modo demo (só simula sucesso).
 *   Depois de 2 falhas seguidas aparece "Entrar no grupo mesmo assim" (não perde a pessoa).
 */
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { copy, nightCard, type ModalField } from '@/lib/copy'
import { NIGHT_META, type NightId } from '@/lib/nights'
import { config } from '@/lib/config'
import { formatMobile, isValidMobile, toDigits, toInternational } from '@/lib/phone'
import { newEventId, track } from '@/lib/analytics'
import { UI } from '@/lib/ui-text'
import { getModalOverride } from '@/lib/modal-copy'

export interface LeadModalDialogProps {
  open: boolean
  noite?: NightId
  origem?: string
  getOpener: () => HTMLElement | null
  onClose: () => void
}

type FieldId = ModalField['id']
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
    // CORS bloqueou a leitura da resposta (ou rede caiu): tenta de novo sem preflight
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

export default function LeadModalDialog({ open, noite, origem, getOpener, onClose }: LeadModalDialogProps) {
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
  const [outras, setOutras] = useState(false)

  // abre/fecha o <dialog> nativo conforme a prop
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

  // sucesso: foco no título novo (anuncia a mudança de tela)
  useEffect(() => {
    if (status === 'ok') okTitleRef.current?.focus()
  }, [status])

  // página individual (André/Walter/Carlos): título, botão e seleção da noite vêm da copy do professor
  const ov = getModalOverride()
  const mc = ov?.modal ?? copy.modal
  const card = noite ? nightCard(noite) : null
  const noiteTxt = ov ? ov.selecao_noite : card ? `${card.noite} · ${card.prof}` : ''
  const fields = mc.campos
  const hasData = values.nome !== '' || values.whats !== '' || values.email !== ''

  const setValue = (id: FieldId, v: string) => {
    setValues((s) => ({ ...s, [id]: v }))
    // recompensa cedo: o erro some assim que o campo fica válido
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
    // isca para robôs: campo escondido preenchido = finge sucesso e não envia
    if (honeypot.current?.value) {
      setStatus('ok')
      return
    }

    setStatus('sending')
    const digits = toDigits(values.whats)
    const eventId = newEventId()
    track('envio_tentado', { origem: origem ?? null, noite: noite ?? null }, eventId)
    const result = await postLead({
      event_id: eventId,
      nome: values.nome.trim(),
      whatsapp: toInternational(digits),
      whatsapp_formatado: formatMobile(digits),
      email: values.email.trim(),
      noite: noite ?? null,
      origem: origem ?? null,
      pagina: window.location.pathname,
      utm: readUtm(),
      outras_noites: ov ? outras : undefined,
      consentimento: mc.consentimento,
      enviado_em: new Date().toISOString(),
    })
    if (result.ok) {
      setStatus('ok')
      setFails(0)
      track('envio_ok', { origem: origem ?? null, noite: noite ?? null, demo: result.demo ?? false }, eventId)
    } else {
      setStatus('fail')
      setFails((n) => n + 1)
      track('envio_falha', { status: result.status ?? 0 }, eventId)
    }
  }

  const groupExternal = /^https?:/i.test(config.groupUrl)
  const titleId = `${uid}-t`
  const descId = `${uid}-d`

  return (
    <dialog
      ref={dialogRef}
      className="pta-dialog"
      aria-labelledby={titleId}
      aria-describedby={noiteTxt && noite ? descId : undefined}
      data-lenis-prevent=""
      data-demo={config.demoMode || undefined}
      {...({ closedby: 'closerequest' } as object)}
      // clique no fundo escuro fecha SÓ se a pessoa ainda não digitou nada (não perde o cadastro por um clique sem querer)
      onClick={(e) => {
        if (e.target === e.currentTarget && !hasData) dialogRef.current?.close()
      }}
      onClose={() => {
        track('modal_fechado', { com_dados: hasData })
        onClose()
        getOpener()?.focus() // Safari: devolve o foco ao botão que abriu
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
              {mc.sucesso_titulo}
            </h2>
            <p className="pta-ok__text" role="status" aria-live="polite">
              {mc.sucesso_texto}
            </p>
            <a
              className="pta-btn"
              href={config.groupUrl}
              {...(groupExternal ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
              onClick={() => track('grupo_clique', { origem: origem ?? null })}
            >
              {mc.sucesso_botao}
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
              <div>
                <h2 ref={titleRef} tabIndex={-1} className="pta-dialog__title" id={titleId}>
                  {mc.titulo}
                </h2>
                {noiteTxt && noite && (
                  <p
                    className="pta-dialog__night"
                    id={descId}
                    style={{ ['--night' as string]: NIGHT_META[noite].hex }}
                  >
                    {noiteTxt}
                  </p>
                )}
              </div>
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

              <input
                ref={honeypot}
                className="pta-hp"
                type="text"
                name="empresa_site"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {ov && (
                // "Quero assistir também às noites do …": opcional, desmarcado. Botão com role=checkbox (não é um
                // <input>: o formulário continua com os 3 campos do pedido)
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={outras}
                  className="pta-check"
                  onClick={() => setOutras((v) => !v)}
                >
                  <span className="pta-check__box" aria-hidden="true" />
                  <span>{ov.outras_noites}</span>
                </button>
              )}

              <p className="pta-consent">{mc.consentimento}</p>

              <div>
                <button type="submit" className="pta-btn pta-btn--block" disabled={status === 'sending'}>
                  <span>{status === 'sending' ? UI.sending : mc.botao}</span>
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
