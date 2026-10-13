import type { Metadata } from 'next'
import { SOLO } from '@/components/solo-v2/copy'
import { SoloShell } from '@/components/solo-v2/Shell'
import { HeroCarlos } from '@/components/solo-v2/Heroes'
import { Bonus, Como, Faq, Final, Intro, Noite, Pague, Pos, Professor, Sec } from '@/components/solo-v2/Sections'
import '../../../v2/v2.css'
import '../../solo-v2.css'

/**
 * Solo · Carlos Garon · Treinamento Feminino · roxo. v2 Dossiê + "A VISÃO 360°": anel de 4 setores e grade polar
 * graduada em volta do retrato; faixa escura em cima (imagem) e clara embaixo (texto).
 * Tons nativos: dobra preto+papel · frase papel · como preto · noite papel · professor preto · pós papel ·
 * oferta preto · bônus papel · perguntas preto · fecho papel.
 */
const c = SOLO.carlos
export const metadata: Metadata = {
  title: { absolute: c.barra.texto },
  description: c.hero.sub,
}

export default function Page() {
  return (
    <SoloShell prof="carlos">
      <HeroCarlos />
      <Intro prof="carlos" tom="papel" />
      <Como prof="carlos" tom="preto" />
      <Noite prof="carlos" tom="papel" />
      <Sec tom="preto" className="s2-profsec" labelledby="h-prof">
        <Professor prof="carlos" />
      </Sec>
      <Sec tom="papel" className="s2-possec" labelledby="h-pos">
        <Pos prof="carlos" />
      </Sec>
      <Pague prof="carlos" tom="preto" />
      <Bonus prof="carlos" tom="papel" />
      <Faq prof="carlos" tom="preto" />
      <Final prof="carlos" tom="papel" />
    </SoloShell>
  )
}
