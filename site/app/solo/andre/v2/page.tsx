import type { Metadata } from 'next'
import { SOLO } from '@/components/solo-v2/copy'
import { SoloShell } from '@/components/solo-v2/Shell'
import { HeroAndre } from '@/components/solo-v2/Heroes'
import { Bonus, Como, Faq, Final, Intro, Noite, Pague, Pos, Professor, Sec } from '@/components/solo-v2/Sections'
import '../../../v2/v2.css'
import '../../solo-v2.css'

/**
 * Solo · André Albuquerque · Biomecânica · azul. v2 Dossiê (papel × preto) + "O ÂNGULO": goniômetro atrás do busto.
 * Tons nativos: dobra e frase preto · como papel · noite preto · professor+pós papel · oferta preto · bônus papel ·
 * perguntas preto · fecho papel. Decisões: docs/solo-v2-decisoes.md.
 */
const c = SOLO.andre
export const metadata: Metadata = {
  title: { absolute: c.barra.texto },
  description: c.hero.sub,
}

export default function Page() {
  return (
    <SoloShell prof="andre">
      <HeroAndre />
      <Intro prof="andre" tom="preto" />
      <Como prof="andre" tom="papel" />
      <Noite prof="andre" tom="preto" />
      <Sec tom="papel" className="s2-profpos" labelledby="h-prof">
        <Professor prof="andre" deco="prumo" />
        <Pos prof="andre" deco="planos" />
      </Sec>
      <Pague prof="andre" tom="preto" />
      <Bonus prof="andre" tom="papel" />
      <Faq prof="andre" tom="preto" />
      <Final prof="andre" tom="papel" />
    </SoloShell>
  )
}
