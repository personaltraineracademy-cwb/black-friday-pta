'use client'
import { useEffect, useRef, useState } from 'react'
import { UI } from '@/lib/ui-text'
import { motionMode } from '@/lib/motion'

/**
 * Faixa rolante dos selos (hero.selos: só 2 frases). Mesmo CSS .pta-marquee da base, mas com 4 grupos
 * (só o 1º é lido por leitor de tela): com 2 frases curtas o grupo não cobre telas largas (1920 px) e abriria um vão.
 * A velocidade é fixa em 50 px/s (a duração sai da largura de 1 grupo). Botão de pausa (WCAG 2.2.2).
 * Modo parado: o CSS da base mostra só o 1º grupo, em linhas, centrado.
 */
export function FaixaSolo({ items }: { items: readonly string[] }) {
  const box = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el || motionMode() === 'parado') return
    const group = el.querySelector<HTMLElement>('.pta-marquee__group')
    if (!group) return
    const ajusta = () => {
      const w = group.getBoundingClientRect().width
      // a trilha anda 50 % (2 grupos de 4) por ciclo: 2 × largura do grupo
      if (w) el.style.setProperty('--dur', `${((2 * w) / 50).toFixed(1)}s`)
    }
    ajusta()
    void document.fonts?.ready.then(ajusta)
    window.addEventListener('resize', ajusta)
    return () => window.removeEventListener('resize', ajusta)
  }, [])

  const grupo = (k: number) => (
    <div className="pta-marquee__group" aria-hidden={k > 0 || undefined} key={k}>
      {items.map((t) => (
        <span key={`${k}-${t}`} className="contents">
          <span className="pta-marquee__item">{t}</span>
          <i className="pta-marquee__sep" aria-hidden="true" />
        </span>
      ))}
    </div>
  )

  return (
    <div className="so-faixa faixas">
      <div className="pta-marquee" ref={box} data-paused={paused} style={{ ['--dur' as string]: '40s' }}>
        <div className="pta-marquee__viewport">
          <div className="pta-marquee__track">{[0, 1, 2, 3].map(grupo)}</div>
        </div>
        <button
          type="button"
          className="pta-marquee__pause"
          aria-pressed={paused}
          aria-label={paused ? UI.resumeMotion : UI.pauseMotion}
          onClick={() => setPaused((p) => !p)}
        />
      </div>
    </div>
  )
}
