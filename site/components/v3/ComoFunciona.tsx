import { Reveal } from '@/components/Reveal'
import { copy } from '@/lib/copy'

/** 3 passos: numerais de contorno (herói), 1 frase cada. Fundo papel. O título entra por linha (data-split). */
export function ComoFunciona() {
  return (
    <section className="sec pta-paper" id="como" aria-labelledby="h-como">
      <div className="wrap">
        <h2 id="h-como" className="titulo" data-split>
          {copy.como_funciona.titulo}
        </h2>
        <ol className="passos">
          {copy.como_funciona.passos.map((p, i) => (
            <Reveal as="li" className="passo" index={i} key={p.t}>
              <span className="passo-n" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
