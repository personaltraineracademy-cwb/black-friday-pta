import { ButtonCta } from '@/components/ButtonCta'
import { copy } from '@/lib/copy'
import { withBase } from '@/lib/url'
import { eventLine, profsList } from './v2-text'

/**
 * 1ª dobra = logo (no Header) + H1 + 1 subheadline + data + 1 CTA + o trio. Nada mais.
 * Composição (todas as larguras): uma FAIXA preta de borda a borda atrás do tronco do trio, o trio centrado
 * por cima dela (a faixa nasce da forma, não é um painel solto). Abaixo: o H1 e, no desktop, a coluna de apoio
 * (sub + data + CTA) ao lado dele, alinhados pelo topo e pela base.
 * O trio "emerge" da faixa: a faixa sobe atrás e ele sobe junto (CSS, ~0,8 s, sem opacidade zero, então o LCP
 * é pintado no 1º quadro). Foto = LCP: <img fetchpriority="high">, sem lazy, com largura/altura (CLS 0).
 * Ordem no HTML = ordem de leitura (H1, apoio, foto); a posição visual vem do grid.
 */
export function Hero() {
  const { dias, hora } = eventLine()
  const src640 = withBase('/img/v2/trio-c-640.webp')
  const src1100 = withBase('/img/v2/trio-c-1100.webp')
  return (
    <section className="v2-hero v2-papel pta-dobra" id="hero" data-hero aria-labelledby="h1">
      <div className="v2-wrap">
        <div className="v2-g">
          <h1 id="h1" className="v2-hero-h1">
            {copy.hero.h1}
          </h1>
          <div className="v2-hero-side">
            <div className="v2-hero-quando">
              <p className="v2-hero-sub">{copy.hero.destaque}</p>
              <span className="v2-hero-data v2-mono">
                {dias} · {hora}
              </span>
            </div>
            <div className="v2-cta-row">
              <ButtonCta origem="hero">{copy.hero.cta}</ButtonCta>
              <small className="v2-micro">{copy.hero.micro}</small>
            </div>
          </div>
          <div className="v2-trio">
            <div className="v2-trio-in">
              <img
                src={src640}
                srcSet={`${src640} 640w, ${src1100} 1100w`}
                sizes="(min-width:1024px) 940px, (min-width:768px) 560px, 420px"
                width={1100}
                height={611}
                alt={`Os três professores: ${profsList()}`}
                fetchPriority="high"
                decoding="sync"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
