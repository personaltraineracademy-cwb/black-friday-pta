import { Logo } from '@/components/Logo'
import { copy } from '@/lib/copy'

/** Rodapé: logo (fora da dobra) + aviso legal da copy. */
export function Rodape() {
  return (
    <footer className="rodape">
      <div className="wrap rodape-in">
        <Logo concept="tarja" variant="pta" live height={48} mode="img" />
        <p>{copy.rodape}</p>
      </div>
    </footer>
  )
}
