# Decisões técnicas — base Next.js das páginas Black PTA ao Vivo

Data: 10/10/2026. Contexto: trocar as 3 páginas HTML puras (v1 Sala de controle, v2 Dossiê, v3 Placar,
aprovadas no desenho) por um projeto de tecnologia atual, com potencial máximo de elementos e movimento,
**hospedável na Vercel e na Hostinger (compartilhada = só arquivos estáticos)**.

## Resumo

| Decisão | Escolha | Por quê (curto) |
|---|---|---|
| Framework | **Next.js 16.4 `output: 'export'`**, `trailingSlash: true`, `images.unoptimized` | build estático (`out/`) serve em Apache e na Vercel; mesmo código nas duas; componentes React reaproveitados nas 3 versões |
| UI | React 19.3 + TypeScript **5.9.3** | TS 7 (nativo) ainda não é compatível com o ecossistema (eslint-config-next, typescript-eslint); 5.9 é a última 5.x estável |
| Estilo | **Tailwind v4** (`@theme static`) + CSS próprio `.pta-*` | tokens viram variáveis CSS **e** utilidades (`bg-ouro`, `p-g2`); componentes complexos (dialog, scroll-driven) ficam em CSS à mão |
| Movimento | **CSS scroll-driven** 1ª escolha; **GSAP 3.15** sob demanda; Lenis opcional | CSS não custa JS; GSAP só para pin/SplitText; licença "No Charge" vale (página gratuita) |
| Pop-up | `<dialog>` nativo, carregado por `React.lazy` | acessibilidade de graça; 0 KB no JS inicial; pré-aquecido em idle |
| Grão | tile PNG fixo (CSS) + WebGL próprio só em seções | tile estático é barato no celular; shader de 1,3 KB para "fumaça de ouro" |
| Hospedagem | `vercel.json` + `public/.htaccess` + `NEXT_PUBLIC_BASE_PATH` | funciona em raiz, subpasta e subdomínio |

## 1. Por que Next.js em exportação estática (e não HTML puro, Astro ou Vite)

- **Compartilhar o sistema**: pop-up, relógio de 5 estados, máscara de WhatsApp, logos, fotos, tokens e
  verificador são iguais nas 3 versões. Em HTML puro cada versão tinha sua cópia e as correções (4 rodadas da
  cliente) tinham que ser repetidas à mão.
- **Estático de verdade**: com `output: 'export'` não existe servidor. O que é dinâmico (relógio, formulário,
  rotação) roda no navegador. Hostinger compartilhada hospeda sem Node.
- **Mesma saída na Vercel**: a Vercel detecta o export e serve `out/` na borda com `vercel.json` (cache,
  segurança). Sem ISR/Edge: portabilidade total, sem lock-in.
- **Ecossistema**: TypeScript, ESLint, Tailwind, `next/font` (preload, fonte-reserva com métricas ajustadas,
  sem Google em tempo de execução), metadados e favicon por convenção.

Trade-offs aceitos:
- **Base de JS maior que HTML puro**: React + runtime do Next ≈ 120 KB gzip. O orçamento é 150 KB; ficamos em
  ~135 KB. A mitigação é estrutural: modal em chunk lazy, GSAP/Lenis/WebGL em `import()` em idle, Logo e Photo
  como componentes de servidor (zero JS), Accordion/Reveal/Marquee em CSS.
- **Sem otimização de imagem em tempo real** (`next/image`): as imagens já saem do estúdio em WebP com
  `srcset` próprio (`scripts/` do estúdio). `<picture>` à mão dá art direction (trio compacta × larga).
- **Pouca folga**: ~15 KB de JS sobrando. Regra: nada pesado no topo de arquivo; `npm run size` roda no `check`.

## 2. Alternativas descartadas

| Alternativa | Por que não |
|---|---|
| **HTML puro + um `_shared.js`** (estado atual) | repete código nas 3 versões; sem tipos; sem verificação de copy; sem tokens compartilhados |
| **Astro** | ótimo para estático e leve (ilhas), mas o projeto já tem a regra de "React + Tailwind" na equipe e a skill de páginas; o ganho de ~100 KB de JS não compensa trocar o ferramental. Candidato forte se o orçamento apertar |
| **Next com servidor (SSR/ISR, API routes)** | impossível na Hostinger compartilhada; exigiria Vercel apenas; proibido pelo briefing |
| **three.js / React Three Fiber** | 130+ KB gzip para um efeito que um shader de 1,3 KB resolve; pesa no celular de entrada |
| **Framer Motion / Motion** | 40+ KB; o que ele faz, CSS `view()` + GSAP sob demanda fazem |
| **Remotion** | licença paga acima de 3 funcionários; não é para página |
| **Locomotive / ScrollSmoother (rolagem sequestrada)** | atrapalha leitura, âncoras e acessibilidade; Lenis opcional e só desktop já cobre |
| **Biblioteca de máscara (IMask, libphonenumber)** | 15–80 KB para o que 6 linhas próprias fazem (DDD, 11 dígitos); só valida BR |
| **Biblioteca de modal (Radix, Headless UI)** | `<dialog>` nativo tem foco preso, ESC, `inert`, `::backdrop` e animação com `@starting-style` |
| **Formulário com Server Action** | não existe servidor; POST direto a webhook (Make/n8n) ou `lead.php` |
| **TypeScript 7 nativo** | `typescript-eslint` 8 declara suporte só até TS < 6.1; mantido em 5.9.3 fixo |
| **ESLint 10** | `eslint-plugin-react` 7.37 (dependência do eslint-config-next) declara peer só até ESLint 9; fixado em 9.39 |

## 3. Tailwind v4: como usamos

- `@import 'tailwindcss' source(none)` + `@source` explícito (`app`, `components`, `lib`): a varredura não
  entra em `docs/` nem em `out/`.
- `@theme static` com **reset** das paletas (`--color-*: initial`, também breakpoints, raios e tamanhos): só
  existem as cores e escalas da marca. Não há `bg-blue-500`. `static` garante que **todo** token vire variável
  CSS (CSS próprio de cada versão usa `var(--color-ouro)` mesmo sem utilidade correspondente).
- Espaço semântico responsivo (`--m`, `--g1/g2/g3`, `--sec`, `--gut`) em `:root` com media queries; exposto como
  utilidades por `@theme inline` (`px-margem`, `gap-g2`, `py-secao`). A escala 4·8·12·16·24·32·40·48·64·96·128·
  160·200 do contrato §4f é a escala numérica padrão do Tailwind (`p-6` = 24 px).
- Tipografia: 5 degraus (label 14, body 18→20, lead 28→44, h2 40→76, h1 40→84) + numerais gigantes.
  `clamp()` com termo em `rem` + `vw` (passa no zoom de 200%).
- Componentes complexos ficam em `styles/components.css` com prefixo `.pta-` e variáveis de ajuste
  (`--btn-radius`, `--mq-bg`, `--acc-line`…): cada versão sobrescreve variável, não o arquivo.

## 4. Movimento: política e custo

- **CSS `animation-timeline: view()`** (`Reveal`): thread do compositor, 0 KB de JS, reversível sem estado.
  Reserva por IO (`RevealObserver`, ~0,4 KB) só onde `view()` não existe; nada fica `opacity:0` sem JS.
- **GSAP 3.15 por `import()`** em `requestIdleCallback` (`lib/gsap.ts`, `useGsap`): contexto com cleanup,
  `prefers-reduced-motion` respeitado, `ScrollTrigger.refresh()` após `document.fonts.ready`. Chunks de
  ~26 KB (core), ~17 KB (ScrollTrigger), ~3 KB (SplitText) gzip, **fora do JS inicial**.
- **Licença GSAP**: "Standard No Charge" da Webflow — grátis para sites que não cobram acesso. Registrado no
  README e em `lib/gsap.ts`. Risco: a Webflow pode mudar a licença; mitigação: nada crítico depende de GSAP.
- **Lenis** (5 KB gzip, MIT): só desktop com mouse, `NEXT_PUBLIC_SMOOTH_SCROLL=1`, `import()` em idle.
  Desligado por padrão (premium não é rolagem lenta; é opção por versão).
- **Grão WebGL** (`Grain`): 1 canvas a 0,5×, `fps` limitado a 24, pausa fora da tela/aba oculta,
  quadro fixo em reduced-motion, fallback CSS (gradiente + tile PNG). O grão FIXO da página inteira é CSS
  (`body::after`), não WebGL: pesquisa 18 §5.4 (tile estático, nunca `feTurbulence` animado).

## 5. Pop-up de captura

- `<dialog>` + `showModal()`: abre **só por clique** (delegação em `[data-open-modal]` ou `useLeadModal()`);
  foco no título; ESC fecha; clique fora **não** fecha (padrão do modal; `closedby="closerequest"`); fechar
  não apaga os dados (estado do formulário vive no componente, que fica montado); foco volta ao botão.
- **Lazy**: `LeadModal.tsx` (provedor, ~1 KB) fica no layout; `LeadModalDialog.tsx` (formulário, validação,
  envio) é `React.lazy` e aquecido em idle. O 1º clique abre sem espera perceptível (testado em 390 e 1440).
- **WhatsApp**: normaliza ao sair do campo (não a cada tecla: quebra apagar/colar), aceita `+55`/`55`/`0`, 67
  DDDs, celular de 11 dígitos com 9; `type="tel"`, `autocomplete="tel-national"`, campo ≥ 16 px. Testes em
  `lib/phone.test.ts`.
- **Erro**: fio de 2 px + ✕ + "Erro:" (nunca só cor), `aria-invalid` + `aria-describedby`, foco no 1º inválido,
  erro some a cada tecla assim que o campo fica válido. Cor `#FFB4AB` no escuro, `#9E1B32` no papel.
- **Envio**: JSON ao endpoint com timeout; 2ª tentativa `no-cors` (resolve o caso comum do Make/n8n sem
  cabeçalho CORS) com o **mesmo `event_id`** para deduplicação; após 2 falhas, "Entrar no grupo mesmo assim".
  Modo demo sem endpoint. Isca (honeypot) contra robôs. UTM/fbclid anexados ao payload.
- **Consentimento**: texto curto da copy sob o botão, **sem caixa** (entrega do link "a pedido do titular",
  pesquisa 18 §2.5, opção A). Se houver marketing posterior, adicionar caixa desmarcada. Confirmar com advogado.
- Safari/iOS **não foi testado** em aparelho (sem dispositivo): foco ao fechar tem reserva (`opener.focus()`);
  `body:has(dialog[open])` trava a rolagem; plano B em pesquisa 18 §2.8.

## 6. Relógio honesto

- Máquina pura (`lib/event.ts`): 5 estados `before · today · live · between · ended` a partir de ISO com
  `-03:00` (Brasil sem horário de verão). Testes cobrem limites exatos e virada de dia.
- **Nunca "00 dias"**: dias só aparecem se ≥ 1. Sem JS ou antes de hidratar mostra a linha de data da copy.
  Render no servidor e no cliente são idênticos (`useSyncExternalStore` com snapshot de servidor `null`):
  não há descompasso entre o HTML do build e a hora de quem abre.
- Texto 1×/s; timecode `aria-hidden`; frase `aria-live="polite"` muda só quando o estado muda; botão
  "Congelar" (WCAG 2.2.2). `?agora=` simula o relógio (só no navegador de quem abriu o link).

## 7. Logo, fotos, fontes

- **Logo**: SVG inline como componente de **servidor** (`currentColor`; tons ouro/claro/escuro). Os 10 SVG
  (A·Tarja e C·REC × pta/nome/símbolo × ao vivo) são otimizados por `scripts/build-logos.mjs` (números a 2
  casas, sem ids): 17,7 → 11 KB por logo. `mode="img"` existe para repetir sem inflar o HTML.
- **Foto**: `<picture>` com `srcset`; `priority` = `loading=eager` + `fetchpriority=high` + `decoding=sync`.
  Largura/altura sempre declaradas (CLS 0).
- **Fontes**: woff2 em subconjunto Latin/PT-BR (`npm run assets`): Big Shoulders 900 (18 KB), Archivo variável
  500–800 com largura fixa (27 KB), Azeret Mono 500/600 (9 KB cada). `font-display: swap` e fonte-reserva com
  métricas ajustadas pelo `next/font`. Corpo em **peso 500** (o variável começa em 500; mais legível no escuro).

## 8. Verificação automática

- `npm run check`: build → servidor estático em porta livre (imita Apache: 301 para barra final, 404.html,
  gzip) → `check_pagina.py` em v1/v2/v3 → peso. Código de saída 1 com qualquer erro.
- Ajustes feitos no `check_pagina.py` do estúdio para este stack: (a) reconhece logo em SVG inline pelo atributo
  `data-logo` (antes só `<img>`); (b) desliga as revelações `.pta-reveal` antes da captura de página inteira
  (senão tudo abaixo da dobra sai invisível por causa do `view()`).

## 9. Armadilhas encontradas (para não repetir)

1. `next/link` + `output: 'export'` + `trailingSlash: true` no Next 16.4: o prefetch pede
   `__next.v1.__PAGE__.txt` e o arquivo gerado é `__next.v1/__PAGE__.txt` → 404 no console. Usamos `<a>`.
2. O Next **não copia** `public/.htaccess` (arquivo oculto) para `out/`: `scripts/postbuild.mjs` copia.
3. Git Bash no Windows converte `/black` em caminho de disco (`NEXT_PUBLIC_BASE_PATH=/black` quebra o build com
   "Missing parameter name"). Use `black` sem a barra (a base normaliza).
4. Servidor estático e `spawnSync` no mesmo processo travam o loop de eventos: o `check` usa `spawn` assíncrono.
5. Grid de uma coluna com filho `nowrap` estoura o container (min-width:auto): usar `minmax(0,1fr)`.
6. `<p>`/`<li>` < 16 px = erro no verificador; rótulos de 14 px vão em `<span>/<small>/<div>`.
7. Provedor do pop-up importando `NIGHT_IDS` de `copy.ts` puxava o JSON inteiro da copy para todo bundle:
   chaves das noites ficam em `lib/nights.ts`, sem texto.

## 10. O que ficou de fora de propósito

- Pixel/CAPI reais (só o stub `track()` com `event_id`); QR do grupo no desktop; botão "adicionar à agenda";
  `.ics`; página de obrigado separada; JSON-LD de evento. Todos cabem em componentes novos sobre esta base.
- Teste em Safari/iOS e Firefox: a base usa recursos com reserva (`view()`, `@starting-style`, `::details-content`,
  `text-box`) que degradam sem quebrar, mas **não foram vistos** nesses navegadores.
