# v1 · Sala de controle — polimento (rodada 8, 11/10/2026)

Ela disse "a V1 ficou perfeita" (desktop e mobile). **A composição não mudou.** Esta rodada zera o que o verificador novo
acusa (e que ela veria com a barra de rolagem de 15 px), aplica a lista única de auditoria e dá à página uma
**linguagem de movimento** (modo `total` · `suave` · `parado`). Arquivos tocados: `app/v1/v1.css`,
`components/v1/{Hero,Quando,Noites,Monitor,Contador,Movimento,Bonus,Faq,PorQuePta}.tsx`, novo `components/v1/Contagem.tsx`
e este documento. Nenhum arquivo compartilhado foi alterado.

## 1. O que o verificador acusou → causa → o que mudou

| Aviso / defeito | Causa medida | Mudança |
|---|---|---|
| `article.v1-mon` com margem 24 × **10,7 px** (360) e botão 48 × 34,7 | a trilha `1fr` = `minmax(auto,1fr)`: a barra `NOITE 1 · SEG 9/11 · 20H30` (nowrap, 244 px) alargava a coluna 13 px | `grid-template-columns: minmax(0,1fr)` + `min-width:0` no cartão; barra do monitor com **2 linhas** quando o cartão tem < 336 px (container query) e sem entreletra em ≤ 400 px |
| Mesmo defeito, mais escondido, em **1024–1279**: a barra do cartão 2 e 3 saía do cartão ("20H3(") | idem (cartão de 272 px, barra de 332) | idem (a barra vira "NOITE n" + "SEG 9/11 · 20H30" embaixo, alinhada ao texto) |
| Botão "Quero entrar no grupo da Black" em **2 linhas** na vista 390-barra | coluna de 327 px: rótulo de ≈ 265 px + `padding-inline` 30 + borda | `padding-inline: 20px` em `.pta-btn--lg` ≤ 479 px; `white-space: nowrap` em todo botão da v1 |
| "Quero esta noite" em 2 linhas em **1024** | coluna do botão 152 px × rótulo 153 px | `padding-inline: 16px` + nowrap no botão do cartão |
| "quase alinhado" a 1024 (botão 481 × títulos 492) | botão `min(100%, 420px)` numa coluna de 431 px | de 1024 a 1199 o botão ocupa a coluna inteira (borda direita = a do H1); ≥ 1200 continua 420 |
| 768: vãos 12·24·40·**52**·**72** | (72) a linha de data era `<div>`, invisível para a régua: destaque → CTA lia 72 = 12+20+40; (52) botão do cabeçalho → foto | a data virou `<time datetime=…>` (a mesma linha, semântica melhor): vãos reais 12 · 24 · 40 |
| 768: respiro do hero 40/112 | `padding-block: 40px 112px` | `112px` em cima e embaixo (o mesmo do desktop); CTA termina em y 914 (< 92%) |
| 768: cartões 40 × **168** | `max-width: 560px` à esquerda numa coluna de 688 | cartão **horizontal** (barra em cima, retrato à esquerda, texto à direita) na largura da coluna: 40 × 40 |
| Trio / cantoneiras assimétricos (mobile) | tinta deslocada no arquivo (corrigida na base) | **conferido medindo a tinta renderizada**: ver §3, item 2 |
| (achado) "MEC" sozinho na linha de baixo (selos e ficha), "2." sozinho no destaque (390-barra), "online" / "(na" sozinhos nos bônus | quebra de linha natural | selos 1 por linha; `text-wrap: balance` em ficha, destaque e bônus |
| (achado) dígitos do timecode empilhados depois de virarem nós separados | `b` deixou de ser uma palavra só | `white-space: nowrap` no `b` |
| (achado) janela do título por linha **não** protegia o acento | o SplitText nomeia a janela `v1-lin-mask`; o CSS falava de `v1-mask` | CSS na classe certa; folga só em cima (com folga embaixo as margens colapsam e o título cresce); a linha começa em 135% (o acento também entra escondido) |

## 2. Linguagem de movimento (uma ideia: **enquadrar / sintonizar**)

Uma curva (`--ease-marca`), três tempos (0,32 · 0,55 · 0,7 s), só `transform`/`opacity`/`clip-path`, uma vez por entrada.
Tudo repete o gesto do visor da dobra: *algo chega fora de foco e trava*.

| Momento | O que acontece | Onde |
|---|---|---|
| **Travar foco** | as 4 cantoneiras entram 8% maiores, passam do ponto e assentam | dobra (carga), fecho (ao entrar), e **de novo no hover do monitor** (na cor da noite) |
| **Sintonizar** *(refinado)* | o monitor nasce em barras de teste + chuvisco, as barras colapsam numa linha e **o retrato abre dessa linha** (clip-path), escalonado 120 ms | 3 monitores |
| **Timecode vivo** *(novo)* | cada dígito que muda "vira" (sobe 34% e acende); o REC pisca 5× ao vivo e fica fixo; antes do ar o anel "respira" 2× | relógio |
| **Janela** | título por linha, numerais 01·02·03, "1" e "2", fios se desenhando | seções |
| **Grade da mesa de corte** *(novo)* | a grade do "Como funciona" acende em ouro sob o cursor (ponteiro fino) | seção Roteiro |
| **Monitor sob o ponteiro** *(novo)* | sobe 4 px, inclina ≤ 2,5° para o ponteiro, a "câmera" aproxima 3,5%, o tally acende | 3 monitores |
| **Prova que conta** *(novo, no lugar da faixa)* | "+10.000" e "6" contam até o valor (0,9 s); selos entram em sequência | Por que a PTA · Quando |
| Pacote comum | barra de leitura de 2 px · listas escalonadas (selos, bônus, ficha, FAQ) · seta do botão do cartão entra no hover/foco · `+`/FAQ | página |

Nunca: H1, foto do LCP, CTA principal (só o hover de 2 px da base).

### Os três modos (`<html data-movimento>`; política de 11/10)

| Modo | Quando | Como a v1 se comporta |
|---|---|---|
| `total` | padrão | tudo acima |
| `suave` | o sistema pede menos movimento (**o Windows dela**) | a MESMA coreografia, variáveis `--v1-k` 0,6 · `--v1-sobe` 28% · `--v1-esc` 1,03 · `--v1-tick` −14%: distâncias ≤ 12 px, tempos ×0,6, sem inclinação nem zoom, REC pisca 3× |
| `parado` | só `?movimento=parado` | nenhuma animação (duração 1 ms), retratos e títulos inteiros, barra de leitura oculta |

Verificado: `total` e `suave` carregam as mesmas 59 animações (`getAnimations()`), `parado` não anima; contagem, sintonia
e revelação por linha rodam nos dois primeiros. O verificador (que roda com `reduce` ligado = `suave`) passa com 0 erros.

## 3. Lista única de auditoria → como ficou na v1 → evidência

| # | Item | Como ficou | Evidência |
|---|---|---|---|
| 1 | Margens esquerda = direita; nada 10–40 px fora da coluna; zero `100vw` | verificador: **0 avisos de margem** em 360 · 390 · 390-barra · 768 · 1024 · 1440 (antes: 4); nenhum `100vw` em CSS (só `sizes` do `<img>`) | `_check/r3/_relatorio.json`; `_check/polimento/*_folha*.png` (telas rolando de verdade, com barra) |
| 2 | Foto recortada centrada pela tinta; harmonia | tinta do trio **renderizada** (limiar 38/255), esquerda × direita dentro da moldura: 360 **10/9** · 390 **11/10** · 390-barra **11/9** · 768 **15/13** · 1024 **14/12** · 1440 **19/17** px (≤ 2 px; o resto é o degradê do braço) | medida por captura do `.v1-trio` sem a cantoneira |
| 3 | Nenhum bloco "solto" | fundos de borda a borda (Quando, Roteiro, Condição, Por que, Fecho); cartões nascem das 3 colunas do grid; **no tablet o cartão deixou de ser um bloco de 560 px à esquerda** | `768_folha02.png` |
| 4 | Bloco final com UMA ideia | fecho = título + 1 CTA em ouro chapado + cantoneiras; sem textura, sem numerais; mantido | `1440_folha09.png`, `360_folha04.png` |
| 5 | Faixa/selos | a v1 não tem faixa (arquétipo A). Elemento equivalente de prova: **selos em sequência + "+10.000"/"6" que contam** + timecode vivo. Em `suave` a contagem dura 0,6 s; em `parado` o texto final já está lá | `contagem` medida: +0 → +3.321 → +6.173 → … → +10.000 |
| 6 | Pacote comum | títulos por linha (acento preservado) · seta/botão com micro-interação · dígitos · hover leve com tilt ≤ 2,5° · barra de leitura · retrato que **abre por clip-path** · listas escalonadas · 3 momentos assinatura (§2) | `sintonia-total-1024.png`, `hover-total.png`, `btn-total.png`, `titulo-360.png` |
| 7 | Grão suave | `--grao-op: .22` só na v1 (o desenho aprovado usava 20%; o padrão da base é .55, escuro .38): não aparece em fotos nem em faixas; conferido em 100% | folhas |
| 8 | Detalhes | rótulos de botão em 1 linha em **todas** as 6 vistas (antes 5 erros); alvos ≥ 44 px; números tabulares (relógio, contagem); nada cortado (barra do monitor); vãos da dobra 12·24·40 | `_relatorio.json` |
| 9 | Movimento reduzido | página completa e bonita no modo `suave` (animada, curta) e inteira no `parado`; verificador sem texto invisível/cortado | `_check/r3/*-reduzido.png` |

## 4. Verificação executada

- `npm run typecheck`, `lint`, `test` (12/12), `build`: sem erro. **JS inicial /v1 = 138,5 KB gzip** (limite 150; antes 137,9)
  · CSS 11,9 KB · HTML 80,4 KB (21,2 KB gzip) · GSAP segue sob demanda.
- `check_pagina.py` (6 vistas + passagem reduzida): **0 erros**; avisos (justificados abaixo).
- Pop-up em 390 e 1440: abre por Enter, foco no título, Tab circula (o dialog nativo passa uma vez pelo navegador), ESC fecha
  e devolve o foco a `#cta-hero`; sem erro de console.
- Relógio (`?agora=`): antes · hoje · ao vivo noite 2 (tally e REC) · entre noites · encerrado — rótulo, dígitos e unidades certos.
- Raiz e subpasta (`NEXT_PUBLIC_BASE_PATH=black`, servido em `/black/v1/`): 0 requisições falhas, 0 erros.

## 5. Avisos que ficam (com justificativa) e o que ainda é imperfeito

- **360 × 740: CTA termina em y 634 (> 607, 82%).** Está inteiro na tela (86%), com o micro embaixo; em 390 × 844 termina em
  74%. Subir mais exigiria trocar 40 por 24 nos vãos foto↔H1 e data↔CTA, o que mudaria a composição aprovada. Mantido.
- **1024 × 768: "tela 4 com 12 blocos" (> 11).** São os 3 cartões iguais lado a lado (imagem + nome + bio + botão × 3);
  a régua conta 4 blocos × 3. Mesma estrutura repetida, lida por colunas. Mantido.
- A captura de página inteira do verificador, com barra de rolagem real, recorta 15 px à direita e redesenha sem barra
  (as PNGs `1024.png`, `768.png`, `390-barra.png` não são o que ela vê; as medidas, sim). Por isso a inspeção visual foi
  feita rolando de verdade (`_check/polimento/`).
- Inclinação e luz de cursor só em ponteiro fino (em toque não existem). Firefox/Safari não vistos em aparelho
  (`view()`, `clip-path`, `translate`/`rotate` degradam para o estado final).
- O tilt usa `rotate` com eixo livre (Chrome 104+, Safari 14.1+); sem suporte, o cartão só sobe 4 px.
- Contador usa o relógio do aparelho (como antes).

## 6. Patches em arquivo compartilhado

Nenhum necessário.
