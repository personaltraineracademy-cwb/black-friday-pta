import { ButtonCta } from '@/components/ButtonCta'
import { copy } from '@/lib/copy'

/** CTA final (preto): repete o chamado curto e abre o mesmo pop-up. */
export function CtaFinal() {
  return (
    <section className="v2-sec v2-preto v2-final" aria-labelledby="h-final">
      <div className="v2-wrap">
        <h2 className="v2-h1x" id="h-final" data-v2-lines="">
          {copy.cta_final.titulo}
        </h2>
        <div className="v2-acao">
          <ButtonCta origem="final">{copy.cta_final.botao}</ButtonCta>
          <small className="v2-micro v2-pr" data-v2-io="">
            {copy.hero.micro}
          </small>
        </div>
      </div>
    </section>
  )
}
