import type { CSSProperties, ReactNode } from 'react'
import { ButtonCta } from '@/components/ButtonCta'
import { withBase } from '@/lib/url'
import { FAQ_TITULO } from '../v2/v2-text'
import { SOLO, type SoloId } from './copy'
import { El } from './El'

/**
 * Blocos das páginas individuais (doc da cliente, nesta ordem): hero · formulário (pop-up) · como funciona ·
 * o que vai ver ao vivo · quem é o professor · a pós que você leva · pague 1, leve 2 · bônus · prova · FAQ · CTA final.
 * Cada bloco recebe o professor e lê SÓ a copy final dele. A composição (ordem dos tons, o que vai ao lado do quê)
 * é de cada página (app/solo/<prof>/v2/page.tsx) e do CSS (.solo-<prof>). Texto que a copy não traz não existe aqui.
 * "Perguntas" (título do FAQ) é rótulo de composição da v2 (components/v2/v2-text.ts), não promessa.
 */
export type Tom = 'preto' | 'papel'

const idx = (i: number): CSSProperties => ({ ['--i' as string]: i }) as CSSProperties

/** Seção com o tom nativo (preto/papel). No tema claro o CSS redesenha os dois tons (ver solo-v2.css). */
export function Sec({
  tom,
  className,
  labelledby,
  children,
}: {
  tom: Tom
  className?: string
  labelledby?: string
  children: ReactNode
}) {
  return (
    <section
      className={['v2-sec', tom === 'preto' ? 'v2-preto' : 'v2-papel', className].filter(Boolean).join(' ')}
      aria-labelledby={labelledby}
    >
      <div className="v2-wrap">{children}</div>
    </section>
  )
}

/** Frase longa + selos (logo abaixo da dobra, no mesmo tom dela). */
export function Intro({ prof, tom }: { prof: SoloId; tom: Tom }) {
  const c = SOLO[prof]
  return (
    <section className={`s2-intro ${tom === 'preto' ? 'v2-preto' : 'v2-papel'}`} aria-label={c.hero.eyebrow}>
      <div className="v2-wrap">
        <span className="s2-eyebrow v2-mono">{c.hero.eyebrow}</span>
        <p className="v2-declara v2-pr" data-v2-io="">
          {c.hero.sub}
        </p>
        <ul className="v2-selos">
          {c.hero.selos.map((s, i) => (
            <li key={s} className="v2-pr" data-v2-io="" style={idx(i + 1)}>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Como({ prof, tom }: { prof: SoloId; tom: Tom }) {
  const c = SOLO[prof].como_funciona
  return (
    <Sec tom={tom} className="s2-como" labelledby="h-como">
      <h2 className="v2-h2 s2-h2" id="h-como" data-v2-lines="">
        {c.titulo}
      </h2>
      <ol className="s2-passos">
        {c.passos.map((p, i) => (
          <li className="s2-passo v2-pr" key={p.t} data-v2-io="" style={idx(i)}>
            <span className="s2-n" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </Sec>
  )
}

export function Noite({ prof, tom }: { prof: SoloId; tom: Tom }) {
  const c = SOLO[prof].na_noite
  return (
    <Sec tom={tom} className="s2-noite" labelledby="h-noite">
      <h2 className="v2-h2 s2-h2" id="h-noite" data-v2-lines="">
        {c.titulo}
      </h2>
      <ul className="s2-itens">
        {c.itens.map((t, i) => (
          <li key={t} className="v2-pr" data-v2-io="" style={idx(i + 1)}>
            <span className="s2-ix v2-mono" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <b>{t}</b>
          </li>
        ))}
      </ul>
    </Sec>
  )
}

/** Quem é o professor: retrato + nome + bio. `deco` = elemento do kit ao lado do retrato. */
export function Professor({ prof, deco }: { prof: SoloId; deco?: string }) {
  const c = SOLO[prof]
  return (
    <div className="s2-prof">
      <figure className="s2-prof-fig">
        <div className="s2-prof-foto">
          <img
            src={withBase(`/img/v2/${prof}-pb-720.webp`)}
            width={720}
            height={964}
            alt={c.professor.nome}
            loading="lazy"
            decoding="async"
          />
        </div>
        {deco && <El prof={prof} nome={deco} className="s2-prof-deco" />}
      </figure>
      <div className="s2-prof-txt">
        <h2 className="v2-h2 s2-h2" id="h-prof" data-v2-lines="">
          {c.professor.nome}
        </h2>
        <p className="s2-bio v2-pr" data-v2-io="">
          {c.professor.bio}
        </p>
      </div>
    </div>
  )
}

/** A pós que você leva: título + linhas. `deco` = elemento do kit. */
export function Pos({ prof, deco }: { prof: SoloId; deco?: string }) {
  const c = SOLO[prof].pos
  return (
    <div className="s2-pos">
      <h2 className="v2-h2 s2-h2" id="h-pos" data-v2-lines="">
        {c.titulo}
      </h2>
      <ul className="s2-pos-itens">
        {c.itens.map((t, i) => (
          <li key={t} className="v2-pr" data-v2-io="" style={idx(i + 1)}>
            {t}
          </li>
        ))}
      </ul>
      {deco && <El prof={prof} nome={deco} className="s2-pos-deco" />}
    </div>
  )
}

/** Pague 1, leve 2: o ÚNICO bloco dourado (cartão de ouro, tinta preta). */
export function Pague({ prof, tom }: { prof: SoloId; tom: Tom }) {
  const c = SOLO[prof].pague1leve2
  const cta = SOLO[prof].hero.cta
  return (
    <Sec tom={tom} className="s2-pague" labelledby="h-pague">
      <div className="s2-ouro">
        <div className="s2-ouro-txt">
          <h2 className="v2-h2 s2-h2" id="h-pague" data-v2-lines="">
            {c.titulo}
          </h2>
          <p className="s2-ouro-intro">{c.intro}</p>
          <ul className="s2-opcoes">
            {c.opcoes.map((o, i) => (
              <li key={o} className="v2-pr" data-v2-io="" style={idx(i + 1)}>
                <span className="s2-l v2-mono" aria-hidden="true">
                  {'ABC'[i]}
                </span>
                <b>{o}</b>
              </li>
            ))}
          </ul>
          <p className="s2-nota">{c.nota}</p>
          <p className="s2-nota">{c.pagamento}</p>
        </div>
        <div className="s2-ouro-fig">
          <El prof={prof} nome="pague" className="s2-ouro-el" />
        </div>
      </div>
      <div className="s2-ouro-cta">
        <ButtonCta origem="pague">{cta}</ButtonCta>
      </div>
    </Sec>
  )
}

/** Bônus + prova (a linha da copy, sem número que ela não traga). */
export function Bonus({ prof, tom }: { prof: SoloId; tom: Tom }) {
  const c = SOLO[prof]
  return (
    <Sec tom={tom} className="s2-bonus" labelledby="h-bonus">
      <h2 className="v2-h2 s2-h2" id="h-bonus" data-v2-lines="">
        {c.bonus.titulo}
      </h2>
      <ol className="s2-lista">
        {c.bonus.itens.map((t, i) => (
          <li key={t} className="v2-pr" data-v2-io="" style={idx(i + 1)}>
            <span className="s2-ix v2-mono" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <b>{t}</b>
          </li>
        ))}
      </ol>
      <div className="s2-prova">
        {c.prova.itens.map((t) => (
          <p key={t} className="v2-pr" data-v2-io="">
            {t}
          </p>
        ))}
      </div>
    </Sec>
  )
}

export function Faq({ prof, tom }: { prof: SoloId; tom: Tom }) {
  const c = SOLO[prof]
  return (
    <Sec tom={tom} className="s2-faq" labelledby="h-faq">
      <div className="s2-faq-in">
        <h2 className="v2-h2 s2-h2" id="h-faq" data-v2-lines="">
          {FAQ_TITULO}
        </h2>
        <div className="pta-acc v2-perguntas">
          {c.faq.map((item) => (
            <details className="pta-acc__item" key={item.q}>
              <summary>
                <span>{item.q}</span>
                <span className="pta-acc__icon" aria-hidden="true" />
              </summary>
              <div className="pta-acc__body">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </Sec>
  )
}

export function Final({ prof, tom, deco }: { prof: SoloId; tom: Tom; deco?: string }) {
  const c = SOLO[prof].cta_final
  return (
    <Sec tom={tom} className="s2-final" labelledby="h-final">
      {deco && <El prof={prof} nome={deco} className="s2-final-deco" />}
      <h2 className="v2-h1x s2-h1x" id="h-final" data-v2-lines="">
        {c.titulo}
      </h2>
      <div className="v2-acao">
        <ButtonCta size="lg" origem="final">
          {c.botao}
        </ButtonCta>
      </div>
    </Sec>
  )
}
