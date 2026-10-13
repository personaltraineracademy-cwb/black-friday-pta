import type { Metadata } from 'next'
import { copy } from '@/lib/copy'
import { Bonus } from '@/components/v1/Bonus'
import { Condicao } from '@/components/v1/Condicao'
import { CtaFinal } from '@/components/v1/CtaFinal'
import { Faq } from '@/components/v1/Faq'
import { Footer } from '@/components/v1/Footer'
import { Header } from '@/components/v1/Header'
import { Hero } from '@/components/v1/Hero'
import { Movimento } from '@/components/v1/Movimento'
import { Noites } from '@/components/v1/Noites'
import { PorQuePta } from '@/components/v1/PorQuePta'
import { Quando } from '@/components/v1/Quando'
import { Roteiro } from '@/components/v1/Roteiro'
import { StickyBar } from '@/components/v1/StickyBar'
import './v1.css'

/**
 * v1 · SALA DE CONTROLE — arquétipo A (transmissão), logo C·REC (visor, tally, monitor, timecode).
 * Porte de paginas/v1/index.html para a base Next.js. Todo o CSS desta versão vive em app/v1/v1.css, escopado
 * em `.v1`; os componentes ficam em components/v1/. Texto: só lib/copy.ts e lib/ui-text.ts (+ rótulos neutros
 * de components/v1/rotulos.ts). Decisões e medidas: docs/v1-decisoes.md.
 */
export const metadata: Metadata = { title: { absolute: copy.barra.texto } }

export default function Page() {
  return (
    <div className="v1">
      <div className="v1-prog" aria-hidden="true" />
      <Header />
      <Movimento>
        <Hero />
        <Quando />
        <Roteiro />
        <Noites />
        <Condicao />
        <Bonus />
        <PorQuePta />
        <Faq />
        <CtaFinal />
      </Movimento>
      <Footer />
      <StickyBar>{copy.barra.botao}</StickyBar>
    </div>
  )
}
