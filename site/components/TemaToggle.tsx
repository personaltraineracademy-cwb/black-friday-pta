'use client'

import { useEffect, useState } from 'react'

type Tema = 'escuro' | 'claro'

/**
 * Botão de teste: alterna o tema claro/escuro (atributo data-tema no <html>; guarda em localStorage).
 * O atributo inicial vem do script no <head> (?tema=claro|escuro > localStorage > escuro): sem piscar.
 * O estado visual vem do CSS (aria-pressed é atualizado depois da montagem).
 */
export function TemaToggle() {
  const [tema, setTema] = useState<Tema>('escuro')

  useEffect(() => {
    const d = document.documentElement
    const ler = () => setTema(d.getAttribute('data-tema') === 'claro' ? 'claro' : 'escuro')
    ler()
    const mo = new MutationObserver(ler)
    mo.observe(d, { attributes: true, attributeFilter: ['data-tema'] })
    return () => mo.disconnect()
  }, [])

  const aplicar = (t: Tema) => {
    document.documentElement.setAttribute('data-tema', t)
    try {
      localStorage.setItem('pta-tema', t)
    } catch {}
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', t === 'claro' ? '#ECE7DC' : '#0C0B09')
  }

  return (
    <div className="pta-tema" role="group" aria-label="Tema da página (teste): escuro ou claro">
      <button type="button" aria-pressed={tema === 'escuro'} onClick={() => aplicar('escuro')}>
        Escuro
      </button>
      <button type="button" aria-pressed={tema === 'claro'} onClick={() => aplicar('claro')}>
        Claro
      </button>
    </div>
  )
}
