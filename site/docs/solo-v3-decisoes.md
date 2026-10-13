# v3 · páginas individuais (André · Walter · Carlos) — decisões, inventário e tema claro

Data: 11/10/2026. Espaço de trabalho: `black-pta-rascunho/solo-v3` (cópia do site; **não** levar para o projeto principal
a única alteração fora das novas pastas: `next.config.ts` → `turbopack.root`, só porque `node_modules` aqui é uma junção).
Tudo é teste. Texto: **só** `content/solo/<prof>.copy.json` (cópia dos `pagina-solo.<prof>.copy.json` finais); notas e
pendências em `content/solo/PENDENCIAS.md` e nunca na página.

## ESTADO ATUAL (11/10/2026, fim da rodada do tema claro)
- PRONTO: 3 páginas solo (`/solo/andre|walter|carlos/v3/`) + mãe `/v3` nos 2 temas; pop-up do professor; 13 elementos do
  kit com versão clara/escura; imagens em `black-pta-rascunho/_solo/v3/` (dobras 390/1440, página inteira 390 e
  faixas legíveis por página e tema em `_solo/v3/faixas/<página>-<tema>/NN.jpg`).
- Typecheck, lint, 12 testes e build: OK. `check_pagina.py` e `teste_pagina_total.py --rapido`: 0 erros nas 8 combinações
  (4 páginas × 2 temas); resultados na seção 8.
- PENDENTE/NÃO FEITO: Safari/Firefox/iOS não vistos; CTA da dobra no celular termina em ~85 % da altura (aviso; a mãe
  tem o mesmo); o botão de tema (ferramenta) gera avisos de alvo de toque/fonte 11 px; 768 px visto só por amostra.
- DECISÕES TOMADAS: pop-up novo por página sem tocar `LeadModalDialog`; botão do cabeçalho com `data-solo-open`;
  só dia/hora no cabeçalho; logo da pós do Carlos fora (texto "Emagrecimento…"); seleção de noites com checkbox.

## 0. O que foi criado (todos arquivos novos; nada da mãe foi movido)
```
app/solo/<andre|walter|carlos>/v3/page.tsx      rota (metadata + componente)
components/solo-v3/
  comum.tsx      cabeçalho, faixa, FAQ, rodapé, moldura (.v3 .so), ElTema (elemento do kit nos 2 temas)
  FaixaSolo.tsx  faixa rolante dos 2 selos (4 grupos: com 2 frases curtas 1 grupo não cobre 1920 px)
  SoloModal.tsx  provedor do pop-up da página (captura o clique ANTES do provedor da mãe; não altera arquivo compartilhado)
  SoloDialog.tsx pop-up com texto do professor + "Noite do <prof> (data, 20h30)" já marcada + "outras noites" opcional
  PaginaAndre.tsx · PaginaWalter.tsx · PaginaCarlos.tsx   as 3 composições
  solo.css · andre.css · walter.css · carlos.css
lib/solo-v3.ts                                  copy tipada por professor
content/solo/                                   JSON final + PENDENCIAS.md
public/img/solo/<prof>/v3/                      elementos do kit (SVG) + logo oficial da pós
scripts/solo-v3-elementos.py                    exporta os elementos do kit (nenhum desenho novo)
```
Reaproveitados sem mudar: `ButtonCta`, `Logo`, `Reveal`, `Accordion`, `components/v3/{Numeral,Movimento,BarraFixa}`,
`app/v3/v3.css` (CSS da v3, importado) e os tokens 12·24·40 / `--m` / `--sec`.

## 1. Família e diferenças (a prova "se eu trocar só a cor, ainda é outra composição?")
Mesmo método da v3 (preto, Big Shoulders 900, numerais, cor do produto em área grande, tarja ouro na oferta, mesma
ordem de blocos, mesmos tokens, botão reto com sombra dura). Muda por professor:

| | André · azul · "O ÂNGULO" | Walter · vermelho · "A ANILHA" | Carlos · roxo · "VISÃO 360º" |
|---|---|---|---|
| ideia (1 frase) | o goniômetro abre o ângulo atrás do professor; eixo vertical organiza a página | a anilha vermelha e a barra olímpica: a página é a barra recebendo carga | a grade polar de 360° em volta do professor: a pós trata a mulher inteira (físico, hormonal, nutricional, psicológico) |
| eixo da dobra | tudo centrado, mesma coluna do celular ao desktop | texto à esquerda, palco à direita (a anilha sangra pela borda) | palco circular à esquerda, texto à direita |
| fundo | preto + painel azul + seções papel | preto ↔ papel (a única "noite clara" do manual) + faixas vermelhas | preto + seção inteira dourada (oferta) + cartões de canto arredondado |
| como funciona | eixo vertical com nó azul por passo | barra + 3 anéis numerados pendurados, em linha | 3 cartões com numeral gigante roxo |
| o que vai ver | régua do kit + lista | ficha de treino (aba vermelha numerada, 2 colunas) | 1 bloco dividido em 4 quadrantes |
| professor | painel azul + prumo lateral + foto | painel vermelho + foto + fita métrica | halftone radial roxo atrás da foto |
| pós | logo oficial + planos anatômicos + lista | barra + logo oficial + lista com pontos de carga | anel de 4 setores + frase "Visão 360º" em destaque |
| pague 1, leve 2 | "1 × 2." gigante da v3 (placar) | diagrama do kit pague 1 → leve 2 + escolha | seção toda em ouro, tinta escura, botão preto |
| bônus | lista numerada (papel) | 4 cartões com contorno (papel) | 4 etiquetas arredondadas (papel) |
| prova | frase central | faixa vermelha | número "+10.000" que conta, em roxo |
| final | o goniômetro fecha como abriu | painel vermelho cheio | frase + botão e a grade polar à direita |

Movimento (uma linguagem por página, uma vez, só transform/opacity/clip-path, sempre ligado; "suave" = mais curto):
André = o braço do goniômetro abre de 0° a 120° (0,9 s) · Walter = a anilha rola 40° até a posição e a barra entra
da esquerda (1,0 s / 0,8 s) · Carlos = a grade polar gira 60° e o disco enche de baixo (1,1 s / 0,62 s).

## 2. Inventário do kit (elemento → onde entra → por quê) — elementos ANTES da página
| página | elemento (biblioteca `ornamentos`) | onde entra | por quê |
|---|---|---|---|
| André | `assunto.goniometro` (cheio, completo, 120°, sem rótulo) | dobra e CTA final | é o assunto: ângulo articular; o braço separado vira a marcação do movimento |
| André | `assunto.prumo` (prumo lateral, 5 pontos) | professor (sobre o painel azul) | o eixo da página; "saber do assunto": pontos de Kendall |
| André | `assunto.planos` (destaque sagital) | pós | planos anatômicos = o que a pós ensina (avaliação do movimento) |
| André | `fios.numeracao` (grande, n/3) | como funciona | 01/03, 02/03, 03/03: os 3 passos |
| André | `fios.regua` (0–100) | o que vai ver | medir: régua como divisor com função |
| Walter | `assunto.anilha` (25 kg cheio = vermelho IWF) | dobra | o produto é carga; a cor da anilha é a cor do produto (sem inventar) |
| Walter | `assunto.barra` (olímpica, sem rótulo de carga) | dobra, como funciona, pós | linha de carga que organiza a página |
| Walter | `assunto.fita_metrica` (0–15 cm) | professor | medida: morfologia e genética (MORFOGEN) |
| Walter | `fios.numeracao` (anel, n) | como funciona | número no anel = passo de processo |
| Walter | `dados.pilha_1_2` (blocos) | pague 1, leve 2 | o diagrama da condição Black do kit, em ouro |
| Carlos | `grades.polar` (graduada, 360°) | dobra e CTA final | a "visão 360º" literal; gradua só o que mede (ângulo) |
| Carlos | `pontos.meio_tom` (radial) | professor | textura de ponto = o "feminino" do produto sem enfeite solto |
| Carlos | `dados.anel_progresso` (segmentado 4/4, sem número) | pós | 4 setores = os 4 aspectos da pós |

O que NÃO foi do kit (CSS simples, listado para decidir): disco sólido da dobra do Carlos (círculo de cor),
marcadores quadrados/circulares das listas, cartões/fichas (bordas e aba numerada), tarja do destaque (herdada da v3).
Selo "MEC" do kit (`selos.selo_circular`) **não** foi usado: regra do manual ("sem selo oficial, sem nome de órgão") e
"nada de aprovada/recomendada pelo MEC". O texto "Certificado reconhecido pelo MEC" aparece como texto.

## 3. Estrutura de blocos (ordem do documento da cliente, sem inventar)
barra fixa (logo + botão; dia/hora a partir de 1280 px; barra do celular aparece depois da dobra) · hero (H1 + "No
final, a condição Black" + data + CTA; sub abaixo da dobra; selos na faixa) · pop-up (aberto por todos os CTAs) · como
funciona · o que vai ver ao vivo · quem é o professor · a pós que você leva · pague 1, leve 2 · bônus · prova · FAQ ·
CTA final · rodapé legal. Fora (pendências): depoimentos, número de alunos (André/Walter), tema da aula, datas de
turma, perguntas de FAQ com resposta em colchete.
Rótulos de interface que não estão na copy (ROTULO): título "Perguntas frequentes" (igual à mãe); "Prova" só no
`aria-label`. O cabeçalho mostra só o dia/hora; o nome do professor está no H1 e no `aria-label` da logo (a frase
inteira "Black PTA ao Vivo com …" não cabe ao lado do botão de tema sem colidir).

## 4. O que ela precisa confirmar (da lista dela; nada foi decidido pelo estúdio)
- "Garantia de 30 dias" (Carlos) está na página porque não tinha colchete; a FAQ da garantia ficou fora (C-B3).
- "+10.000 alunos formados" (Carlos) idem (C-B2); "+4.000 alunos certificados · 18 professores" (Walter, W-B2).
- Logo oficial da pós do Carlos **não** usado: o arquivo traz o texto "Emagrecimento, Estética e Performance" e a
  lista `_evitar` do Carlos proíbe promessa de emagrecimento. André e Walter usam o logo oficial.
- "Treinador de atletas de elite" (Walter, W-B3) e "mestre em Educação Física" sem instituição (André): como na copy.
- Nome da pós do Carlos (C-B7): "Treinamento Feminino" em todo lugar até ela decidir.
- Seleção de noites do pop-up: "Noite do <prof>" já marcada (pode desmarcar) e "outras noites" opcional; o PDF só
  diz isso; o formato visual é decisão do estúdio para ela vetar.

## 5. Defeitos que apareceram (lição para a próxima)
| defeito | causa | correção |
|---|---|---|
| André mobile: título e tarja cortados na direita | tarja `nowrap` alargava a trilha da grade | `grid-template-columns: minmax(0, 1fr)` + tarja que quebra em linhas (`box-decoration-break: clone`) |
| ponta do braço do goniômetro sob o cabeçalho | geometria do mostrador (raio 76 % da largura do SVG; braço 1,62 R) mal calculada | palco 1 : 0,92, mostrador 100 % da largura, centro a 58 % da altura |
| `<p>` com rótulo mono de 14 px = erro do verificador | regra do contrato (p ≥ 16 px) | rótulos mono em `<div>`/`<span>` |
| pop-up "não testável" no celular | 1º `[data-open-modal]` do DOM era o botão do cabeçalho, escondido < 768 px | botão do cabeçalho usa `data-solo-open` (o CTA da dobra é o 1º `data-open-modal`) |
| fundo do CTA final do Walter não pintava | `.v3 .final` (mãe) com a mesma especificidade | `.v3.so .so-w-final` |
| rótulo mono quase invisível no papel | token `--color-mute` é claro (feito para o escuro) | `currentColor` + opacidade na seção `.pta-paper` |
| `h3` colado no `p` (0 px) nos passos | vão herdado de um wrapper sem gap | `margin-bottom: 12px` no título |
| logo da pós, quando branco, some no papel | arquivo oficial é branco | `filter: brightness(0)` no claro (mono preto é permitido) |
| ferramenta de teste a 3 px do botão no celular | botão do tema no meio do cabeçalho | `html .pta-tema` à direita no celular (só CSS desta versão) |
| matei todos os `node.exe` uma vez | `taskkill /IM node.exe` para parar o meu servidor | passei a matar só pela porta (4303/4313); o servidor do v1 (4301) continuou de pé |

## 6. Verificação
Comandos (cada página nos 2 temas, `?tema=escuro|claro`):
`npm run typecheck && npm run lint && npm run test && npm run build`; servidor `node scripts/serve-out.mjs --port 4303 --dir out`;
`check_pagina.py http://localhost:4303/<rota>/?tema=<t> -o <pasta>`; `teste_pagina_total.py … --rapido`.
Em paralelo, 4 sessões de navegador esgotam o buffer de rede do Windows (`ERR_NO_BUFFER_SPACE`, imagem "quebrada"
falsa na mãe); rodar `teste_pagina_total` uma por vez.

## 7. Tema claro — como foi desenhado (não é inversão)
Mecanismo (do coordenador): `data-tema` no `<html>`; tokens `--color-ink/tinta/papel/ouro/mute` trocam e as seções
`.pta-paper` ficam escuras. A v3 é toda escura de nascença, então o claro ganhou desenho próprio:

1. **Dois fios**: `--line` (hairline sobre a superfície) fica escuro e `--line-d` (dentro de `.pta-paper`, agora
   escura) fica claro; antes os fios sumiam no papel.
2. **Ouro em ÁREA** (tarja do destaque, "2." da oferta, faixa dos selos da mãe) continua `#CDA85E` com tinta escura
   (não vira oliva); ouro de TEXTO/fio/ícone = token (`#7C5F1C` no papel). Botão: preto com texto ouro (do coordenador).
3. **Cor do produto**: só em área grande ou ≥ 72 px; numerais, rótulos e desenhos SOBRE a cor ficam em tinta escura
   fixa (`--sobre-cor: #0C0B09`) nos 2 temas (4,5–4,9:1 azul/vermelho; roxo só com texto grande).
4. **Elementos do kit**: cada SVG de cor assada ganhou a versão para superfície clara (traço `#0C0B09`, cor do
   produto igual) — `…-sobre-claro.svg` / `…-sobre-escuro.svg`. `ElTema` mostra um por tema e, dentro de `.pta-paper`
   (que inverte no claro), troca o par. O mostrador do goniômetro e a anilha funcionam nos 2 fundos (uma versão só);
   o braço do goniômetro tem as duas (branco no escuro, preto no claro).
5. **Logos**: da dobra/cabeçalho em tom escuro no papel; rodapé e logo oficial da pós vão para preto (`brightness(0)`).
6. **Tipografia**: texto escuro em fundo claro pesa mais e a condensada em caixa alta aperta: títulos com +0,01 em
   de tracking e rótulos mono em 600 com +0,14 em, só no claro. Famílias e tamanhos do sistema mantidos.
7. **Fotos**: recorte com alfa + máscara de fade usam o alfa (funcionam nos 2 fundos); nenhum fade assado para preto.
8. **Grão**: 0,30 no escuro da v3 e no claro (olhado em 390 e 1440: ponto de ruído discreto, não suja o papel).
9. **Pop-up**: contorno dos campos, placeholder, fio de erro, backdrop e botões refeitos para o papel (erro com ✕ e
   "Erro:" continua). Estados vistos: aberto, erro, enviando, sucesso (390 e 1440, 2 temas).
10. **Rodapé, FAQ aberto, faixa, hover/foco**: foco usa o token (`outline` tinta); ícone do FAQ em ouro de texto.

Por página (o que mudou do escuro para o claro):
- **André**: o painel azul do professor e o mostrador continuam azuis (cor = identidade); braço do goniômetro, régua,
  planos e numeração trocam para traço escuro/claro conforme a superfície; "Como funciona" e "Bônus" (papel no escuro)
  viram seções escuras no claro, com o eixo vertical em `currentColor`.
- **Walter**: no escuro é a noite com mais papel; no claro as seções papel ficam escuras (ritmo invertido), o
  vermelho continua em área (faixa, prova, final, abas da ficha); barra e anéis trocam de versão.
- **Carlos**: a seção dourada é a mesma nos 2 temas (tinta escura, botão preto); a grade polar passa a traço escuro
  roxo; cartões usam o token de superfície (papel mais escuro no claro).
- **Mãe /v3**: mesmos ajustes de fio, ouro de área, numerais sobre a cor em tinta escura, rodapé e logos, e seção
  "como funciona"/"por que a PTA" (papel) que viram escuras com traço em `currentColor`.

## 8. Resultados (build final, 11/10/2026)
| página | tema | check_pagina | teste_pagina_total --rapido | avisos que sobraram |
|---|---|---|---|---|
| /solo/andre/v3/ | escuro · claro | 0 erros · 0 erros | 0 erros · 0 erros | botão do tema (11 px, alvo 28 px); CTA termina em ~85 % no celular; texto repetido na dobra ("condição Black") |
| /solo/walter/v3/ | escuro · claro | 0 · 0 | 0 · 0 | idem; "img a −3 px da borda" (a barra sangra até a borda de propósito) |
| /solo/carlos/v3/ | escuro · claro | 0 · 0 | 0 · 0 | idem; blocos do rodapé a 8 px |
| /v3/ (mãe) | escuro · claro | 0 · 0 | 0 · 0 | os da v3 original + botão do tema |

Contraste WCAG (medido pelo teste total nos 2 temas): sem erro. Texto pequeno nunca na cor do produto; ouro de texto no
papel `#7C5F1C` (4,8:1). Pop-up conferido em 390 e 1440, 2 temas, estados aberto · erro · enviando · sucesso.
Peso (check_pagina): André 1,19 MB · Walter 0,99 MB · Carlos 1,00 MB (SVG do kit com texto em curvas pesam 25–60 KB cada;
dá para passar por SVGO).

## 9. Arquivos de apoio fora do projeto
`_solo/v3/<prof>-<390|1440>[-claro].jpg` (dobras) · `<prof>-390-inteira[-claro]-N.jpg` (página inteira, partes ≤ 8000 px) ·
`_solo/v3/faixas/<prof>-<escuro|claro>/NN.jpg` (390 px, faixas de 1100 px). `<prof>` = andre · walter · carlos · mae.
