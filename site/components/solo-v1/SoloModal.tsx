'use client'
import { useEffect } from 'react'
import { setModalOverride, type ModalOverride } from '@/lib/modal-copy'

/**
 * Registra o texto do pop-up desta página (título, botão, seleção da noite, "outras noites"). Não desenha nada.
 * O <dialog> é o mesmo das outras páginas; ao sair da rota o registro é desfeito (a mãe volta a usar a copy dela).
 */
export function SoloModal({ data }: { data: ModalOverride }) {
  useEffect(() => {
    setModalOverride(data)
    return () => setModalOverride(null)
  }, [data])
  return null
}
