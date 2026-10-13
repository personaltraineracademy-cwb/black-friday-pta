# v2 — dobra desktop final (11/10/2026): "O holofote"

Pedido dela: imagem primeiro, depois texto, depois botão; grande; alinhado; criativo; Nano Banana 2.1 sempre.

- Ordem: IMAGEM (trio grande rompendo um disco de ouro) → título → apoio + data → botão → micro. Eixo central único.
- CSS: bloco `@media (min-width: 1024px)` "7ª" de `app/v2/v2.css`; disco = `.v2-trio-in::before` (gradiente no `--gold`,
  anel em `box-shadow`), animação `v2-holofote`. Tamanho do trio pela altura da janela (cabe título + botão na 1ª tela).
- TODAS as larguras (360 → 2560): a mesma composição (8ª versão). Disco ø 48% do trio, topo -3%, termina atrás do tronco;
  botão em largura total < 600 px, centrado ≥ 600 px.
- Descartados (reprovados por ela): faixa fina + apoio ao lado; título monumental com trio no entalhe; 2 colunas;
  trio sobre o preto da seção seguinte; palco de estúdio gerado (Nano Banana 2.1) com trio montado em código.
- Cenário de estúdio gerado e palco montado ficaram em `_cenario/` (rascunho) caso queira reaproveitar em outra peça.
