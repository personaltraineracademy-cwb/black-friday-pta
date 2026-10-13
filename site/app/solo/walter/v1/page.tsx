import type { Metadata } from 'next'
import { WalterPage } from '@/components/solo-v1/WalterPage'
import { SOLO } from '@/lib/solo/copy'
import '@/app/v1/v1.css'
import '../../solo-v1.css'

export const metadata: Metadata = {
  title: { absolute: SOLO.walter.barra.texto },
  description: SOLO.walter.hero.sub,
}

export default function Page() {
  return <WalterPage />
}
