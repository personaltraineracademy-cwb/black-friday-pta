'use client'
import { useEffect } from 'react'
import { whenIdle } from '@/lib/idle'
import { motionMode } from '@/lib/motion'

/**
 * Controlador de movimento da v3 · Placar (um só componente cliente, sem renderizar nada).
 * Princípio: o HTML já é a versão final; aqui só se coloca movimento POR CIMA, uma vez, ao entrar na tela.
 * Linguagem: o placar que VIRA (dígitos) e a cor que VARRE/ENCHE (tarja, painéis); o resto é entrada discreta.
 *
 *  [data-roll]   numerais virem (roll de dígitos, CSS) ...................... marca data-estado=pendente -> vai
 *  [data-tarja]  a tarja ouro do "1 × 2." varre (scaleX, CSS) ............... idem
 *  [data-enche]  os 3 painéis do final acendem de baixo (clip-path, CSS) .... idem
 *  [data-count]  números do "Por que a PTA" contam de 0 ao valor (1,1 s) .... texto final restaurado no fim
 *  [data-split]  títulos revelados por linha (SplitText, GSAP em idle) ...... só se escondem se estão abaixo da tela
 *  .pta-btn--lg  botão "magnético" <= 6 px (só mouse fino e modo total)
 *
 * Modos (motionMode, definido em app/layout.tsx): total = tudo · suave = o sistema pede menos movimento: a MESMA
 * coreografia, mais curta (títulos sobem 12 px em vez de uma linha inteira, contagem em 0,7 s), sem magnético ·
 * parado = nada roda e nada é escondido. Sem JS: tudo visível e parado.
 * Regras (pesquisa 19 §4): só transform/opacity/clip-path · <= 1,1 s · 1 vez · conteúdo final sempre no HTML.
 */
const MOUSE = '(hover: hover) and (pointer: fine)'

export function Movimento() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.v3')
    if (!root) return
    const modo = motionMode()
    if (modo === 'parado') return
    const suave = modo === 'suave'

    const limpezas: Array<() => void> = []
    const vh = window.innerHeight

    /* ---------- 1 · roll, tarja, painéis e contagem: entram uma vez ---------- */
    const alvos = Array.from(root.querySelectorAll<HTMLElement>('[data-roll], [data-tarja], [data-enche], [data-count]'))
    if ('IntersectionObserver' in window && alvos.length) {
      const fmt = new Intl.NumberFormat('pt-BR')
      const rafs = new Set<number>()

      const contar = (el: HTMLElement) => {
        const alvo = Number(el.dataset.count)
        if (!Number.isFinite(alvo) || alvo <= 0) return
        const pre = el.dataset.prefix ?? ''
        const final = el.textContent ?? ''
        const t0 = performance.now()
        const dur = suave ? 700 : 1100
        const passo = (t: number) => {
          const p = Math.min(1, (t - t0) / dur)
          const e = 1 - Math.pow(1 - p, 3)
          if (p < 1) {
            el.textContent = pre + fmt.format(Math.round(alvo * e))
            rafs.add(requestAnimationFrame(passo))
          } else {
            el.textContent = final
          }
        }
        el.textContent = pre + '0'
        rafs.add(requestAnimationFrame(passo))
      }

      const disparar = (el: HTMLElement) => {
        if (el.hasAttribute('data-count')) contar(el)
        else el.dataset.estado = 'vai'
      }

      const io = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            if (!e.isIntersecting) continue
            io.unobserve(e.target)
            disparar(e.target as HTMLElement)
          }
        },
        { rootMargin: '0px 0px -12% 0px' },
      )
      for (const el of alvos) {
        if (!el.hasAttribute('data-count')) el.dataset.estado = 'pendente'
        io.observe(el)
      }
      limpezas.push(() => {
        io.disconnect()
        rafs.forEach((r) => cancelAnimationFrame(r))
      })
    }

    /* ---------- 2 · botão magnético (só mouse fino e modo total; nunca é a única pista de clique) ---------- */
    if (!suave && window.matchMedia(MOUSE).matches) {
      for (const btn of Array.from(root.querySelectorAll<HTMLElement>('.pta-btn--lg'))) {
        const mover = (e: PointerEvent) => {
          const r = btn.getBoundingClientRect()
          const x = (e.clientX - r.left - r.width / 2) * 0.12
          const y = (e.clientY - r.top - r.height / 2) * 0.2
          btn.style.translate = `${Math.max(-6, Math.min(6, x))}px ${Math.max(-4, Math.min(4, y))}px`
        }
        const sair = () => {
          btn.style.translate = ''
        }
        btn.addEventListener('pointermove', mover)
        btn.addEventListener('pointerleave', sair)
        limpezas.push(() => {
          btn.removeEventListener('pointermove', mover)
          btn.removeEventListener('pointerleave', sair)
          btn.style.translate = ''
        })
      }
    }

    /* ---------- 3 · títulos por linha (GSAP SplitText, em idle, fora do JS inicial) ---------- */
    const titulos = Array.from(root.querySelectorAll<HTMLElement>('[data-split]'))
    let cancelado = false
    const reverts: Array<() => void> = []
    const cancelaIdle = titulos.length
      ? whenIdle(() => {
          void (async () => {
            const [{ gsap }, { SplitText }] = await Promise.all([import('gsap'), import('gsap/SplitText')])
            if (cancelado) return
            gsap.registerPlugin(SplitText)
            await document.fonts?.ready
            if (cancelado) return
            for (const el of titulos) {
              let feito = false
              let obs: IntersectionObserver | undefined
              const split = SplitText.create(el, {
                type: 'lines',
                mask: 'lines',
                linesClass: 'v3-ln',
                autoSplit: true,
                onSplit(self) {
                  obs?.disconnect()
                  const r = el.getBoundingClientRect()
                  // já à vista (ou já passou): fica como está, sem esconder nada
                  if (feito || r.top < vh * 0.88) {
                    feito = true
                    return
                  }
                  gsap.set(self.lines, suave ? { yPercent: 30, opacity: 0 } : { yPercent: 135 })
                  obs = new IntersectionObserver(
                    ([e]) => {
                      if (!e?.isIntersecting) return
                      obs?.disconnect()
                      feito = true
                      gsap.to(self.lines, {
                        yPercent: 0,
                        opacity: 1,
                        duration: suave ? 0.4 : 0.7,
                        ease: 'power3.out',
                        stagger: suave ? 0.06 : 0.09,
                        overwrite: true,
                      })
                    },
                    { rootMargin: '0px 0px -12% 0px' },
                  )
                  obs.observe(el)
                },
              })
              reverts.push(() => {
                obs?.disconnect()
                split.revert()
              })
            }
          })()
        })
      : () => {}

    return () => {
      cancelado = true
      cancelaIdle()
      reverts.forEach((f) => f())
      limpezas.forEach((f) => f())
    }
  }, [])

  return null
}
