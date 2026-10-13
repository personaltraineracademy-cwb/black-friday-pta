# v3 · Placar — porte para Next.js: decisões, medidas e o que ficou imperfeito

Data: 10/10/2026. Origem: `paginas/v3/index.html` (aprovada, 5ª rodada). Destino: `app/v3/` + `components/v3/`
(+ `public/img/v3/`, sem mudança). Nenhum arquivo compartilhado (`components/*.tsx`, `lib/*`, `app/globals.css`,
`styles/*`) foi editado. A única alteração fora desses caminhos está em `next.config.ts` **desta cópia de trabalho**
(`turbopack.root`, só porque `node_modules` aqui é uma junção para `../site`): **não levar para o projeto principal**.

## 1. O que voltou ao projeto principal
```
app/v3/page.tsx            composição da página (server component)
app/v3/v3.css              todo o CSS da versão, escopado em .v3
components/v3/             Cabecalho · Hero · Paineis · FaixaSelos · Intro · ComoFunciona · Noites (PainelNoite) ·
                           Condicao1x2 · Bonus · PorQuePta · Faq · CtaFinal · Rodape · BarraFixa · Numeral ·
                           Movimento (controlador de movimento) · dados.ts
```
Componentes compartilhados reutilizados sem mudar: `ButtonCta`, `Logo`, `Reveal`, `Marquee`, `Accordion`
(+ pop-up `LeadModal` do layout). `StickyCta` não foi usado: a barra fixa da v3 some na seção final, então há um
`BarraFixa` próprio (mesmo CSS `.pta-sticky`).

## 2. Igual × diferente do desenho aprovado
**Igual (medido, `scripts` do estúdio em `.check/v3/` e comparação por retângulos com a página aprovada):**
cabeçalho, H1, tarja do sub, data, CTA, micro, os 3 painéis (posição, tamanho, rostos, nome e dia), faixa, enunciado,
passos, 3 noites, "1 × 2.", bônus, por que a PTA, FAQ, CTA final e rodapé. Nos 4 testes (390 · 768 · 1024 · 1440) a
diferença de qualquer borda principal é **0 px**, salvo a tarja do sub (+2,7 px a 1440, item 2.3) e o numeral das
noites (parallax: depende da rolagem). A página inteira tem a mesma altura em 768, 1024 e 1440; em 390 a diferença é
de +8 px só no rodapé, de propósito (item 2.5).
Ordem das seções, 3 vãos (12 · 24 · 40), margens (24 · 40 · clamp), `text-box: trim-both` no H1 e nos nomes,
topo dos painéis = topo das maiúsculas do H1, base dos painéis = base do micro.

**Diferente (e por quê):**
1. **Numerais viram** (roll de dígitos) em vez de só subir — é o movimento novo (seção 4).
2. **Peso do corpo 500** (o aprovado usava Archivo 400). A base só tem o variável 500–800. Isso deixaria os parágrafos
   de lead ~4% mais largos e mudaria a quebra de linha (+1 linha, +39 px no mobile). Compensei com
   `letter-spacing: -.012em` e `max-width` × 1,02 em `.enun p` e `.oferta-txt`: mesma quebra, mesma altura de página.
3. **Tarja do sub (≥ 600 px) acompanha a largura do botão**: antes a tarja e o botão acabavam a 3 px um do outro
   (o botão ganhou 4 px de borda na base). Agora a borda direita é a mesma (o verificador chama isso de "quase
   alinhado" quando difere de 1 a 14 px).
4. **Botões sólidos sem a borda de 2 px da base** dentro da v3 (mesma medida do desenho; o botão "Quero esta noite"
   mantém o contorno de 2 px, como no aprovado). Em ≤ 420 px o padding lateral é 12 px, como no aprovado.
5. **Rodapé 8 px mais alto no celular**: reserva de 80 px (altura real da barra fixa: 12 + 56 + 12) em vez de 72.
6. **FAQ**: o ícone "+" virou "×" ao abrir (como no aprovado), mas feito com 2 traços de 3,5 px em vez do glifo.
7. **Pop-up** é o compartilhado da base (cartão com rótulo da noite, sem a faixa de 6 px de cor do aprovado).
   Comportamento verificado (seção 6).
8. **Título "Perguntas frequentes"** não existe em `content/pagina-mae.copy.json` (só as 8 perguntas). Está em
   `components/v3/dados.ts` (`TITULO_FAQ`) como rótulo de seção. Recomendo acrescentar `faq_titulo` à copy.

## 3. Espaçamento e alinhamento (§4d–§4f): o que o verificador disse
Resultado do `check_pagina.py` na versão final, nas 4 larguras: **0 erros, 2 avisos**, ambos já justificados na
versão aprovada:
- `390/768 · seção «topo» respiro 24/72 (112)`: o hero começa a 24 px do cabeçalho de propósito (regra §4f:
  cabeçalho ↔ painéis = 24, grupo relacionado).

Avisos que apareceram durante o porte e foram **corrigidos** (não justificados):
| Aviso | Causa | Correção |
|---|---|---|
| 1 link sem texto | logo em SVG inline dentro de `<a>` | `aria-label` no link (texto da copy) e logo decorativa |
| blocos colados (FAQ, 0 px) | resposta fechada do `<details>` contava como bloco | resposta fechada com `visibility:hidden` |
| tela 10/11 com 9–15 blocos | mesma causa | mesma correção (volta ao máximo 9 do aprovado) |
| altura +47..79 px | (a) máscara do SplitText com padding/margem negativa, (b) quebra de linha com peso 500, (c) botão de 2 linhas em 390 | `overflow-clip-margin` na máscara; compensação do item 2.2; `white-space:nowrap` e padding de 12 px |
| H1 com 4 linhas em 1024–1279 px | a base lê `--h1` só no `:root`; o `.hero` redefine `--h1: 5.1vw` | `.v3 h1 { font-size: var(--h1) }` |
| numeral final com o topo cortado | janela do dígito com `line-height .78` | `overflow-clip-margin: .14em` e passo entre dígitos de 1,3 × linha |

### Rostos pequenos na dobra do celular (item 6 do pedido)
Testei ampliar os rostos dentro do mesmo painel (zoom 1,10 · 1,15 · 1,20, com variável `--zoom`, folha comparativa).
**Não há ganho sem custo**: a imagem do painel já termina com o queixo a ~10 px da faixa do nome; qualquer zoom corta
o queixo (1,10 já corta o do André) ou, se o painel crescer para acomodar, empurra o CTA além de 692 px (82 % da
altura, limite do verificador; hoje termina em 664). O orçamento da §4d manda reduzir a foto, não o CTA. Mantive o
painel aprovado (109 × 189 px, rostos ~65 px). O caminho que melhoraria de verdade é outro: foto de corte mais
fechado (busto mais curto, ~10 % menos ombro) gerada no estúdio para o mobile — pede nova rodada de recorte e fica
como recomendação.

## 4. Movimento (arquétipo: placar esportivo)
Regra de ouro: o HTML já é a versão final; o movimento entra por cima, **uma vez**, só `transform`/`opacity`.
Com `prefers-reduced-motion: reduce`: 0 animações, 0 divisão de título, 0 estado escondido (verificado:
`document.getAnimations()` vazio). Sem JS: tudo visível e parado (verificado com todos os scripts bloqueados).

| Onde | O que faz | Como | Custo |
|---|---|---|---|
| Dobra | numerais 01·02·03 **viram** (dígitos sobem; 02 e 03 passam por 1 e 2) | CSS puro ao carregar, defasado 80 ms por painel, 0,46–0,62 s | 0 KB |
| 3 noites | numeral gigante vira ao entrar; numeral e busto andam em sentidos e velocidades diferentes (±8 % × 0–5 %) | roll por IntersectionObserver (uma vez) + `animation-timeline: view()` | ~0 KB |
| "1 × 2." | clímax: o "2." (tinta sobre tinta) aparece quando a tarja ouro varre da esquerda | `scaleX` 0,8 s, uma vez, abaixo da dobra | 0 KB |
| Faixa de selos | rola a 50 px/s (duração medida pela largura), acelera até 2,2× com a rolagem e volta; botão de pausa de 64 px | `Marquee` da base + `playbackRate` | 0,5 KB |
| Por que a PTA | +10.000 e 6 contam de 0 ao valor em 1,1 s; texto final restaurado no fim; `tabular-nums` | rAF, uma vez | 0,8 KB |
| Títulos "Como funciona", "Bônus", "Perguntas" | revelação por linha (máscara, 0,7 s, 90 ms de passo) | GSAP core + SplitText por `import()` em idle (~30 KB gzip, fora do JS inicial) | lazy |
| CTA final | os 3 numerais viram de novo (eco da dobra) | mesmo roll | 0 KB |
| Botões | seta anda 4 px; "Quero esta noite" preenche de ouro; botão grande "magnético" ≤ 6 px (só mouse fino) | CSS + 0,4 KB | 0 KB |
| Entradas | passos, enunciado, bônus, itens do "Por que" sobem 24 px ao entrar | `Reveal` da base (CSS `view()`) | 0 KB |

Leitura em primeiro lugar: nada anima o H1, a foto do LCP, o CTA, o preço/condição nem texto legal; ≤ 1 efeito
principal por tela (dobra: roll; faixa: marquee; 1×2: tarja; por que: contagem); nada pisca; só 2 curvas
(`--ease-marca` na tarja, `--ease-saida` no resto; o GSAP usa `power3.out`, equivalente).
Honestamente, por tipo: 5 nomes de animação no documento (roll, marquee, reveal, desliza, busto); 3 delas são
funções da rolagem (não se movem sozinhas), 1 é loop (faixa, com pausa) e 1 é de entrada única.

## 5. Orçamento e verificação (build de produção, `npm run check -- --routes v3`)
| Item | Limite | v3 |
|---|---|---|
| JS inicial (gzip) | ≤ 150 KB | **136,8 KB** (v1: 134,6 → +2,2 KB) |
| CSS (gzip) | ≤ 40 KB | **11,0 KB** |
| HTML (bruto / gzip) | ≤ 120 KB | 97,2 KB / 16,3 KB (logo do rodapé em `<img>`, não inline: −22 KB) |
| LCP | foto do hero `fetchpriority=high` | LCP = H1 aos 200–244 ms (390 / 1440); os 3 bustos com `fetchpriority="high"` e tamanho declarado |
| CLS | ≤ 0,1 | 0 (390) · 0,0001 (1440) |
| Rolagem horizontal | nenhuma | 0 nas 4 larguras |
| Erros de console | 0 | 0 |
| Tarefa longa | — | 1 de 110–131 ms na hidratação (React da base; igual às outras rotas) |

Comandos: `npm run typecheck` ✔ · `npm run lint` ✔ · `npm test` 12/12 ✔ · `npm run build` ✔ (9 rotas) ·
`check_pagina.py` 0 erros / 2 avisos · build com `NEXT_PUBLIC_BASE_PATH=black` servido em `/black/v3/`: 0 erros,
0 requisições com falha, pop-up e GSAP carregam do prefixo.

## 6. Pop-up (testado em 390 e 1440)
Não abre sozinho · Enter no botão abre · foco no título · ESC fecha e o foco volta ao botão que abriu · envio vazio:
2 erros inline ("Erro:" + ✕ + fio) com foco no 1º campo · nome + WhatsApp válidos → "Enviando…" → "Você está
dentro." com foco no título e botão do grupo · cartão da noite 2 mostra "TER 10/11 · WALTER KRAUSE".
Capturas desta rodada: `.check/v3-modal/` (aberto, erro, enviando, sucesso, cartão da noite, em 390 e 1440).
Sequências do movimento (quadros) e a folha do teste de zoom: `.check/v3-movimento/`.

## 7. O que ainda é imperfeito (a ser decidido pela cliente / próxima rodada)
1. **Rostos do celular continuam em ~65 px** (item 3). Solução real = recorte novo, mais fechado, só para < 600 px.
2. **Safari, Firefox e iOS não foram vistos.** `view()` (parallax) e `text-box-trim` degradam sem quebrar (parallax
   parado; H1 ~6 px mais alto); `overflow-clip-margin` tem reserva (a revelação por linha só perde a folga do acento).
3. **Parallax medido na captura estática**: o verificador fotografa com a rolagem em 0, então os numerais das noites
   aparecem 8 % mais baixos nas PNGs que o visitante verá com o painel no meio da tela.
4. **Roll visto em quadros intermediários** mostra fragmentos de dígitos (é o que um odômetro faz, durante ~120 ms);
   se a cliente achar que "parece defeito" (D1 da lista), trocar por fade de 120 ms.
5. **GSAP "No Charge"**: vale enquanto a página não cobra acesso (é gratuita). O restante não depende dele.
6. Sem contador regressivo (a copy não tem; a base oferece `Countdown`, não foi pedido nesta versão).
7. Título "Perguntas frequentes" fora da copy (item 2.8).
