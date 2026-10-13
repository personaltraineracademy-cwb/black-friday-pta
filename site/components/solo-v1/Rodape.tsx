import type { SoloCopy, SoloId } from '@/lib/solo/copy'
import { ImgTema } from './util'

/** Rodapé legal: logo completa (PTA) na cor do produto + as linhas da copy. */
export function Rodape({ id, c }: { id: SoloId; c: SoloCopy }) {
  return (
    <footer className="v1-rodape s-rodape s-inv">
      <div className="v1-wrap">
        <ImgTema
          className="v1-rodape__logo"
          base={`/logos/solo/c-rec-${id}-pta`}
          width={2829}
          height={742}
          alt="Black Friday da Personal Trainer Academy"
        />
        {c.rodape.map((linha) => (
          <p key={linha}>{linha}</p>
        ))}
      </div>
    </footer>
  )
}
