# v1 · Sala de controle — porte para Next.js (decisões)

Data: 10/10/2026. Origem: `paginas/v1/index.html` (aprovada no desenho, 4 rodadas). Destino: `app/v1`, `components/v1`,
`public/img/v1` (só estes três voltam para o projeto principal). Arquétipo A (transmissão), logo C·REC.

## 1. O que foi portado

| Arquivo | Papel |
|---|---|
| `app/v1/page.tsx` | monta a página; metadados (`title` absoluto = linha de data da copy) |
| `app/v1/v1.css` | TODO o CSS da versão, escopado em `.v1` (sem camada: ganha da base sem `!important`) |
| `components/v1/Header · Hero · Quando · Roteiro · Noites · Condicao · Bonus · PorQuePta · Faq · CtaFinal · Footer` | seções (servidor, 0 JS) |
| `components/v1/Contador.tsx` (cliente) | relógio da sala de controle: ponto REC + timecode do estado real |
| `components/v1/Monitor.tsx` (cliente) | casca de cada monitor: sinal (sem sinal → sintoniza) e tally ao vivo |
| `components/v1/Movimento.tsx` (cliente) | `<main>` + revelação por linha dos títulos (SplitText) |
| `components/v1/StickyBar.tsx` (cliente) | barra fixa do celular (variante da `StickyCta`: some no fecho) |
| `components/v1/rotulos.ts`, `unidades.ts` | rótulos neutros e funções que derivam a forma da copy |

Usa da base, sem alterar: `ButtonCta` (todos os CTAs; abrem o pop-up compartilhado), `Logo` (cabeçalho inline; rodapé
`mode="img"`), `Photo` (trio do hero, `priority` = LCP), `Reveal`, `LeadModal`, `lib/event` + `use-event-state`,
`lib/ui-text`, `lib/copy`. Componentes **não** reaproveitados e por quê: `Countdown` (visual de cartão; o desenho aprovado
é timecode em linha), `Accordion` (o verificador conta a resposta fechada como bloco de tela; marcação própria com
`<details>` e a mesma animação `::details-content`), `StickyCta` (não sabe sumir no fecho), `Marquee`/`Grain` (a v1
aprovada não usa: restrição).

### Texto
Só `lib/copy.ts` e `lib/ui-text.ts`. Rótulos neutros que a copy não tem ficam em `components/v1/rotulos.ts`
(indexadores "(01) Roteiro"…, "Perguntas frequentes", "Antes", "Pós", unidades Dias/Horas/Min/Seg). Derivados da copy:
linha de data da dobra (barra sem o nome da campanha), números "1"/"2" da condição, número + legenda do "Por que a PTA",
horas das noites (de `NEXT_PUBLIC_EVENT_START`), "20h30 – 22h30".
Removido em relação ao HTML: o texto "Sem sinal" do monitor (dura < 0,6 s; vira só barras de teste).

## 2. Diferenças em relação ao HTML aprovado (e por quê)

| # | Diferença | Motivo |
|---|---|---|
| 1 | **H1 tem "DO"**: "…FÍSICA DO JÁ COMEÇOU!" (o HTML aprovado tinha "FÍSICA JÁ COMEÇOU!") | a copy final (`pagina-mae.copy.json`) tem "DO"; regra do porte: copy só de `lib/copy.ts`. A v2 já registrou que o "DO" parece sobra (decisão da cliente). **Se for erro de digitação, corrigir no JSON (1 lugar).** |
| 2 | H1 ≈ 6% menor no celular (37,6 px em vez de 40) e ≈ 3% no desktop (69 px em vez de 72 em 1440) | com o "DO" a 3ª linha cresce 11%; a fonte é medida pela coluna (`11cqi`) para manter as **3 linhas** do desenho (`A MAIOR BLACK / FRIDAY DA EDUCAÇÃO / FÍSICA DO JÁ COMEÇOU!`). Sem isso quebrava em 4 linhas e empurrava o CTA para y=697 (aviso do verificador) |
| 3 | Corpo em Archivo **500** (o HTML usava 400) | a base só embarca Archivo 500–800 variável (subconjunto de 27 KB); 500 é o "peso de leitura" da base |
| 4 | Rótulo do relógio: "Falta para a noite 1" (era "Começa em 30 dias"); "Ao vivo agora · noite 2" (era "…de 3"); "Próxima: noite 3" (era "Noite 2 encerrada · noite 3 amanhã") | texto vem de `lib/ui-text.ts` (regra do porte); o conteúdo dos 5 estados é o mesmo |
| 5 | Barra fixa do celular com 64 px (era 72) e some também no fecho (já sumia no original) | usa as classes `.pta-sticky` da base |
| 6 | Rodapé: logo `<img>` (arquivo SVG da base, mesma arte, caixa de recorte mais justa: ~6 px mais baixa) | tira ~11 KB do HTML e uma árvore SVG do layout (o rodapé está abaixo da dobra) |
| 7 | Grão: véu fixo da base a 22% (a base usa 80% de um tile de 128 px; o HTML tinha 20% de um tile de 192 px) | `body:has(.v1)::after` em `v1.css` (só esta rota); olho a olho igual ao aprovado |
| 8 | Retratos das noites: `<img>` lazy com `object-fit: cover` (era `background-image`) | semântica e `loading=lazy`; alt vazio (o nome já está no `<h3>`) |
| 9 | Fio do topo de cada passo é um elemento (não `border-top`) | para poder se desenhar; `padding-top: 33` mantém a altura idêntica |

Tudo o mais foi medido contra o aprovado (Playwright, mesmas larguras, `.rev` do HTML aprovado sem a translação inicial):
em 768, 1024 e 1440 seções, títulos, botões e imagens coincidem com |Δ| ≤ 1 px, exceto o H1 (item 2: ±4–7 px no
desktop, porque o bloco de texto é centrado na altura) e o rodapé (item 6, −6 px). Em 390 tudo desce 17 px por causa do
H1 (item 2) e a seção "condição" tem +0,8 px (subpixel, não rastreado). Altura total: 390 −22 px · 768 −6 px ·
1024 −7 px · 1440 −6 px.

## 3. Movimento (arquétipo: transmissão) — um efeito principal por tela

Tudo só `transform`/`opacity`; curva da marca; nada pisca > 3×/s; nada infinito; `prefers-reduced-motion` desliga
tudo (medido: `document.getAnimations()` = 0). Sem JS ou sem `animation-timeline`, o conteúdo final já está no lugar.

| Tela | Efeito | Significado | Como |
|---|---|---|---|
| Dobra | cantoneiras do visor "travam foco" (entram de fora, passam 1,5% e assentam; 0,65 s, uma vez) | a câmera enquadra o trio: "você está na transmissão" | CSS `@keyframes` em `.v1-trio::after`. Foto e H1 (LCP) não animam |
| Quando | ponto ● REC + timecode com o estado REAL | a página sabe se está no ar: ao vivo o ponto toma a cor da noite e pisca 5× (WCAG 2.2.2) e fica fixo | `useEventState` (1 Hz), 5 estados, `?agora=` |
| Roteiro | numerais 01/02/03 sobem de uma janela, o fio do topo se desenha, em sequência | "uma ordem": 1, 2, 3 | CSS `view()` (0 JS) |
| Noites | monitores nascem "sem sinal" (barras de teste + chuvisco fixo) e **sintonizam** ao entrar (barras colapsam numa linha, retrato aparece), escalonados 120 ms; o tally da noite no ar pisca 5× | cada noite é um canal da sala de controle | `Monitor` (IO + `data-fase`) + CSS |
| Condição | o "1" sobe e, depois, o "2" | a ordem do movimento é a ordem da oferta | CSS `view()` |
| Bônus | cada "visto" aparece com a linha | confirmação | CSS `view()` (o ícone vai num invólucro: a rotação do `✓` não se perde) |
| Fecho | cantoneiras pretas fecham o quadro ao entrar (scrub) | repete o gesto da dobra: "no ar" | CSS `view()` |
| Todas abaixo da dobra | título revelado **por linha** (0,7 s, 70 ms entre linhas) | entrada padrão | SplitText via `loadGsap` em idle, depois de `fonts.ready`; desfaz (revert) ao terminar |
| Página | barra de leitura de 2 px no topo | progresso | CSS `scroll()` |
| Botões | hover −2 px + sombra 6 px; pressionado +3 px; foco 3 px ouro a 4 px | resposta ao toque | base `.pta-btn` + `--sh`/`--btn-radius` da v1 |

Salvaguardas do SplitText (achadas ao testar): (a) palavras em `inline-block` perdem o kerning e o título de 768 px
quebrava numa linha a mais (+48 px) → o título dividido precisa ter a MESMA altura do natural; se não tiver, desfaz e só
sobe o bloco; (b) a janela de revelação tem folga de 0,2 em (til/acento não corta; regra 15 da pesquisa 19) e o título é
`display: flow-root` para a margem negativa não vazar; (c) títulos já visíveis na carga não são divididos (sem piscar).

Elementos animados por rolagem levam a classe `pta-reveal` e sobrescrevem só a animação: a base (RevealObserver, reserva
sem `view()`) e o verificador (`check_pagina.py` desliga `.pta-reveal` na captura de página inteira) sabem lidar com ela.

**Lenis: não ligado.** Âncoras e leitura em primeiro lugar; o arquétipo A é restrição. (`NEXT_PUBLIC_SMOOTH_SCROLL=1`
continua funcionando se a cliente pedir.)

## 4. Orçamento medido (`npm run size`, build de produção)

| Item | Limite | v1 | Base (v2 esqueleto) |
|---|---|---|---|
| JS inicial (gzip) | ≤ 150 KB | **137,9 KB** | 134,6 KB |
| CSS (gzip) | ≤ 40 KB | **11,7 KB** | 7,4 KB |
| HTML (bruto / gzip) | ≤ 120 KB | **76,7 KB / 20,5 KB** | 52 KB / 9,7 KB |
| GSAP (sob demanda, em idle) | — | 26,5 + 17,0 + 3,3 = **46,8 KB** gzip, 3 chunks | igual |
| Fontes pré-carregadas | — | 45,2 KB (as da base) | igual |
| Retratos (lazy) | ≤ 220 KB (hero) | 52–55 KB cada; trio do hero 76 KB (1100 px) / 39 KB (640 px) | — |

LCP = `IMG.pta-photo` (trio), `fetchpriority=high`, 212 ms no desktop; 1,4–1,6 s em celular simulado (CPU 4×, rede
1,6 Mbps/150 ms). CLS = 0 (10 cargas e rolagem completa). Sem rolagem horizontal em 390/768/1024/1440.
Tarefa longa de ~650 ms em CPU 4× é parse + 1º layout da página (214 ms de `Layout`), não JS: a v1 é mais longa que o
esqueleto. Mitigação aplicada: logo do rodapé em `<img>` (−23 KB de HTML).

## 5. Verificação executada

- `npm run typecheck`, `npm run lint`, `npm run build`: sem erros.
- `check_pagina.py` em `/v1/`: **0 erros · 1 aviso** (o mesmo, justificado, do HTML aprovado: 768 px, hero com respiro
  40/112 px — o cabeçalho é sticky e em fluxo; 112 empurraria o CTA abaixo de 92%). Também com
  `NEXT_PUBLIC_BASE_PATH=black` (servido em `/black/v1/`): 0 erros, mesmo aviso; imagens, JS e fontes com o prefixo.
- Pop-up em 390 e 1440: abre só por clique/Enter, foco no título, Tab preso, ESC fecha e devolve o foco a `#cta-hero`,
  erros inline ("Erro: Digite seu nome." / telefone), sucesso ("Você está dentro."), sem erro no console.
- Relógio com `?agora=` nos 5 estados (antes · hoje · ao vivo noite 2 · entre noites · encerrado) em 390 e 1440:
  rótulo, dígitos/unidades, ponto REC e tally corretos; "Congelar" some no encerrado.
- Reduzido (`prefers-reduced-motion`): 0 animações, retratos visíveis, títulos inteiros. Sem JS: todo o texto e os CTAs
  presentes (o relógio mostra a linha de data e o espaço reservado).
- Nenhum texto fora de `copy`/`ui-text`/`rotulos` na página (varredura dos nós de texto).

## 6. O que ainda considero imperfeito

- **H1 com "DO"** (item 2): é decisão da cliente; a fonte menor é o custo de manter as 3 linhas.
- **Safari/iOS e Firefox não testados** em aparelho: `view()`, `::details-content`, `text-box` e `@starting-style`
  degradam sem quebrar (numerais/fios ficam parados no lugar; Firefox usa a reserva por IntersectionObserver da base),
  mas não foram vistos.
- **Contador usa o relógio do aparelho** (como no desenho); em produção, hora do servidor se a cliente exigir.
- O verificador não "vê" a sintonia nem a revelação por linha (são estados transitórios): conferidas por quadros
  capturados à mão (`_check/frames-monitor.png`, `frames-hero.png`).
- `Layout` do 1º quadro (~54 ms em CPU normal) cresceu com a página longa e 8 grades; se o TBT em aparelho de entrada
  for problema, o próximo corte é `content-visibility: auto` nas seções abaixo da dobra (não aplicado: mudaria alturas
  medidas pelo verificador e a barra de rolagem).
- Estado "encerrado": ao hidratar, o bloco de dígitos some e a seção encolhe (salto de layout só depois do evento).
- `next.config.ts` do `site-v1` tem `turbopack.root` por causa da junção `node_modules`; **não** voltar para o projeto.
