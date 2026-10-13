import { ButtonCta } from '@/components/ButtonCta'
import { copy } from '@/lib/copy'
import { NOITES } from './dados'
import { Numeral } from './Numeral'

/**
 * CTA final: o placar FECHA como abriu. Uma ideia só: 01 · 02 · 03 (cada painel na cor da noite, a mesma grade
 * de 3 colunas da dobra) + a frase + o botão. Sem textura atrás de texto, sem grade, sem segunda camada.
 * Ordem de leitura no celular: placar (em cima, como na dobra) → frase → botão. No desktop: texto à esquerda,
 * placar à direita. Os painéis são decorativos (aria-hidden): o conteúdo é a frase e o botão. Ao entrar na
 * tela a cor sobe de baixo, um painel por vez, e os numerais viram (mesma linguagem da dobra).
 */
export function CtaFinal() {
  return (
    <section className="sec final" id="final" aria-labelledby="h-final">
      <div className="wrap final-in">
        <h2 id="h-final" data-split>
          {copy.cta_final.titulo}
        </h2>
        <ButtonCta size="lg" origem="final" className="final-cta">
          {copy.cta_final.botao}
        </ButtonCta>
        <div className="final-placar" aria-hidden="true" data-enche="">
          {NOITES.map((n) => (
            <div className="final-tile" key={n.id} data-noite={n.id}>
              <Numeral n={n.n} className="final-num" roll />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
