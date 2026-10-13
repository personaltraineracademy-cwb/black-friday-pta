# Solo · v2 (Dossiê) — André · Walter · Carlos (decisões e estado)

Data: 11/10/2026. Espaço: `solo-v2` (cópia de trabalho; `site/`, `solo-v1`, `solo-v3` intactos). Rotas: `/solo/andre/v2/`,
`/solo/walter/v2/`, `/solo/carlos/v2/`. Copy: só a final de `testes/black-pta/sistema/pagina-solo.<prof>.copy.json`
(cópia em `content/solo/`). Nada novo na `biblioteca/`; sem IA de imagem; fotos reais P&B recortadas (`public/img/v2/*-pb-720.webp`).

## Estado (atualizado no meio do trabalho)
- PRONTO: 3 páginas nos 2 temas (escuro = Dossiê papel × preto; claro = paleta própria), build ok, `check_pagina.py` 0 erros
  nos 2 temas (rodada 1; refazer 1 vez no fim), pop-up próprio (Nome · WhatsApp · E-mail opcional + noite do professor já
  marcada + outras noites opcional), kit gerado em 2 variantes (superfície escura `-d` e clara `-l`).
- FALTA / EM CURSO: tema claro da página-mãe `/v2` (bloco no fim de `app/v2/v2.css`), rodada final dos 2 verificadores
  (`check_pagina.py` + `teste_pagina_total.py --rapido`), imagens em `_solo/v2/`.

## Método
Base herdada de `app/v2/v2.css` (tokens, tipografia, botão, acordeão, pop-up, movimento "imprimir/carimbar" de
`DossieRoot`). Novo: `app/solo/solo-v2.css` (escopo `.solo` + `.s2-*`), `components/solo-v2/` (copy, Shell, Heroes, Sections,
El, pop-up), 3 `page.tsx`. Ordem do documento da cliente: barra · dobra · (frase+selos) · como funciona · o que vai ver ao
vivo · professor · pós · pague 1 leve 2 (único dourado, cartão de ouro com tinta preta) · bônus + prova · perguntas · fecho · rodapé legal.
Perguntas = rótulo de composição da v2 (`v2-text.ts`), não é promessa.

## Por página (ideia · elementos do kit · composição)
| | André · Biomecânica · azul | Walter · Bodybuilding · vermelho | Carlos · Treinamento Feminino · roxo |
|---|---|---|---|
| Ideia da dobra | O ÂNGULO: goniômetro atrás do busto, fulcro nos ombros; eixo central; título cobre a camisa preta | A MEDIDA: fita em pé ao lado do retrato sobre palco vermelho largo; carimbo da noite; alinhado à esquerda | A VISÃO 360°: anel de 4 setores + grade polar; faixa escura (imagem) / clara (texto) |
| Elementos (biblioteca ornamentos) | `assunto.goniometro` (mínimo, 60°, sem rótulo) · `assunto.prumo` (sem rótulos) · `assunto.planos` · `dados.pilha_1_2` blocos | `assunto.fita_metrica` (0–30 cm, girada) · `assunto.anilha` (20 kg contorno) · `selos.carimbo` retângulo · `dados.pilha_1_2` barras | `dados.anel_progresso` segmentado 4/4 · `grades.polar` completa · `linhas` "concêntricos · arco da base" · `dados.pilha_1_2` cartões |
| Como funciona | 3 colunas, numerais azuis gigantes | linhas-placar com numeral em bloco vermelho | linha do tempo com anéis |
| O que vai ver | 2×2 com fio grosso | ficha com quadrados vermelhos | cartões com raio e marcador roxo |
| Professor / pós | retrato em bloco azul + prumo; pós com planos anatômicos (mesma seção) | nome gigante + retrato em bloco vermelho; pós com anilha (seção própria) | retrato em círculo roxo; pós em 2 colunas |
| Oferta (ouro) | texto à esquerda, diagrama à direita | diagrama à esquerda, texto à direita | cartão largo (raio 28), diagrama embaixo |
| Tons nativos (escuro) | preto·papel·preto·papel·**preto(ouro)**·papel·preto·papel | preto·papel·preto·papel·preto·**papel(ouro)**·preto·papel·preto | preto/papel·papel·preto·papel·preto·papel·**preto(ouro)**·papel·preto·papel |

Quantidade média: 4 elementos por página (3–5). Nenhum elemento novo criado: só parâmetros das funções da biblioteca
(`assets-src/solo/gen_elementos.py`). O que o kit NÃO tinha e foi preciso: nada; a fita métrica em pé é o mesmo elemento girado 90°.

## Tema claro (desenhado, não inversão)
- Escuro: preto `#0C0B09` × papel `#ECE7DC` (identidade nativa).
- Claro: o "preto" vira papel profundo `#DED7C6` e o "papel" vira papel claro `#F3EFE6`; tinta `#0C0B09` para texto; texto
  secundário `#3A372F` (8:1); fios `rgba(12,11,9,.34)`; botão preto com texto papel e sombra dura na cor do produto;
  rodapé e cartão de ouro seguem escuros/ouro (âncoras); grão 0,22 (papel 0,10).
- Tokens do v2 (`--ink`, `--paper`, `--ink-2`, `--paper-2`, `--line`, `--line-d`) redefinidos DENTRO de cada tom, então toda
  regra herdada (selos, acordeão, fios) cai na cor certa. Elementos do kit: arquivo `-d` ou `-l` por seção × tema; os do
  hero entram como fundo CSS (`--ud`/`--ul`).
- Foto: no claro o título não fica sobre a camisa preta do André (sem sobreposição; máscara só nos 8% finais).
  Nos outros, retrato sobre bloco/círculo da cor do produto (funciona nos 2 temas).
- Cor do produto só em área grande (bloco, anel, fita, numeral ≥ 72 px) ou como sombra do botão; texto sempre tinta/papel.
- Botão de tema (ferramenta de teste do coordenador): no desktop vai para o canto de baixo (`body:has(.solo) .pta-tema`).

## Defeitos achados e correções (lições)
1. Retrato cortado/título sobre o rosto: o canvas das fotos tem 18–24% vazios em cima → recortar por baixo (`object-position`
   topo/rodapé conforme a página) e medir a sobreposição do título em fração da altura.
2. Faixa preta entre cabeçalho e hero do Carlos no claro: `.pta-dobra` centra o conteúdo e a raiz `.v2` é escura → a faixa de
   cima cresce (`flex:1`) e o retrato assenta na divisa.
3. Botão do cabeçalho escondido no celular era o 1º `[data-open-modal]` e quebrava o teste do pop-up → botão próprio com
   `data-open-solo`, escutado pelo anfitrião do pop-up.
4. Texto "sobre a foto" falso: `<img>` de elemento maior que o palco → elementos do hero viraram fundo CSS.
5. `font-size: 0` para esconder numeral → trocado por `display:none` + `::before`.
6. Botão do cartão de ouro estourava a coluna no celular (rótulo em 1 linha) → botão fora do cartão, largura da coluna.
7. CTA da dobra abaixo de 88% da tela no celular → altura do retrato calculada por `88svh` (celular) e `100svh` (desktop).

## Para ela confirmar / imperfeito
- Pendências de copy: `pagina-solo.pendencias.md` (nada disso aparece na página). Prova do André/Walter é só "Professores-referência…".
- Sombra do rótulo "Escuro/Claro" é ferramenta de teste (11 px, alvo 28 px) e gera avisos; não é parte da página.
- Safari/iOS e Firefox não testados em aparelho real; movimento herdado da v2 (CSS `view()` com reserva por IO).
- Dobra das 3 páginas em 360×740: CTA termina em ~88% (medido); fotos ficam menores nas telas baixas.
