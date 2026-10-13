import type { Metadata } from 'next'
import { AndrePage } from '@/components/solo-v1/AndrePage'
import { SOLO } from '@/lib/solo/copy'
import '@/app/v1/v1.css'
import '../../solo-v1.css'

export const metadata: Metadata = {
  title: { absolute: SOLO.andre.barra.texto },
  description: SOLO.andre.hero.sub,
}

export default function Page() {
  return <AndrePage />
}
