# v2 · Dossiê — polimento (rodada 8, 11/10/2026)

Arquivos tocados: `app/v2/v2.css`, `components/v2/*` (Hero, Intro, Roteiro, Condicao, Bonus, ValorTarja, PorQuePta,
CtaFinal, DossieRoot, DossieModalDialog) e este arquivo. Nenhum arquivo compartilhado foi alterado.
Imagens de evidência: `.check/final/*.png` (6 larguras + `*-reduzido.png` + pop-up), `.check/propostas-desktop.png`
(antes × proposta 2 × proposta 1).

## 1. O que ela apontou → causa → o que mudou

| Ela disse | Causa medida | O que mudou |
|---|---|---|
| "quadradão preto no meio do quadrado branco" | no desktop o escuro era um retângulo (`::before` do trio, `left:0; right:calc(-1*(pad+…100vw…)); bottom:-(hpb+33px)`) solto no canto da área de papel, começando a meio da altura e engolido pela seção preta de baixo: forma sem regra do grid | a dobra inteira usa a ideia que ela aprovou no mobile: **faixa preta de borda a borda atrás do tronco, trio centrado por cima**. Em 768+ o H1 desce e o apoio (sub · data · CTA) fica ao lado dele. Nenhum retângulo solto |
| "a imagem dos professores não combinou; o lado esquerdo ficou maior que o direito" | trio na coluna 6–12, deslocado, com o painel escuro sangrando só para a direita | trio **centrado na página pela tinta** (medido: centro 712,5 = centro da janela em 1440), faixa simétrica, H1 alinhado à borda esquerda da logo e o botão do apoio alinhado à borda direita do botão do cabeçalho (126,9 / 1298,1 nas duas pontas) |
| mobile aprovado, mas trio 24 px à esquerda × 56/41 à direita | `width: min(100%, 310px)` alinhado à esquerda | `width: min(100%, 420px)` centrado: no celular o trio ocupa a coluna inteira (margens 24 = 24), no tablet 560 px centrado |
| botão em 2 linhas em 390-barra | `max-width: 380px` não pega janela de 390 px com barra de 15 px (coluna de 327 px) | rótulo 17 px / padding 16 até 440 px, 16 px até 380 px; no desktop `nowrap` também no bloco final |
| margens 40 × 153 (768) no ingresso e no botão | coluna de 560 px encostada na esquerda | coluna de ingressos de 560 px **centrada** no tablet (margens iguais) |
| `100vw` em `v2.css` | sangria da faixa do desktop | a faixa agora sangra por `cqw` do próprio trio (`left/right: -200cqw`, `overflow-x: clip` na seção). Zero `vw` no arquivo |
| ingressos com pouca área vazia (4–5) | foto colorida + corpo + canhoto, 1 por linha | respiro entre ingressos 40 → 96 px; continua 35–37% medido (os ingressos são conteúdo colorido): aviso mantido e justificado em §5 |

## 2. Duas propostas para a dobra do desktop

(`.check/propostas-desktop.png`)

**Proposta 1 · "Faixa de borda a borda" (ESCOLHIDA).** Faixa preta de ponta a ponta da página atrás do tronco; trio
centrado em cima; H1 à esquerda e apoio à direita, alinhados pelo topo das maiúsculas e pela base. É o princípio do
mobile aprovado, em escala. O trio é largo (1,8 : 1), então usa a largura inteira em vez de uma coluna.
- 1440×900: botão termina em 85% da altura; 1024×768: 83%; 1366×768: 85%. O trio encolhe com a altura da janela
  (`min(100%, 680px, max(460px, (100svh − 470px) × 1,8))`) para o CTA nunca sair da 1ª tela.
- Mede: H1 587,7 → 782,7; apoio 587,7 → 782,7 (topo e base iguais pela tinta, `text-box: trim`).

**Proposta 2 · "Coluna inteira escura".** Texto à esquerda em papel; a metade direita inteira preta da altura do
cabeçalho até o fim da dobra, com o trio ancorado embaixo. Testei a imagem (injeção de CSS). **Reprovada:** a coluna
preta continua emendando na seção preta de baixo e forma um "L"; o trio (largo) deixa um vazio preto grande em cima;
a metade esquerda ainda parece "maior" que a direita — o mesmo incômodo, só alinhado ao grid.

Descartada antes de montar: a mesma ideia com a faixa só atrás do CTA (duas colunas): o trio larguíssimo não cresce na
coluna da direita, sobra um vazio de papel em cima dela.

## 3. Linguagem de movimento: "IMPRIMIR / CARIMBAR"

Uma ideia só, repetida com variações. Mesma curva (`cubic-bezier(.2,.7,.2,1)`), três tempos (0,6 s impressão ·
0,9 s tarja · 0,35 s toque). Só `transform`, `opacity`, `clip-path`.

| Gesto | Onde | Como lê |
|---|---|---|
| **Faixa carimbada** da esquerda para a direita, o trio sai dela (sobe 28 px) e, ao rolar, afunda 3% de volta ao piso | dobra | a tarja preta do documento |
| **Texto sai impresso** de cima para baixo (clip-path) | frase da abertura, "Pague 1 leve 2", apoio do VALOR, micro do CTA, opções A·B·C, bônus 01–04, texto dos 3 passos | impressora |
| **Fio que se traça** da esquerda para a direita, depois do texto | passos, opções, bônus | régua do formulário sendo preenchida |
| **Carimbo**: o quadradinho ouro dos selos cai de maior e girado | 3 selos da abertura | "aprovado" |
| **Títulos sobem linha a linha** de uma janela que preserva til e acento | todos os H2 | linha impressa |
| **Ingressos imprimem** em sequência (picote é máscara real), depois a foto se revela por clip-path | 3 noites | o ingresso saindo da máquina |
| **Ingresso na mão**: sobe 6 px, inclina ≤ 3° seguindo o mouse, brilho que acompanha | hover (ponteiro fino) | cartão físico |
| **Numerais impressos** guiados pela rolagem + **contador** (0 → 10.000, assenta dígito a dígito, ease-out) | 1·2·3 e "Por que a PTA" | carimbo de número |
| **Tarja que cobre e abre**, guiada pela rolagem | "os valores" (passo 3) e "AO VIVO" | documento sigiloso |
| **Barra de progresso de leitura** (fio ouro no topo) | página | folha de rosto |
| Botões: hover −2/−2 + sombra, seta anda 4 px, `:active` afunda | todos | já existia |
| Cortina de tarja no sucesso do pop-up | pop-up | já existia |

Política (coordenação, 11/10): o movimento roda **sempre**. `data-movimento`:
- `total` (padrão): tudo, incluindo parallax do trio e inclinação dos ingressos;
- `suave` (o sistema pede menos movimento — o caso dela): **a mesma coreografia**, `--rise` 10 px, `--t-print` 0,4 s,
  `--stag` 60 ms, sem parallax e sem inclinação;
- `parado` (só `?movimento=parado`): `animation: none; transition: none`, JS não liga, tudo no estado final.

Estado natural do CSS = estado final; os estados "antes" só existem com `.v2[data-io]` (JS ligado) e a peça ainda
fora da tela. `forwards`/`backwards`, nunca `both`. Nada no H1, no LCP (o trio só começa a 35% de opacidade e a
foto é a imagem do LCP) nem no CTA (só a seta).

Detalhe técnico que custou um defeito: um `clip-path` fechado em 100% **no próprio alvo** do IntersectionObserver o
deixava "fora da tela" para sempre (o micro do CTA final nunca imprimia). O estado fechado é `inset(0 0 calc(100% -
0.02px) 0)` e o observador usa `threshold: 0`. O final do clip usa `0.5em` de sobra (não %), senão a descida do "p"
e do "g" do micro é cortada.

## 4. Lista única (9 itens) → como ficou na v2 → evidência

| # | Item | Como ficou na v2 | Evidência |
|---|---|---|---|
| 1 | Margens esquerda = direita; zero `100vw` | verificador: **0 avisos de margem**, 0 de `100vw` (360, 390, 390-barra, 768, 1024, 1440). Tablet: trio e ingressos centrados em 560 px. Faixa por `cqw` | `.check/final/_relatorio.json`; `scrollWidth` = largura em todas (360/390/375/753/1009/1425) |
| 2 | Foto centrada pela tinta; harmonia | trio centrado pela tinta (arquivo com margens 30/30 px); medido 712,5 = centro da janela | `1440-dobra.png`, `1024-dobra.png`, `768-dobra.png`, `390-barra-dobra.png` |
| 3 | Nenhum bloco solto | o painel escuro do desktop deixou de existir (§2). Varredura da página: faixas de borda a borda (dobra), seções inteiras papel/preto, grade visível só em "Por que a PTA" (cobre a seção toda, alinhada a `--pad` em passos de 64 px). Nada flutuante | `1440.png` (página inteira) |
| 4 | Bloco final com uma ideia | título à esquerda, ação à direita, base alinhada (espelha a dobra); sem textura atrás do texto; CTA ouro 64 px, 1 linha; micro imprime depois | `1440.png` final; `390.png` final |
| 5 | Faixa/selos | a v2 não tem faixa rolante (conceito dossiê). Equivalente "de prova": os 3 selos da abertura **carimbam** em sequência (quadradinho cai girado, texto imprime) e "+10.000" conta de 0 a 10.000 em "Por que a PTA". Parado/sem JS: lista completa, sem corte | `390.png`, `1440-reduzido.png` |
| 6 | Pacote comum | títulos por linha ✔ · setas/botões ✔ · contador ✔ · ingressos com hover/inclinação ✔ · barra de progresso ✔ · fotos por clip-path (faixa da dobra, foto dos ingressos) ✔ · listas escalonadas ✔ · 3 momentos assinatura (faixa+trio; ingressos imprimem; tarja abre) ✔ | §3; `motion_test` (scratchpad): total/suave/parado sem erro de console |
| 7 | Grão | global 0,50 nesta rota (base 0,55) e papel `multiply` 0,12; conferido a 100% sobre fotos, faixa preta e papel: não pesa | `1440-dobra.png`, `1440.png` |
| 8 | Detalhes | rótulo de botão em 1 linha em 360/390/390-barra/768/1024/1440 (0 erros); alvos ≥ 44 (0 avisos); numerais com `tabular-nums` e tinta alinhada com o fio (−0,035em); vãos da dobra 12·24·40; topo e base do H1 = topo e base do apoio | relatório; `1440` probe |
| 9 | Movimento reduzido | `reduce` = `suave`: a mesma coreografia, mais curta; `?movimento=parado`: nada anima e a página está completa. 0 erros no verificador (texto invisível/cortado) | `1440-reduzido.png`, `390-reduzido.png` |

## 5. Números

| Item | Resultado |
|---|---|
| Verificador (`check_pagina.py`, 6 larguras + reduzido) | **0 erros**, 13 avisos (justificados abaixo) |
| JS inicial (gzip) | 136,6 KB (limite 150) — a v2 não carrega GSAP |
| CSS (gzip) | 12,5 KB (limite 40) |
| `typecheck` · `lint` · `test` (12) · `build` | sem erro |
| Raiz e subpasta (`NEXT_PUBLIC_BASE_PATH=black`) | 0 erro de console, 0 requisição falha, `data-movimento` total/suave/parado |
| Pop-up | Tab chega ao botão; abre com foco no título; ESC fecha e devolve o foco; envio demo → cortina → "Você está dentro" |
| `?agora=` | v2 não mostra relógio: a página não muda nem dá erro nos 3 estados testados |
| Contador | 0 → 10.000 em ~1,3 s (amostras: 4.471 · 7.480 · 8.963 · 9.669 · 9.934 · 9.997 · 10.000) |

### Avisos que ficam (justificativa)

- **"hero com respiro 24/72", "24/112", "56/112"**: é o vão cabeçalho↔trio do sistema (24; 56 no desktop). O respiro
  de baixo (72/112) passa. Subir o de cima para 112 no desktop empurra o CTA para 94% da altura (> 92%) em 1440×900.
- **"CTA termina em y=645 (> 607)" em 360×740**: 87% da altura de um celular pequeno, 95 px de folga; abaixo disso só
  tirando o trio (que ela aprovou) ou comprimindo os vãos (proibido pelo §4f).
- **"telas 4–6 com < 38% vazio" (360/390/768)**: são os ingressos (foto colorida + texto + canhoto, 1 por linha),
  medidos 35–37%. Já vão com 96 px entre eles; mais que isso deixa o ingresso mais curto que a tela. Estreitar o
  ingresso (para sobrar preto nas laterais) tira tamanho do rosto, que é o que importa ali.
- **"topo das colunas desalinhado (texto 762 × imagem 96)" em 768 e 1440**: o verificador entende o trio centrado como
  "coluna da direita". A composição é empilhada (imagem em cima, texto embaixo); não há colunas lado a lado a alinhar.

## 6. O que ainda é imperfeito

- **Peso 500 no texto corrido** (herdado da base, já documentado em `v2-decisoes.md`).
- Firefox e iOS < 26 não têm `animation-timeline`: parallax e a barra de progresso caem em reserva por JS/IO
  (a barra por `scroll`); os numerais/tarjas rodam por tempo. **Não testei em Firefox/Safari reais.**
- `text-box: trim-both` (alinhamento do topo/base pela tinta no desktop) é Chrome 133+/Safari 18.2+; nos demais
  sobra a diferença normal do entrelinha (≈ 9 px de topo do H1 × apoio).
- O ingresso do meio fica 64 px mais baixo no desktop (decisão do desenho aprovado); as bases/canhotos alinham.
- A subida (6 px), a inclinação e o brilho dos ingressos só existem com mouse e no modo `total`. O que ela verá no
  Windows com "reduzir movimento" ligado (`suave`): faixa e trio, impressão dos textos, fios, selos, ingressos e fotos,
  tarjas, contador e barra de progresso; sem parallax e sem inclinação.
- O foco/teclado do pop-up foi testado em Chrome, não em Safari.

## 7. Patches em arquivos compartilhados

Nenhum necessário. (A base já tinha `data-movimento`, `lib/motion.ts` e o grão 0,55.)
