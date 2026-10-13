/**
 * Peças COMUNS das 3 páginas individuais da v3 (André · Walter · Carlos).
 * A família é a mesma da página-mãe v3 (preto, numerais, cor do produto em área grande, tarja ouro na oferta);
 * o que muda por professor (layout da dobra, elementos, composição das seções) está em PaginaAndre/Walter/Carlos.
 * Texto: SÓ de content/solo/<prof>.copy.json (via lib/solo-v3.ts). Rótulos de interface: lib/ui-text.ts.
 */
import type { ReactNode } from 'react'
import { Accordion } from '@/components/Accordion'
import { ButtonCta } from '@/components/ButtonCta'
import { Logo } from '@/components/Logo'
import { BarraFixa } from '@/components/v3/BarraFixa'
import { Movimento } from '@/components/v3/Movimento'
import type { NightId } from '@/lib/nights'
import { barra, type SoloCopy } from '@/lib/solo-v3'
import { withBase } from '@/lib/url'
import { FaixaSolo } from './FaixaSolo'
import { SoloModal } from './SoloModal'

/** ROTULO: título da seção do FAQ não existe na copy (a mãe usa o mesmo rótulo). */
export const TITULO_FAQ = 'Perguntas frequentes'

/** Caminho de um elemento do kit exportado para esta página (public/img/solo/<prof>/v3/). */
export const el = (prof: NightId, nome: string) => withBase(`/img/solo/${prof}/v3/${nome}`)
/** Foto da v3 (public/img/v3/<prof>-bw-2x.webp etc.). */
export const foto = (prof: NightId, nome: string) => withBase(`/img/v3/${prof}-${nome}.webp`)

/**
 * Elemento do kit com cor assada: renderiza as 2 versões (traço claro / traço escuro) e o CSS mostra uma por tema.
 * `superficie`: "base" = sobre o fundo da página (escuro no tema escuro, papel no claro);
 *               "alt"  = dentro de .pta-paper (papel no tema escuro, escuro no claro) → versões trocadas.
 * A versão do tema ativo carrega normalmente; a outra é `loading="lazy"` e display:none (não baixa).
 */
export function ElTema({
  prof,
  nome,
  superficie = 'base',
  className,
  width,
  height,
  eager,
}: {
  prof: NightId
  nome: string
  superficie?: 'base' | 'alt'
  className?: string
  width: number
  height: number
  eager?: boolean
}) {
  const noEscuro = superficie === 'base' ? 'sobre-escuro' : 'sobre-claro'
  const noClaro = superficie === 'base' ? 'sobre-claro' : 'sobre-escuro'
  return (
    <>
      <img
        className={`t-escuro ${className ?? ''}`}
        src={el(prof, `${nome}-${noEscuro}.svg`)}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <img
        className={`t-claro ${className ?? ''}`}
        src={el(prof, `${nome}-${noClaro}.svg`)}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </>
  )
}

/** Quebra o título em linhas visuais pelo ponto/vírgula? Não: só protege "pós-graduação" de quebrar no hífen. */
export function ProtegeHifen({ t }: { t: string }) {
  const partes = t.split(/(pós-graduação)/i)
  return (
    <>
      {partes.map((p, i) =>
        /^pós-graduação$/i.test(p) ? (
          <span className="nb" key={i}>
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  )
}

/** Cabeçalho: logo (única da dobra) + botão (a partir de 768 px) + dia/hora (a partir de 1280 px). O nome do professor está no H1. */
export function Cabecalho({ c, noite }: { c: SoloCopy; noite: NightId }) {
  const b = barra(c)
  return (
    <header className="so-bar">
      <div className="wrap so-bar__in">
        <a className="so-bar__logo" href="#topo" aria-label={c.hero.eyebrow}>
          <Logo concept="tarja" variant="pta" label="" tone="claro" />
        </a>
        <div className="so-bar__txt mono">{b.quando}</div>
        <ButtonCta
          size="bar"
          arrow={false}
          origem="barra"
          noite={noite}
          className="so-bar__btn"
          data-open-modal={undefined}
          data-solo-open=""
        >
          {c.barra.botao}
        </ButtonCta>
      </div>
    </header>
  )
}

/** Faixa de selos (hero.selos): costura abaixo da dobra, na cor do produto. */
export function Selos({ c }: { c: SoloCopy }) {
  return <FaixaSolo items={c.hero.selos} />
}

/** FAQ: <details> nativo (0 JS). Título é rótulo de interface. */
export function Faq({ c }: { c: SoloCopy }) {
  return (
    <section className="sec so-faq" id="faq" aria-labelledby="h-faq">
      <div className="wrap">
        <h2 id="h-faq" className="titulo" data-split>
          {TITULO_FAQ}
        </h2>
        <Accordion items={c.faq} exclusive className="faq-lista" />
      </div>
    </section>
  )
}

/** Rodapé legal: logo fora da dobra + as 3 linhas de aviso da copy. */
export function Rodape({ c }: { c: SoloCopy }) {
  return (
    <footer className="so-rodape">
      <div className="wrap so-rodape__in">
        <Logo concept="tarja" variant="pta" height={48} tone="claro" />
        <div className="so-rodape__txt">
          {c.rodape.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </div>
    </footer>
  )
}

/** Moldura de TODA página individual: raiz (.v3 .so), pop-up do professor, barra fixa do celular, movimento. */
export function Moldura({ c, noite, classe, children }: { c: SoloCopy; noite: NightId; classe: string; children: ReactNode }) {
  return (
    <>
      <div className={`v3 so ${classe}`} data-solo={noite}>
        <Cabecalho c={c} noite={noite} />
        <main id="conteudo">{children}</main>
        <Rodape c={c} />
        <BarraFixa>{c.barra.botao}</BarraFixa>
        <Movimento />
        <div className="progresso" aria-hidden="true" />
      </div>
      {/* fora da raiz .v3: o pop-up fica idêntico ao da página-mãe (as regras .v3 .pta-btn não o alcançam) */}
      <SoloModal noite={noite} copy={c} />
    </>
  )
}
