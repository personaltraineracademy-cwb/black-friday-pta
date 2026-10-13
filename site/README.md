# Black PTA ao Vivo — páginas de captura (Next.js 16, exportação estática)

Base compartilhada das 3 versões da página de captura do evento **Black PTA ao Vivo** (Personal Trainer
Academy): `/v1/` Sala de controle · `/v2/` Dossiê · `/v3/` Placar. O site é **100% estático**: `npm run build`
gera a pasta `out/` (HTML + JS + CSS + imagens), que roda em qualquer hospedagem (Vercel, Hostinger, Netlify…).

> Estado (10/10/2026): **as 3 versões estão prontas**, com a copy final da campanha, pop-up de captura, relógio
> de 5 estados e movimento por versão. `npm run build` gera tudo. Cada versão é independente; depois da escolha,
> veja "Escolher a versão final" no fim deste arquivo.

## Rodar

Requisitos: Node 22+ e npm 10+ (testado em Node 22.17).

```bash
npm install
npm run dev          # http://localhost:3000   (/, /v1/, /v2/, /v3/)
npm run build        # gera out/ (e copia .htaccess para out/)
npm run start:out    # serve out/ em http://localhost:4173 imitando produção (301 de /v1 para /v1/, 404.html, gzip)
npm run lint         # ESLint (flat config, eslint-config-next)
npm run typecheck    # tsc --noEmit
npm test             # máquina de estados do relógio + normalização do WhatsApp (node:test)
npm run size         # peso inicial (JS/CSS gzip) por rota vs orçamento
npm run check        # build + servidor em porta livre + check_pagina.py em v1, v2, v3 + peso
```

`npm run check -- --no-build` reaproveita o `out/`. Os relatórios e screenshots ficam em `.check/<rota>/`
(`390.png`, `768.png`, `1024.png`, `1440.png`, `*-dobra.png`, `*-modal.png`, `_folha.jpg`, `_relatorio.json`).
O verificador é o do estúdio (`C:\Users\User\design\skills\direcao-de-arte\scripts\check_pagina.py`; outro
caminho em `CHECK_PAGINA`). Ele precisa terminar com **0 erros**; avisos são perguntas a responder.

## Estrutura

```
app/
  layout.tsx          lang pt-BR, metadados, viewport, provedor do pop-up, fontes
  globals.css         @theme (tokens Tailwind v4) + variáveis responsivas de espaço
  fonts.ts            next/font/local: Big Shoulders 900 · Archivo 500–800 · Azeret Mono 500/600
  page.tsx            índice (links para /v1 /v2 /v3 /kit)
  v1|v2|v3/page.tsx   ESQUELETOS das versões (substituir pelo design)
  kit/                vitrine dos componentes e tokens (teste visual; apague no deploy final)
  robots.ts · not-found.tsx · icon.svg · apple-icon.png
components/           ButtonCta · Logo · Photo · Reveal(+RevealObserver) · Accordion · Marquee · Countdown
                      Grain · StickyCta · SmoothScroll · LeadModal(+LeadModalDialog)
lib/
  copy.ts             COPY FINAL tipada (a partir de content/pagina-mae.copy.json)
  ui-text.ts          rótulos de interface neutros (Fechar, Enviando…, Erro:, estados do relógio)
  config.ts           variáveis NEXT_PUBLIC_*
  event.ts            máquina de estados do evento (pura, testada) · use-event-state.ts (hooks)
  phone.ts            WhatsApp BR (67 DDDs, 11 dígitos) · analytics.ts (stub) · gsap.ts · idle.ts
  nights.ts · photos.ts · url.ts (BASE_PATH) · logos.generated.ts (gerado)
content/pagina-mae.copy.json   copy final (única fonte de texto comercial)
public/               img/ (fotos webp, grão), logos/ (svg), og.png, licencas/, .htaccess
styles/               base.css + components.css (classes .pta-*)
scripts/              build-assets.py · build-logos.mjs · serve-out.mjs · check.mjs · size.mjs · postbuild.mjs
docs/DECISOES.md      por que estas escolhas, trade-offs, alternativas descartadas
vercel.json · .env.example
```

## Trocar copy, datas, endpoint e link do grupo

| O quê | Onde | Depois |
|---|---|---|
| Texto da página | `content/pagina-mae.copy.json` (nunca na página/JSX) | `npm run build` |
| Rótulos de interface (Fechar, Enviando…) | `lib/ui-text.ts` | build |
| Datas das noites | `NEXT_PUBLIC_EVENT_START` (ISO com `-03:00`; noites 2 e 3 = +1 e +2 dias, 2 h cada) **e** os `noite` dos cartões na copy ("Seg 9/11") | build |
| Endpoint do formulário | `NEXT_PUBLIC_LEAD_ENDPOINT` | build |
| Link do grupo | `NEXT_PUBLIC_GROUP_URL` | build |
| URL final / OG | `NEXT_PUBLIC_SITE_URL` | build |
| Subpasta | `NEXT_PUBLIC_BASE_PATH=black` | build |
| Indexação | `NEXT_PUBLIC_NOINDEX=0` na versão final (padrão 1 = `noindex` + `robots.txt` bloqueando) | build |
| Rolagem suave (Lenis, desktop) | `NEXT_PUBLIC_SMOOTH_SCROLL=1` | build |

Copie `.env.example` para `.env.local` (dev) ou cadastre as variáveis no painel da Vercel. **No build estático
os valores são gravados no JavaScript**: mudou uma variável, rode o build de novo e reenvie `out/`.
Se a copy e `NEXT_PUBLIC_EVENT_START` divergirem (ex.: copy "Seg 9/11" e data na terça), o build avisa.

Simulação de relógio para QA: `/v1/?agora=2026-11-10T21:00:00-03:00` (o relógio anda a partir dessa hora).
O `/kit/` mostra os 5 estados fixos lado a lado.

### Formulário: o que o servidor recebe

`POST` com `Content-Type: application/json` para `NEXT_PUBLIC_LEAD_ENDPOINT`:

```json
{
  "event_id": "2f0c…",                  // o MESMO id vai para o Pixel e para a API de Conversões (deduplicação)
  "nome": "Maria Souza",
  "whatsapp": "5511912345678",          // só dígitos, com 55
  "whatsapp_formatado": "(11) 91234-5678",
  "email": "",                          // opcional
  "noite": "andre",                     // andre | walter | carlos | null (botão do cartão da noite)
  "origem": "hero",                     // hero | barra | barra-fixa | cartao-… | final
  "pagina": "/v1/",
  "utm": { "utm_source": "instagram", "fbclid": "…" },
  "consentimento": "Usaremos seus dados só para…",
  "enviado_em": "2026-10-10T20:11:05.123Z"
}
```

Comportamento do envio: timeout de 8 s; se o navegador bloquear a leitura da resposta (CORS) ou a rede falhar,
há uma 2ª tentativa `no-cors` (`text/plain` com o mesmo JSON, **mesmo `event_id`**) — por isso o servidor deve
**deduplicar por `event_id`**. Depois de 2 falhas seguidas aparece "Entrar no grupo mesmo assim". Sem endpoint
(vazio) o formulário só **simula** o sucesso (modo demo; `data-demo` no `<dialog>`).

Exemplos de endpoint (todos gratuitos/baratos; nenhum chaveiro vai para o navegador):

1. **Make (Integromat)**: cenário "Custom webhook" → copie a URL do webhook → `NEXT_PUBLIC_LEAD_ENDPOINT`.
   Módulos seguintes: Google Sheets "Add a row", WhatsApp/ManyChat, Meta Conversions API (use `event_id`).
2. **n8n**: nó *Webhook* (método POST, "Respond: Immediately", `Allow Origins` = seu domínio) → *Google Sheets*
   / *HTTP Request* para a CAPI.
3. **Hostinger, PHP simples** (`public_html/lead.php`, na mesma origem: sem CORS):

```php
<?php
// lead.php — recebe o JSON, grava uma linha em leads.csv (fora de public_html é melhor) e responde 204.
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
$raw = file_get_contents('php://input');
$d = json_decode($raw, true);
if (!is_array($d) || empty($d['event_id']) || empty($d['whatsapp'])) { http_response_code(400); exit; }
$arquivo = __DIR__ . '/../leads.csv';               // ajuste: pasta NÃO pública
$ja = is_file($arquivo) ? file_get_contents($arquivo) : '';
if (strpos($ja, $d['event_id']) !== false) { http_response_code(204); exit; }   // deduplica
$linha = [date('c'), $d['event_id'], $d['nome'] ?? '', $d['whatsapp'], $d['email'] ?? '', $d['noite'] ?? '', $d['origem'] ?? ''];
$f = fopen($arquivo, 'ab'); fputcsv($f, $linha); fclose($f);
http_response_code(204);
```

   Aponte `NEXT_PUBLIC_LEAD_ENDPOINT=/lead.php` (ou `/black/lead.php` em subpasta) e **envie o `lead.php` junto
   com `out/`** (ele não faz parte do build). Em produção troque o CSV por e-mail/planilha/banco e valide
   o tamanho dos campos.

## Deploy

### Vercel
1. Suba esta pasta para um repositório (ou use a CLI: `npm i -g vercel` → `vercel` dentro da pasta).
2. "Add New Project" → importe → *Framework Preset*: Next.js (detecta `output: 'export'` sozinho; a pasta de
   saída é `out`). Build: `npm run build`.
3. Em *Settings → Environment Variables* cadastre as `NEXT_PUBLIC_*` (Production e Preview).
4. `vercel.json` já define cache imutável para `/_next/static`, cache de 30 dias para `/img` e `/logos` e
   cabeçalhos de segurança. Domínio: *Settings → Domains*.

### Hostinger (hospedagem compartilhada, só arquivos estáticos)
1. No seu computador: `npm install` e `npm run build` (com as variáveis no `.env.local`).
2. Painel da Hostinger → *Gerenciador de arquivos* (ou FTP) → `public_html`.
3. **Raiz do domínio** (`seudominio.com.br`): envie **o conteúdo** de `out/` (não a pasta `out` em si) para
   `public_html/`. Confirme que o `.htaccess` foi junto (arquivo oculto: ative "mostrar ocultos").
4. **Subpasta** (`seudominio.com.br/black/`): rode o build com `NEXT_PUBLIC_BASE_PATH=black`
   (PowerShell: `$env:NEXT_PUBLIC_BASE_PATH="black"; npm run build`; no Git Bash use `black` **sem a barra**,
   senão o Windows converte `/black` num caminho de disco), envie o conteúdo de `out/` para
   `public_html/black/` e, no `.htaccess`, troque a linha do `ErrorDocument 404` pelo caminho com `/black/`.
5. **Subdomínio** (`black.seudominio.com.br`): crie o subdomínio no painel, aponte para uma pasta própria e
   envie o conteúdo de `out/` lá. É o caminho mais simples (sem `BASE_PATH`).
6. Ative o SSL gratuito (*Segurança → SSL*) e, depois, descomente o bloco "forçar HTTPS" do `.htaccess`.
7. Teste: `/v1/` abre; `/v1` redireciona para `/v1/`; uma URL inexistente mostra a página 404 da marca.
   Depois de qualquer novo build, reenvie `out/` inteiro (os arquivos `/_next/static/*` mudam de nome).

## Orçamento de desempenho (medido por `npm run size`)

| Item | Limite | Hoje (`/v1/`) |
|---|---|---|
| JS inicial da rota (gzip, sem polyfill `noModule`) | ≤ 150 KB | ~135 KB (React + runtime do Next ≈ 120 KB; o resto é nosso) |
| CSS (gzip) | ≤ 40 KB | ~7 KB |
| LCP | foto do hero com `fetchpriority="high"` | `<Photo priority>` |
| Rolagem horizontal | nenhuma em 390/768/1024/1440 | verificado |

Sobra pouca folga de JS: **o que é novo e pesado entra por `import()` em idle** (ver `lib/gsap.ts`), nunca
no topo do arquivo. GSAP (+ScrollTrigger +SplitText) pesa ~47 KB gzip em chunks separados, só carregados na
rota que chama `useGsap`.

## Política de movimento (atual, 11/10/2026)

- O movimento roda **sempre**, para todos. `<html data-movimento="total | suave | parado">` (script em `app/layout.tsx`):
  `total` padrão; `suave` quando o sistema do visitante pede menos movimento (mesma coreografia, curta, sem parallax/tilt,
  faixa mais lenta com botão de pausa); `parado` só por `?movimento=parado` (impressão/teste). Em JS: `motionMode()`.
- Só `transform`/`opacity`/`clip-path`; uma vez; ≤ 0,7 s; nunca no H1, na foto do LCP nem no CTA principal (exceto a seta).
  Estado natural do CSS = estado final (`animation-fill-mode: forwards`). Sem JS: tudo visível.
- Padrão de página (dobra = tela inteira, tokens, ordem imagem → título → botão): `skills/direcao-de-arte/references/padrao-de-pagina.md`.

## Testes

```bash
python <skills>/direcao-de-arte/scripts/check_pagina.py http://localhost:4173/v2/ -o pasta   # contrato de design
python <skills>/direcao-de-arte/scripts/teste_pagina_total.py http://localhost:4173/v2/ -o pasta  # bateria completa
```

## Licenças

- **GSAP 3.15 (core, ScrollTrigger, SplitText)**: licença gratuita **"Standard No Charge"** da Webflow
  (https://gsap.com/standard-license/). Vale **enquanto o site não cobra pelo acesso** — esta página de captura
  é gratuita. Se passar a cobrar, trocar por CSS puro ou revisar a licença. Cópia do texto:
  `public/licencas/GSAP-standard-no-charge.txt` (vai junto no deploy).
- Lenis 1.3 (MIT), Next.js e React (MIT), Tailwind CSS (MIT).
- Fontes Big Shoulders, Archivo e Azeret Mono: **SIL OFL 1.1** (`public/licencas/`).
- Fotos: reais, dos professores, cedidas pela PTA. Nunca gerar pessoa por IA.

## O que NÃO fazer

- Não adicionar API routes, middleware, Server Actions, `next/image` com otimização, `revalidate` ou rotas
  dinâmicas sem `generateStaticParams`: quebram o `output: 'export'` ou exigem servidor (Hostinger não tem).
- Não escrever texto de venda no JSX; tudo vem de `lib/copy.ts`. Nada de "últimas vagas", contador falso,
  preço inventado, "de/por". Notas de orientação ficam em `pagina-mae.pendencias.md`, nunca na página.
- Não abrir o pop-up sozinho (ao carregar, ao sair, por tempo). Só por clique.
- Não usar `<p>`/`<li>` com menos de 16 px (o verificador reprova); rótulos de 14 px vão em `<span>/<small>/<div>`.
- Não usar `next/link` para trocar de versão (prefetch dá 404 no export com `trailingSlash`); use `<a href={withBase('/v2/')}>`.
- Não referenciar imagens por `/img/x.webp` solto: use `withBase('/img/x.webp')` ou os componentes `Photo`/`Logo`
  (senão quebra em subpasta). Em CSS, prefira `<img>`; para fundo use uma variável como `--grain-url`.
- Não importar `gsap` no topo de um componente (entra no JS inicial); use `loadGsap()`/`useGsap`.
- Não mexer em `lib/logos.generated.ts` à mão (`npm run logos` regenera de `assets-src/logos/`).
- Não pôr `type="number"` em telefone. Não validar a cada tecla antes de a pessoa sair do campo.
- Não subir `.env`, `node_modules`, `.check`, `_scratch`. (A rota de testes `/kit/` já foi removida.)

## Versões prontas

| Rota | Versão | Logo | Ideia | Decisões |
|---|---|---|---|---|
| `/v1/` | Sala de controle | C·REC (visor) | painel de transmissão, relógio, 3 canais | `docs/v1-decisoes.md` |
| `/v2/` | Dossiê | A·Tarja, papel | documento de produção, ingressos, fios | `docs/v2-decisoes.md` |
| `/v3/` | Placar | A·Tarja, ao vivo | painéis 01·02·03 e o placar 1 × 2 | `docs/v3-decisoes.md` |

Código de cada versão: `app/vN/`, `components/vN/`, imagens em `public/img/vN/`. Tudo o que é comum (pop-up,
botão, relógio, foto, logo, fontes, textos) vem da base e da copy em `content/pagina-mae.copy.json`.

## Escolher a versão final (e publicar só ela)

1. Defina a versão: apague as outras pastas `app/vN`, `components/vN`, `public/img/vN` e a lista em `app/page.tsx`
   (ou troque `app/page.tsx` por um redirecionamento para `/vN/`).
2. Em `.env.local` / painel da hospedagem: `NEXT_PUBLIC_NOINDEX=0` (com `1` o site pede aos buscadores para NÃO
   indexar; é o padrão enquanto as 3 versões coexistem), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GROUP_URL` (link do
   grupo) e `NEXT_PUBLIC_LEAD_ENDPOINT` (quem recebe o formulário; vazio = demonstração).
3. `npm run build` e envie `out/`. Dois pacotes já prontos acompanham a entrega: `black-pta-raiz.zip` (domínio ou
   subdomínio) e `black-pta-subpasta-black.zip` (`seudominio.com.br/black/`).

## Aprendizados do porte (já aplicados; vale para a próxima página)

- Animação ligada à rolagem usa `animation-fill-mode: forwards`, **nunca `both`**: antes da faixa a peça fica no
  estado final (visível). Com `both` ela ficava escondida em captura de página inteira, impressão e leitor sem
  rolagem (blocos "vazios" para quem tirasse um print).
- Foto pequena de seção abaixo da dobra com fundo de cor: carregar junto (`eager`, `fetchpriority=low`), senão o
  painel colorido aparece sem rosto.
- Rótulo de botão sempre em **1 linha**, em qualquer largura (360 px incluído). Largura mínima de um botão `nowrap`
  também alarga a trilha da grade e empurra título e tarja juntos (margens 24 × 20).
- Ao editar CSS por substituição de trecho dentro de `@media`, conferir chaves: um `}` fora do lugar apagou o layout
  desktop da v2 e só o verificador acusou. Build + `check_pagina.py` depois de TODA edição de CSS.
- O verificador agora mede 360 × 740 também e acusa rótulo de botão em 2+ linhas como erro.
