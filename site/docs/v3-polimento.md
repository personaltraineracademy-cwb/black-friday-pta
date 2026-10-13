# v3 · Placar — polimento (rodada 8, 11/10/2026)

Pedido dela: "perfeccionista com tudo… algo bem premium… animações leves, algumas coisas animadas para chamar a
atenção". Pontos concretos: bloco final "estranho", margens (um lado maior que o outro), grão forte, faixa sem
movimento. Política nova (coordenação): **o movimento roda sempre**; `<html data-movimento="total|suave|parado">`.
Tudo desta rodada fica em `app/v3`, `components/v3` e este arquivo (nenhum arquivo compartilhado foi editado).

## 1. O que ela apontou → causa → o que mudou
| Ela disse | Causa medida | O que mudou |
|---|---|---|
| Bloco final "estranho" (01 02 03 gigantes + listras + frase + botão) | 3 ideias numa tela: numerais de 110–300 px, grade de 12 listras atrás do texto, frase pequena demais perto deles | **Uma ideia só: o placar fecha como abriu.** 3 painéis na cor da noite com o numeral (a mesma grade de 3 colunas da dobra), a frase, o botão. Sem listras, sem grade, sem 2ª camada. Celular: placar → frase → botão (como a dobra). Desktop: frase e botão à esquerda, placar à direita com a ALTURA da frase (topo e base dos painéis = topo e base das maiúsculas). Os painéis acendem de baixo e os numerais viram ao entrar |
| "Um lado maior que o outro" (mobile) | (a) numeral das noites começava 31 px depois da margem (a coluna já tem a margem e o `left` somava de novo); (b) o busto parava 24 px antes da borda da tela, com a cor sangrando além dele; (c) numerais/títulos medidos pela caixa, não pela tinta (o "0" da Big Shoulders tem 0,044 em de folga, o "1" 0,032 em: 11–25 px nos numerais grandes); (d) "1" do 1 × 2 entrava 7–18 px para dentro da coluna | (a) numeral nasce na margem; (b) busto encosta na borda direita da tela (a cor sangra dos dois lados), no desktop continua rente à borda do painel; (c)(d) numerais recuam a folga do desenho e avançam a do título (`--hb`): a tinta cai na MESMA vertical da tinta do título. Medido por pixel: 24–25 px no celular, 87–89 px a 1440 (título 88–89) |
| "Essa parte achei estranha" | idem bloco final | ver acima |
| Grão "um pouquinho forte demais" | 0,8 → base 0,55 → 0,38 na v3 | v3 a **0,30** (o grão agora é textura, não ruído em foto/preto). Papel ficou como estava |
| "A faixa passando para ler" parada | movimento reduzido ligado no Windows dela | com a política nova a faixa roda (modo suave: ×1,8 mais lenta + botão de pausa) |
| Faixa sem capricho | palavra cortada a faca nas bordas; velocidade só acelerava | bordas esmaecem; velocidade acoplada à rolagem COM SENTIDO (para baixo acelera até ~3,4×, para cima desacelera, para e inverte; volta ao normal sozinha); passar o mouse pausa |
| Detalhes | título "3 noites, 3 / professores" quebrava no meio; "pós-/graduação" quebrava no hífen; título "Por que a PTA" 7 px abaixo do fio; tarja do "2." em coluna nenhuma | quebra no sinal do próprio texto; "pós-graduação" não quebra; topo das maiúsculas = topo do fio (`text-box`); a tarja nasce na coluna 5, a mesma borda do texto da oferta (medido: 364,8 / 511,8 / 455,3 px, igual ao texto, em 1024 / 1440 / 1280) |
| Verificador: botão 24 × 39 em 390-barra | **falso positivo do verificador**: ele mede depois do print de página inteira, quando o viewport ainda está sendo restaurado (clientWidth 390 lido, layout de 375 medido). Reproduzido: rodando de novo a mesma medida 600 ms depois, `[]` | não é da página (ver §5) |

## 2. Lista única (coordenação) → como ficou na v3 → evidência
| # | Item | Como ficou | Evidência |
|---|---|---|---|
| 1 | Margens esq. = dir., zero `100vw` em layout | Verificador mede todas as caixas de coluna nas 6 vistas: 0 avisos de margem reais. CSS só tem `100vw` em sangria `inset:0 -100vw` (inofensiva) | `.check/v3p/_relatorio.json`; sondas por pixel em `.check/v3p/s3/` |
| 2 | Foto centrada pela tinta; harmonia | Bustos das noites rente à borda da tela no celular/tablet e rente ao painel no desktop; numerais na vertical da tinta do título; numeral "02" par com a tinta a 1339,5 px (= margem direita 1339,5) | 390 · 768 · 1024 · 1440 `*-05-noites.png` |
| 3 | Nenhum bloco "solto" | Painéis coloridos: ou ocupam coluna inteira do grid de borda a borda (noites) ou 3 trilhas iguais (dobra/final). A grade de listras foi removida | `s3/1440-10-final.png`, `s3/1440-05-noites.png` |
| 4 | Bloco final de uma ideia | Ver §1 | `s3/{360,390,768,1024,1440}-10-final.png` |
| 5 | Faixa premium + reduzido | Ver §1. Parado: texto centrado em linhas, sem corte | `.check/v3p/{390,1440}-reduzido.png`, teste `faixa.py` (taxa 1,7 → 2,6 → −0,66 → 1) |
| 6 | Pacote de movimento comum | Ver §3 | quadros: `.check/v3p/frames-*.png` |
| 7 | Grão suave | 0,30; conferido a 100% em fotos, painéis e áreas pretas | `s3/_grao-topo.png` (ampliado 2×) |
| 8 | Detalhes | Botões em 1 linha em 360 (verificador: 0 erros); alvos ≥ 44; tabular nums nos contadores e no "01 02 03" dos bônus; nada cortado em nenhum modo | `_relatorio.json` |
| 9 | Reduzido | Modo suave = mesma coreografia curta; modo parado = nada anima e nada escondido. Página completa nos dois | `390-reduzido.png`, `1440-reduzido.png`, `?movimento=parado` (`getAnimations()` vazio) |

## 3. Linguagem de movimento: "o placar que vira"
Duas palavras, repetidas com variações: **o dígito vira** (roll de 0 até o número, dentro de uma janela) e **a cor
varre/enche** (de baixo ou da esquerda). Uma curva (`--ease-saida`; a varredura usa `--ease-marca`), tempos 0,4 ·
0,62 · 0,8 s, uma vez por entrada, só `transform`/`opacity`/`clip-path`. Nada no H1, na foto do LCP, no preço nem no
botão (só a seta).

| Momento | O que acontece | Como | Suave |
|---|---|---|---|
| **Dobra: placar acende** | os 3 painéis enchem de cor de baixo para cima, um após o outro (0 / 0,1 / 0,2 s); os numerais viram por cima | CSS puro ao carregar | 0,4 s, rolagem dos dígitos mais curta |
| **Noites** | numeral vira ao entrar; busto SOBE da base do painel (clip-path ligado à rolagem); parallax mínimo (numeral ±8 %, busto 0–5 %); busto cresce 3 % ao passar o mouse | `animation-timeline: view()` + IO | sem parallax e sem crescer; busto continua revelando |
| **1 × 2.** | o "1" e o "2" viram como dígitos de placar; a tarja ouro varre da esquerda e o "×" aparece (escala 0,5 → 1) | IO + CSS | varredura 0,5 s |
| **Final** | os 3 painéis enchem de baixo e os numerais viram (eco da dobra) | IO + CSS | 0,4 s |
| **Faixa de selos** | ver §1 (rolagem acelera/inverte, mouse pausa, bordas esmaecem) | `playbackRate` + CSS | ritmo fixo ×1,8 mais lento, botão de pausa |
| **Contadores** | +10.000 e 6 contam de 0 ao valor | rAF | 0,7 s |
| **Títulos** | revelação por linha com máscara que preserva acento (GSAP SplitText em idle, fora do JS inicial): Como funciona, Noites, Bônus, Por que, Perguntas, final | já existia; agora em 6 títulos | sobe 30 % da linha com fade, 0,4 s |
| **Leitura** | barra de 3 cores (azul · vermelho · roxo) no topo cresce com a rolagem | CSS puro `scroll()` | igual (não se move) |
| **Detalhes** | seta do botão avança 4 px (também com foco no teclado); "+" do FAQ gira ao passar o mouse; botão grande magnético ≤ 6 px (só mouse fino); listas entram escalonadas (Reveal) | CSS/JS 0,4 KB | sem magnético; entrada de 8 px |

## 4. Números
| Item | Valor |
|---|---|
| JS inicial (gzip) | 137,0 KB (limite 150) |
| CSS (gzip) | 11,1 KB |
| `npm run typecheck` · `lint` · `test` (12/12) · `build` | sem erro |
| Verificador | 0 erros · 5 avisos reais (§5) + 1 falso positivo |
| Subpasta `NEXT_PUBLIC_BASE_PATH=black` | 0 requisições com falha, 0 imagens quebradas, pop-up abre |
| Pop-up (teclado, ESC, foco) | Enter abre; foco no título; ESC fecha e o foco volta ao botão; cartão da noite 2 mostra "TER 10/11 · WALTER KRAUSE"; igual em total e suave |

## 5. Avisos do verificador (todos justificados)
- **«topo» respiro 24/72 (390, 360, 390-barra) e 24/112 (768):** é o vão de 24 px entre o cabeçalho e os painéis
  (§4f, "grupos relacionados"). Subir para 72 empurraria o CTA da dobra (664 px → 712 px = 84 % da altura) e foi
  justamente a dobra que ela aprovou. Mantido.
- **360: CTA termina em y=649 (> 607):** 360 × 740 é a tela mais curta que o verificador testa; o CTA está 100 %
  visível (88 % da altura). Reduzir os vãos 12·24·40 quebraria o sistema; reduzir os rostos (já ~65 px) pioraria o
  que ela mais olha. Em 390 × 844 o CTA termina em 664 (79 %).
- **390-barra: margens 24 × 39:** falso positivo do verificador (veja a tabela do §1). **Patch sugerido** em
  `check_pagina.py`: esperar 300 ms depois do `screenshot(full_page=True)` antes de `MARGENS_JS` (o viewport
  ainda está sendo restaurado), ou medir `MARGENS_JS` ANTES do print.

## 6. O que ainda é imperfeito
1. **Rostos do celular continuam ~65 px** (recorte mais fechado só para < 600 px = nova rodada de foto).
2. **"02" e "03" atrás da cabeça** em 1024 (o numeral passa por trás do professor): é o efeito "palavra atrás da
   pessoa", intencional, mas a 1024 corta a curva do "0". Se ela achar estranho: reduzir o numeral a 42 cqw.
3. **Base compartilhada:** `styles/components.css` linha ~308: a regra `.pta-marquee__viewport { display:block;
   overflow:visible; white-space:normal }` ficou SEM o prefixo `:root[data-movimento='parado']` (o resto do bloco
   tem). Em qualquer modo ela solta o corte da faixa. A v3 reafirma o normal em `.v3 .pta-marquee__viewport`, mas
   v1 e v2 precisam do patch: prefixar essa regra.
4. **Safari/Firefox/iOS não vistos.** `view()` (parallax, busto subindo) e `text-box` degradam sem quebrar (busto
   inteiro, sem parallax).
5. `?agora=` não muda a v3 (ela não usa o relógio; a base oferece `Countdown`, não pedido).
6. GSAP "No Charge" vale enquanto a página é gratuita.
