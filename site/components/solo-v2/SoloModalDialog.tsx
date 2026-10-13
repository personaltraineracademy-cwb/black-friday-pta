'use client'
/**
 * Pop-up das páginas individuais (solo v2) — variante do DossieModalDialog (v2), com a copy do professor.
 * Mesmo contrato: <dialog> nativo (foco preso, ESC), foco no título, fechar não apaga o digitado, rótulos visíveis,
 * WhatsApp normalizado ao sair do campo, erro com fio + ✕ + "Erro:", envio com timeout e 2ª tentativa no-cors (mesmo
 * event_id), modo demo, isca anti-robô. Formulário curto: Nome · WhatsApp · E-mail (opcional) + a noite do professor
 * (já marcada) e a opção das outras noites. Carregado sob demanda por SoloModalHost.
 */
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { SOLO, barraPartes, type ModalCampo, type SoloId } from './copy'
import { config } from '@/lib/config'
import { motionMode } from '@/lib/motion'
import { formatMobile, isValidMobile, toDigits, toInternational } from '@/lib/phone'
import { newEventId, track } from '@/lib/analytics'
import { UI } from '@/lib/ui-text'
import { postLead } from '../v2/post-lead'
import { TITULAR } from '../v2/v2-text'

export interface SoloModalDialogProps {
  prof: SoloId
  open: boolean
  origem?: string
  getOpener: () => HTMLElement | null
  onClose: () => void
}

type FieldId = ModalCampo['id']
type Values = Record<FieldId, string>
type Errors = Partial<Record<FieldId, string>>
type Status = 'idle' | 'sending' | 'ok' | 'fail'
type Curtain = null | 'in' | 'out'

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

function IconX() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M1 1l10 10M11 1 1 11" />
    </svg>
  )
}

function Ticket({ a, b, c, nome, className }: { a: string; b: string; c: string; nome: string; className?: string }) {
  return (
    <div className={['v2-m-ing', className].filter(Boolean).join(' ')} aria-hidden="true">
      <span className="v2-mono">{a}</span>
      <span className="v2-mono">{b}</span>
      <b className="v2-m-ing-c">{c}</b>
      <div className="v2-m-tit">
        <span className="v2-mono">{TITULAR}</span>
        <b>{nome.trim() ? nome.trim().toUpperCase() : '——'}</b>
      </div>
    </div>
  )
}

export default function SoloModalDialog({ prof, open, origem, getOpener, onClose }: SoloModalDialogProps) {
  const copy = SOLO[prof]
  const uid = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const okTitleRef = useRef<HTMLHeadingElement>(null)
  const inputs = useRef<Partial<Record<FieldId, HTMLInputElement | null>>>({})
  const honeypot = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])
  const [values, setValues] = useState<Values>({ nome: '', whats: '', email: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [fails, setFails] = useState(0)
  const [curtain, setCurtain] = useState<Curtain>(null)
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
    // `status` só decide onde o foco cai na abertura
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (status === 'ok') okTitleRef.current?.focus()
  }, [status])

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t))
    },
    [],
  )

  const { dia, hora } = barraPartes(copy)
  const ticket = { a: dia, b: hora, c: `${copy.produto.professor} · ${copy.produto.nome_pos}` }
  const fields = copy.modal.campos
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

  /** Sucesso: a cortina (tarja) fecha por cima do formulário, troca o conteúdo e abre. Movimento 'parado' (?movimento=parado): troca direto. */
  const showSuccess = () => {
    if (motionMode() === 'parado') {
      setStatus('ok')
      return
    }
    setCurtain('in')
    timers.current.push(
      window.setTimeout(() => {
        setStatus('ok')
        setCurtain('out')
      }, 280),
      window.setTimeout(() => setCurtain(null), 280 + 520),
    )
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending' || curtain) return
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
      showSuccess() // isca para robôs: finge sucesso e não envia
      return
    }

    setStatus('sending')
    const digits = toDigits(values.whats)
    const eventId = newEventId()
    track('envio_tentado', { origem: origem ?? null, noite: prof }, eventId)
    const result = await postLead({
      event_id: eventId,
      nome: values.nome.trim(),
      whatsapp: toInternational(digits),
      whatsapp_formatado: formatMobile(digits),
      email: values.email.trim(),
      noite: prof,
      outras_noites: outras,
      origem: origem ?? null,
      pagina: window.location.pathname,
      utm: readUtm(),
      consentimento: copy.modal.consentimento,
      enviado_em: new Date().toISOString(),
    })
    if (result.ok) {
      setFails(0)
      track('envio_ok', { origem: origem ?? null, noite: prof, demo: result.demo ?? false }, eventId)
      showSuccess()
    } else {
      setStatus('fail')
      setFails((n) => n + 1)
      track('envio_falha', { status: result.status ?? 0 }, eventId)
    }
  }

  const groupExternal = /^https?:/i.test(config.groupUrl)
  const titleId = `${uid}-t`
  const sending = status === 'sending'

  return (
    <dialog
      ref={dialogRef}
      className="v2-dialog"
      aria-labelledby={titleId}
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
        getOpener()?.focus()
      }}
    >
      <div className="v2-m-in" data-status={status}>
        <div className="v2-m-hd">
          {status === 'ok' ? (
            <span />
          ) : (
            <h2 ref={titleRef} tabIndex={-1} id={titleId}>
              {copy.modal.titulo}
            </h2>
          )}
          <button type="button" className="v2-m-x" aria-label={UI.close} onClick={() => dialogRef.current?.close()} />
        </div>

        {status === 'ok' ? (
          <div className="v2-m-ok" role="status">
            <h2 ref={okTitleRef} tabIndex={-1} id={titleId}>
              {copy.modal.sucesso_titulo}
            </h2>
            <Ticket {...ticket} nome={values.nome} className="v2-m-ing--ok" />
            <p>{copy.modal.sucesso_texto}</p>
            <a
              className="pta-btn v2-m-group"
              id="grupo-whatsapp"
              href={config.groupUrl}
              {...(groupExternal ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
              onClick={() => track('grupo_clique', { origem: origem ?? null })}
            >
              {copy.modal.sucesso_botao}
              <svg className="pta-btn__arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d="M1 8h13M9 2.5 14.5 8 9 13.5" />
              </svg>
            </a>
          </div>
        ) : (
          <div className="v2-m-form">
            <Ticket {...ticket} nome={values.nome} />
            <form noValidate onSubmit={onSubmit}>
              {fields.map((f) => {
                const err = errors[f.id]
                const id = `${uid}-${f.id}`
                const errId = `${id}-e`
                return (
                  <div className="v2-cp" key={f.id}>
                    <label htmlFor={id}>{f.rotulo}</label>
                    <input
                      ref={(el) => {
                        inputs.current[f.id] = el
                      }}
                      id={id}
                      name={f.id}
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
                      <div className="v2-erro" id={errId} role="alert">
                        <IconX />
                        <span>
                          <b>{UI.errorPrefix}</b> {err}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="s2-noites" role="group" aria-label={copy.formulario.selecao_noite}>
                <p className="s2-chk s2-chk--on">
                  <span className="s2-chk-box" aria-hidden="true">
                    <svg viewBox="0 0 12 12" focusable="false">
                      <path d="M1.5 6.5 4.6 9.5 10.5 2.5" />
                    </svg>
                  </span>
                  <span>{copy.formulario.selecao_noite}</span>
                </p>
                <label className="s2-chk">
                  <input type="checkbox" checked={outras} onChange={(e) => setOutras(e.target.checked)} />
                  <span>{copy.formulario.opcional_outras_noites}</span>
                </label>
              </div>

              <input
                ref={honeypot}
                className="v2-hp"
                type="text"
                name="empresa_site"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="v2-m-st" role="status" aria-live="polite">
                {sending ? UI.sending : ''}
              </div>
              <button type="submit" className="pta-btn v2-m-go" disabled={sending || curtain !== null}>
                <span>{sending ? UI.sending : copy.modal.botao}</span>
                {sending && <span className="v2-spin" aria-hidden="true" />}
              </button>
              <small className="v2-m-cons">{copy.modal.consentimento}</small>

              {status === 'fail' && (
                <div className="v2-erro" role="alert">
                  <IconX />
                  <span>
                    <b>{UI.errorPrefix}</b> {UI.network}
                  </span>
                </div>
              )}
              {status === 'fail' && fails >= 2 && (
                <a
                  className="v2-m-anyway"
                  href={config.groupUrl}
                  {...(groupExternal ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
                  onClick={() => track('grupo_clique', { origem: origem ?? null, via: 'fallback' })}
                >
                  {UI.groupAnyway}
                </a>
              )}
            </form>
          </div>
        )}

        {curtain && <div className="v2-cortina" data-fase={curtain} aria-hidden="true" />}
      </div>
    </dialog>
  )
}
