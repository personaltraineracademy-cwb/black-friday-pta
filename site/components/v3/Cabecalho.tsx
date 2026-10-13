import { ButtonCta } from '@/components/ButtonCta'
import { Logo } from '@/components/Logo'
import { copy } from '@/lib/copy'

/**
 * Cabeçalho: a ÚNICA logo da dobra (esquerda, na largura do 1º painel no celular) + botão (direita).
 * Header e conteúdo no MESMO .wrap (mesma margem). Sticky a partir de 768 px (CSS).
 */
export function Cabecalho() {
  return (
    <header className="bar">
      <div className="wrap bar-in">
        <a className="bar-logo" href="#topo" aria-label={copy.hero.eyebrow}>
          <Logo concept="tarja" variant="pta" live label="" />
        </a>
        <ButtonCta size="bar" arrow={false} origem="barra">
          {copy.barra.botao}
        </ButtonCta>
      </div>
    </header>
  )
}
