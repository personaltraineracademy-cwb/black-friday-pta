import type { CSSProperties, ReactNode } from 'react'
import { Logo } from '@/components/Logo'
import { StickyCta } from '@/components/StickyCta'
import { DossieRoot } from '@/components/v2/DossieRoot'
import { SoloModalHost } from './SoloModalHost'
import { barraPartes, COR_PRODUTO, SOLO, type SoloId } from './copy'

/**
 * Casca das páginas individuais da v2 (Dossiê): cabeçalho + <main> + rodapé + barra de baixo (celular) + pop-up.
 * O movimento é o motor do Dossiê (DossieRoot, a mesma linguagem "imprimir/carimbar"); a classe `solo` carrega a cor
 * do produto em `--c` e o professor em `data-prof`. Nada de JS novo: o pop-up é o único cliente próprio (lazy).
 */
export function SoloShell({ prof, children }: { prof: SoloId; children: ReactNode }) {
  const c = SOLO[prof]
  return (
    <div className={`solo solo-${prof}`} data-prof={prof} style={{ ['--c' as string]: COR_PRODUTO[prof] } as CSSProperties}>
      <DossieRoot>
        <SoloHeader prof={prof} />
        <main id="conteudo">{children}</main>
        <SoloFooter prof={prof} />
        <StickyCta>{c.barra.botao}</StickyCta>
        <SoloModalHost prof={prof} />
      </DossieRoot>
    </div>
  )
}

/**
 * Barra do topo (cor da dobra): logo à esquerda; a frase "Black PTA ao Vivo com … · dia · hora" e o botão à direita.
 * Celular: logo + dia e hora (o botão é a barra de baixo, depois da dobra). >= 768: dia/hora + botão. >= 1280: a frase toda.
 */
export function SoloHeader({ prof }: { prof: SoloId }) {
  const c = SOLO[prof]
  const { dia, hora } = barraPartes(c)
  return (
    <header className="v2-barra s2-barra v2-preto">
      <a className="v2-barra-logo" href="#conteudo" aria-label="Black PTA ao Vivo">
        <Logo concept="tarja" variant="nome" live tone="escuro" label="" className="v2-logo-c" />
        <Logo concept="tarja" variant="pta" tone="escuro" label="" className="v2-logo-w" />
      </a>
      <span className="s2-barra-d v2-mono">
        {dia} · {hora}
      </span>
      <span className="s2-barra-t v2-mono">{c.barra.texto}</span>
      {/* botão do cabeçalho: no celular fica escondido (a barra de baixo faz o papel) e não pode ser o 1º
          [data-open-modal] da página; o anfitrião do pop-up também escuta [data-open-solo]. */}
      <button
        type="button"
        className="pta-btn pta-btn--bar v2-barra-btn s2-barra-btn"
        data-open-solo=""
        data-origem="barra"
        aria-haspopup="dialog"
      >
        {c.barra.botao}
        <svg className="pta-btn__arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M1 8h13M9 2.5 14.5 8 9 13.5" />
        </svg>
      </button>
    </header>
  )
}

export function SoloFooter({ prof }: { prof: SoloId }) {
  const c = SOLO[prof]
  return (
    <footer className="v2-rodape s2-rodape">
      <div className="v2-wrap">
        <div className="v2-rod-in">
          <span className="s2-rod-logo">
            <Logo concept="tarja" variant="pta" tone="claro" label="Black PTA ao Vivo" className="v2-rod-logo" />
          </span>
          <div className="s2-rod-txt">
            {c.rodape.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
