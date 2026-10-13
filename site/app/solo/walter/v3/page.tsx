import type { Metadata } from 'next'
import { PaginaWalter } from '@/components/solo-v3/PaginaWalter'
import { SOLO } from '@/lib/solo-v3'
import '@/app/v3/v3.css'
import '@/components/solo-v3/solo.css'

const c = SOLO.walter

export const metadata: Metadata = {
  title: `${c.produto.professor} · ${c.produto.nome_pos} ao vivo`,
  description: c.hero.sub,
}

/** /solo/walter/v3/ — Walter Krause · Bodybuilding e Estética Corporal · vermelho · "A ANILHA". Decisões: docs/solo-v3-decisoes.md */
export default function Page() {
  return <PaginaWalter />
}
