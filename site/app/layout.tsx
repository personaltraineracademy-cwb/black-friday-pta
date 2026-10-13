import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { fontVariables } from './fonts'
import { config } from '@/lib/config'
import { withBase } from '@/lib/url'
import { copy } from '@/lib/copy'
import { UI } from '@/lib/ui-text'
import { warnIfCopyDatesDiffer } from '@/lib/copy-check'
import { LeadModalProvider } from '@/components/LeadModal'
import { RevealObserver } from '@/components/RevealObserver'
import { SmoothScroll } from '@/components/SmoothScroll'
import { TemaToggle } from '@/components/TemaToggle'

warnIfCopyDatesDiffer() // só servidor/build: avisa se a copy e as datas do .env divergirem

const TITLE = 'Black PTA ao Vivo · Personal Trainer Academy'

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),  // com subpasta, a URL da imagem OG inclui o BASE_PATH (abaixo)
  title: { default: TITLE, template: `%s · Black PTA ao Vivo` },
  description: copy.hero.sub,
  applicationName: 'Black PTA ao Vivo',
  robots: config.noindex ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Personal Trainer Academy',
    title: TITLE,
    description: copy.hero.sub,
    images: [{ url: `${config.siteUrl}${withBase('/og.png')}`, width: 1200, height: 630, alt: copy.barra.texto }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: copy.hero.sub, images: [`${config.siteUrl}${withBase('/og.png')}`] },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0C0B09',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={fontVariables}
      data-movimento="total"
      data-tema="escuro"
      suppressHydrationWarning
      style={{ ['--grain-url' as string]: `url(${withBase('/img/grao-128.png')})` }}
    >
      <head>
        {/* movimento SEMPRE ligado: 'total' (padrão), 'suave' se o sistema pede menos movimento, 'parado' só por ?movimento=parado */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search).get('movimento'),m=(q==='parado'||q==='suave'||q==='total')?q:(matchMedia('(prefers-reduced-motion: reduce)').matches?'suave':'total');d.setAttribute('data-movimento',m)}catch(e){}})()",
          }}
        />
        {/* tema claro/escuro (teste): ?tema=claro|escuro > localStorage > escuro */}
        <script dangerouslySetInnerHTML={{ __html: "(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search).get('tema'),s=localStorage.getItem('pta-tema'),t=(q==='claro'||q==='escuro')?q:((s==='claro'||s==='escuro')?s:'escuro');d.setAttribute('data-tema',t);if(q==='claro'||q==='escuro')localStorage.setItem('pta-tema',q)}catch(e){}})()" }} />
      </head>
      <body>
        <TemaToggle />
        <a className="pta-skip" href="#conteudo">
          {UI.skip}
        </a>
        <LeadModalProvider>{children}</LeadModalProvider>
        <RevealObserver />
        <SmoothScroll />
      </body>
    </html>
  )
}
