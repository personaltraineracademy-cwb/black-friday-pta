import { ButtonCta } from '@/components/ButtonCta'
import type { SoloCopy, SoloId } from '@/lib/solo/copy'
import { ImgTema } from './util'

/**
 * Cabeçalho: logo C·REC na cor do produto (arquivo oficial de brand.json) à esquerda; à direita o botão do pop-up
 * (seta no celular, rótulo inteiro a partir de 768). O centro do cabeçalho é livre (no teste, do botão do tema).
 */
export function Topo({ id, c }: { id: SoloId; c: SoloCopy }) {
  return (
    <header className="v1-topo s-topo">
      <div className="v1-wrap v1-topo__in">
        <a className="v1-topo__logo" href="#conteudo" aria-label={c.barra.texto}>
          <ImgTema
            base={`/logos/solo/c-rec-${id}-nome`}
            width={1382}
            height={865}
            alt=""
            eager
            logo
          />
        </a>
        {/* celular: botão-seta (o rótulo da copy fica para o leitor de tela); a partir de 768 o rótulo inteiro */}
        <ButtonCta size="bar" arrow noite={id} origem="barra" className="s-topo__btn">
          <span className="s-topo__txt">{c.barra.botao}</span>
        </ButtonCta>
      </div>
    </header>
  )
}
