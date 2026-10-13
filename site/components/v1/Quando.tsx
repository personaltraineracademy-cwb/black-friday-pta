import { Reveal } from '@/components/Reveal'
import { copy } from '@/lib/copy'
import { Contador } from './Contador'
import { dataLinha } from './rotulos'

/** "Quando começa": o relógio honesto (5 estados) + o parágrafo longo da copy + os selos. */
export function Quando() {
  return (
    <section className="v1-sec v1-sec--2" id="quando" aria-label={copy.barra.texto}>
      <div className="v1-wrap v1-quando">
        <Reveal className="v1-quando__tc">
          <Contador rotuloEstatico={dataLinha()} fraseEstatica={copy.barra.texto} />
        </Reveal>
        <div className="v1-quando__txt">
          <Reveal as="p" index={1} className="v1-p">
            {copy.hero.sub}
          </Reveal>
          <div className="v1-selos v1-mono">
            {copy.hero.selos.map((s, i) => (
              <Reveal as="span" key={s} index={i + 2}>
                {s}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
