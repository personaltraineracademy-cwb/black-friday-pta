/**
 * Carlos Garon · Treinamento Feminino · roxo · "VISÃO 360º" (anel).
 * Uma ideia gráfica: a grade polar graduada de 360° em volta do professor (a "visão 360º da mulher" que a pós trata:
 * aspectos físicos, hormonais, nutricionais e psicológicos) e o anel de 4 setores na seção da pós.
 * Layout: palco circular à esquerda, texto à direita; seções com cartões de canto levemente arredondado (a curva é a
 * escola: conteúdo e gente ganham a curva; botão, logo e tarja ficam retos).
 * Inventário do kit (docs/solo-v3-decisoes.md): grade polar graduada · meio-tom radial · anel de 4 setores.
 */
import { ButtonCta } from '@/components/ButtonCta'
import { SoloFold } from '@/components/solo/SoloFold'
import { Reveal } from '@/components/Reveal'
import { Numeral } from '@/components/v3/Numeral'
import { barra, SOLO } from '@/lib/solo-v3'
import { el, foto, Faq, Moldura, ProtegeHifen, Selos } from './comum'
import './carlos.css'

const c = SOLO.carlos
const NOITE = 'carlos' as const
const { quando } = barra(c)
const e = (n: string) => el(NOITE, n)

function Dobra() {
  return (
    <SoloFold
      prof={NOITE}
      ver="v3"
      h1={c.hero.h1}
      destaque={c.hero.destaque}
      quando={quando}
      alt={c.produto.professor}
      cta={
        <ButtonCta id="cta-hero" size="lg" origem="hero" noite={NOITE}>
          {c.hero.cta}
        </ButtonCta>
      }
    />
  )
}

function Enunciado() {
  return (
    <section className="sec so-c-enun" id="enunciado" aria-label={c.hero.destaque}>
      <div className="wrap">
        <Reveal as="p">{c.hero.sub}</Reveal>
      </div>
    </section>
  )
}

/** Como funciona: 3 cartões lado a lado, o numeral grande na cor do produto (>= 100 px). */
function ComoFunciona() {
  return (
    <section className="sec fundo-ink2 so-c-como" id="como" aria-labelledby="h-como">
      <div className="wrap">
        <h2 id="h-como" className="titulo" data-split>
          {c.como_funciona.titulo}
        </h2>
        <ol className="so-c-passos">
          {c.como_funciona.passos.map((p, i) => (
            <Reveal as="li" className="so-c-passo" index={i} key={p.t}>
              <span className="so-c-passo__n" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** O que vai ver ao vivo: um bloco só, dividido em 4 quadrantes por uma cruz (os 4 itens). */
function NaNoite() {
  return (
    <section className="sec so-c-noite" id="noite" aria-labelledby="h-noite">
      <div className="wrap">
        <h2 id="h-noite" className="titulo" data-split>
          {c.na_noite.titulo}
        </h2>
        <ol className="so-c-quad">
          {c.na_noite.itens.map((t, i) => (
            <Reveal as="li" index={i} key={t}>
              <span className="mono" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="t">{t}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Quem é o professor: a foto dentro de um disco de cor com o meio-tom radial do kit; a cabeça passa do disco. */
function Professor() {
  return (
    <section className="sec so-c-prof" id="professor" aria-labelledby="h-prof">
      <div className="wrap so-c-prof__in">
        <div className="so-c-prof__disco">
          <span className="so-c-prof__cor" aria-hidden="true">
            <img src={e('meio-tom.svg')} alt="" width={700} height={700} loading="lazy" decoding="async" />
          </span>
          <img
            className="so-c-prof__foto"
            src={foto(NOITE, 'bw-1x')}
            srcSet={`${foto(NOITE, 'bw-1x')} 610w, ${foto(NOITE, 'bw-2x')} 1084w`}
            sizes="(min-width:1024px) 420px, 80vw"
            alt={c.professor.nome}
            width={610}
            height={831}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="so-c-prof__txt">
          <div className="mono so-c-rotulo">{c.produto.nome_pos}</div>
          <h2 id="h-prof">{c.professor.nome}</h2>
          <p className="so-c-bio">{c.professor.bio}</p>
        </div>
      </div>
    </section>
  )
}

/** A pós que você leva: o anel de 4 setores do kit ao lado da frase da visão 360º, e a lista. */
function Pos() {
  const destaque = c.pos.itens.find((t) => t.startsWith('Visão 360º'))
  const resto = c.pos.itens.filter((t) => t !== destaque)
  return (
    <section className="sec fundo-ink2 so-c-pos" id="pos" aria-labelledby="h-pos">
      <div className="wrap">
        <h2 id="h-pos" className="titulo" data-split>
          {c.pos.titulo}
        </h2>
        {destaque && (
          <div className="so-c-360">
            <img className="so-c-360__anel" src={e('anel-4.svg')} alt="" aria-hidden="true" width={300} height={300} loading="lazy" decoding="async" />
            <p>{destaque}</p>
          </div>
        )}
        <ul className="so-c-lista">
          {resto.map((t, i) => (
            <Reveal as="li" index={i} key={t}>
              {t}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Pague 1, leve 2: a seção inteira em dourado (o único bloco dourado), tinta escura, botão preto. */
function Oferta() {
  const o = c.pague1leve2
  return (
    <section className="sec oferta so-c-oferta" id="oferta" aria-labelledby="h-oferta">
      <div className="wrap">
        <p className="placar" aria-hidden="true" data-tarja="">
          <span className="l">
            <Numeral n={1} digits={1} roll />
            <span className="x">×</span>
          </span>
          <span className="tarja">
            <Numeral n={2} digits={1} roll />
            <span className="pt">.</span>
          </span>
        </p>
        <h2 id="h-oferta">
          <ProtegeHifen t={o.titulo} />
        </h2>
        <div className="oferta-2">
          <div className="wrap-2">
            <div className="col">
              <p className="oferta-txt">{o.intro}</p>
              <ul className="opcoes">
                {o.opcoes.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="nota">{o.nota}</p>
              <p className="nota">{o.pagamento}</p>
              <ButtonCta origem="oferta" noite={NOITE} className="oferta-cta">
                {c.hero.cta}
              </ButtonCta>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Bonus() {
  return (
    <section className="sec pta-paper so-c-bonus" id="bonus" aria-labelledby="h-bonus">
      <div className="wrap">
        <h2 id="h-bonus" className="titulo" data-split>
          {c.bonus.titulo}
        </h2>
        <ol className="so-c-bonus__lista">
          {c.bonus.itens.map((t, i) => (
            <Reveal as="li" index={i} key={t}>
              <span className="n mono" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="t">{t}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** "+10.000 alunos formados · Professores-referência…": o número vira herói e conta uma vez (como na mãe). */
function Prova() {
  const partes = c.prova.itens.flatMap((t) => t.split(' · '))
  const m = partes[0]?.match(/^(\+?\d[\d.]*)\s+(.+)$/)
  const num = m?.[1]
  const resto = m?.[2]
  const outros = num ? partes.slice(1) : partes
  return (
    <section className="sec so-c-prova" id="prova" aria-label="Prova">
      <div className="wrap so-c-prova__in">
        {num && resto && (
          <Reveal as="p" className="so-c-prova__num">
            <b className="cnt" data-count={num.replace(/\D/g, '')} data-prefix={num.startsWith('+') ? '+' : ''}>
              {num}
            </b>
            <span>{resto}</span>
          </Reveal>
        )}
        {outros.map((t) => (
          <Reveal as="p" className="so-c-prova__txt" key={t}>
            {t}
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/** CTA final: frase e botão (sem elemento decorativo: não tem função). */
function Final() {
  return (
    <section className="sec final so-c-final" id="final" aria-labelledby="h-final">
      <div className="wrap so-c-final__in">
        <h2 id="h-final" data-split>
          {c.cta_final.titulo}
        </h2>
        <ButtonCta size="lg" origem="final" noite={NOITE} className="final-cta">
          {c.cta_final.botao}
        </ButtonCta>
      </div>
    </section>
  )
}

export function PaginaCarlos() {
  return (
    <Moldura c={c} noite={NOITE} classe="so-carlos">
      <Dobra />
      <Selos c={c} />
      <Enunciado />
      <ComoFunciona />
      <NaNoite />
      <Professor />
      <Pos />
      <Oferta />
      <Bonus />
      <Prova />
      <Faq c={c} />
      <Final />
    </Moldura>
  )
}
