import type { CSSProperties } from 'react'
import { copy } from '@/lib/copy'

/** Bônus (papel): lista numerada com fios finos (C10: lista limpa, não caixas). */
export function Bonus() {
  return (
    <section className="v2-sec v2-papel v2-bonus" aria-labelledby="h-bonus">
      <div className="v2-wrap">
        <div className="v2-bonus-in">
          <h2 className="v2-h2" id="h-bonus" data-v2-lines="" style={{ maxWidth: '12ch' }}>
            {copy.bonus.titulo}
          </h2>
          <ol className="v2-lista">
            {copy.bonus.itens.map((t, i) => (
              <li key={t} className="v2-pr v2-fio" data-v2-io="" style={{ ['--i' as string]: i + 1 } as CSSProperties}>
                <span className="v2-ix v2-mono">{String(i + 1).padStart(2, '0')}</span>
                <b>{t}</b>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
