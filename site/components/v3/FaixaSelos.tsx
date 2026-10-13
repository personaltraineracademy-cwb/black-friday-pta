'use client'
import { useEffect, useRef } from 'react'
import { Marquee } from '@/components/Marquee'
import { motionMode } from '@/lib/motion'

/**
 * Faixa rolante de selos (costura entre a dobra e o enunciado; só abaixo da dobra, >= 72 px de ar).
 * Reaproveita o <Marquee> compartilhado (pausa >= 48 px, cópia aria-hidden) e soma o momento premium:
 *  - velocidade em px/s (50 px/s): a duração é medida pela largura do grupo, não fixa;
 *  - o ritmo ACOMPANHA A ROLAGEM: rolar para baixo acelera a faixa (até ~3x); rolar para cima a desacelera, para e
 *    INVERTE o sentido; ao parar de rolar, ela volta suave ao ritmo e ao sentido normais;
 *  - passar o mouse pausa (CSS, v3.css) para ler a palavra.
 * Modo suave (o sistema pede menos movimento): ritmo fixo e mais lento (base), sem acoplamento à rolagem.
 * Modo parado: texto centrado em linhas (CSS), nada a fazer aqui.
 */
export function FaixaSelos({ items }: { items: readonly string[] }) {
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const mq = el.querySelector<HTMLElement>('.pta-marquee')
    const group = el.querySelector<HTMLElement>('.pta-marquee__group')
    const track = el.querySelector<HTMLElement>('.pta-marquee__track')
    if (!mq || !group || !track) return
    const modo = motionMode()
    if (modo === 'parado') return

    let primed = false
    const prime = () => {
      // tempo de partida grande: com taxa negativa a animação infinita tem para onde voltar (não trava em 0)
      const anim = track.getAnimations()[0]
      if (!anim || primed) return
      const d = Number(anim.effect?.getComputedTiming().duration)
      if (Number.isFinite(d) && d > 0) {
        anim.currentTime = d * 40
        primed = true
      }
    }
    const ajusta = () => {
      const w = group.getBoundingClientRect().width
      if (w) mq.style.setProperty('--dur', `${(w / 50).toFixed(1)}s`)
      primed = false
      requestAnimationFrame(prime)
    }
    ajusta()
    void document.fonts?.ready.then(ajusta)
    let rz = 0
    const onResize = () => {
      clearTimeout(rz)
      rz = window.setTimeout(ajusta, 200)
    }
    window.addEventListener('resize', onResize)

    let last = window.scrollY
    let alvo = 0 // velocidade de rolagem normalizada e COM sinal (-1..1)
    let atual = 0
    let raf = 0
    const tick = () => {
      raf = 0
      const anim = track.getAnimations()[0]
      if (!anim) return
      atual += (alvo - atual) * 0.14
      alvo *= 0.9
      anim.playbackRate = 1 + 2.4 * atual
      if (Math.abs(atual) > 0.01 || Math.abs(alvo) > 0.01) raf = requestAnimationFrame(tick)
      else anim.playbackRate = 1
    }
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - last
      last = y
      alvo = Math.max(-1, Math.min(1, dy / 60))
      if (!raf) raf = requestAnimationFrame(tick)
    }
    if (modo === 'total') window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(rz)
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="faixas" ref={box}>
      <Marquee items={items} duration={40} />
    </div>
  )
}
