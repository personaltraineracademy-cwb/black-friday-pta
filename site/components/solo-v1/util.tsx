import type { ReactNode } from 'react'
import { emTresPartes } from '@/lib/solo/copy'
import { withBase } from '@/lib/url'

/** Texto com o trecho impedido de quebrar linha (ex.: "pós-graduação" nunca parte no hífen). */
export function SemQuebra({ texto, trecho }: { texto: string; trecho: string }): ReactNode {
  const p = emTresPartes(texto, trecho)
  if (!p) return texto
  return (
    <>
      {p[0]}
      <span className="v1-nw">{p[1]}</span>
      {p[2]}
    </>
  )
}

/** "+10.000 alunos formados" -> { n: "+10.000", legenda: "alunos formados" } */
export function numeroELegenda(item: string): { n: string | null; legenda: string } {
  const m = /^(\+?\d[\d.,]*)\s+(.+)$/.exec(item)
  return m ? { n: m[1]!, legenda: m[2]! } : { n: null, legenda: item }
}

/** Dois dígitos: 1 -> "01" (indexador mono; número, não texto de venda). */
export const dois = (n: number): string => String(n).padStart(2, '0')

/**
 * "No final, a condição Black: pague 1 pós e leve 2." — quebra SÓ depois dos dois pontos (cada metade não parte):
 * "No final, a condição Black:" / "pague 1 pós e leve 2.". Sem dois pontos, o texto sai inteiro.
 */
export function Destaque({ texto, className = 's-destaque' }: { texto: string; className?: string }): ReactNode {
  const i = texto.indexOf(': ')
  if (i < 0) return <p className={className}>{texto}</p>
  return (
    <p className={className}>
      {texto.slice(0, i + 1)}
      <br />
      {texto.slice(i + 2)}
    </p>
  )
}

/**
 * Imagem com variante por tema: `<base>.svg` (escuro) e `<base>-claro.svg` (claro). As duas ficam no HTML; o CSS
 * (`.t-escuro` / `.t-claro` em app/v1/v1.css) mostra uma só; a oculta não é baixada (lazy) nem lida por leitor de tela.
 * Elementos do kit e logos têm a cor assada no SVG: por isso um arquivo por tema, gerado por scripts/solo-v1-elementos.py.
 */
export function ImgTema({
  base,
  alt = '',
  width,
  height,
  className,
  eager = false,
  logo = false,
}: {
  base: string
  alt?: string
  width: number
  height: number
  className?: string
  eager?: boolean
  logo?: boolean
}): ReactNode {
  const cls = (t: string) => [className, t].filter(Boolean).join(' ')
  const extra = logo ? ({ 'data-logo': '' } as Record<string, string>) : {}
  const decorativa = alt === ''
  return (
    <>
      <img
        className={cls('t-escuro')}
        src={withBase(`${base}.svg`)}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? undefined : 'lazy'}
        decoding="async"
        {...(decorativa ? { 'aria-hidden': true } : null)}
        {...extra}
      />
      <img
        className={cls('t-claro')}
        src={withBase(`${base}-claro.svg`)}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        {...(decorativa ? { 'aria-hidden': true } : null)}
        {...extra}
      />
    </>
  )
}
