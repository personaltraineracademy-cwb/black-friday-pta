import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { NightId } from '@/lib/copy'

/**
 * Botão de ação. Componente de SERVIDOR (zero JS próprio).
 *
 * - Abre o pop-up de captura: o `LeadModalProvider` escuta cliques em `[data-open-modal]`.
 * - `noite` pré-seleciona a noite no pop-up (cartões dos professores).
 * - `origem` identifica o botão nos eventos (hero, barra, cartao-andre, final…).
 * - Alvo >= 48 px (bar) ou >= 56 px (padrão). Sombra dura SÓ em elemento clicável (é este).
 * - Raio: 0 por padrão (reto = sinal da campanha). Troque por versão com `--btn-radius`.
 * - Com `href` vira link (<a>) e NÃO abre o pop-up.
 */
export interface ButtonCtaProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  children: ReactNode
  tone?: 'ouro' | 'papel' | 'tinta' | 'ink' | 'ghost'
  size?: 'md' | 'lg' | 'bar'
  /** seta no fim (padrão: sim, exceto size="bar") */
  arrow?: boolean
  block?: boolean
  noite?: NightId
  origem?: string
  href?: string
  target?: string
  rel?: string
}

function Arrow() {
  return (
    <svg className="pta-btn__arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M1 8h13M9 2.5 14.5 8 9 13.5" />
    </svg>
  )
}

export function ButtonCta({
  children,
  tone = 'ouro',
  size = 'md',
  arrow,
  block,
  noite,
  origem,
  href,
  target,
  rel,
  className,
  ...rest
}: ButtonCtaProps) {
  const showArrow = arrow ?? size !== 'bar'
  const cls = [
    'pta-btn',
    tone !== 'ouro' && `pta-btn--${tone}`,
    size !== 'md' && `pta-btn--${size}`,
    block && 'pta-btn--block',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <a className={cls} href={href} target={target} rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}>
        {children}
        {showArrow && <Arrow />}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={cls}
      data-open-modal=""
      data-noite={noite}
      data-origem={origem}
      aria-haspopup="dialog"
      {...rest}
    >
      {children}
      {showArrow && <Arrow />}
    </button>
  )
}
