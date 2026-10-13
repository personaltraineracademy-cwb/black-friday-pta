import type { Metadata } from 'next'
import { StickyCta } from '@/components/StickyCta'
import { copy } from '@/lib/copy'
import { Header } from '@/components/v2/Header'
import { Hero } from '@/components/v2/Hero'
import { Intro } from '@/components/v2/Intro'
import { Roteiro } from '@/components/v2/Roteiro'
import { Ingressos } from '@/components/v2/Ingressos'
import { Condicao } from '@/components/v2/Condicao'
import { ValorTarja } from '@/components/v2/ValorTarja'
import { Bonus } from '@/components/v2/Bonus'
import { PorQuePta } from '@/components/v2/PorQuePta'
import { Faq } from '@/components/v2/Faq'
import { CtaFinal } from '@/components/v2/CtaFinal'
import { Footer } from '@/components/v2/Footer'
import { DossieRoot } from '@/components/v2/DossieRoot'
import { DossieModalHost } from '@/components/v2/DossieModalHost'
import './v2.css'

/**
 * v2 · DOSSIÊ — papel × preto, ingressos com picote, a tarja que se abre.
 * Desenho aprovado: paginas/v2/index.html (+ decisoes.md). Decisões do porte: docs/v2-decisoes.md.
 * Todo texto vem de lib/copy.ts (e os 4 rótulos de composição de components/v2/v2-text.ts).
 */
export const metadata: Metadata = {
  title: { absolute: copy.barra.texto },
  description: copy.hero.sub,
}

export default function Page() {
  return (
    <DossieRoot>
      <Header />
      <main id="conteudo">
        <Hero />
        <Intro />
        <Roteiro />
        <Ingressos />
        <Condicao />
        <ValorTarja />
        <Bonus />
        <PorQuePta />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <StickyCta>{copy.barra.botao}</StickyCta>
      <DossieModalHost />
    </DossieRoot>
  )
}
