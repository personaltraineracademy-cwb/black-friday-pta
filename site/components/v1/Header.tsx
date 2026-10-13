import { ButtonCta } from '@/components/ButtonCta'
import { Logo } from '@/components/Logo'
import { copy } from '@/lib/copy'

/** Cabeçalho: logo (com nome) à esquerda · botão pequeno à direita. No mesmo container do conteúdo. */
export function Header() {
  return (
    <header className="v1-topo">
      <div className="v1-wrap v1-topo__in">
        <a className="v1-topo__logo" href="#conteudo" aria-label={copy.hero.eyebrow}>
          <Logo concept="rec" variant="nome" tone="ouro" label="" />
        </a>
        <ButtonCta size="bar" arrow={false} origem="barra">
          {copy.barra.botao}
        </ButtonCta>
      </div>
    </header>
  )
}
