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
import { dois, ImgTema } from './util'

const ID = 'andre' as const
const c = SOLO[ID]
const el = (nome: string) => `/img/solo/${ID}/v1/${nome}`

/**
 * ANDRÉ · Biomecânica (azul) — v1 SALA DE CONTROLE, "o ângulo certo".
 * Ideia da dobra: o retrato dentro do visor, com o goniômetro (o instrumento do assunto) atrás da pessoa.
 * Composição: duas colunas, EIXO vertical (título à esquerda, conteúdo à direita) em todas as seções.
 * Elementos do kit: goniômetro (dobra) · prumo (professor) · planos anatômicos (pós) · pague 1 leve 2 · blocos (ouro).
 */
export function AndrePage() {
  return (
    <div className="v1 solo solo-andre">
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

        {/* ============ COMO FUNCIONA (eixo) ============ */}
        <section className="v1-sec v1-sec--grade s-eixo" id="como" aria-labelledby="h-como">
          <div className="v1-wrap s-eixo__grid">
            <div className="s-eixo__l">
              <Reveal className="v1-rot v1-mono s-rot">{ROT.roteiro}</Reveal>
              <h2 id="h-como" className="v1-disp v1-h2" data-linhas>
                {c.como_funciona.titulo}
              </h2>
            </div>
            <span className="s-eixo__fio" aria-hidden="true" />
            <ol className="s-eixo__r v1-passos s-passos">
              {c.como_funciona.passos.map((p, i) => (
                <Reveal as="li" index={i} key={p.t} className="v1-passo">
                  <span className="v1-passo__fio pta-reveal" aria-hidden="true" />
                  <span className="v1-passo__mask" aria-hidden="true">
                    <span className="v1-passo__n v1-disp pta-reveal">{dois(i + 1)}</span>
                  </span>
                  <h3>{p.t}</h3>
                  <p className="v1-p">{p.d}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ O QUE VAI VER AO VIVO ============ */}
        <section className="v1-sec v1-sec--2 s-eixo s-inv" id="ao-vivo" aria-labelledby="h-vivo">
          <div className="v1-wrap s-eixo__grid">
            <div className="s-eixo__l">
              <Reveal className="v1-rot v1-mono s-rot">{ROT.programacao}</Reveal>
              <h2 id="h-vivo" className="v1-disp v1-h2" data-linhas>
                {c.na_noite.titulo}
              </h2>
            </div>
            <span className="s-eixo__fio" aria-hidden="true" />
            <ol className="s-eixo__r s-quatro">
              {c.na_noite.itens.map((t, i) => (
                <Reveal as="li" index={i} key={t}>
                  <span className="s-quatro__n v1-mono">{dois(i + 1)}</span>
                  <span className="s-quatro__t">{t}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ PROFESSOR (o prumo) ============ */}
        <section className="v1-sec" id="professor" aria-labelledby="h-prof">
          <div className="v1-wrap">
            <Reveal className="v1-rot v1-mono s-rot">{ROT.professor}</Reveal>
          </div>
          <div className="v1-wrap s-eixo__grid s-prof">
            <div className="s-eixo__l s-prof__l">
              <ImgTema className="s-prof__prumo" base={el('prumo')} width={77} height={346} />
            </div>
            <span className="s-eixo__fio" aria-hidden="true" />
            <div className="s-eixo__r">
              <h2 id="h-prof" className="v1-disp s-prof__nome" data-linhas>
                {c.professor.nome}
              </h2>
              <Reveal as="p" index={1} className="v1-p s-prof__bio">
                {c.professor.bio}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ A PÓS (planos anatômicos) ============ */}
        <section className="v1-sec v1-sec--2 s-eixo" id="pos" aria-labelledby="h-pos">
          <div className="v1-wrap s-eixo__grid">
            <div className="s-eixo__l">
              <Reveal className="v1-rot v1-mono s-rot">{ROT.pos}</Reveal>
              {/* o título da pós é a própria logo oficial da pós (alt = título da copy): sem texto repetido na tela */}
              <h2 id="h-pos" className="s-pos__h">
                <ImgTema
                  className="s-pos__logo"
                  base="/logos/solo/pos-andre"
                  alt={c.pos.titulo}
                  width={915}
                  height={146}
                />
              </h2>
            </div>
            <span className="s-eixo__fio" aria-hidden="true" />
            <div className="s-eixo__r">
              <ul className="v1-check s-lista">
                {c.pos.itens.map((t, i) => (
                  <Reveal as="li" key={t} index={i}>
                    <span className="v1-chk-w pta-reveal" aria-hidden="true">
                      <span className="v1-chk" />
                    </span>
                    <span className="v1-t s-t">{t}</span>
                  </Reveal>
                ))}
              </ul>
              <ImgTema className="s-pos__planos" base={el('planos')} width={454} height={291} />
            </div>
          </div>
        </section>

        {/* ============ PAGUE 1, LEVE 2 (dourado) ============ */}
        <section className="s-cond" id="condicao" aria-labelledby="h-cond">
          <div className="v1-wrap s-cond__grid">
            <div className="s-cond__txt">
              <Reveal className="v1-rot v1-mono s-rot">{ROT.condicao}</Reveal>
              <h2 id="h-cond" className="v1-disp v1-h2 s-cond__h" data-linhas>
                {c.pague1leve2.titulo}
              </h2>
              <Reveal as="p" index={1} className="s-cond__intro">
                {c.pague1leve2.intro}
              </Reveal>
              <Reveal as="ul" index={2} className="s-cond__opcoes">
                {c.pague1leve2.opcoes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </Reveal>
            </div>
            <div className="s-cond__fig">
              <ImgTema base={el('pague-leve')} width={288} height={244} />
            </div>
            <div className="s-cond__notas">
              <Reveal as="p" className="s-cond__nota">
                {c.pague1leve2.nota}
              </Reveal>
              <Reveal as="p" index={1} className="s-cond__pag">
                {c.pague1leve2.pagamento}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ BÔNUS ============ */}
        <section className="v1-sec" id="bonus" aria-labelledby="h-bonus">
          <div className="v1-wrap v1-bonus">
            <div className="v1-bonus__h">
              <Reveal className="v1-rot v1-mono s-rot">{ROT.bonus}</Reveal>
              <h2 id="h-bonus" className="v1-disp v1-h2" data-linhas>
                {c.bonus.titulo}
              </h2>
            </div>
            <ul className="v1-check">
              {c.bonus.itens.map((t, i) => (
                <Reveal as="li" key={t} index={i}>
                  <span className="v1-chk-w pta-reveal" aria-hidden="true">
                    <span className="v1-chk" />
                  </span>
                  <span className="v1-t">{t}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ PROVA ============ */}
        <section className="s-prova" aria-label="Prova">
          <div className="v1-wrap">
            {c.prova.itens.map((t) => (
              <Reveal as="p" key={t} className="s-prova__t v1-disp">
                {t}
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="v1-sec v1-sec--2" id="faq" aria-labelledby="h-faq">
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
