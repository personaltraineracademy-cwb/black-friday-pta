'use client'
/**
 * Raiz da v2 (Dossiê) e MOTOR DE MOVIMENTO. O conteúdo todo (children) continua sendo HTML de servidor;
 * este componente só "liga" o movimento por cima. Sem JS ou com ?movimento=parado: tudo já está no estado final,
 * visível e na ordem.
 *
 * LINGUAGEM única do dossiê: IMPRIMIR / CARIMBAR (clip-path de cima para baixo, fio que se traça, tarja que cobre e
 * abre, carimbo). Três motores, do mais barato ao mais caro (nenhuma biblioteca de terceiros; 0 KB de GSAP):
 *   1. CSS puro (v2.css): entrada da dobra, parallax, tarjas, numerais "impressos" — ligados à rolagem por
 *      `animation-timeline` onde existe (Chrome/Edge/Safari 26); zero JS.
 *   2. Um IntersectionObserver marca `.is-on` nos itens `[data-v2-io]` e nos títulos `[data-v2-lines]` quando entram
 *      na tela: ingressos, textos e listas "imprimem", fios se traçam, títulos sobem linha a linha
 *      (split-lines.ts); onde `animation-timeline` não existe (Firefox, iOS < 26) os gestos do motor 1 rodam com
 *      tempo. `data-io` na raiz diz o modo: "tickets" | "all".
 *   3. Detalhes de ponteiro/rolagem: inclinação ≤ 3° dos ingressos (só mouse, só modo 'total'), contador dos
 *      números e barra de progresso de leitura.
 * Política de movimento (lib/motion.ts): 'total' (padrão) · 'suave' (sistema pede menos: mesma coreografia curta,
 * sem parallax/inclinação) · 'parado' (só ?movimento=parado: nada liga). O que já está na tela quando o JS liga
 * nasce no estado final (sem piscar).
 */
import { useEffect, useRef, type ReactNode } from 'react'
import { motionMode } from '@/lib/motion'
import { splitLines } from './split-lines'

/** Conta de 0 até o número do elemento (pt-BR), com ease-out: os últimos dígitos assentam por último. */
function countUp(el: HTMLElement): void {
  const full = el.textContent ?? ''
  const m = /^(\D*)([\d.]+)(\D*)$/.exec(full.trim())
  if (!m) return
  const [, pre = '', digits = '', post = ''] = m
  const target = parseInt(digits.replace(/\./g, ''), 10)
  if (!Number.isFinite(target) || target < 2) return
  const dur = Math.min(1300, 450 + Math.log10(target) * 220)
  const fmt = (v: number) => pre + v.toLocaleString('pt-BR') + post
  const t0 = performance.now()
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / dur)
    const e = 1 - Math.pow(1 - k, 4)
    el.textContent = k >= 1 ? full : fmt(Math.round(target * e))
    if (k < 1) requestAnimationFrame(step)
  }
  el.textContent = fmt(0)
  requestAnimationFrame(step)
}

export function DossieRoot({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const mode = motionMode()
    if (mode === 'parado') return
    const viewOk = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()')
    const vh = window.innerHeight
    const targets = Array.from(el.querySelectorAll<HTMLElement>('[data-v2-io], [data-v2-lines]'))

    // o que já está na tela (ou já passou) nasce ligado, no mesmo quadro do data-io: sem transição, sem piscar
    const pending = targets.filter((t) => {
      const r = t.getBoundingClientRect()
      if (r.top < vh * 0.92) {
        t.classList.add('is-on')
        return false
      }
      return true
    })
    el.dataset.io = viewOk ? 'tickets' : 'all'
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const t = e.target as HTMLElement
          t.classList.add('is-on')
          io.unobserve(t)
          // contador: só dos números que ENTRAM na tela (os que já estavam nascem prontos)
          t.querySelectorAll<HTMLElement>('[data-v2-count]').forEach(countUp)
        }
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )
    pending.forEach((t) => io.observe(t))

    // títulos em linhas (depois que a fonte da marca carregou; refaz quando a largura muda)
    const titles = targets.filter((t) => t.hasAttribute('data-v2-lines'))
    const restore = new Map<HTMLElement, () => void>()
    let alive = true
    const split = (t: HTMLElement) => {
      restore.get(t)?.() // volta ao HTML original antes de medir de novo
      restore.set(t, splitLines(t))
    }
    void document.fonts.ready.then(() => {
      if (!alive) return
      titles.forEach(split)
    })
    // refaz as linhas só quando a LARGURA da página muda (girar o celular, redimensionar), não quando a altura muda
    let lastW = el.clientWidth
    let timer = 0
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === lastW) return
      lastW = el.clientWidth
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (alive && restore.size) titles.forEach(split)
      }, 150)
    })
    ro.observe(el)

    // ingressos: inclinação leve (≤ 3°) que segue o mouse + brilho que acompanha; só ponteiro fino, só 'total'
    const cleanups: Array<() => void> = []
    if (mode === 'total' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      el.querySelectorAll<HTMLElement>('.v2-ingresso').forEach((li) => {
        const move = (ev: PointerEvent) => {
          const r = li.getBoundingClientRect()
          const x = (ev.clientX - r.left) / r.width
          const y = (ev.clientY - r.top) / r.height
          li.style.setProperty('--rx', `${((0.5 - y) * 5).toFixed(2)}deg`)
          li.style.setProperty('--ry', `${((x - 0.5) * 5).toFixed(2)}deg`)
          li.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
          li.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
        }
        const leave = () => {
          li.style.removeProperty('--rx')
          li.style.removeProperty('--ry')
        }
        li.addEventListener('pointermove', move)
        li.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          li.removeEventListener('pointermove', move)
          li.removeEventListener('pointerleave', leave)
        })
      })
    }

    // barra de progresso de leitura: CSS (scroll-driven) onde existe; reserva por rolagem nos demais
    if (!CSS.supports('animation-timeline: scroll()')) {
      let raf = 0
      const upd = () => {
        raf = 0
        const h = document.documentElement
        const max = h.scrollHeight - h.clientHeight
        el.style.setProperty('--p', max > 0 ? String(Math.min(1, h.scrollTop / max)) : '0')
      }
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(upd)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      upd()
      cleanups.push(() => {
        window.removeEventListener('scroll', onScroll)
        if (raf) cancelAnimationFrame(raf)
      })
    }

    return () => {
      alive = false
      window.clearTimeout(timer)
      ro.disconnect()
      io.disconnect()
      cleanups.forEach((fn) => fn())
      restore.forEach((fn) => fn())
      delete el.dataset.io
      targets.forEach((t) => t.classList.remove('is-on'))
    }
  }, [])

  return (
    <div className="v2" ref={root}>
      <div className="v2-prog" aria-hidden="true" />
      {children}
    </div>
  )
}
