import type { Metadata } from 'next'
import { PaginaCarlos } from '@/components/solo-v3/PaginaCarlos'
import { SOLO } from '@/lib/solo-v3'
import '@/app/v3/v3.css'
import '@/components/solo-v3/solo.css'

const c = SOLO.carlos

export const metadata: Metadata = {
  title: `${c.produto.professor} · ${c.produto.nome_pos} ao vivo`,
  description: c.hero.sub,
}

/** /solo/carlos/v3/ — Carlos Garon · Treinamento Feminino · roxo · "VISÃO 360º". Decisões: docs/solo-v3-decisoes.md */
export default function Page() {
  return <PaginaCarlos />
}
