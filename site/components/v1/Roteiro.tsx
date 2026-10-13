import { Reveal } from '@/components/Reveal'
import { copy } from '@/lib/copy'
import { HORA_FIM, HORA_INICIO, ROTULOS } from './rotulos'

/** "Como funciona": 3 passos. Movimento: numerais sobem de uma janela e o fio do topo se desenha (CSS view()). */
export function Roteiro() {
  const metas = [ROTULOS.antes, `${HORA_INICIO} – ${HORA_FIM}`, HORA_FIM]
  return (
    <section className="v1-sec v1-sec--grade" id="como" aria-labelledby="h-como">
      <div className="v1-wrap">
        <Reveal className="v1-rot v1-mono">{ROTULOS.secoes.roteiro}</Reveal>
        <h2 id="h-como" className="v1-disp v1-h2" data-linhas>
          {copy.como_funciona.titulo}
        </h2>
        <ol className="v1-passos">
          {copy.como_funciona.passos.map((p, i) => (
            <Reveal as="li" index={i} key={p.t} className="v1-passo">
              <span className="v1-passo__fio pta-reveal" aria-hidden="true" />
              <span className="v1-mono v1-passo__meta">{metas[i] ?? ''}</span>
              <span className="v1-passo__mask" aria-hidden="true">
                <span className="v1-passo__n v1-disp pta-reveal">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <h3>{p.t}</h3>
              <p className="v1-p">{p.d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
