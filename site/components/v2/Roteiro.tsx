import { Fragment, type CSSProperties } from 'react'
import { copy } from '@/lib/copy'
import { PASSO_TARJA } from './v2-text'

/**
 * Como funciona (papel): 3 numerais gigantes "impressos" ao rolar + fio de 1 px.
 * A tarja inline cobre "os valores" do passo 3 e se abre ao rolar (documento sigiloso). O texto está
 * sempre no HTML e é lido por leitor de tela; a tarja é só um fundo.
 */
function Descricao({ text }: { text: string }) {
  const i = text.indexOf(PASSO_TARJA)
  if (i < 0) return <>{text}</>
  return (
    <Fragment>
      {text.slice(0, i)}
      <span className="v2-tarja" data-v2-io="">
        {PASSO_TARJA}
      </span>
      {text.slice(i + PASSO_TARJA.length)}
    </Fragment>
  )
}

export function Roteiro() {
  return (
    <section className="v2-sec v2-papel v2-como" aria-labelledby="h-como">
      <div className="v2-wrap">
        <h2 className="v2-h2" id="h-como" data-v2-lines="" style={{ maxWidth: '14ch' }}>
          {copy.como_funciona.titulo}
        </h2>
        <ol className="v2-passos">
          {copy.como_funciona.passos.map((p, i) => (
            <li className="v2-passo v2-fio" key={p.t} data-v2-io="" style={{ ['--i' as string]: i } as CSSProperties}>
              <span className="v2-n" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3>{p.t}</h3>
                <p>
                  <Descricao text={p.d} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
