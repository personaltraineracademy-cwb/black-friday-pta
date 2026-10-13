import type { CSSProperties } from 'react'
import { ButtonCta } from '@/components/ButtonCta'
import { copy, NIGHT_META } from '@/lib/copy'
import { withBase } from '@/lib/url'
import { weekdayOf } from './v2-text'

/**
 * 3 noites = 3 ingressos (preto). Picote por máscara (furos reais, nunca tinta da cor do fundo); o canhoto é a
 * noite; o botão abre o MESMO pop-up com a noite pré-selecionada (`noite` no <ButtonCta>).
 * Movimento: os ingressos "imprimem" em sequência curta (clip-path, 0,6 s cada, 140 ms entre eles) quando a
 * seção entra na tela. Ligado por DossieRoot (sem JS ou com movimento reduzido: já estão impressos).
 */
export function Ingressos() {
  return (
    <section className="v2-sec v2-preto v2-noites" aria-labelledby="h-noites">
      <div className="v2-wrap">
        <h2 className="v2-h2" id="h-noites" data-v2-lines="">
          {copy.noites.titulo}
        </h2>
        <ul className="v2-ingressos">
          {copy.noites.cards.map((c, i) => (
            <li
              className="v2-ingresso"
              key={c.foto}
              data-v2-io=""
              style={{ ['--noite' as string]: NIGHT_META[c.foto].hex, ['--i' as string]: i } as CSSProperties}
            >
              <article className="v2-ing">
                <div className="v2-ing-foto">
                  <img
                    src={withBase(`/img/v2/${c.foto}-pb-720.webp`)}
                    width={720}
                    height={964}
                    loading="eager"
                    fetchPriority="low"
                    decoding="async"
                    alt={`${c.prof}, professor da noite de ${weekdayOf(c.noite)}`}
                  />
                </div>
                <div className="v2-ing-corpo">
                  <span className="v2-mono v2-ing-pos">{c.pos}</span>
                  <h3>{c.prof}</h3>
                  <p>{c.bio}</p>
                </div>
                <div className="v2-ing-canhoto">
                  <span className="v2-ing-data">{c.noite}</span>
                  <ButtonCta noite={c.foto} origem={`cartao-${c.foto}`}>
                    {copy.noites.botao_card}
                  </ButtonCta>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
