import type { CSSProperties } from 'react'
import { withBase } from '@/lib/url'
import medidas from './medidas.json'
import type { SoloId } from './copy'

type Medidas = Record<string, { w: number; h: number; fx?: number; fy?: number }>
const M = medidas as Medidas

/** Medida do arquivo do kit (para largura/altura declaradas e a posição do fulcro do goniômetro). */
export function medida(prof: SoloId, nome: string) {
  const m = M[`${prof}/${nome}-d`] ?? M[`${prof}/${nome}`]
  if (!m) throw new Error(`[solo-v2] elemento sem medida: ${prof}/${nome}`)
  return m
}

/**
 * Elemento do kit (biblioteca `ornamentos`) como SVG em 2 variantes de cor assada: `-d` para superfície escura e `-l`
 * para superfície clara. O CSS mostra uma só (superfície da seção × tema). Decorativo (aria-hidden) salvo `alt`.
 * `ouro` = o cartão único da oferta (tinta preta sobre ouro; não muda com o tema).
 */
export function El({
  prof,
  nome,
  className,
  alt = '',
  eager = false,
  style,
}: {
  prof: SoloId
  nome: string
  className?: string
  alt?: string
  eager?: boolean
  style?: CSSProperties
}) {
  const m = medida(prof, nome)
  const base = `/img/solo/${prof}/v2/${nome}`
  const w = Math.round(m.w)
  const h = Math.round(m.h)
  const loading = eager ? ('eager' as const) : ('lazy' as const)
  const cls = ['s2-el', className].filter(Boolean).join(' ')
  const hidden = alt === '' ? { 'aria-hidden': true as const } : {}
  if (!(`${prof}/${nome}-d` in M)) {
    return (
      <span className={cls} style={style} {...hidden}>
        <img src={withBase(`${base}.svg`)} width={w} height={h} alt={alt} decoding="async" loading={loading} />
      </span>
    )
  }
  return (
    <span className={cls} style={style} {...hidden}>
      <img className="el-d" src={withBase(`${base}-d.svg`)} width={w} height={h} alt={alt} decoding="async" loading={loading} />
      <img className="el-l" src={withBase(`${base}-l.svg`)} width={w} height={h} alt={alt} decoding="async" loading={loading} />
    </span>
  )
}
