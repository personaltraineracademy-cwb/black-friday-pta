import { Logo } from '@/components/Logo'
import { withBase } from '@/lib/url'

/** Vira out/404.html no export (Vercel e Apache usam como página de erro). */
export default function NotFound() {
  return (
    <main id="conteudo" className="wrap grid min-h-svh content-center gap-g2 py-secao">
      <Logo concept="tarja" variant="pta" height={40} />
      <h1 className="mt-g3 max-w-[12ch] text-h2">Página não encontrada</h1>
      <p className="text-mute">O endereço não existe ou mudou de lugar.</p>
      <p className="mt-g1">
        <a href={withBase('/')} className="pta-btn">
          Voltar ao início
        </a>
      </p>
    </main>
  )
}
