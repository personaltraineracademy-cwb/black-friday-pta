import type { Metadata } from 'next'
import { PaginaAndre } from '@/components/solo-v3/PaginaAndre'
import { SOLO } from '@/lib/solo-v3'
import '@/app/v3/v3.css'
import '@/components/solo-v3/solo.css'

const c = SOLO.andre

export const metadata: Metadata = {
  title: `${c.produto.professor} · ${c.produto.nome_pos} ao vivo`,
  description: c.hero.sub,
}

/** /solo/andre/v3/ — André Albuquerque · Biomecânica · azul · "O ÂNGULO". Decisões: docs/solo-v3-decisoes.md */
export default function Page() {
  return <PaginaAndre />
}
