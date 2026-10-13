'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { ButtonCta } from '@/components/ButtonCta'

/**
 * Barra de CTA do celular (< 768 px): só aparece depois que o botão do hero sai da tela (por cima) e some na seção
 * final (que já tem o botão). Oculta de verdade (inert + visibility) fora desse intervalo. Usa o CSS .pta-sticky.
 */
export function BarraFixa({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const cta = document.getElementById('cta-hero')
    const fim = document.getElementById('final')
    if (!cta || !('IntersectionObserver' in window)) return
    let passou = false
    let noFim = false
    const upd = () => setVisible(passou && !noFim)
    const a = new IntersectionObserver(([e]) => {
      if (!e) return
      passou = !e.isIntersecting && e.boundingClientRect.bottom < 0
      upd()
    })
    a.observe(cta)
    const b = new IntersectionObserver(
      ([e]) => {
        if (!e) return
        noFim = e.isIntersecting
        upd()
      },
      { threshold: 0.35 },
    )
    if (fim) b.observe(fim)
    return () => {
      a.disconnect()
      b.disconnect()
    }
  }, [])

  return (
    <div className="pta-sticky" data-visible={visible} inert={!visible}>
      <ButtonCta arrow={false} block origem="barra-fixa">
        {children}
      </ButtonCta>
    </div>
  )
}
