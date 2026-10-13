/**
 * André Albuquerque · Biomecânica · azul · "O ÂNGULO" (eixo central).
 * Uma ideia gráfica: o goniômetro ABRE o ângulo atrás do professor (marcação de movimento) e o eixo vertical
 * (prumo) organiza o resto. Layout: tudo no mesmo eixo, centrado, do celular ao desktop.
 * Inventário do kit (docs/solo-v3-decisoes.md): goniômetro · prumo lateral · planos anatômicos · numeração · régua.
 */
import { ButtonCta } from '@/components/ButtonCta'
import { SoloFold } from '@/components/solo/SoloFold'
import { Reveal } from '@/components/Reveal'
import { Numeral } from '@/components/v3/Numeral'
import { barra, SOLO } from '@/lib/solo-v3'
import { el, ElTema, foto, Faq, Moldura, ProtegeHifen, Selos } from './comum'
import './andre.css'

const c = SOLO.andre
const NOITE = 'andre' as const
const { quando } = barra(c)
const e = (n: string) => el(NOITE, n)

/** O goniômetro: base (mostrador) + braço móvel em camada própria, para o ângulo ABRIR (CSS, uma vez). */
function Goniometro({ className }: { className?: string }) {
  return (
    <div className={`so-a-dial ${className ?? ''}`} aria-hidden="true">
      <img src={e('gon-base.svg')} alt="" width={367} height={338} decoding="async" />
      <ElTema prof={NOITE} nome="gon-arm" className="so-a-arm" width={367} height={338} eager />
    </div>
  )
}

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
    <section className="sec so-a-enun" id="enunciado" aria-label={c.hero.destaque}>
      <div className="wrap">
        <Reveal as="p">{c.hero.sub}</Reveal>
      </div>
    </section>
  )
}

/** Como funciona: o eixo vertical com um nó por passo (numeração do kit). Fundo papel. */
function ComoFunciona() {
  return (
    <section className="sec pta-paper so-a-como" id="como" aria-labelledby="h-como">
      <div className="wrap so-a-como__in">
        <h2 id="h-como" className="titulo" data-split>
          {c.como_funciona.titulo}
        </h2>
        <ol className="so-a-passos">
          {c.como_funciona.passos.map((p, i) => (
            <Reveal as="li" className="so-a-passo" index={i} key={p.t}>
              <ElTema prof={NOITE} nome={`num-${i + 1}`} superficie="alt" className="so-a-num" width={223} height={162} />
              <div>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** O que vai ver ao vivo: régua do kit em cima, 4 itens na coluna do eixo. */
function NaNoite() {
  return (
    <section className="sec so-a-noite" id="noite" aria-labelledby="h-noite">
      <div className="wrap">
        <h2 id="h-noite" className="titulo" data-split>
          {c.na_noite.titulo}
        </h2>
        <ElTema prof={NOITE} nome="regua" className="so-a-regua" width={460} height={92} />
        <ol className="so-a-itens">
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

/** Quem é o professor: painel azul (foto + prumo lateral do kit) e o texto no preto ao lado. */
function Professor() {
  return (
    <section className="so-a-prof" id="professor" aria-labelledby="h-prof">
      <div className="wrap so-a-prof__in">
        <div className="so-a-prof__cor">
          <img className="so-a-prumo" src={e('prumo-painel.svg')} alt="" aria-hidden="true" width={236} height={346} loading="lazy" decoding="async" />
          <img
            className="so-a-prof__foto"
            src={foto(NOITE, 'bw-1x')}
            srcSet={`${foto(NOITE, 'bw-1x')} 578w, ${foto(NOITE, 'bw-2x')} 1027w`}
            sizes="(min-width:1024px) 420px, 70vw"
            alt={c.professor.nome}
            width={578}
            height={742}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="so-a-prof__txt">
          <div className="mono so-a-rotulo">{c.produto.nome_pos}</div>
          <h2 id="h-prof">{c.professor.nome}</h2>
          <p className="so-a-bio">{c.professor.bio}</p>
        </div>
      </div>
    </section>
  )
}

/** A pós que você leva: título, logo oficial da pós, planos anatômicos do kit e a lista. */
function Pos() {
  return (
    <section className="sec fundo-ink2 so-a-pos" id="pos" aria-labelledby="h-pos">
      <div className="wrap so-a-pos__in">
        <div className="so-a-pos__cab">
          <h2 id="h-pos" className="titulo" data-split>
            {c.pos.titulo}
          </h2>
          <img className="so-a-logo-pos so-logo-pos" src={e('pos-biomecanica.svg')} alt="" aria-hidden="true" width={915} height={146} loading="lazy" decoding="async" />
        </div>
        <ElTema prof={NOITE} nome="planos" className="so-a-planos" width={454} height={291} />
        <ul className="so-a-lista">
          {c.pos.itens.map((t, i) => (
            <Reveal as="li" index={i} key={t}>
              {t}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Pague 1, leve 2: o único bloco dourado (a assinatura "1 × 2." da v3, classes da mãe). */
function Oferta() {
  const o = c.pague1leve2
  return (
    <section className="sec fundo-ink2 oferta so-a-oferta" id="oferta" aria-labelledby="h-oferta">
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
    <section className="sec pta-paper so-a-bonus" id="bonus" aria-labelledby="h-bonus">
      <div className="wrap">
        <h2 id="h-bonus" className="titulo" data-split>
          {c.bonus.titulo}
        </h2>
        <ol className="so-a-bonus__lista">
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

function Prova() {
  return (
    <section className="sec so-a-prova" id="prova" aria-label="Prova">
      <div className="wrap">
        {c.prova.itens.map((t) => (
          <Reveal as="p" key={t}>
            {t}
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/** CTA final: o ângulo FECHA como abriu (o mesmo goniômetro, menor), frase e botão. */
function Final() {
  return (
    <section className="sec final so-a-final" id="final" aria-labelledby="h-final">
      <div className="wrap so-a-final__in">
        <Goniometro className="so-a-dial--final" />
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

export function PaginaAndre() {
  return (
    <Moldura c={c} noite={NOITE} classe="so-andre">
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
