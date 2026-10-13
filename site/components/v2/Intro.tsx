import type { CSSProperties } from 'react'
import { copy } from '@/lib/copy'

/** Frase longa da copy + selos (preto). Sai da dobra para a dobra ficar só com o essencial (§4c). */
export function Intro() {
  return (
    <section className="v2-quando v2-preto" aria-label={copy.hero.eyebrow}>
      <div className="v2-wrap">
        <span className="v2-eyebrow v2-mono">{copy.hero.eyebrow}</span>
        <p className="v2-declara v2-pr" data-v2-io="">
          {copy.hero.sub}
        </p>
        <ul className="v2-selos">
          {copy.hero.selos.map((s, i) => (
            <li key={s} className="v2-pr" data-v2-io="" style={{ ['--i' as string]: i + 1 } as CSSProperties}>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
