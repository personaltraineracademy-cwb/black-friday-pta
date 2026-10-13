import { Reveal } from '@/components/Reveal'
import { copy } from '@/lib/copy'

/**
 * Por que a PTA: os números reais da copy viram herói (Big Shoulders) e CONTAM uma vez ao entrar na tela
 * (Movimento; tabular-nums). O valor final está no HTML; só os números que a copy tem (nenhum dado inventado).
 */
function separa(t: string): { num?: string; resto: string } {
  const m = t.match(/^(\+?\d[\d.]*)\s+(.+)$/)
  return m && m[1] && m[2] ? { num: m[1], resto: m[2] } : { resto: t }
}

export function PorQuePta() {
  return (
    <section className="sec pta-paper" id="porque" aria-labelledby="h-porque">
      <div className="wrap duas">
        <h2 id="h-porque" className="titulo" data-split>
          {copy.por_que.titulo}
        </h2>
        <ul className="porque-lista">
          {copy.por_que.itens.map((t, i) => {
            const { num, resto } = separa(t)
            return (
              <Reveal as="li" index={i} key={t}>
                <p>
                  {num && (
                    <b className="cnt" data-count={num.replace(/\D/g, '')} data-prefix={num.startsWith('+') ? '+' : ''}>
                      {num}
                    </b>
                  )}{' '}
                  {resto}
                </p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
