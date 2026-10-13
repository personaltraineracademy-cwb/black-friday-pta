import type { ReactNode } from 'react'
import { withBase } from '@/lib/url'
import './fold.css'

/**
 * 1ª DOBRA PADRÃO das 9 páginas individuais (3 professores × 3 versões). Contrato único (padrao-de-pagina.md):
 *   um eixo central · palco (arte + retrato) → H1 → destaque → dia/hora → botão · a dobra é a tela inteira ·
 *   a mesma composição em todas as larguras · só a ARTE do palco muda (1 elemento do kit, na cor do professor).
 * Nada de eyebrow, parágrafo ou selos aqui: vão para a seção logo abaixo (`SoloIntro`).
 * Dourado NÃO existe nas individuais: botão, sublinhado e elementos usam a cor do professor.
 */
export type SoloProf = 'andre' | 'walter' | 'carlos'
export type SoloVer = 'v1' | 'v2' | 'v3'

export const FOLD_ARTE: Record<SoloProf, Record<SoloVer, string>> = {
  andre: { v1: 'aberto', v2: 'aberto', v3: 'disco' },
  walter: { v1: 'aberto', v2: 'aberto', v3: 'disco' },
  carlos: { v1: 'aberto', v2: 'aberto', v3: 'disco' },
}

/** variante por tema: o CSS mostra um só (a oculta não é lida por leitor de tela) */
function Img({ src, className, w, h }: { src: string; className: string; w: number; h: number }) {
  return (
    <img
      className={className}
      src={withBase(src)}
      alt=""
      aria-hidden="true"
      width={w}
      height={h}
      decoding="async"
    />
  )
}

function Arte({ prof, ver }: { prof: SoloProf; ver: SoloVer }) {
  const base = `/img/solo/${prof}`
  if (ver === 'v3') {
    return (
      <>
        <span className="sf-disco" aria-hidden="true" />
        <Img src={`${base}/v3/polar-sobre-escuro.svg`} className="sf-arte sf-arte--polar3 t-escuro" w={900} h={900} />
        <Img src={`${base}/v3/polar-sobre-claro.svg`} className="sf-arte sf-arte--polar3 t-claro" w={900} h={900} />
      </>
    )
  }
  if (prof === 'andre') {
    // goniômetro circular concêntrico ao busto (v1 em 90°, v2 em 50°): a escala inteira aparece em volta do professor
    return (
      <>
        <Img src={`${base}/${ver}/gonio-circ-d.svg`} className="sf-arte sf-arte--gonioc t-escuro" w={356} h={356} />
        <Img src={`${base}/${ver}/gonio-circ-l.svg`} className="sf-arte sf-arte--gonioc t-claro" w={356} h={356} />
      </>
    )
  }
  if (prof === 'walter' && ver === 'v1') {
    return (
      <>
        <Img src={`${base}/v1/barra.svg`} className="sf-arte sf-arte--barra t-escuro" w={470} h={98} />
        <Img src={`${base}/v1/barra-claro.svg`} className="sf-arte sf-arte--barra t-claro" w={470} h={98} />
      </>
    )
  }
  if (prof === 'walter') {
    return (
      <>
        <Img src={`${base}/v1/anilha.svg`} className="sf-arte sf-arte--anilha t-escuro" w={303} h={303} />
        <Img src={`${base}/v1/anilha-claro.svg`} className="sf-arte sf-arte--anilha t-claro" w={303} h={303} />
      </>
    )
  }
  if (ver === 'v1') {
    return (
      <>
        <Img src={`${base}/v1/halo.svg`} className="sf-arte sf-arte--anel t-escuro" w={300} h={300} />
        <Img src={`${base}/v1/halo-claro.svg`} className="sf-arte sf-arte--anel t-claro" w={300} h={300} />
      </>
    )
  }
  return (
    <>
      <Img src={`${base}/v2/polar-d.svg`} className="sf-arte sf-arte--polar t-escuro" w={1080} h={1080} />
      <Img src={`${base}/v2/polar-l.svg`} className="sf-arte sf-arte--polar t-claro" w={1080} h={1080} />
      <Img src={`${base}/v2/anel-d.svg`} className="sf-arte sf-arte--anel t-escuro" w={300} h={300} />
      <Img src={`${base}/v2/anel-l.svg`} className="sf-arte sf-arte--anel t-claro" w={300} h={300} />
    </>
  )
}

export function SoloFold({
  prof,
  ver,
  h1,
  destaque,
  quando,
  dateTime,
  alt,
  cta,
  tom,
}: {
  prof: SoloProf
  ver: SoloVer
  h1: string
  destaque: string
  quando: string
  dateTime?: string
  alt: string
  /** o <ButtonCta> já configurado pela página (origem="hero", noite) */
  cta: ReactNode
  /** classe de tom da versão (v2: 'v2-preto'), para a dobra herdar fundo e texto do dossiê nos 2 temas */
  tom?: string
}) {
  return (
    <section
      className={`sf pta-dobra${tom ? ` ${tom}` : ''}`}
      id="hero"
      data-hero
      data-prof={prof}
      data-ver={ver}
      data-arte={FOLD_ARTE[prof][ver]}
      aria-labelledby="h1"
    >
      <div className="sf__in">
        <div className="sf__palco">
          <Arte prof={prof} ver={ver} />
          <img
            className="sf__foto"
            src={withBase(`/img/v2/${prof}-pb-720.webp`)}
            width={720}
            height={964}
            alt={alt}
            fetchPriority="high"
            decoding="sync"
          />
        </div>
        <h1 id="h1" className="sf__h1">
          {h1}
        </h1>
        <p className="sf__destaque">
          <span>{destaque}</span>
        </p>
        <time className="sf__quando" dateTime={dateTime}>
          {quando}
        </time>
        <div className="sf__cta">{cta}</div>
      </div>
    </section>
  )
}

/** Logo abaixo da dobra: o que saiu dela (eyebrow, frase de apoio, selos). Texto da copy final, sem edição. */
export function SoloIntro({ eyebrow, sub, selos }: { eyebrow?: string; sub: string; selos?: string[] }) {
  return (
    <section className="sf-intro" aria-label="Sobre a noite">
      <div className="sf-intro__in">
        {eyebrow ? <p className="sf-intro__eyebrow">{eyebrow}</p> : null}
        <p className="sf-intro__sub">{sub}</p>
        {selos && selos.length > 0 ? (
          <ul className="sf-intro__selos">
            {selos.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
