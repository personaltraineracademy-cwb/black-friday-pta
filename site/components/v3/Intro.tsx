import { Reveal } from '@/components/Reveal'
import { copy } from '@/lib/copy'

/** Enunciado: o apoio longo do hero (copy.hero.sub), sozinho numa tela. */
export function Intro() {
  return (
    <section className="sec enun" id="enunciado" aria-label={copy.hero.destaque}>
      <div className="wrap">
        <Reveal as="p">{copy.hero.sub}</Reveal>
      </div>
    </section>
  )
}
