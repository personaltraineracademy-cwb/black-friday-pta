import { copy } from '@/lib/copy'
import { BarraFixa } from '@/components/v3/BarraFixa'
import { Bonus } from '@/components/v3/Bonus'
import { Cabecalho } from '@/components/v3/Cabecalho'
import { Condicao1x2 } from '@/components/v3/Condicao1x2'
import { ComoFunciona } from '@/components/v3/ComoFunciona'
import { CtaFinal } from '@/components/v3/CtaFinal'
import { FaixaSelos } from '@/components/v3/FaixaSelos'
import { Faq } from '@/components/v3/Faq'
import { Hero } from '@/components/v3/Hero'
import { Intro } from '@/components/v3/Intro'
import { Movimento } from '@/components/v3/Movimento'
import { Noites } from '@/components/v3/Noites'
import { PorQuePta } from '@/components/v3/PorQuePta'
import { Rodape } from '@/components/v3/Rodape'
import './v3.css'

/**
 * v3 · PLACAR (arquétipo D: placar esportivo + numerais monumentais).
 * Uma cor de produto por noite em área grande (azul André · vermelho Walter · roxo Carlos); ouro só na oferta e no CTA.
 * Logo A·Tarja (com "AO VIVO"). Todo o CSS da versão está em ./v3.css, escopado em `.v3`.
 * Decisões, medidas e o que ficou imperfeito: docs/v3-decisoes.md.
 */
export default function Page() {
  return (
    <div className="v3">
      <Cabecalho />
      <main id="conteudo">
        <Hero />
        <FaixaSelos items={copy.hero.selos} />
        <Intro />
        <ComoFunciona />
        <Noites />
        <Condicao1x2 />
        <Bonus />
        <PorQuePta />
        <Faq />
        <CtaFinal />
      </main>
      <Rodape />
      <BarraFixa>{copy.barra.botao}</BarraFixa>
      <Movimento />
      <div className="progresso" aria-hidden="true" />
    </div>
  )
}
