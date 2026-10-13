import { Reveal } from '@/components/Reveal'
import { copy } from '@/lib/copy'
import { emTresPartes, numeraisDaCondicao, ROTULOS } from './rotulos'

/**
 * Condição Black (papel): "pague 1, leve 2".
 * Movimento: o "1" sobe da janela e, logo depois, o "2" (CSS view()): a ordem do movimento é a ordem da oferta.
 */
export function Condicao() {
  const c = copy.pague1leve2
  const partes = emTresPartes(c.titulo, 'pós-graduação')
  const numerais = numeraisDaCondicao()
  return (
    <section className="v1-sec v1-sec--papel pta-paper" id="condicao" aria-labelledby="h-condicao">
      <div className="v1-wrap">
        <Reveal className="v1-rot v1-mono">{ROTULOS.secoes.condicao}</Reveal>
        <h2 id="h-condicao" className="v1-disp v1-h2 v1-h-cond" data-linhas>
          {partes ? (
            <>
              {partes[0]}
              <span className="v1-nw">{partes[1]}</span>
              {partes[2]}
            </>
          ) : (
            c.titulo
          )}
        </h2>
        <Reveal index={2} as="p" className="v1-apoio v1-p">
          {c.texto}
        </Reveal>
        <div className="v1-um-dois">
          {numerais.slice(0, 2).map((n, i) => (
            <div className="v1-num" key={n + i} data-i={i}>
              <span className="v1-num__mask" aria-hidden="true">
                <span className="v1-num__n v1-disp pta-reveal">{n}</span>
              </span>
              <span className="v1-num__l v1-mono">
                {ROTULOS.pos} {n}
              </span>
            </div>
          ))}
          <Reveal index={2} as="ul" className="v1-opcoes">
            {c.opcoes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </Reveal>
        </div>
        <Reveal as="p" className="v1-nota">
          {c.nota}
        </Reveal>
      </div>
    </section>
  )
}
