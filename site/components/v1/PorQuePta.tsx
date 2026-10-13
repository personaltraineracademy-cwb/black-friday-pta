import { Reveal } from '@/components/Reveal'
import { copy } from '@/lib/copy'
import { Contagem } from './Contagem'
import { numeroELegenda, ROTULOS } from './rotulos'

/**
 * "Por que a PTA": 4 fatos em ficha. Os dois primeiros trazem número grande (vem do começo do texto da copy).
 * Movimento: a lista entra em sequência e os números CONTAM até o valor (Contagem, uma vez).
 */
export function PorQuePta() {
  return (
    <section className="v1-sec v1-sec--2" id="porque" aria-labelledby="h-porque">
      <div className="v1-wrap">
        <Reveal className="v1-rot v1-mono">{ROTULOS.secoes.pta}</Reveal>
        <h2 id="h-porque" className="v1-disp v1-h2" data-linhas>
          {copy.por_que.titulo}
        </h2>
        <ul className="v1-ficha">
          {copy.por_que.itens.map((item, i) => {
            const { n, legenda } = numeroELegenda(item)
            return (
              <Reveal as="li" key={item} index={i}>
                {n && (
                  <b>
                    <Contagem texto={n} />
                  </b>
                )}
                <span className="v1-u">{legenda}</span>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
