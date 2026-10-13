/**
 * Walter Krause · Bodybuilding e Estética Corporal · vermelho · "A ANILHA" (carga).
 * Uma ideia gráfica: a anilha vermelha atrás do professor e a barra olímpica como linha de carga; o resto da página
 * é a barra recebendo peso (seções alternam papel e preto, como o produto "única noite clara" do manual).
 * Layout: texto à esquerda, palco à direita (anilha sangra pela borda); em cada seção, composição própria.
 * Inventário do kit (docs/solo-v3-decisoes.md): anilha · barra olímpica · fita métrica · numeração em anel · pague 1, leve 2.
 */
import { ButtonCta } from '@/components/ButtonCta'
import { SoloFold } from '@/components/solo/SoloFold'
import { Reveal } from '@/components/Reveal'
import { barra, SOLO } from '@/lib/solo-v3'
import { el, ElTema, foto, Faq, Moldura, ProtegeHifen, Selos } from './comum'
import './walter.css'

const c = SOLO.walter
const NOITE = 'walter' as const
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
    <section className="sec so-w-enun" id="enunciado" aria-label={c.hero.destaque}>
      <div className="wrap">
        <Reveal as="p">{c.hero.sub}</Reveal>
      </div>
    </section>
  )
}

/** Como funciona: a barra em cima e 3 anéis numerados (numeração do kit) pendurados nela. Fundo papel. */
function ComoFunciona() {
  return (
    <section className="sec pta-paper so-w-como" id="como" aria-labelledby="h-como">
      <div className="wrap">
        <h2 id="h-como" className="titulo" data-split>
          {c.como_funciona.titulo}
        </h2>
        <ElTema prof={NOITE} nome="barra" superficie="alt" className="so-w-linha" width={470} height={124} />
        <ol className="so-w-passos">
          {c.como_funciona.passos.map((p, i) => (
            <Reveal as="li" className="so-w-passo" index={i} key={p.t}>
              <ElTema prof={NOITE} nome={`num-${i + 1}`} superficie="alt" className="so-w-anel" width={125} height={125} />
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

/** O que vai ver ao vivo: ficha de treino (linhas com aba vermelha). */
function NaNoite() {
  return (
    <section className="sec so-w-noite" id="noite" aria-labelledby="h-noite">
      <div className="wrap">
        <h2 id="h-noite" className="titulo" data-split>
          {c.na_noite.titulo}
        </h2>
        <ol className="so-w-ficha">
          {c.na_noite.itens.map((t, i) => (
            <Reveal as="li" index={i} key={t}>
              <span className="so-w-ficha__n mono" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="so-w-ficha__t">{t}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Quem é o professor: painel vermelho com a foto e a fita métrica do kit (a medida). Fundo papel. */
function Professor() {
  return (
    <section className="sec pta-paper so-w-prof" id="professor" aria-labelledby="h-prof">
      <div className="wrap so-w-prof__in">
        <div className="so-w-prof__cor">
          <img
            src={foto(NOITE, 'bw-1x')}
            srcSet={`${foto(NOITE, 'bw-1x')} 562w, ${foto(NOITE, 'bw-2x')} 999w`}
            sizes="(min-width:1024px) 440px, 80vw"
            alt={c.professor.nome}
            width={562}
            height={789}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="so-w-prof__txt">
          <div className="mono so-w-rotulo">{c.produto.nome_pos}</div>
          <h2 id="h-prof">{c.professor.nome}</h2>
          <p className="so-w-bio">{c.professor.bio}</p>
          <img className="so-w-fita" src={e('fita.svg')} alt="" aria-hidden="true" width={470} height={53} loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  )
}

/** A pós que você leva: barra do kit, título, logo oficial e a lista em linhas. */
function Pos() {
  return (
    <section className="sec fundo-ink2 so-w-pos" id="pos" aria-labelledby="h-pos">
      <div className="wrap">
        <ElTema prof={NOITE} nome="barra" className="so-w-linha" width={470} height={124} />
        <div className="so-w-pos__in">
          <div>
            <h2 id="h-pos" className="titulo" data-split>
              {c.pos.titulo}
            </h2>
            <img className="so-logo-pos" src={e('pos-bodybuilding.svg')} alt="" aria-hidden="true" width={807} height={217} loading="lazy" decoding="async" />
          </div>
          <ul className="so-w-cargas">
            {c.pos.itens.map((t, i) => (
              <Reveal as="li" index={i} key={t}>
                {t}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** Pague 1, leve 2: o único bloco dourado. O diagrama do kit (pague 1 → leve 2) e a escolha da segunda pós. */
function Oferta() {
  const o = c.pague1leve2
  return (
    <section className="sec fundo-ink2 oferta so-w-oferta" id="oferta" aria-labelledby="h-oferta">
      <div className="wrap so-w-oferta__in">
        <ElTema prof={NOITE} nome="pilha-1-2" className="so-w-pilha" width={288} height={244} />
        <div className="so-w-oferta__txt">
          <h2 id="h-oferta">
            <ProtegeHifen t={o.titulo} />
          </h2>
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
    </section>
  )
}

function Bonus() {
  return (
    <section className="sec pta-paper so-w-bonus" id="bonus" aria-labelledby="h-bonus">
      <div className="wrap">
        <h2 id="h-bonus" className="titulo" data-split>
          {c.bonus.titulo}
        </h2>
        <ol className="so-w-bonus__grade">
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
    <section className="so-w-prova" id="prova" aria-label="Prova">
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

function Final() {
  return (
    <section className="sec final so-w-final" id="final" aria-labelledby="h-final">
      <div className="wrap so-w-final__in">
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

export function PaginaWalter() {
  return (
    <Moldura c={c} noite={NOITE} classe="so-walter">
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
