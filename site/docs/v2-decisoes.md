# v2 · Dossiê — porte para Next.js (decisões)

Data: 10/10/2026. Origem do desenho: `../paginas/v2/index.html` + `decisoes.md` (aprovado em 390/768/1024/1440).
Rota: `/v2/`. Arquivos desta versão (só estes voltam ao projeto principal):

```
app/v2/page.tsx · app/v2/v2.css
components/v2/   Header · Hero · Intro · Roteiro · Ingressos · Condicao · ValorTarja · Bonus · PorQuePta · Faq ·
                 CtaFinal · Footer          (servidor, zero JS próprio)
                 DossieRoot                 (cliente: motor de movimento, ~1 KB)
                 DossieModalHost + DossieModalDialog + post-lead   (cliente: pop-up da v2, lazy)
                 split-lines.ts · v2-text.ts
public/img/v2/   trio-c-640/1100 · andre/walter/carlos-pb-720 (já existiam)
```

Nada em `components/*.tsx`, `lib/*`, `app/globals.css`, `app/layout.tsx` foi alterado. (Na cópia de trabalho `site-v2`
só o `next.config.ts` ganhou `turbopack.root`, porque `node_modules` é uma junção para `../site`; não volta.)

## 1. Igual × diferente do desenho aprovado

**Igual (medido, estático, `prefers-reduced-motion: reduce`, 4 larguras):** altura total da página idêntica
(9998 · 10401 · 10213 · 10031 px) e cada bloco principal (cabeçalho, logo, botão, H1, sub, data, CTA, micro, trio,
10 seções, H2, passos, ingressos, fotos, opções, bônus, números, perguntas, rodapé) a **≤ 0,7 px** do HTML aprovado.
Rolagem horizontal: 0 em 320/360/390/600/768/820/1024/1200/1280/1440/1920. Verificador: **0 erros, 4 avisos = os mesmos
4 do HTML aprovado** (justificados em §6).

**Diferente (de propósito ou inevitável):**
| O quê | Por quê |
|---|---|
| Texto corrido em peso **500** (aprovado: 400) | o Archivo compartilhado é variável **500–800** (decisão da base: "corpo em 500"). Para não mudar nenhuma quebra de linha, o texto de peso 500 recebe `letter-spacing: -0,009em` (devolve a largura do 400; medido: 0,7 px de diferença). Se a cliente preferir 400 exato: pôr `Archivo-400.woff2` (já existe em `paginas/v2/assets/fonts`) em `app/v2/fonts/` e declarar com `next/font/local` (+30 KB). |
| Logo em SVG inline (tom `escuro`) em vez de `<img>` | usa o `<Logo>` compartilhado; 2 inline no cabeçalho (compacta e larga, o CSS mostra uma) |
| Botão: seta de 20 px por SVG do `<ButtonCta>` (aprovado: máscara CSS) | mesmo desenho; stroke 1,9 para igualar o peso |
| Grão do `<body>` a 50% (base: 80%) + camada `multiply` a 12% **só nas seções de papel** | igual ao aprovado (50%) e atende "papel com grão multiply"; 12% porque 22% já mancha e piora a medida de área vazia do verificador |
| Pop-up: variante própria (papel + tinta, ingresso miniatura) | ver §3 |
| Ingressos nascem "impressos" quando o JS liga | movimento (§2); sem JS aparecem prontos |

## 2. Movimento — arquétipo "documento sigiloso"

Regras: 1 gesto principal por tela; só `transform`, `opacity`, `clip-path`, `background-size`; ≤ 0,8 s; uma curva
(`cubic-bezier(.2,.7,.2,1)`, a do desenho aprovado); nada em loop; nada no H1, preço ou campo em uso.
`prefers-reduced-motion: reduce` → nenhum motor liga (testado: `data-io` ausente, 0 linhas divididas, 0 animações
rodando). Sem JS → todo o texto e todos os botões no lugar (testado com JS desligado).

| Onde | Gesto (significado) | Motor | Fallback |
|---|---|---|---|
| Dobra | o trio **emerge da tarja preta**: a tarja sobe atrás (0,8 s) e o trio sobe 28 px com fade de .35→1 (nunca de 0: o LCP é pintado no 1º quadro). Ao rolar, o trio **afunda** até 9% de volta à tarja (parallax mínimo, `scroll()`) | CSS | Firefox/iOS<26: só a entrada (sem parallax) |
| Todos os H2 | sobem **linha a linha** de uma janela (0,7 s, 90 ms entre linhas, uma vez) | `split-lines.ts` + CSS, disparado por IntersectionObserver | sem JS/reduce: título normal |
| Como funciona | numerais 1·2·3 **impressos** de cima para baixo guiados pela rolagem; a tarja inline cobre "os valores" e **se abre** (scrub) | CSS `view()` | IO + transição de 0,6–0,7 s |
| Noites | os 3 ingressos **imprimem** em sequência (0,6 s, 140 ms entre eles; o picote é máscara real) quando a seção entra | CSS transition + IO (todos os navegadores) | — |
| Valor | a tarja de papel sobre "AO VIVO" **se abre guiada pela rolagem** (clip-path, ~30% de rolagem, bloco abaixo da dobra) | CSS `view()` (`cover 12% → 42%`) | IO + transição de 0,9 s |
| Condição · Bônus · frase · CTA final | entrada padrão (fade + 24 px, escalonada) | `<Reveal>` compartilhado | `RevealObserver` do layout |
| Por que a PTA | os 2 números gigantes **imprimem** (mesmo gesto dos passos) | CSS `view()` | IO |
| Perguntas | altura animada por `::details-content` (compartilhado) | CSS | abre sem animação |
| Botões | hover −2/−2 + sombra 6; seta anda 4 px; `:active` afunda | CSS | — |
| Pop-up | abre subindo 20 px (`@starting-style`); no **sucesso** uma **cortina de tarja** fecha da esquerda (0,28 s), troca o conteúdo e abre para a direita (0,52 s); `Enviando…` com giro | CSS + 2 timeouts | reduce: troca direto |

**Por que não SplitText/GSAP:** o `SplitText` recontava as quebras depois de embrulhar as palavras e, com
`text-wrap: balance`, devolveu quebras diferentes das aprovadas (título do passo "Como funciona…" em 3 linhas no lugar
de 2, "PÓS-GRADUAÇÃO / E LEVA 2." no lugar de "PÓS-GRADUAÇÃO E / LEVA 2.") = salto de layout, e custava ~46 KB gzip. O
`split-lines.ts` mede cada palavra com `Range`, agrupa pelo `top` que o navegador já calculou e reescreve o título em
linhas de bloco: **0,000% de diferença de pixels** em 768 e 1440 (e ≤ 4% de antialiasing em 390). Refaz só quando a
LARGURA muda (girar o celular). `aria-label` com o título inteiro; linhas `aria-hidden`. A janela de cada linha usa
`clip-path` com inset negativo (til/acento passam por cima, vírgula por baixo) em vez de padding: nenhuma mudança de altura.
**GSAP não está nesta rota** (0 KB). A licença "No Charge" fica irrelevante aqui.

## 3. Pop-up (variante da v2)

O pop-up compartilhado (`LeadModalDialog`) é escuro e não tem o ingresso miniatura do desenho. Sem editá-lo:
- `DossieModalHost` escuta `click` em `window` na **fase de captura** para `[data-open-modal]` e chama
  `stopPropagation()`: o provedor do layout (que escuta `document`) não vê o clique e só um pop-up abre. Fora da v2 nada muda.
- `DossieModalDialog` (React.lazy, aquecido em idle) repete o contrato do compartilhado: `<dialog>` nativo, só abre por
  clique, foco no título, ESC fecha, clique fora **não** fecha, fechar não apaga o digitado, rótulos visíveis, WhatsApp
  normalizado ao sair do campo, erro com fio 2 px + ✕ + "Erro:" (16 px, `<div role=alert>`), `Enviando…`, 2 falhas →
  "Entrar no grupo mesmo assim", isca anti-robô, `event_id` igual nas duas tentativas, modo demo, `track()`.
  Reaproveita `lib/phone`, `lib/analytics`, `lib/config`, `lib/copy`, `lib/ui-text`; só `postLead` foi copiado (`post-lead.ts`).
- **Ingresso miniatura**: noite pré-selecionada pelo `<ButtonCta noite=…>` ("Noite 2 · Ter 10/11 · Walter Krause ·
  Bodybuilding…") e o **nome digitado aparece no campo Titular** em tempo real; vale também na tela de sucesso.
- Testado em 390 e 1440 (Playwright): 20 verificações, 0 falhas (nenhum pop-up sozinho, abre, foco no título, Tab, ESC,
  foco volta ao botão, clique fora, ingresso pré-selecionado, erro, foco no 1º inválido, nome no ingresso, máscara,
  fechar sem apagar, cortina, sucesso, foco no título do sucesso, botão do grupo, foco de volta). Também em `/black/v2/`.

## 4. Orçamento (medido no build)

| Item | Limite | v2 |
|---|---|---|
| JS inicial (gzip, sem `noModule`) | ≤ 150 KB | **136 KB** (esqueleto v1: 134,6 KB → esta versão custa ~1,4 KB; o pop-up é chunk lazy) |
| CSS (gzip) | ≤ 40 KB | **12,4 KB** (compartilhado + v2) |
| HTML | ≤ 120 KB bruto | 100,7 KB (19,9 KB gzip; inclui 2 logos inline que o RSC repete) |
| LCP | foto `fetchpriority=high` | `<img>` do trio, 216–432 ms (4× CPU no celular) |
| CLS | ≤ 0,1 | **0,000** (carga + rolagem completa) |
| Rolagem horizontal | nenhuma | nenhuma em 11 larguras |
| Console | sem erros | 0 (produção e `next dev`, incl. hidratação) |

Fontes: as 3 do compartilhado (45 KB pré-carregados). Fotos dos ingressos `loading=lazy`.

## 5. Textos que não estão na copy

4 rótulos de composição do desenho aprovado ficaram em `components/v2/v2-text.ts` (a base não permite editar
`content/pagina-mae.copy.json`): **"Valor"** e **"Ao vivo"** (seção da tarja), **"Perguntas"** (título do FAQ) e
**"Titular"** (rótulo do ingresso miniatura). Também de lá: o dia da semana por extenso do `alt` das fotos
("segunda-feira"…) e a quebra de `eventLine()` (`copy.barra.texto` → data e hora). Todo o resto vem de `lib/copy.ts`.
Se a cliente quiser, mover os 4 rótulos para o JSON e apagar `v2-text.ts` (6 linhas).

## 6. Avisos do verificador que sobram (4, os mesmos do aprovado)

- 390/768 "hero com respiro 24 (< 72/112)": o 24 é o vão cabeçalho↔trio do sistema; o respiro DE BAIXO (72/112) passa.
- 390/768 "telas 4–5 com < 38% vazio": são os ingressos (foto colorida + texto + canhoto, 1 por linha). Ar extra
  deixaria o ingresso mais longo que a tela. Medido ≈ 35%.

Avisos que existiram no caminho e foram **corrigidos** (não são mais avisos):
- "blocos colados 0 px" e "telas com 9–14 blocos": o `<p>` da resposta fechada do Accordion compartilhado contava como
  bloco visível. O FAQ da v2 usa as classes `.pta-acc*` com a resposta em `<div>` (mesma animação, sem o falso positivo).
- "1 link sem texto": o link da logo (SVG decorativo) agora tem `aria-label="Black PTA ao Vivo"`.
- "tela 1 com pouca área vazia" em 1440: a camada de grão `multiply` a 22% sujava o papel na medida; 12% volta ao valor aprovado.

## 7. Armadilhas encontradas (não repetir)

1. **Turbopack e junção**: `node_modules` como junção para fora da pasta derruba o build ("Symlink … leaves the filesystem
   root"). Em cópia de trabalho: `turbopack.root` apontando para a pasta pai.
2. **`overflow: hidden` prende a linha do tempo `view()`**: a tarja do VALOR ficou parada porque o `.valor-campo`
   (overflow hidden) virou o "scroller" da animação. Use `overflow: clip`.
3. **`text-wrap: balance` + SplitText** muda as quebras (§2). Medir linha a linha antes de embrulhar.
4. **Margem negativa em janela de máscara muda a altura do grid** (+0,26 em, 16 px de deslocamento em 1440): usar
   `clip-path` com inset negativo.
5. **`animation-fill-mode: both` mantém camada composta**: a borda de 1 px da tarja saía 1 px fora. Entradas de carga
   usam `backwards`.
6. Base compartilhada: `h3 { text-wrap: balance }` quebrava "CONHEÇA A CONDIÇÃO BLACK." diferente do aprovado → `wrap` nos
   h3 da v2. Botão do cabeçalho tem borda **ouro** no aprovado (herdada de `.barra .btn`).
7. O provedor do layout continua aquecendo o chunk do pop-up compartilhado em idle (~4 KB gzip) sem uso na v2: não dá
   para evitar sem editar `app/layout.tsx`.

## 8. O que considero imperfeito

- **Peso 500 no texto corrido** (§1): a leitura é um pouco mais "cheia" que o aprovado; quebras idênticas, mas o
  traço é mais escuro. Decisão a tomar: aceitar (consistente com v1/v3) ou +30 KB de fonte.
- **Firefox e iOS < 26** não têm `animation-timeline`: o scrub (tarja do VALOR, numerais, parallax) vira transição com
  tempo por IntersectionObserver. Testei a lógica (forçando `data-io="all"`), **não** testei em Firefox/Safari reais.
- **Safari/iOS** não testado para o pop-up (`closedby`, `@starting-style`, foco ao fechar tem reserva `opener.focus()`).
- As fotos dos ingressos são `lazy`: num salto direto de âncora o painel colorido "imprime" antes da cara carregar
  (some na rolagem normal; não afeta LCP). Alternativa: `loading=eager` (+91 KB no carregamento).
- Primeiro quadro da dobra mostra o trio a 35% de opacidade por ~100 ms (a entrada); se incomodar, tirar o fade e
  deixar só a subida.
- O botão de sucesso do pop-up usa `#grupo-whatsapp` até `NEXT_PUBLIC_GROUP_URL` ser definido (demo).
