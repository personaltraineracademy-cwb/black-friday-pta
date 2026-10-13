'use client'
import { useEffect, useRef } from 'react'
import { motionMode } from '@/lib/motion'

/**
 * Número que "conta" até o valor final ao entrar na tela (uma vez, 0,9 s, easeOutCubic).
 *
 *  - O HTML estático já traz o valor FINAL (sem JS, leitor de tela, impressão, captura: tudo certo).
 *  - Só quando o bloco está abaixo da dobra e não é ?movimento=parado (suave: a mesma contagem, 0,6 s): troca para "0" e conta ao entrar na tela.
 *  - Formato do original: prefixo ("+"), separador de milhar pt-BR. A largura é reservada em `ch` (sem salto).
 *  - Texto que não é número ("Professores…") nem passa por aqui (o chamador só usa com o número da copy).
 */
export function Contagem({ texto }: { texto: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (motionMode() === 'parado') return
    const m = /^(\D*)(\d[\d.]*)(\D*)$/.exec(texto)
    if (!m) return
    const [, pre = '', digitos = '', pos = ''] = m
    const alvo = Number(digitos.replace(/\./g, ''))
    if (!Number.isFinite(alvo) || alvo < 1) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return // já visível: fica como está

    const fmt = (v: number) => `${pre}${Math.round(v).toLocaleString('pt-BR')}${pos}`
    el.textContent = fmt(0)
    let raf = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const passo = (t: number) => {
          const p = Math.min(1, (t - t0) / (motionMode() === 'suave' ? 600 : 900))
          const v = alvo * (1 - Math.pow(1 - p, 3))
          el.textContent = p >= 1 ? texto : fmt(v)
          if (p < 1) raf = requestAnimationFrame(passo)
        }
        raf = requestAnimationFrame(passo)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
      el.textContent = texto
    }
  }, [texto])

  return (
    <span ref={ref} className="v1-cont" style={{ minWidth: `${texto.length}ch` }}>
      {texto}
    </span>
  )
}
