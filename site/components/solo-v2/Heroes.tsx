import { ButtonCta } from '@/components/ButtonCta'
import { SoloFold } from '@/components/solo/SoloFold'
import { barraPartes, SOLO, type SoloId } from './copy'

/**
 * 1ª dobra da v2 (Dossiê): usa a DOBRA PADRÃO das individuais (components/solo/SoloFold), a mesma das 9 páginas.
 * Eyebrow, frase de apoio e selos ficam na faixa `Intro` logo abaixo. Arte: André goniômetro atrás do busto ·
 * Walter anilha (contorno) atrás do busto · Carlos anel de 4 setores + grade polar.
 */
function Dobra({ prof }: { prof: SoloId }) {
  const c = SOLO[prof]
  const { dia, hora } = barraPartes(c)
  return (
    <SoloFold
      prof={prof}
      ver="v2"
      tom="v2-preto"
      h1={c.hero.h1}
      destaque={c.hero.destaque}
      quando={`${dia} · ${hora}`}
      alt={`${c.professor.nome}, professor da noite de ${c.produto.nome_pos}`}
      cta={
        <ButtonCta size="lg" origem="hero">
          {c.hero.cta}
        </ButtonCta>
      }
    />
  )
}

export const HeroAndre = () => <Dobra prof="andre" />
export const HeroWalter = () => <Dobra prof="walter" />
export const HeroCarlos = () => <Dobra prof="carlos" />
