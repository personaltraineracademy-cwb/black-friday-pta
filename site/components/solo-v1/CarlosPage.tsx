import { ButtonCta } from '@/components/ButtonCta'
import { Reveal } from '@/components/Reveal'
import { Movimento } from '@/components/v1/Movimento'
import { config } from '@/lib/config'
import { dataLinha, SOLO } from '@/lib/solo/copy'
import { SoloFold, SoloIntro } from '@/components/solo/SoloFold'
import { Barra } from './Barra'
import { Faq } from './Faq'
import { modalData } from './modal-data'
import { Rodape } from './Rodape'
import { FAQ_TITULO, ROT } from './rotulos'
import { SoloModal } from './SoloModal'
import { Topo } from './Topo'
import { dois, ImgTema, numeroELegenda } from './util'

const ID = 'carlos' as const
const c = SOLO[ID]
const el = (nome: string) => `/img/solo/${ID}/v1/${nome}`

/**
 * CARLOS · Treinamento Feminino (roxo) — v1 SALA DE CONTROLE, "a visão 360º".
 * Ideia da dobra: o retrato dentro do anel de 4 setores (os 4 aspectos da pós: físicos, hormonais, nutricionais,
 * psicológicos); o anel volta, com o "360º", na seção da pós.
 * Composição: dobra ESPELHADA (retrato à esquerda, texto à direita) e seções em PAINÉIS (monitores da sala de controle).
 * Elementos do kit: anel segmentado (halo e "360º") · calendário (a noite 11/11) · pague 1 leve 2 · cartões (ouro).
 */
export function CarlosPage() {
  return (
    <div className="v1 solo solo-carlos">
      <div className="v1-prog" aria-hidden="true" />
      <SoloModal data={modalData(ID, c)} />
      <Topo id={ID} c={c} />
      <Movimento>
        {/* ============ DOBRA (padrão único das individuais: components/solo/SoloFold) ============ */}
        <SoloFold
          prof={ID}
          ver="v1"
          h1={c.hero.h1}
          destaque={c.hero.destaque}
          quando={dataLinha(c)}
          dateTime={config.eventStart}
          alt={c.professor.nome}
          cta={
            <ButtonCta size="lg" arrow={false} noite={ID} origem="hero" id="cta-hero">
              {c.hero.cta}
            </ButtonCta>
          }
        />
        <SoloIntro eyebrow={c.hero.eyebrow} sub={c.hero.sub} selos={c.hero.selos} />

        {/* ============ COMO FUNCIONA (calendário + 3 painéis) ============ */}
        <section className="v1-sec v1-sec--2" id="como" aria-labelledby="h-como">
          <div className="v1-wrap">
            <Reveal className="v1-rot v1-mono s-rot">{ROT.roteiro}</Reveal>
            <h2 id="h-como" className="v1-disp v1-h2" data-linhas>
              {c.como_funciona.titulo}
            </h2>
            <div className="c-como">
              <div className="c-como__cal">
                <ImgTema base={el('calendario')} width={386} height={356} />
              </div>
              <ol className="c-paineis">
                {c.como_funciona.passos.map((p, i) => (
                  <Reveal as="li" index={i} key={p.t} className="c-painel">
                    <div className="c-painel__bar v1-mono">
                      <i className="v1-tally" aria-hidden="true" />
                      <span>{dois(i + 1)}</span>
                    </div>
                    <div className="c-painel__corpo">
                      <h3>{p.t}</h3>
                      <p className="v1-p">{p.d}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ============ O QUE VAI VER AO VIVO (4 telas) ============ */}
        <section className="v1-sec s-inv" id="ao-vivo" aria-labelledby="h-vivo">
          <div className="v1-wrap">
            <Reveal className="v1-rot v1-mono s-rot">{ROT.programacao}</Reveal>
            <h2 id="h-vivo" className="v1-disp v1-h2" data-linhas>
              {c.na_noite.titulo}
            </h2>
            <ol className="c-telas">
              {c.na_noite.itens.map((t, i) => (
                <Reveal as="li" index={i} key={t} className="c-tela">
                  <div className="c-tela__bar v1-mono">
                    <i className="v1-tally" aria-hidden="true" />
                    <span>{dois(i + 1)}</span>
                  </div>
                  <p className="c-tela__t">{t}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ PROFESSOR ============ */}
        <section className="v1-sec v1-sec--2" id="professor" aria-labelledby="h-prof">
          <div className="v1-wrap c-prof">
            <div className="c-prof__nome">
              <Reveal className="v1-rot v1-mono s-rot">{ROT.professor}</Reveal>
              <h2 id="h-prof" className="v1-disp" data-linhas>
                {c.professor.nome}
              </h2>
            </div>
            <Reveal as="p" index={1} className="v1-p c-prof__bio">
              {c.professor.bio}
            </Reveal>
          </div>
        </section>

        {/* ============ A PÓS (anel 360º) ============ */}
        <section className="v1-sec" id="pos" aria-labelledby="h-pos">
          <div className="v1-wrap c-pos">
            <div className="c-pos__l">
              <Reveal className="v1-rot v1-mono s-rot">{ROT.pos}</Reveal>
              <h2 id="h-pos" className="s-pos__h">
                <ImgTema
                  className="c-pos__logo"
                  base="/logos/solo/pos-carlos"
                  alt={c.pos.titulo}
                  width={118}
                  height={31}
                />
              </h2>
              <ImgTema className="c-pos__anel" base={el('anel')} width={300} height={300} />
            </div>
            <ul className="c-pos__lista">
              {c.pos.itens.map((t, i) => (
                <Reveal as="li" key={t} index={i}>
                  <i className="v1-tally" aria-hidden="true" />
                  <span>{t}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ PAGUE 1, LEVE 2 (ouro chapado) ============ */}
        <section className="c-cond" id="condicao" aria-labelledby="h-cond">
          <div className="v1-wrap c-cond__grid">
            <div className="c-cond__txt">
              <Reveal className="v1-rot v1-mono s-rot">{ROT.condicao}</Reveal>
              <h2 id="h-cond" className="v1-disp v1-h2" data-linhas>
                {c.pague1leve2.titulo}
              </h2>
              <Reveal as="p" index={1} className="c-cond__intro">
                {c.pague1leve2.intro}
              </Reveal>
              <Reveal as="ul" index={2} className="c-cond__opcoes">
                {c.pague1leve2.opcoes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </Reveal>
            </div>
            <div className="c-cond__fig">
              <ImgTema base={el('pague-leve')} width={319} height={186} />
            </div>
            <div className="c-cond__notas">
              <Reveal as="p" className="c-cond__nota">
                {c.pague1leve2.nota}
              </Reveal>
              <Reveal as="p" index={1} className="c-cond__pag">
                {c.pague1leve2.pagamento}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ BÔNUS (4 cartões) ============ */}
        <section className="v1-sec" id="bonus" aria-labelledby="h-bonus">
          <div className="v1-wrap">
            <Reveal className="v1-rot v1-mono s-rot">{ROT.bonus}</Reveal>
            <h2 id="h-bonus" className="v1-disp v1-h2" data-linhas>
              {c.bonus.titulo}
            </h2>
            <ul className="c-bonus">
              {c.bonus.itens.map((t, i) => (
                <Reveal as="li" key={t} index={i}>
                  <span className="c-bonus__n v1-mono">{dois(i + 1)}</span>
                  <span className="c-bonus__t">{t}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ PROVA (número + legenda) ============ */}
        <section className="c-prova v1-sec--2" aria-label="Prova">
          <div className="v1-wrap">
            {c.prova.itens.map((linha) => (
              <ul key={linha} className="c-prova__lista">
                {linha.split(' · ').map((parte) => {
                  const { n, legenda } = numeroELegenda(parte)
                  return (
                    <Reveal as="li" key={parte}>
                      {n ? <b className="v1-disp">{n}</b> : null}
                      <span className={n ? 'c-prova__l' : 'c-prova__frase v1-disp'}>{legenda}</span>
                    </Reveal>
                  )
                })}
              </ul>
            ))}
          </div>
        </section>

        {/* ============ FAQ (2 colunas) ============ */}
        <section className="v1-sec c-faq" id="faq" aria-labelledby="h-faq">
          <div className="v1-wrap">
            <Faq c={c} rotulo={ROT.duvidas} titulo={FAQ_TITULO} />
          </div>
        </section>

        {/* ============ FECHO ============ */}
        <section className="v1-final" id="cta-final" aria-labelledby="h-final">
          <span className="v1-corners v1-final__c pta-reveal" aria-hidden="true" />
          <div className="v1-wrap">
            <h2 id="h-final" className="v1-disp" data-linhas>
              {c.cta_final.titulo}
            </h2>
            <Reveal index={1}>
              <ButtonCta size="lg" arrow={false} block tone="ink" noite={ID} origem="final" className="v1-btn-final">
                {c.cta_final.botao}
              </ButtonCta>
            </Reveal>
          </div>
        </section>
      </Movimento>
      <Rodape id={ID} c={c} />
      <Barra id={ID}>{c.barra.botao}</Barra>
    </div>
  )
}
