import { copy } from '@/lib/copy'

/**
 * Por que a PTA (preto + a única grade visível da página): 2 números gigantes + 2 frases.
 * Os números são desenho (aria-hidden) com o texto completo em .sr-only; "imprimem" ao rolar.
 */
const NUM = /^(\+?[\d.]+)\s+(.+)$/

export function PorQuePta() {
  return (
    <section className="v2-sec v2-preto v2-grade v2-por" aria-labelledby="h-por">
      <div className="v2-wrap">
        <h2 className="v2-h2" id="h-por" data-v2-lines="">
          {copy.por_que.titulo}
        </h2>
        <ul className="v2-stats">
          {copy.por_que.itens.map((t, i) => {
            const m = NUM.exec(t)
            return (
              <li className={`v2-stat v2-s${i + 1}`} key={t} data-v2-io="">
                {m ? (
                  <>
                    <span className="v2-n" aria-hidden="true" data-v2-count="">
                      {m[1]}
                    </span>
                    <span className="v2-c">
                      <span className="sr-only">{m[1]} </span>
                      {m[2]}
                    </span>
                  </>
                ) : (
                  <span className="v2-t">{t}</span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
