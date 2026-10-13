'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { ButtonCta } from '@/components/ButtonCta'
import type { SoloId } from '@/lib/solo/types'

/**
 * Barra de CTA fixa do celular (< 768 px): só aparece depois que o botão do hero saiu da tela PARA CIMA (nunca na
 * 1ª tela) e some enquanto o fecho (#cta-final) está na tela. Mesmas classes `.pta-sticky` da base; o botão
 * pré-seleciona a noite do professor no pop-up.
 */
export function Barra({ id, children }: { id: SoloId; children: ReactNode }) {
  const [heroFora, setHeroFora] = useState(false)
  const [fimDentro, setFimDentro] = useState(false)

  useEffect(() => {
    const h = document.querySelector('#cta-hero')
    const f = document.querySelector('#cta-final')
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
  }, [])

  const visible = heroFora && !fimDentro
  return (
    <div className="pta-sticky s-barra" data-visible={visible} inert={!visible}>
      <ButtonCta size="bar" arrow={false} block noite={id} origem="barra-fixa">
        {children}
      </ButtonCta>
    </div>
  )
}
