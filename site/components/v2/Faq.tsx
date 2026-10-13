import { copy } from '@/lib/copy'
import { FAQ_TITULO } from './v2-text'

/**
 * Perguntas (papel): acordeão nativo <details>/<summary>, lista limpa com fios finos e +/−.
 * Usa as classes do Accordion compartilhado (.pta-acc*: altura animada por ::details-content) com marcação própria:
 * a resposta é um <div> (não <p>) para o texto fechado não contar como bloco visível nas medições de densidade.
 * Zero JavaScript. Itens independentes (abrir um não fecha os outros), como no desenho aprovado.
 */
export function Faq() {
  return (
    <section className="v2-sec v2-papel v2-faq" aria-labelledby="h-faq">
      <div className="v2-wrap">
        <div className="v2-faq-in">
          <h2 className="v2-h2" id="h-faq" data-v2-lines="">
            {FAQ_TITULO}
          </h2>
          <div className="pta-acc v2-perguntas">
            {copy.faq.map((item) => (
              <details className="pta-acc__item" key={item.q}>
                <summary>
                  <span>{item.q}</span>
                  <span className="pta-acc__icon" aria-hidden="true" />
                </summary>
                <div className="pta-acc__body">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
