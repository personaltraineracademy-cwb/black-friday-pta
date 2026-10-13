'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import { loadGsap } from '@/lib/gsap'
import { motionMode } from '@/lib/motion'
import { whenIdle } from '@/lib/idle'

/**
 * <main> da v1 + o movimento que o CSS não alcança: revelação POR LINHA dos títulos (SplitText).
 *
 *  - Cada [data-linhas] abaixo da dobra é partido em linhas; cada linha sobe de dentro de uma janela
 *    (overflow: clip + folga de .2em para o acento, ver .v1-mask) quando o título chega a 88% da tela. Uma vez.
 *  - GSAP entra por import() em idle (loadGsap, o mesmo carregador do useGsap) e só depois de `fonts.ready`
 *    (dividir antes da fonte carregar quebra as linhas). O texto final já está no HTML: sem JS ou com
 *    ?movimento=parado fica parado e visível; no modo suave (o sistema pede menos movimento) a mesma revelação é curta.
 *  - O H1 (LCP) nunca é dividido. Títulos já visíveis na carga também não (evita piscar).
 *  - Prova de layout: o título dividido TEM que ter a mesma altura do natural (palavras em inline-block perdem o
 *    kerning entre elas e podem quebrar uma linha a mais, ex.: 768 px). Se não tiver, desfaz e só sobe o bloco.
 *  - Ao terminar, o texto volta ao natural (revert): nada de janelas com overflow ficam na página.
 *  - Ponteiro fino: a grade da seção "Como funciona" acende sob o cursor (variáveis --mx/--my, CSS faz o resto).
 */
export function Movimento({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const scope = root.current
    if (!scope) return
    if (motionMode() === 'parado') return
    const suave = motionMode() === 'suave'
    let cancelled = false
    let revert: (() => void) | undefined

    const cancelIdle = whenIdle(() => {
      void loadGsap().then(async ({ gsap, ScrollTrigger, SplitText }) => {
        await document.fonts?.ready
        if (cancelled) return
        const ctx = gsap.context(() => {
          scope.querySelectorAll<HTMLElement>('[data-linhas]').forEach((el) => {
            const box = el.getBoundingClientRect()
            if (box.top < window.innerHeight * 0.98) return // já na tela: fica como está
            const natural = box.height
            const trigger = { trigger: el, start: 'top 88%', once: true }
            const split = SplitText.create(el, {
              type: 'lines',
              mask: 'lines',
              linesClass: 'v1-lin',
              maskClass: 'v1-mask',
            })
            if (Math.abs(el.getBoundingClientRect().height - natural) > 1) {
              split.revert()
              gsap.from(el, { y: suave ? 8 : 24, opacity: 0, duration: suave ? 0.4 : 0.6, ease: 'power3.out', scrollTrigger: trigger })
              return
            }
            // suave: a mesma subida por linha, mas curta (≤ 12 px) e com fade; total: sobe de dentro da janela
            gsap.from(split.lines, {
              yPercent: suave ? 22 : 135, // 135: o acento (0,2 em acima da linha) também começa escondido na janela
              opacity: suave ? 0 : 1,
              duration: suave ? 0.4 : 0.7,
              ease: 'power3.out',
              stagger: suave ? 0.05 : 0.07,
              scrollTrigger: trigger,
              onComplete: () => split.revert(),
            })
          })
        }, scope)
        revert = () => ctx.revert()
        await document.fonts?.ready
        ScrollTrigger.refresh()
      })
    })

    return () => {
      cancelled = true
      cancelIdle()
      revert?.()
    }
  }, [])

  // MOMENTO ASSINATURA: a grade da mesa de corte (seção "Como funciona") acende sob o cursor.
  // Só ponteiro fino e movimento permitido; a luz é uma 2ª grade em ouro, mascarada por um círculo que segue o ponteiro.
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches || motionMode() === 'parado') return
    const sec = root.current?.querySelector<HTMLElement>('.v1-sec--grade')
    if (!sec) return
    let raf = 0
    const move = (ev: PointerEvent) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = sec.getBoundingClientRect()
        sec.style.setProperty('--mx', `${(ev.clientX - r.left).toFixed(0)}px`)
        sec.style.setProperty('--my', `${(ev.clientY - r.top).toFixed(0)}px`)
      })
    }
    const on = () => sec.setAttribute('data-luz', '')
    const off = () => sec.removeAttribute('data-luz')
    sec.addEventListener('pointerenter', on)
    sec.addEventListener('pointermove', move)
    sec.addEventListener('pointerleave', off)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      sec.removeEventListener('pointerenter', on)
      sec.removeEventListener('pointermove', move)
      sec.removeEventListener('pointerleave', off)
      off()
    }
  }, [])

  return (
    <main id="conteudo" ref={root}>
      {children}
    </main>
  )
}
