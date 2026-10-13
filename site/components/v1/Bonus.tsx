import { Reveal } from '@/components/Reveal'
import { copy } from '@/lib/copy'
import { ROTULOS } from './rotulos'

/** Bônus: lista limpa com fios finos (C10). Movimento: o "visto" de cada item entra junto com a linha. */
export function Bonus() {
  return (
    <section className="v1-sec" id="bonus" aria-labelledby="h-bonus">
      <div className="v1-wrap v1-bonus">
        <div className="v1-bonus__h">
          <Reveal className="v1-rot v1-mono">{ROTULOS.secoes.bonus}</Reveal>
          <h2 id="h-bonus" className="v1-disp v1-h2" data-linhas>
            {copy.bonus.titulo}
          </h2>
        </div>
        <ul className="v1-check">
          {copy.bonus.itens.map((t, i) => (
            <Reveal as="li" key={t} index={i}>
              <span className="v1-chk-w pta-reveal" aria-hidden="true">
                <span className="v1-chk" />
              </span>
              <span className="v1-t">{t}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
