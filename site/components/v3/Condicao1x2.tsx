import { ButtonCta } from '@/components/ButtonCta'
import { copy } from '@/lib/copy'
import { Numeral } from './Numeral'

/** "pós-graduação" não quebra no hífen (mesmo texto da copy; só ganha um invólucro nowrap). */
function Titulo({ t }: { t: string }) {
  const partes = t.split(/(pós-graduação)/i)
  return (
    <>
      {partes.map((p, i) =>
        /^pós-graduação$/i.test(p) ? (
          <span className="nb" key={i}>
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  )
}

/**
 * A condição: "1 × 2." como clímax. O "2." fica na tarja ouro; a tarja VARRE (escala X, só transform) quando o
 * bloco entra (Movimento marca data-tarja). O texto real da oferta é o h2 abaixo: o placar é decoração (aria-hidden).
 * O "1" e o "2" são dígitos do placar (viram 0→1 e 0→1→2); o "2" é tinta sobre tinta até a tarja passar.
 */
export function Condicao1x2() {
  const o = copy.pague1leve2
  return (
    <section className="sec fundo-ink2 oferta" id="oferta" aria-labelledby="h-oferta">
      <div className="wrap">
        <p className="placar" aria-hidden="true" data-tarja="">
          <span className="l">
            <Numeral n={1} digits={1} roll />
            <span className="x">×</span>
          </span>
          <span className="tarja">
            <Numeral n={2} digits={1} roll />
            <span className="pt">.</span>
          </span>
        </p>
        <h2 id="h-oferta">
          <Titulo t={o.titulo} />
        </h2>

        <div className="oferta-2">
          <div className="wrap-2">
            <div className="col">
              <p className="oferta-txt">{o.texto}</p>
              <ul className="opcoes">
                {o.opcoes.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="nota">{o.nota}</p>
              <ButtonCta origem="oferta" className="oferta-cta">
                {copy.hero.cta}
              </ButtonCta>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
