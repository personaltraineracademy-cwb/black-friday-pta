import { Fragment } from 'react'
import { ButtonCta } from '@/components/ButtonCta'
import { Photo } from '@/components/Photo'
import { config } from '@/lib/config'
import { copy } from '@/lib/copy'
import { dataLinha, emTresPartes, palavrasDoH1 } from './rotulos'

/**
 * Dobra: pessoas · H1 · subheadline + data · CTA · micro. A logo é a do cabeçalho (única).
 * Movimento: SÓ as cantoneiras do visor "travam foco" ao carregar (CSS). Foto e H1 (LCP) nunca animam.
 */
export function Hero() {
  const partes = emTresPartes(copy.hero.destaque, 'pós-graduação')
  const palavras = palavrasDoH1()
  return (
    <section className="v1-hero pta-dobra" aria-labelledby="h1" data-hero>
      <div className="v1-wrap v1-hero__grid">
        <div className="v1-hero__txt">
          <h1 id="h1" className="v1-disp">
            {palavras.map((w, i) => (
              <Fragment key={i}>
                {w.palavra}
                {i < palavras.length - 1 ? ' ' : null}
                {w.quebra ? <br /> : null}
              </Fragment>
            ))}
          </h1>
          <p className="v1-destaque">
            {partes ? (
              <>
                {partes[0]}
                <span className="v1-nw">{partes[1]}</span>
                {partes[2]}
              </>
            ) : (
              copy.hero.destaque
            )}
          </p>
          <time className="v1-data v1-mono" dateTime={config.eventStart}>
            {dataLinha()}
          </time>
          <ButtonCta size="lg" arrow={false} block origem="hero" id="cta-hero" className="v1-btn-hero">
            {copy.hero.cta}
          </ButtonCta>
          <p className="v1-micro">{copy.hero.micro}</p>
        </div>
        <div className="v1-trio v1-visor">
          <Photo
            kind="trio"
            layout="compacta"
            priority
            sizes="(min-width: 1024px) 50vw, (min-width: 768px) 480px, 100vw"
          />
        </div>
      </div>
    </section>
  )
}
