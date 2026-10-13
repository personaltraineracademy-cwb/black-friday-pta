import { ButtonCta } from '@/components/ButtonCta'
import { Logo } from '@/components/Logo'
import { copy } from '@/lib/copy'
import { eventLine } from './v2-text'

/**
 * Cabeçalho do Dossiê: LOGO à esquerda + botão pequeno à direita, mesma altura, mesmo container do conteúdo.
 * Celular: logo compacta (com AO VIVO, 44 px). >= 768: logo larga com "personal trainer academy" (48 px).
 * As duas ficam no HTML e o CSS mostra uma (a outra é display:none, fora da árvore de acessibilidade).
 */
export function Header() {
  return (
    <header className="v2-barra">
      <a className="v2-barra-logo" href="#conteudo" aria-label={eventLine().brand}>
        <Logo concept="tarja" variant="nome" live tone="escuro" label="" className="v2-logo-c" />
        <Logo concept="tarja" variant="pta" tone="escuro" label="" className="v2-logo-w" />
      </a>
      <ButtonCta size="bar" arrow origem="barra" className="v2-barra-btn">
        {copy.barra.botao}
      </ButtonCta>
    </header>
  )
}
