import { ButtonCta } from '@/components/ButtonCta'
import { copy } from '@/lib/copy'
import { UI } from '@/lib/ui-text'
import { FOTOS, HORA, img, NOITES, type NoiteV3 } from './dados'
import { Numeral } from './Numeral'

/**
 * Um painel por professor: tela dividida (cor do produto + numeral gigante + busto) e o texto ao lado.
 * Par/ímpar alterna o lado (desktop). Numeral e busto andam em velocidades e sentidos diferentes (parallax mínimo,
 * CSS view(); parado no Firefox e com movimento reduzido). O numeral "vira" ao entrar (Movimento).
 */
function PainelNoite({ noite, par }: { noite: NoiteV3; par: boolean }) {
  const f = FOTOS[noite.id]
  return (
    <article className={`noite${par ? ' noite--even' : ''}`} data-noite={noite.id}>
      <div className="wrap noite-in">
        <div className="noite-cor">
          <Numeral n={noite.n} className="noite-num" roll />
          <div
            className="noite-foto"
            style={{ ['--ph' as string]: f.ph, aspectRatio: `${f.w1} / ${f.h1}` }}
          >
            <img
              src={img(`${noite.id}-bw-1x`)}
              srcSet={`${img(`${noite.id}-bw-1x`)} ${f.w1}w, ${img(`${noite.id}-bw-2x`)} ${f.w2}w`}
              sizes="(min-width:1024px) 480px, 70vw"
              alt={noite.prof}
              width={f.w1}
              height={f.h1}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div className="noite-info">
          <div className="noite-quando mono">
            <span>
              {UI.night} {noite.n}
            </span>
            <span>{noite.dia}</span>
            <span>{HORA}</span>
          </div>
          <h3>{noite.prof}</h3>
          <p className="noite-pos">
            <span>{noite.pos}</span>
          </p>
          <p className="noite-bio">{noite.bio}</p>
          <ButtonCta tone="ghost" noite={noite.id} origem={`cartao-${noite.id}`}>
            {copy.noites.botao_card}
          </ButtonCta>
        </div>
      </div>
    </article>
  )
}

export function Noites() {
  return (
    <section id="noites" aria-labelledby="h-noites">
      <div className="wrap noites-hd">
        <h2 id="h-noites" className="titulo" data-split>
          {copy.noites.titulo.split(', ').map((p, i, a) => (
            <span key={p}>
              <span className="ln">
                {p}
                {i < a.length - 1 ? ',' : ''}
              </span>
              {i < a.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h2>
      </div>
      {NOITES.map((n, i) => (
        <PainelNoite key={n.id} noite={n} par={i % 2 === 1} />
      ))}
    </section>
  )
}
