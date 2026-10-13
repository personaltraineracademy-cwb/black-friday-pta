import type { CSSProperties } from 'react'
import { copy } from '@/lib/copy'

const LETRAS = ['A', 'B', 'C', 'D', 'E'] as const

/** "Pague 1, leve 2" (papel): título + frase + opções em lista A/B/C, sem caixa. "pós-graduação" nunca quebra. */
function Titulo({ text }: { text: string }) {
  const word = 'pós-graduação'
  const i = text.indexOf(word)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <span style={{ whiteSpace: 'nowrap' }}>{word}</span>
      {text.slice(i + word.length)}
    </>
  )
}

export function Condicao() {
  const c = copy.pague1leve2
  return (
    <section className="v2-sec v2-papel v2-cond" aria-labelledby="h-cond">
      <div className="v2-wrap">
        <div className="v2-cond-in">
          <h2 className="v2-h2" id="h-cond" data-v2-lines="" style={{ maxWidth: '16ch' }}>
            <Titulo text={c.titulo} />
          </h2>
          <div className="v2-cond-d">
            <p className="v2-apoio v2-pr" data-v2-io="">
              {c.texto}
            </p>
            <ul className="v2-opcoes">
              {c.opcoes.map((o, i) => (
                <li key={o} className="v2-pr v2-fio" data-v2-io="" style={{ ['--i' as string]: i + 1 } as CSSProperties}>
                  <span className="v2-l v2-mono">{LETRAS[i]}</span>
                  <b>{o}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
