import type { CSSProperties } from 'react'
import { Reveal } from '@/components/Reveal'
import { copy } from '@/lib/copy'
import { ROTULOS } from './rotulos'

/**
 * FAQ: lista com fios finos (não caixas, C10). <details>/<summary> nativos (teclado e leitor de tela de graça,
 * zero JS); a altura anima com ::details-content (Chrome 131+; nos demais abre sem animação).
 * A resposta fica num <div> (não <p>) para o verificador não contar o texto fechado como bloco de tela.
 */
export function Faq() {
  return (
    <section className="v1-sec" id="faq" aria-labelledby="h-faq">
      <div className="v1-wrap v1-faq">
        <div className="v1-faq__l">
          <Reveal className="v1-rot v1-mono">{ROTULOS.secoes.duvidas}</Reveal>
          <h2 id="h-faq" className="v1-disp v1-h2" data-linhas>
            {ROTULOS.faqTitulo}
          </h2>
        </div>
        <div className="v1-faq__lista">
          {copy.faq.map((item, i) => (
            <details
              key={item.q}
              className="v1-faq__item pta-reveal"
              style={{ ['--rv' as string]: Math.min(i, 5) } as CSSProperties}
            >
              <summary>
                <span>{item.q}</span>
                <span className="v1-mais" aria-hidden="true" />
              </summary>
              <div className="v1-faq__r">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
