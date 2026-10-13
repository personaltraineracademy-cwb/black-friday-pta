import type { Metadata } from 'next'
import { Logo } from '@/components/Logo'
import { withBase } from '@/lib/url'

/**
 * Índice das versões, para a cliente comparar lado a lado. Não faz parte da campanha.
 * Usa <a> comum (e não next/link): no Next 16.4 com `output: 'export'` + `trailingSlash`, o prefetch do <Link>
 * pede `__next.v1.__PAGE__.txt` e o arquivo gerado é `__next.v1/__PAGE__.txt` (404 no console).
 * Navegação completa entre versões é o que queremos mesmo: cada versão é uma página independente.
 */
export const metadata: Metadata = { title: 'Versões' }

const VERSOES = [
  { href: '/v1/', nome: 'v1', titulo: 'Sala de controle', texto: 'Logo C·REC (visor). Painel de transmissão, timecode e três canais.' },
  { href: '/v2/', nome: 'v2', titulo: 'Dossiê', texto: 'Logo A·Tarja. Documento de produção: fichas, numeração e fios.' },
  { href: '/v3/', nome: 'v3', titulo: 'Placar', texto: 'Logo A·Tarja ao vivo. Painéis 01·02·03 e o placar 1 × 2.' },
] as const

export default function Page() {
  return (
    <main id="conteudo" className="wrap pb-secao pt-g3">
      <header className="flex min-h-(--header-h) items-center border-b border-papel/20 pb-g2">
        <Logo concept="tarja" variant="pta" height={40} />
      </header>

      <h1 className="mt-secao max-w-[14ch] text-h2">Black PTA ao Vivo</h1>
      <p className="mono mt-g2 text-ouro">Páginas de captura · comparar versões</p>

      <ul className="mt-g3 grid gap-gut md:grid-cols-3">
        {VERSOES.map((v) => (
          <li key={v.href}>
            <a
              href={withBase(v.href)}
              className="group block h-full rounded-cartao border border-papel/25 bg-ink-2 p-6 transition-colors hover:border-ouro md:p-8"
            >
              <span className="mono text-ouro">{v.nome}</span>
              <span className="mt-g1 block font-display text-lead font-black uppercase">{v.titulo}</span>
              <span className="mt-g1 block text-mute">{v.texto}</span>
              <span className="mono mt-g2 block text-tinta">Abrir →</span>
            </a>
          </li>
        ))}
      </ul>

    </main>
  )
}
