'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { ButtonCta } from '@/components/ButtonCta'

/**
 * Barra de CTA fixa do celular (< 768 px) — variante da StickyCta da base, com a regra da v1:
 * só aparece depois que o botão do hero saiu da tela PARA CIMA (nunca na 1ª tela) e some enquanto o fecho
 * (#cta-final) está na tela, para não duplicar o botão grande. Usa as mesmas classes `.pta-sticky` (CSS da base).
 */
export function StickyBar({ children, hero = '#cta-hero', fim = '#cta-final' }: { children: ReactNode; hero?: string; fim?: string }) {
  const [heroFora, setHeroFora] = useState(false)
  const [fimDentro, setFimDentro] = useState(false)

  useEffect(() => {
    const h = document.querySelector(hero)
    const f = document.querySelector(fim)
    const ios: IntersectionObserver[] = []
    if (h) {
      const io = new IntersectionObserver(([e]) => {
        if (e) setHeroFora(!e.isIntersecting && e.boundingClientRect.bottom < 0)
      })
      io.observe(h)
      ios.push(io)
    }
    if (f) {
      const io = new IntersectionObserver(([e]) => e && setFimDentro(e.isIntersecting), { threshold: 0.35 })
      io.observe(f)
      ios.push(io)
    }
    return () => ios.forEach((io) => io.disconnect())
  }, [hero, fim])

  const visible = heroFora && !fimDentro
  return (
    <div className="pta-sticky" data-visible={visible} inert={!visible}>
      <ButtonCta size="bar" arrow={false} block origem="barra-fixa">
        {children}
      </ButtonCta>
    </div>
  )
}
