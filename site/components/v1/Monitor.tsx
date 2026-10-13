'use client'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motionMode } from '@/lib/motion'
import { useEventState } from '@/lib/use-event-state'

/**
 * Monitor de uma noite. O conteúdo (barra, retrato, texto, botão) chega pronto do servidor em `children`;
 * este componente só cuida do "sinal":
 *   - abaixo da dobra o monitor nasce "sem sinal" (barras de teste + chuvisco) e SINTONIZA ao entrar na tela:
 *     as barras colapsam numa linha (como um tubo ligando) e o retrato ABRE dessa linha (clip-path). Só
 *     transform/opacity/clip-path.
 *   - sem JS, ou com ?movimento=parado, o retrato está sempre visível (conteúdo final no HTML). Modo suave
 *     (o sistema pede menos movimento): a mesma sintonia, mais curta (tempos pelo CSS, --v1-k).
 *   - quando a noite está AO VIVO (relógio real), o tally pisca 5 vezes e fica fixo (WCAG 2.2.2).
 *   - ponteiro fino sobre o monitor (modo total): ele sobe 4 px e inclina ≤ 2,5° para onde o ponteiro está (propriedades
 *     `translate`/`rotate`, que não brigam com a animação de entrada em `transform`); `will-change` só durante
 *     o gesto. O CSS faz o resto (tally acende, câmera aproxima).
 */
type Fase = 'ok' | 'sem-sinal' | 'sintonizando'

const INCLINACAO_MAX = 2.5 // graus

export function Monitor({ n, cor, children }: { n: 1 | 2 | 3; cor: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const [fase, setFase] = useState<Fase>('ok')
  const clock = useEventState()
  const aoVivo = clock.snapshot?.state === 'live' && clock.snapshot.night?.n === n

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (motionMode() === 'parado') return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return // já na tela: nada a sintonizar
    setFase('sem-sinal')
    let t1: ReturnType<typeof setTimeout> | undefined
    let t2: ReturnType<typeof setTimeout> | undefined
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return
        io.disconnect()
        t1 = setTimeout(() => {
          setFase('sintonizando')
          t2 = setTimeout(() => setFase('ok'), motionMode() === 'suave' ? 700 : 900)
        }, 160 + (n - 1) * 120)
      },
      { threshold: 0.25, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [n])

  // inclinação leve: só ponteiro fino com hover e movimento permitido
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches || motionMode() !== 'total') return // inclinação: só no modo total
    let raf = 0
    const onMove = (ev: PointerEvent) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = el.getBoundingClientRect()
        const nx = ((ev.clientX - r.left) / r.width) * 2 - 1 // -1..1
        const ny = ((ev.clientY - r.top) / r.height) * 2 - 1
        const mag = Math.min(1, Math.hypot(nx, ny))
        // eixo perpendicular ao deslocamento do ponteiro; ângulo proporcional à distância do centro
        el.style.setProperty('--tilt', `${(-ny).toFixed(3)} ${nx.toFixed(3)} 0 ${(INCLINACAO_MAX * mag).toFixed(2)}deg`)
      })
    }
    const onEnter = () => el.setAttribute('data-gesto', '')
    const onLeave = () => {
      el.removeAttribute('data-gesto')
      el.style.removeProperty('--tilt')
    }
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const style = { ['--c' as string]: cor, ['--rv' as string]: n - 1 } as CSSProperties
  return (
    <article
      ref={ref}
      className="v1-mon pta-reveal"
      style={style}
      data-noite={n}
      data-fase={fase}
      data-ao-vivo={aoVivo || undefined}
    >
      {children}
    </article>
  )
}
