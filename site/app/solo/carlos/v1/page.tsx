import type { Metadata } from 'next'
import { CarlosPage } from '@/components/solo-v1/CarlosPage'
import { SOLO } from '@/lib/solo/copy'
import '@/app/v1/v1.css'
import '../../solo-v1.css'

export const metadata: Metadata = {
  title: { absolute: SOLO.carlos.barra.texto },
  description: SOLO.carlos.hero.sub,
}

export default function Page() {
  return <CarlosPage />
}
