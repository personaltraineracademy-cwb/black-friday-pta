import { Logo } from '@/components/Logo'
import { copy } from '@/lib/copy'
import { withBase } from '@/lib/url'

/** Rodapé: a logo completa (PTA) + o aviso legal da copy. */
export function Footer() {
  return (
    <footer className="v1-rodape">
      <div className="v1-wrap">
        {/* abaixo da dobra: <img> (o arquivo é cacheado) em vez de SVG inline, que pesaria ~11 KB no HTML */}
        <Logo concept="rec" variant="pta" tone="ouro" mode="img" className="v1-rodape__logo t-escuro" />
        {/* tema claro: o mesmo arquivo com o ouro fechado (#7C5F1C = token --color-ouro do claro); a outra variante some pelo CSS */}
        <img
          className="v1-rodape__logo t-claro"
          src={withBase('/logos/c-rec-todos-pta-claro.svg')}
          width={2829}
          height={742}
          alt="Black Friday da Personal Trainer Academy"
          loading="lazy"
          decoding="async"
        />
        <p>{copy.rodape}</p>
      </div>
    </footer>
  )
}
