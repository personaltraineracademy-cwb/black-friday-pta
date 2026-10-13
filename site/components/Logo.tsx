import { LOGOS, type LogoKey } from '@/lib/logos.generated'
import { withBase } from '@/lib/url'

/**
 * Logo da campanha, SVG inline (cor controlada por `currentColor`). Componente de SERVIDOR:
 * a tabela de logos (~90 KB de texto) nunca vai para o JavaScript do navegador.
 *
 * Conceitos (cada versão da página usa um):
 *   tarja  A·Tarja  "BLACK" sobre barra "FRIDAY" vazada · símbolo BF
 *   rec    C·REC    moldura de visor com cantoneiras · símbolo B + ponto REC
 * Variantes:
 *   pta       logo larga: BLACK FRIDAY | símbolo e nome da Personal Trainer Academy
 *   nome      BLACK FRIDAY + "da Personal Trainer Academy" (empilhada)
 *   simbolo   só o símbolo (favicon, pop-up, barra compacta)
 *   live      acrescenta "AO VIVO" (não existe para `simbolo`)
 * Tom (cor): ouro (padrão, fundo ink) · claro (tinta, fundo ink/foto) · escuro (ink, fundo papel/ouro)
 *
 * Regras: o logo nunca arredonda, nunca recebe sombra, nunca é recolorido fora destes tons; área de respiro
 * mínima = altura do "B". Nunca mais de uma logo na 1ª dobra (paginas-de-captura.md §4c).
 * `mode="img"` usa o arquivo de public/logos (só ouro) em vez de SVG inline — para repetir muitas vezes.
 */
export interface LogoProps {
  concept?: 'tarja' | 'rec'
  variant?: 'pta' | 'nome' | 'simbolo'
  live?: boolean
  tone?: 'ouro' | 'claro' | 'escuro'
  /** altura em px (ou qualquer valor CSS). A largura sai da proporção. */
  height?: number | string
  mode?: 'inline' | 'img'
  /** nome acessível; padrão derivado. Use "" para decorativo (aria-hidden). */
  label?: string
  className?: string
}

const NAMES: Record<NonNullable<LogoProps['variant']>, string> = {
  pta: 'Black Friday da Personal Trainer Academy',
  nome: 'Black Friday da Personal Trainer Academy',
  simbolo: 'Black Friday PTA',
}

export function logoKey(concept: NonNullable<LogoProps['concept']>, variant: NonNullable<LogoProps['variant']>, live: boolean): LogoKey {
  const base = concept === 'tarja' ? 'a-tarja' : 'c-rec'
  const suffix = variant === 'simbolo' ? 'simbolo' : `${variant}${live ? '-aovivo' : ''}`
  return `${base}-todos-${suffix}` as LogoKey
}

export function Logo({
  concept = 'tarja',
  variant = 'pta',
  live = false,
  tone = 'ouro',
  height,
  mode = 'inline',
  label,
  className,
}: LogoProps) {
  const key = logoKey(concept, variant, live && variant !== 'simbolo')
  const logo = LOGOS[key]
  const name = label ?? `${NAMES[variant]}${live && variant !== 'simbolo' ? ', ao vivo' : ''}`
  const cls = ['pta-logo', `pta-logo--${tone}`, className].filter(Boolean).join(' ')
  const style = {
    aspectRatio: `${logo.w} / ${logo.h}`,
    ...(height !== undefined ? { ['--logo-h' as string]: typeof height === 'number' ? `${height}px` : height } : null),
  }
  const a11y = name === '' ? { 'aria-hidden': true as const } : { role: 'img' as const, 'aria-label': name }

  if (mode === 'img') {
    return (
      <img
        className={cls}
        src={withBase(`/logos/${key}.svg`)}
        width={Math.round(logo.w)}
        height={Math.round(logo.h)}
        alt={name}
        data-logo=""
        style={style}
        decoding="async"
      />
    )
  }

  return (
    <svg
      className={cls}
      viewBox={logo.viewBox}
      fill="currentColor"
      focusable="false"
      data-logo=""
      style={style}
      {...a11y}
      dangerouslySetInnerHTML={{ __html: logo.inner }}
    />
  )
}
