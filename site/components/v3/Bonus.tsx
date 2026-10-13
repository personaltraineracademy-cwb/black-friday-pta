import { Reveal } from '@/components/Reveal'
import { copy } from '@/lib/copy'

/** Bônus: lista limpa, fio fino (C10), nada de caixa. */
export function Bonus() {
  return (
    <section className="sec" id="bonus" aria-labelledby="h-bonus">
      <div className="wrap">
        <h2 id="h-bonus" className="titulo" data-split>
          {copy.bonus.titulo}
        </h2>
        <ol className="lista">
          {copy.bonus.itens.map((t, i) => (
            <Reveal as="li" index={i} key={t}>
              <span className="n mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="t">{t}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
