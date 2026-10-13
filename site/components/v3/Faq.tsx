import { Accordion } from '@/components/Accordion'
import { copy } from '@/lib/copy'
import { TITULO_FAQ } from './dados'

/** FAQ: <details> nativo (0 JS), lista com fios finos, 12 px entre itens. */
export function Faq() {
  return (
    <section className="sec" id="faq" aria-labelledby="h-faq">
      <div className="wrap">
        <h2 id="h-faq" className="titulo" data-split>
          {TITULO_FAQ}
        </h2>
        <Accordion items={copy.faq} exclusive className="faq-lista" />
      </div>
    </section>
  )
}
