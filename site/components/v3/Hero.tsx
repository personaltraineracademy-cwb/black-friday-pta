import { ButtonCta } from '@/components/ButtonCta'
import { copy } from '@/lib/copy'
import { QUANDO } from './dados'
import { Paineis } from './Paineis'

/**
 * 1ª dobra: O QUÊ (H1 + diferencial) · QUANDO (data) · O QUE FAZER (CTA) · COM QUEM (3 painéis).
 * Nada mais: sem eyebrow, sem 2ª logo, sem selos (vão para a faixa abaixo da dobra).
 * O H1 e o CTA não se animam (LCP e alvo principal).
 */
export function Hero() {
  return (
    <section className="hero pta-dobra" id="topo" data-hero aria-labelledby="h1">
      <div className="wrap hero-in">
        <div className="hero-txt">
          <h1 id="h1" className="trim-cap">
            {copy.hero.h1}
          </h1>
          <div className="acao">
            <p className="destaque">
              <span>{copy.hero.destaque}</span>
            </p>
            <div className="quando mono">{QUANDO}</div>
            <ButtonCta id="cta-hero" size="lg" origem="hero" className="hero-cta">
              {copy.hero.cta}
            </ButtonCta>
            <p className="micro">{copy.hero.micro}</p>
          </div>
        </div>
        <Paineis />
      </div>
    </section>
  )
}
