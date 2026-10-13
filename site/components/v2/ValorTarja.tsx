import { copy } from '@/lib/copy'
import { VALOR_CAMPO, VALOR_TITULO } from './v2-text'

/**
 * VALOR (preto): a tarja de papel cobre "AO VIVO" e SE ABRE guiada pela rolagem (clip-path scrubbed por
 * `animation-timeline: view()`; reserva por IntersectionObserver). Nunca mostra número: o valor é dito ao vivo.
 * O texto "Ao vivo" está sempre no HTML (a tarja é `aria-hidden`); com movimento reduzido a tarja já está aberta.
 * Só funciona porque o bloco nasce abaixo da dobra (pesquisa 19 §0.8).
 */
export function ValorTarja() {
  return (
    <section className="v2-sec v2-preto v2-valor" aria-labelledby="h-valor">
      <div className="v2-wrap">
        <h2 className="v2-h2" id="h-valor" data-v2-lines="">
          {VALOR_TITULO}
        </h2>
        <span className="v2-valor-campo" data-v2-io="">
          <b>{VALOR_CAMPO}</b>
          <span className="tj" aria-hidden="true" />
        </span>
        <p className="v2-apoio v2-pr" data-v2-io="">
          {copy.pague1leve2.nota}
        </p>
      </div>
    </section>
  )
}
