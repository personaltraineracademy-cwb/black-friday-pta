import type { Metadata } from 'next'
import { SOLO } from '@/components/solo-v2/copy'
import { SoloShell } from '@/components/solo-v2/Shell'
import { HeroWalter } from '@/components/solo-v2/Heroes'
import { Bonus, Como, Faq, Final, Intro, Noite, Pague, Pos, Professor, Sec } from '@/components/solo-v2/Sections'
import '../../../v2/v2.css'
import '../../solo-v2.css'

/**
 * Solo · Walter Krause · Bodybuilding e Estética Corporal · vermelho. v2 Dossiê + "A MEDIDA": fita métrica em pé
 * ao lado do retrato, sobre um bloco da cor do produto, com o carimbo da noite.
 * Tons nativos: dobra e frase preto · como papel · noite preto · professor papel · pós preto · oferta papel ·
 * bônus preto · perguntas papel · fecho preto.
 */
const c = SOLO.walter
export const metadata: Metadata = {
  title: { absolute: c.barra.texto },
  description: c.hero.sub,
}

export default function Page() {
  return (
    <SoloShell prof="walter">
      <HeroWalter />
      <Intro prof="walter" tom="preto" />
      <Como prof="walter" tom="papel" />
      <Noite prof="walter" tom="preto" />
      <Sec tom="papel" className="s2-profsec" labelledby="h-prof">
        <Professor prof="walter" />
      </Sec>
      <Sec tom="preto" className="s2-possec" labelledby="h-pos">
        <Pos prof="walter" />
      </Sec>
      <Pague prof="walter" tom="papel" />
      <Bonus prof="walter" tom="preto" />
      <Faq prof="walter" tom="papel" />
      <Final prof="walter" tom="preto" />
    </SoloShell>
  )
}
