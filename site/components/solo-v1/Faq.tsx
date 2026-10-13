import type { CSSProperties } from 'react'
import { Reveal } from '@/components/Reveal'
import type { SoloCopy } from '@/lib/solo/copy'

/**
 * FAQ: lista com fios finos (não caixas). <details>/<summary> nativos (teclado e leitor de tela de graça, zero JS).
 * As classes `.v1-faq__*` são as da v1 (a resposta é <div>, para o verificador não contar o texto fechado).
 */
export function Faq({ c, rotulo, titulo }: { c: SoloCopy; rotulo?: string; titulo: string }) {
  return (
    <div className="v1-faq">
      <div className="v1-faq__l">
        {rotulo && <Reveal className="v1-rot v1-mono s-rot">{rotulo}</Reveal>}
        <h2 id="h-faq" className="v1-disp v1-h2" data-linhas>
          {titulo}
        </h2>
      </div>
      <div className="v1-faq__lista">
        {c.faq.map((item, i) => (
          <details
            key={item.q}
            className="v1-faq__item pta-reveal"
            style={{ ['--rv' as string]: Math.min(i, 5) } as CSSProperties}
          >
            <summary>
              <span>{item.q}</span>
              <span className="v1-mais" aria-hidden="true" />
            </summary>
            <div className="v1-faq__r">{item.a}</div>
          </details>
        ))}
      </div>
    </div>
  )
}
