import { copy } from '@/lib/copy'
import { UI } from '@/lib/ui-text'
import { img, NOITES } from './dados'
import { Numeral } from './Numeral'

/**
 * Os 3 painéis 01 · 02 · 03 da dobra: cor do produto + rosto inteiro + nome e dia ao pé.
 * Numeral SEMPRE acima da cabeça; texto sobre o painel declarado com data-sobre-foto.
 * As 3 fotos são do LCP: fetchpriority="high", tamanho declarado (CLS 0).
 * O numeral "vira" ao carregar (roll curto, CSS puro, defasado por painel).
 */
export function Paineis() {
  return (
    <div className="strips" role="group" aria-label={copy.noites.titulo}>
      {NOITES.map((p) => (
        <div
          className="strip"
          key={p.id}
          data-noite={p.id}
          role="group"
          aria-label={`${UI.night} ${p.n}, ${p.dia}: ${p.prof}`}
        >
          <div className="strip-box">
            <Numeral n={p.n} className="strip-num num--load" sobreFoto />
            <picture>
              <source media="(min-width:1024px)" srcSet={img(`${p.id}-bust-d`)} />
              <img
                src={img(`${p.id}-bust-m`)}
                alt={p.prof}
                width={370}
                height={641}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
            <div className="strip-nm" data-sobre-foto aria-hidden="true">
              <b>{p.primeiro}</b>
              <span className="mono">{p.dia}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
