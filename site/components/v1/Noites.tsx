import { ButtonCta } from '@/components/ButtonCta'
import { Reveal } from '@/components/Reveal'
import { copy } from '@/lib/copy'
import { NIGHT_META } from '@/lib/nights'
import { UI } from '@/lib/ui-text'
import { withBase } from '@/lib/url'
import { horaDaNoite, ROTULOS } from './rotulos'
import { Monitor } from './Monitor'

/** Altura real de cada retrato aprovado (public/img/v1/*-pb-720.webp, 720 px de largura). */
const ALTURA = { andre: 936, walter: 1026, carlos: 995 } as const

/** "3 noites, 3 professores": 3 monitores. Movimento: sintonia do sinal (ver Monitor.tsx). */
export function Noites() {
  return (
    <section className="v1-sec" id="noites" aria-labelledby="h-noites">
      <div className="v1-wrap">
        <Reveal className="v1-rot v1-mono">{ROTULOS.secoes.programacao}</Reveal>
        <h2 id="h-noites" className="v1-disp v1-h2" data-linhas>
          {copy.noites.titulo}
        </h2>
        <div className="v1-parede">
          {copy.noites.cards.map((c, i) => {
            const meta = NIGHT_META[c.foto]
            return (
              <Monitor key={c.foto} n={meta.n} cor={`var(--color-${meta.color})`}>
                <div className="v1-mon__bar v1-mono">
                  <i className="v1-tally" aria-hidden="true" />
                  <span className="v1-mon__nn">
                    {UI.night} {meta.n}
                  </span>
                  <span className="v1-mon__sep" aria-hidden="true">
                    ·
                  </span>
                  <span className="v1-mon__dt">
                    {c.noite} · {horaDaNoite(i)}
                  </span>
                </div>
                <div className="v1-mon__tela">
                  {/* P&B 720 px, o mesmo retrato aprovado; o nome já está no título do cartão (alt vazio) */}
                  <img
                    className="v1-mon__foto"
                    src={withBase(`/img/v1/${c.foto}-pb-720.webp`)}
                    width={720}
                    height={ALTURA[c.foto]}
                    alt=""
                    loading="lazy"
                  />
                  <div className="v1-mon__ss" aria-hidden="true" />
                </div>
                <div className="v1-mon__info">
                  <h3>{c.prof}</h3>
                  <p className="v1-mon__bio">{c.bio}</p>
                  <div className="v1-mon__pos">
                    <span className="v1-mono">{ROTULOS.pos}</span>
                    {c.pos}
                  </div>
                  <ButtonCta tone="ghost" arrow block noite={c.foto} origem={`cartao-${c.foto}`} className="v1-btn-out">
                    {copy.noites.botao_card}
                  </ButtonCta>
                </div>
              </Monitor>
            )
          })}
        </div>
      </div>
    </section>
  )
}
