# v1 · páginas individuais (André · Walter · Carlos) — decisões

Estado em 11/10/2026. Tudo é TESTE. Espaço de trabalho: `solo-v1` (cópia do site; `next.config.ts` ganhou
`turbopack.root` só por causa da junção `node_modules`: NÃO voltar para o projeto).

## 1. Estado

| item | estado |
|---|---|
| `/solo/andre/v1/` · `/solo/walter/v1/` · `/solo/carlos/v1/` | prontas, tema ESCURO e CLARO (botão do tema fixo no topo) |
| Copy | só `content/solo/<prof>.copy.json` (cópias literais dos JSON validados); nada de pendência entra na página |
| Pop-up | o `<dialog>` da base, com título/botão do professor, "noite já marcada" e "quero assistir também às outras noites" (botão `role=checkbox`, opcional). Registro por página em `lib/modal-copy.ts` + `components/solo-v1/SoloModal.tsx`; `LeadModalDialog.tsx` só ganhou a leitura desse registro (sem registro = copy da mãe, intacta) |
| Mãe `/v1` no tema claro | em andamento (ver §6) |
| Verificadores nos 2 temas | rodados; resultado em §5 |

## 2. Inventário de elementos do kit (biblioteca `ornamentos`) — 3 a 5 por página

Gerados por `scripts/solo-v1-elementos.py` (cada arquivo = uma função da biblioteca com a ficha do produto; nada novo).
Um SVG por tema (`<nome>.svg` escuro, `<nome>-claro.svg` claro), trocados por CSS (`.t-escuro` / `.t-claro`).

| página | elemento (biblioteca) | onde entra | por quê |
|---|---|---|---|
| André | `assunto.goniometro` (mínimo, 118°) | dobra, sobre o retrato dentro do visor | o instrumento do assunto (ângulo) medindo o corpo, como numa análise de movimento |
| André | `assunto.prumo` (sem rótulos) | "Professor", encostado no eixo | o eixo vertical é a ideia da página |
| André | `assunto.planos` (sagital) | "Pós" | conteúdo da pós: coluna, avaliação, marcha |
| André | `dados.pilha_1_2` · blocos | "Pague 1, leve 2" | a condição como diagrama (dourado) |
| Walter | `assunto.barra` (modo ficha) | dobra, atrás dos ombros | a barra carregada = bodybuilding |
| Walter | `assunto.fita_metrica` (0–15) | "Como funciona" | medida; os 3 passos nascem da régua |
| Walter | `assunto.anilha` (contorno) | "Pós" | peça de academia, sem numeral |
| Walter | `dados.pilha_1_2` · barras | "Pague 1, leve 2" | condição (dourado) |
| Carlos | `dados.anel_progresso` segmentado ×4 (halo e com "360º") | dobra e "Pós" | os 4 aspectos da pós (físicos, hormonais, nutricionais, psicológicos) = "visão 360º" |
| Carlos | `dados.calendario` (11/2026, dia 11) | "Como funciona" | a noite de Qua 11/11 |
| Carlos | `dados.pilha_1_2` · cartões | "Pague 1, leve 2" | condição (ouro chapado nos 2 temas) |

Logos: arquivos oficiais de `brand.json` (C·REC por produto; pós `Ativo 15/2/13`). Só o tom do texto muda por tema
(branco ↔ escuro); o do Walter, oficial só em papel, ganhou a versão de texto claro para o tema escuro (derivada).

## 3. Ideia, composição e diferença entre as 3 (e para a mãe)

- **André — "o ângulo certo"**: duas colunas e EIXO vertical (título à esquerda, conteúdo à direita) em todas as seções; dobra
  com o retrato num visor escuro, goniômetro por cima. Mãe: dobra com o trio, seções empilhadas.
- **Walter — "a barra carregada"**: UM eixo central, tudo centrado; chão do palco (fio grosso) com a barra atrás dos ombros;
  "Como funciona" sobre a fita métrica; professor em painel vermelho; faixa vermelha de prova.
- **Carlos — "a visão 360º"**: dobra ESPELHADA (retrato no anel à esquerda), seções em PAINÉIS/monitores (calendário + 3 painéis,
  4 telas, 4 cartões), bloco dourado chapado, FAQ em 2 colunas.
- Teste "trocar só a cor": as três mudam layout da dobra, eixo, grade das seções e elementos; não são a mesma página.

## 4. Tema claro (redesenhado, não invertido)

Ritmo próprio do claro: papel · papel-2 · seções ESCURAS (`.s-inv`: a "tela" da sala de controle) · ouro chapado.
- Ouro: o bloco "pague 1, leve 2" vira CHAPADO em `#CDA85E` com texto/formas em tinta (André e Walter; Carlos é chapado nos 2 temas).
  Ouro de texto no papel = token `--color-ouro` do claro (`#7C5F1C`); nenhum texto em ouro claro sobre papel.
- Cor do produto só em área (botão, barras, quadrados, painel, faixa) ou numerais ≥ 72 px; texto corrido em tinta.
- Botão: cor do produto com texto escuro nos 2 temas (a regra do `tema.css` "preto com ouro" não vale nas individuais: ouro é só do bloco).
- Seções escuras no claro: André "Programação" + rodapé; Walter "Professor" (painel vermelho) + tarja da pós + rodapé;
  Carlos "Programação" (4 telas) + rodapé. Dentro delas as imagens voltam à variante do escuro.
- Fontes: no claro, mono com peso 600 e corpo mais escuro que os títulos; títulos em tinta pura.
- Fotos: recorte com alfa funciona no papel; o retrato do André fica num visor preto (a medição branca lê sobre a camiseta).
- Grão 0,38 (escuro) · 0,30 (claro).
- Pop-up: acompanha o tema (superfície papel-2, bordas em tinta), botão na cor do produto.

## 5. Verificação (ver resultado final na entrega)

`check_pagina.py` e `teste_pagina_total.py --rapido` com `?tema=claro` e padrão. Avisos conhecidos que sobram e por quê:
- "tela 1 com 10–13 blocos": o botão do tema (ferramenta de teste) soma 2 botões + a dobra pede eyebrow, H1, destaque, data, CTA, sub e selos (copy fixa).
- "texto repetido na 1ª tela" (`condição Black`, `pague 1 pós`): a copy repete o destaque no sub; não se reescreve.
- "quase alinhado" entre blocos centrados de larguras diferentes (Walter): falso positivo do verificador.
- Botão do tema: 11 px e 28 px de alvo — ferramenta de teste, não faz parte da página.

## 6. Pendências / o que a usuária precisa confirmar

- Mãe `/v1` no claro: seção `.pta-paper` (condição) vira escura, texto e fios corrigidos em `app/v1/v1.css`; rodapé com logo ouro fechado
  (`public/logos/c-rec-todos-pta-claro.svg`). Conferir imagens `_solo/v1/mae-*`.
- Kit não tinha: nada novo foi criado. Faltou um elemento de assunto para o "Treinamento Feminino" que não seja genérico (usei anel
  dos 4 aspectos e calendário); decidir se vale criar um (ex.: ciclo mensal) com o professor.
- Logo da pós do Carlos (`Ativo 13`) traz "Emagrecimento, Estética e Performance" no próprio arquivo; a lista "O que evitar" pede cuidado.
  Confirmar com ela se esse arquivo vale para a página (o nome oficial da pós também está pendente: C-B7).
- Bônus "4 ebooks de Biomecânica" aparece nas 3 páginas (copy); ela pediu para confirmar nas pendências B5/C-B5.
- Anilha do Walter mostra "20 kg" no rodapé do disco (marcação do próprio elemento).

## 7. Defeitos achados e como foram corrigidos (lições)

- Goniômetro atrás da pessoa ficava escondido pela camiseta: virou sobreposição fina sobre o retrato, dentro de visor escuro.
- Botão do cabeçalho no celular não cabia com o rótulo longo e o `check_pagina` não achava um CTA visível: botão-seta com rótulo para leitor de tela.
- `Destaque` com `<span>` aninhado contava como texto repetido: trocado por `<br>`.
- Logo oficial branca sumia no papel: variante `-claro` + troca por tema; tarja preta da pós usa a variante do escuro.
- Heredoc com apóstrofo quebra o shell neste ambiente: escrever CSS/TSX com a ferramenta Write.
