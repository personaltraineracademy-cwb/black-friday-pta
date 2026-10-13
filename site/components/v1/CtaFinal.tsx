import { ButtonCta } from '@/components/ButtonCta'
import { Reveal } from '@/components/Reveal'
import { copy } from '@/lib/copy'

/**
 * Fecho: tela cheia, ouro chapado. As cantoneiras (pretas) fecham o quadro ao entrar na tela:
 * o mesmo gesto do visor da dobra, agora como "no ar". Só aqui o ouro ocupa a tela inteira.
 */
export function CtaFinal() {
  return (
    <section className="v1-final" id="cta-final" aria-labelledby="h-final">
      <span className="v1-corners v1-final__c pta-reveal" aria-hidden="true" />
      <div className="v1-wrap">
        <h2 id="h-final" className="v1-disp" data-linhas>
          {copy.cta_final.titulo}
        </h2>
        <Reveal index={1}>
          <ButtonCta size="lg" arrow={false} block tone="ink" origem="final" className="v1-btn-final">
            {copy.cta_final.botao}
          </ButtonCta>
        </Reveal>
      </div>
    </section>
  )
}
