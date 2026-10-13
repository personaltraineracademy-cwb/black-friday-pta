import { Logo } from '@/components/Logo'
import { copy } from '@/lib/copy'

/** Rodapé: logo (ouro, arquivo) + aviso legal da copy. Reserva espaço para a barra de baixo no celular. */
export function Footer() {
  return (
    <footer className="v2-rodape">
      <div className="v2-wrap">
        <div className="v2-rod-in">
          <Logo concept="tarja" variant="pta" mode="img" tone="ouro" className="v2-rod-logo" />
          <p>{copy.rodape}</p>
        </div>
      </div>
    </footer>
  )
}
