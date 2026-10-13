import type { CSSProperties } from 'react'

/**
 * Numeral de placar que "vira": cada dígito é uma janela que mostra só o dígito final; os dígitos anteriores
 * (0, 1, … d-1) ficam empilhados ACIMA da janela e sobem até ela quando a animação roda (roll curto).
 * O HTML em repouso é o numeral final (sem JS e com movimento reduzido nada se mexe).
 *
 *   className="num--load"  roda ao carregar (hero)
 *   roll                    marca para o controlador (Movimento) rodar quando entrar na tela
 *
 * Componente de SERVIDOR. Decorativo: aria-hidden (o nome e o dia vão no aria-label do grupo).
 */
export interface NumeralProps {
  n: number
  digits?: number
  className?: string
  roll?: boolean
  /** declara texto sobre a foto de propósito (o verificador não reclama) */
  sobreFoto?: boolean
}

export function Numeral({ n, digits = 2, className, roll, sobreFoto }: NumeralProps) {
  const s = String(n).padStart(digits, '0')
  return (
    <span
      className={['num', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      data-roll={roll ? '' : undefined}
      data-sobre-foto={sobreFoto ? '' : undefined}
    >
      {[...s].map((ch, i) => {
        const d = Number(ch)
        return (
          <span className="dg" key={i} style={{ ['--k' as string]: d } as CSSProperties}>
            <span className="dg-col">
              {Array.from({ length: d }, (_, j) => (
                <i key={j} className="dg-prev" style={{ ['--j' as string]: j - d } as CSSProperties}>
                  {j}
                </i>
              ))}
              <i className="dg-fim">{d}</i>
            </span>
          </span>
        )
      })}
    </span>
  )
}
