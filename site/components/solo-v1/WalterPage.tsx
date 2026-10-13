import { ButtonCta } from '@/components/ButtonCta'
import { Photo } from '@/components/Photo'
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

const ID = 'walter' as const
const c = SOLO[ID]
const el = (nome: string) => `/img/solo/${ID}/v1/${nome}`

/**
 * WALTER · Bodybuilding e Estética Corporal (vermelho) — v1 SALA DE CONTROLE, "a barra carregada".
 * Ideia da dobra: o retrato centrado de pé sobre o "chão do palco", a barra com as anilhas atravessando atrás dos ombros.
 * Composição: UM EIXO CENTRAL (tudo centrado), fio grosso de documento, régua (fita métrica) no "Como funciona".
 * Elementos do kit: barra · fita métrica · anilha · pague 1 leve 2 · barras (ouro).
 */
export function WalterPage() {
  return (
    <div className="v1 solo solo-walter">
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

        {/* ============ COMO FUNCIONA (a régua) ============ */}
        <section className="v1-sec v1-sec--2 w-como" id="como" aria-labelledby="h-como">
          <div className="v1-wrap">
            <Reveal className="v1-rot v1-mono s-rot w-rot">{ROT.roteiro}</Reveal>
            <h2 id="h-como" className="v1-disp v1-h2 w-h2" data-linhas>
              {c.como_funciona.titulo}
            </h2>
            <ImgTema className="w-fita" base={el('fita')} width={910} height={53} />
            <ol className="w-passos">
              {c.como_funciona.passos.map((p, i) => (
                <Reveal as="li" index={i} key={p.t} className="w-passo">
                  <span className="w-passo__n v1-disp">{dois(i + 1)}</span>
                  <h3>{p.t}</h3>
                  <p className="v1-p">{p.d}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ O QUE VAI VER AO VIVO (ficha) ============ */}
        <section className="v1-sec w-vivo" id="ao-vivo" aria-labelledby="h-vivo">
          <div className="v1-wrap">
            <Reveal className="v1-rot v1-mono s-rot w-rot">{ROT.programacao}</Reveal>
            <h2 id="h-vivo" className="v1-disp v1-h2 w-h2" data-linhas>
              {c.na_noite.titulo}
            </h2>
            <ol className="w-ficha">
              {c.na_noite.itens.map((t, i) => (
                <Reveal as="li" index={i} key={t}>
                  <span className="w-ficha__n v1-disp">{i + 1}</span>
                  <span className="w-ficha__t">{t}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ PROFESSOR (palco vermelho) ============ */}
        <section className="v1-sec w-prof s-inv" id="professor" aria-labelledby="h-prof">
          <div className="v1-wrap w-prof__grid">
            <div className="w-prof__foto">
              <Photo kind="prof" who={ID} variant="recorte" sizes="(min-width: 1024px) 460px, 90vw" className="w-prof__img" />
            </div>
            <div className="w-prof__txt">
              <Reveal className="v1-rot v1-mono s-rot">{ROT.professor}</Reveal>
              <h2 id="h-prof" className="v1-disp w-prof__nome" data-linhas>
                {c.professor.nome}
              </h2>
              <Reveal as="p" index={1} className="v1-p w-prof__bio">
                {c.professor.bio}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ A PÓS (a anilha) ============ */}
        <section className="v1-sec v1-sec--2 w-pos" id="pos" aria-labelledby="h-pos">
          <div className="v1-wrap w-pos__grid">
            <div className="w-pos__cab">
              <Reveal className="v1-rot v1-mono s-rot">{ROT.pos}</Reveal>
              {/* o título da pós é a logo oficial da pós (alt = título da copy), sobre a tarja reta da campanha */}
              <h2 id="h-pos" className="w-pos__h">
                <span className="w-pos__tarja s-inv">
                  <ImgTema base="/logos/solo/pos-walter" alt={c.pos.titulo} width={807} height={217} className="w-pos__logo" />
                </span>
              </h2>
            </div>
            <ul className="w-pos__lista">
              {c.pos.itens.map((t, i) => (
                <Reveal as="li" key={t} index={i}>
                  <span className="w-pos__i v1-mono">{dois(i + 1)}</span>
                  <span className="w-pos__t">{t}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ PAGUE 1, LEVE 2 (dourado) ============ */}
        <section className="s-cond s-cond--c" id="condicao" aria-labelledby="h-cond">
          <div className="v1-wrap s-cond__c">
            <Reveal className="v1-rot v1-mono s-rot w-rot">{ROT.condicao}</Reveal>
            <h2 id="h-cond" className="v1-disp v1-h2 s-cond__h" data-linhas>
              {c.pague1leve2.titulo}
            </h2>
            <div className="s-cond__fig">
              <ImgTema base={el('pague-leve')} width={451} height={89} />
            </div>
            <Reveal as="p" index={1} className="s-cond__intro">
              {c.pague1leve2.intro}
            </Reveal>
            <Reveal as="ul" index={2} className="s-cond__opcoes s-cond__opcoes--linha">
              {c.pague1leve2.opcoes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </Reveal>
            <div className="s-cond__notas s-cond__notas--c">
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
        <section className="v1-sec w-bonus" id="bonus" aria-labelledby="h-bonus">
          <div className="v1-wrap">
            <Reveal className="v1-rot v1-mono s-rot w-rot">{ROT.bonus}</Reveal>
            <h2 id="h-bonus" className="v1-disp v1-h2 w-h2" data-linhas>
              {c.bonus.titulo}
            </h2>
            <ul className="w-bonus__grid">
              {c.bonus.itens.map((t, i) => (
                <Reveal as="li" key={t} index={i}>
                  <span className="w-bonus__n v1-mono">{dois(i + 1)}</span>
                  <span className="w-bonus__t">{t}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ PROVA (faixa vermelha) ============ */}
        <section className="w-prova" aria-label="Prova">
          <div className="v1-wrap">
            {c.prova.itens.map((t) => (
              <Reveal as="p" key={t} className="w-prova__t v1-disp">
                {t}
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="v1-sec v1-sec--2 w-faq" id="faq" aria-labelledby="h-faq">
          <div className="v1-wrap">
            <Faq c={c} rotulo={ROT.duvidas} titulo={FAQ_TITULO} />
          </div>
        </section>

        {/* ============ FECHO (centrado) ============ */}
        <section className="v1-final w-final" id="cta-final" aria-labelledby="h-final">
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
