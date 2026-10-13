import { NIGHT_IDS, nightCard, type NightId } from '@/lib/copy'
import { PROF, srcSet, TRIO, type PhotoFile } from '@/lib/photos'

/**
 * Foto real dos professores (P&B, com alfa), em <picture> com srcset. Componente de SERVIDOR.
 *
 *   <Photo kind="trio" priority />                      os 3 juntos; compacta (mobile) <-> larga (desktop)
 *   <Photo kind="prof" who="andre" variant="n" />       individual normalizada 900x1300
 *   <Photo kind="prof" who="walter" variant="pb" />     P&B recortada (proporção original)
 *
 * - `priority`: imagem do LCP (hero) -> loading="eager" + fetchpriority="high" + decoding="sync".
 *   Todas as outras: lazy. Largura/altura sempre declaradas (sem salto de layout).
 * - `sizes`: o que o CSS realmente dá à imagem (padrão 100vw). Informe para o navegador escolher o arquivo certo.
 * - `breakpoint`: largura em que o trio troca de compacta para larga (padrão 768).
 * - Nunca gere pessoa por IA; o alt vem dos nomes da copy.
 */
export type PhotoProps =
  | {
      kind: 'trio'
      layout?: 'auto' | 'compacta' | 'larga' | 'pb'
      breakpoint?: number
      priority?: boolean
      sizes?: string
      alt?: string
      className?: string
    }
  | {
      kind: 'prof'
      who: NightId
      variant?: 'n' | 'pb' | 'recorte'
      priority?: boolean
      sizes?: string
      alt?: string
      className?: string
    }

const trioAlt = () => `Os três professores: ${NIGHT_IDS.map((id) => nightCard(id).prof).join(', ')}`

function Img({ files, sizes, alt, priority, className }: { files: readonly PhotoFile[]; sizes: string; alt: string; priority?: boolean; className?: string }) {
  const last = files[files.length - 1]!
  return (
    <img
      className={['pta-photo', className].filter(Boolean).join(' ')}
      src={last.src}
      srcSet={srcSet(files)}
      sizes={sizes}
      width={last.w}
      height={last.h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
    />
  )
}

export function Photo(props: PhotoProps) {
  const { priority, className } = props
  const sizes = props.sizes ?? '100vw'

  if (props.kind === 'prof') {
    const variant = props.variant ?? 'n'
    const set = PROF[props.who]
    const files: readonly PhotoFile[] = variant === 'n' ? [set.n] : set[variant]
    const alt = props.alt ?? nightCard(props.who).prof
    return <Img files={files} sizes={sizes} alt={alt} priority={priority} className={className} />
  }

  const alt = props.alt ?? trioAlt()
  const layout = props.layout ?? 'auto'
  if (layout === 'compacta') return <Img files={TRIO.compacta} sizes={sizes} alt={alt} priority={priority} className={className} />
  if (layout === 'larga') return <Img files={TRIO.larga} sizes={sizes} alt={alt} priority={priority} className={className} />
  if (layout === 'pb') return <Img files={TRIO.pb} sizes={sizes} alt={alt} priority={priority} className={className} />

  // art direction: compacta no celular, larga a partir de `breakpoint`
  const bp = props.breakpoint ?? 768
  const fallback = TRIO.compacta[TRIO.compacta.length - 1]!
  return (
    <picture>
      <source media={`(min-width: ${bp}px)`} srcSet={srcSet(TRIO.larga)} sizes={sizes} width={TRIO.larga[1].w} height={TRIO.larga[1].h} />
      <img
        className={['pta-photo', className].filter(Boolean).join(' ')}
        src={fallback.src}
        srcSet={srcSet(TRIO.compacta)}
        sizes={sizes}
        width={fallback.w}
        height={fallback.h}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  )
}
