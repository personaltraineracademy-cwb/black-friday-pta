# Páginas individuais (André, Walter, Carlos) — pendências e orientações da copy (NÃO vão para a página)

Fonte: `Black Friday da Personal Trainer Academy ao Vivo.pdf`, páginas 4–8 (André), 9–13 (Walter), 14–18 (Carlos).
Arquivos de copy final: `pagina-solo.andre.copy.json`, `pagina-solo.walter.copy.json`, `pagina-solo.carlos.copy.json`.
Padrão seguido: `pagina-mae.copy.json` e `pagina-mae.pendencias.md`.

## Como ler
- **A. Ficou de fora do JSON**: tudo que estava entre colchetes (ou era orientação, não texto de página). A coluna da direita diz o que falta.
- **B. Entrou no JSON como está no PDF, mas a própria lista dela pede para confirmar**: o trecho não tinha colchetes, por isso copiei; se a resposta for "não", é só tirar a linha.
- **C. Variações de H1** (teste A/B) · **D. Sugestões de tema** (hipóteses) · **E. A lista "O que preciso confirmar" dela**, copiada inteira.
- Regra de recorte: frase inteira entre colchetes some; se só uma parte está entre colchetes, ficou a parte sem colchetes (ex.: "Certificado reconhecido pelo MEC", sem a IES e o ato). Colchete solto "[confirmar]" logo depois de uma frase vale para a frase inteira.

## 0. Vale para os 3 professores

| # | Assunto | O que foi feito / o que falta |
|---|---|---|
| 0.1 | Datas das noites (`[Seg 9/11]`, `[Ter 10/11]`, `[Qua 11/11]` e `[9/11]`, `[10/11]`, `[11/11]` no sub) | Aparecem SEM colchetes na página, igual à página-mãe. São provisórias: a ordem André → Walter → Carlos depende dela. Se a ordem mudar, trocar em barra, sub, seleção da noite e passo 2 do "Como funciona", nas 3 páginas e no "Quero assistir também às noites…". |
| 0.2 | Selos e número de alunos | Na página-mãe `+10.000 alunos formados` ficou nos selos (vinha entre colchetes no PDF). Nas individuais segui a regra "número de alunos entre colchetes não entra": os selos têm só "Aula ao vivo" e "Certificado reconhecido pelo MEC". Voltam quando ela confirmar o número que a PTA comprova. |
| 0.3 | "Quem pode fazer?", "Haverá replay?", "A segunda pós é completa?" | A página-mãe responde ("Graduados e alunos a partir do 6º período.", "Somente para quem adquirir a pós.", "Sim. Ela é atualizada em 2026."). Nas individuais o PDF deixa as três respostas entre colchetes. Ficaram fora (replay e "quem pode") ou só com o que não estava entre colchetes ("Ela é gravada em 2026."). Atenção: "atualizada em 2026" (mãe) e "gravada em 2026" (individuais) não dizem a mesma coisa. |
| 0.4 | Modal / formulário | O PDF não traz o texto do pop-up. Reaproveitei os campos e o consentimento da página-mãe. Título do pop-up = o título do fecho de cada professor ("Entre no grupo e receba o link da aula do André."), botão = botão do professor, texto de sucesso = frase da mãe trocando "o link das 3 noites" por "o link da aula do <professor>". Decisão de design para ela vetar. |
| 0.5 | Seleção "já marcada" | O PDF diz que "Noite do <professor> (data, 20h30)" já vem marcada e que a opção das outras duas noites é opcional. O JSON só traz os rótulos; o estado "marcada" é do layout. |
| 0.6 | Hero: H1 + destaque | No PDF o H1 tem duas linhas. Separei como na mãe: `h1` = "Uma noite especial de … ao vivo com …." e `destaque` = "No final, a condição Black: pague 1 pós e leve 2." |
| 0.7 | Lista "O que evitar" | Copiada em `_evitar` de cada JSON. A página não usa. |
| 0.8 | Certificado do MEC sem o ato | A lista "O que evitar" diz: "certificado reconhecido pelo MEC", com o ato. Como o ato está entre colchetes (André, Carlos) ou sem IES (Walter), a página diz só "Certificado reconhecido pelo MEC" até ela passar instituição e ato. |
| 0.9 | Bônus "Workshop 10k com consultoria online" | O PDF pede "1 linha dizendo o que é" nas 3 páginas. Falta a linha; foi só o nome. |
| 0.10 | Depoimentos (bloco Prova) | O PDF traz "3 depoimentos reais de …, com autorização e sem promessa de renda". Isso é orientação do que colocar, não texto de página; ficou fora. Faltam 3 depoimentos reais com autorização, por professor. |

## 1. André Albuquerque · Biomecânica

### A. Ficou de fora do JSON
| # | Campo | Texto original (PDF) | O que falta confirmar |
|---|---|---|---|
| A1 | hero.selos | `[+10.000 alunos formados]` | Número que a PTA comprova (a lista dela diz "10 mil ou 20 mil"). |
| A2 | na_noite[1] | `Aula ao vivo: [tema da aula: escolher]` | Tema da aula. Ficou só "Aula ao vivo". |
| A3 | na_noite[2] | `Biomecânica na prática: [demonstrações e casos: confirmar]` | Quais demonstrações e casos. Ficou só "Biomecânica na prática". |
| A4 | na_noite[4] | `Perguntas ao vivo com o André. [Confirmar tempo de perguntas.]` | Se haverá tempo de perguntas. Ficou a frase sem o colchete. |
| A5 | professor.bio | `mestre em Educação Física [confirmar instituição e títulos]` | Instituição e títulos. Ficou "mestre em Educação Física". |
| A6 | professor.bio | `[Outros livros: confirmar]` | Se há outros livros para citar. |
| A7 | pos.itens | `Conteúdos: … biomecânica da marcha e corrida [lista completa]` | Lista completa de conteúdos. Ficou só a lista parcial do PDF. |
| A8 | pos.itens | `Certificado reconhecido pelo MEC [IES e ato] · Carga horária [confirmar]` | IES, ato e carga horária. Ficou "Certificado reconhecido pelo MEC". |
| A9 | pos.itens | `Início da turma: [data e turma]` | Data e turma. Linha inteira fora. |
| A10 | pague1leve2.nota | `[Mesma carga horária, certificado e formato: confirmar.]` | Se as pós de escolha têm a mesma carga horária, certificado e formato. |
| A11 | pague1leve2.pagamento | `[Regras e aprovação: confirmar.]` | Regras e aprovação do parcelamento. |
| A12 | bonus.itens | `4 certificações de Biomecânica; (exclusivo desta noite)` + sublista: Expertise em coluna · Expertise em Joelho · Expertise em Agachamento · Expertise em coluna | A sublista repete "Expertise em coluna" (1º e 4º). Faltam o nome da 4ª certificação ou a retirada de um item. Na página ficou "4 certificações …" com os 3 nomes distintos. |
| A13 | bonus | `Workshop 10k com consultoria online [1 linha dizendo o que é]` | A linha de explicação (ver 0.9). |
| A14 | bonus | `[Momento de entrega dos bônus: confirmar. Opcional: bônus surpresa só para quem estiver ao vivo.]` | Quando os bônus são entregues; se haverá bônus surpresa. |
| A15 | prova.itens | `[+10.000 alunos formados] · Professores-referência com foco em aplicação prática` | Número (A1). Ficou "Professores-referência com foco em aplicação prática". |
| A16 | prova.itens | `3 depoimentos reais de alunos de Biomecânica, com autorização e sem promessa de renda` | Orientação (0.10). Faltam os 3 depoimentos. |
| A17 | faq | `Já sou aluno da Turma 10. Posso participar? [Definir a regra.]` | Regra para quem já é da Turma 10. Pergunta e resposta fora. |
| A18 | faq | `A Pós em Biomecânica é ao vivo? [Um fim de semana por mês ao vivo, com aulas gravadas: confirmar.]` | Se o formato vale para esta turma. Pergunta e resposta fora. |
| A19 | faq | `A segunda pós é completa? [Confirmar.] Ela é gravada em 2026.` | Se é completa. Ficou só "Ela é gravada em 2026." |
| A20 | faq | `Haverá replay da aula? [Confirmar.]` | Replay: haverá ou não. Pergunta fora. |
| A21 | faq | `Quem pode fazer? [Confirmar o requisito de graduação.]` | Requisito de graduação. Pergunta fora (a mãe diz "Graduados e alunos a partir do 6º período."). |
| A22 | faq | `Sim, pela instituição certificadora [nome e ato de cada pós].` | Nome e ato de cada pós. Ficou "Sim, pela instituição certificadora." |
| A23 | rodape | `Instituição certificadora e ato de reconhecimento: [inserir].` | Instituição e ato. Ficou "Pós-graduações lato sensu." |

### B. Entrou no JSON, mas a lista dela pede para confirmar
| # | Campo | Texto na página | Pergunta dela |
|---|---|---|---|
| B1 | pos.itens | "Método ADR: avaliação, decisão e resultado prático" | "Se o método atual é o ADR ou o CTLS" (item 1). |
| B2 | pos.itens | "18 meses, 100% online, Sem TCC" e "Um fim de semana por mês ao vivo …" | Valem para esta turma? Qual a carga horária? (item 4) |
| B3 | pague1leve2.nota e faq | "As pós de escolha são gravadas em 2026." / "Ela é gravada em 2026." | Gravada em 2026 ou com encontros ao vivo, como diz a página de Musculação? (item 5) |
| B4 | bonus.itens | "4 certificações de Biomecânica (exclusivo desta noite)" | Quais são, e se coincidem com as do evento de agosto (item 6). Se coincidem, "exclusivo" perde sentido. |
| B5 | pague1leve2.pagamento | "Parcelamento facilitado, que não consome o limite do cartão." | O PDF pede para confirmar as regras e a aprovação (A11). A promessa está na página. |

### C. Variações de H1 para teste A/B (não entram na página)
- (B) "Seg 9/11, 20h30: Biomecânica ao vivo com o André e a condição Black da PTA." (no PDF: `[Seg 9/11], 20h30: …`)
- (C) "Pague 1 pós em Biomecânica e leve 2. Os valores, só ao vivo com o André."

### D. Sugestões de tema, para validar com o André (hipóteses, não confirmadas)
1. "Avaliar, decidir e aplicar: o Método ADR na prática" (liga ao método da pós).
2. "Biomecânica da coluna no treino de força: o que ajustar para treinar com segurança" (usa um dos módulos citados).
3. "Os ajustes biomecânicos que mudam o resultado do treino do seu aluno".
Nota do PDF: a opção 1 é a que mais conecta a aula ao produto. Confirmar também se o método atual é o ADR ou o CTLS, que aparece no livro.

### E. "O que preciso confirmar" (lista dela, copiada)
1. Tema da aula do André e se o método atual é o ADR ou o CTLS.
2. Data da noite do André (a ordem entre os professores).
3. Turma: em qual turma entram os alunos da Black, e a regra para quem já é da Turma 10.
4. Formato da pós: 18 meses, 100% online e um fim de semana por mês ao vivo valem para esta turma? Qual a carga horária?
5. Segunda pós: gravada em 2026 ou com encontros ao vivo, como diz a página de Musculação e Periodização Avançada? Carga horária e certificado.
6. As 4 certificações: quais são, e se coincidem com as do evento de agosto.
7. Número de alunos que a PTA consegue comprovar (10 mil ou 20 mil).
8. Replay: haverá ou não.

## 2. Walter Krause · Bodybuilding e Estética Corporal

### A. Ficou de fora do JSON
| # | Campo | Texto original (PDF) | O que falta confirmar |
|---|---|---|---|
| W-A1 | hero.selos | `[+4.000 alunos certificados na Pós em Bodybuilding]` | Número que a PTA comprova (4.000 da pós ou 10.000 da PTA). |
| W-A2 | na_noite[1] | `Aula ao vivo: [tema da aula: escolher]` | Tema, sem repetir o que foi dado em 27/09. Ficou "Aula ao vivo". |
| W-A3 | na_noite[2] | `Bodybuilding na prática: [demonstrações e casos: confirmar]` | Demonstrações e casos. Ficou "Bodybuilding na prática". |
| W-A4 | na_noite[4] | `Perguntas ao vivo com o Walter. [Confirmar tempo de perguntas.]` | Se haverá tempo de perguntas. |
| W-A5 | professor.bio | `Doutor e pós-doutor em Educação Física [confirmar instituição e títulos].` | Instituição e títulos. Ficou "Doutor e pós-doutor em Educação Física." |
| W-A6 | professor.bio | `Professor da Pós em Bodybuilding e Estética Corporal da PTA [confirmar se é coordenador].` | Se é coordenador. Ficou "Professor da Pós …" (a mãe diz "coordenador da pós"). |
| W-A7 | professor.bio | `[Números de atletas e títulos: só com documentação]` | Só entram com documentação. |
| W-A8 | pos.itens | `Conteúdos: [módulos da pós: preencher]` | Módulos da pós. Linha inteira fora. |
| W-A9 | pos.itens | `Certificado reconhecido pelo MEC, portaria nº 1.058, de 27/12/2021 [confirmar IES]` | Instituição de ensino. Ficaram o MEC e a portaria. |
| W-A10 | pos.itens | `Início da turma: [data e turma]` | Data e turma. |
| W-A11 | pague1leve2.nota | `[Mesma carga horária, certificado e formato: confirmar.]` | Igual a A10 do André. |
| W-A12 | pague1leve2.pagamento | `[Regras e aprovação: confirmar.]` | Igual a A11 do André. |
| W-A13 | bonus.itens | `Workshop de certificação em Bodybuilding e Estética Corporal [mesmo conteúdo do evento de 27/09? confirmar] (exclusivo desta noite)` | Se é o mesmo produto vendido a R$ 19,90 em 27/09. Se for, quem comprou já o tem e o bônus perde valor. |
| W-A14 | bonus | `Workshop 10k com consultoria online [1 linha dizendo o que é]` | A linha de explicação (0.9). |
| W-A15 | bonus | `[Momento de entrega dos bônus: confirmar. Opcional: bônus surpresa só para quem estiver ao vivo.]` | Quando os bônus são entregues; bônus surpresa. |
| W-A16 | prova.itens | `[+4.000 alunos certificados na Pós em Bodybuilding] · Professores-referência com foco em aplicação prática` | Número (W-A1). Ficou "Professores-referência com foco em aplicação prática". |
| W-A17 | prova.itens | `3 depoimentos reais de alunos de Bodybuilding, com autorização e sem promessa de renda` | Orientação (0.10). |
| W-A18 | faq | `Fiz a certificação e recebi o Cupom Ouro. O que acontece com ele? [Definir a regra: vale na Black, é substituído ou acumula?]` | Regra do Cupom Ouro. Pergunta e resposta fora. |
| W-A19 | faq | `Já sou aluno da Pós em Bodybuilding. Posso participar? [Definir a regra.]` | Regra para aluno atual. |
| W-A20 | faq | `A Pós em Bodybuilding é ao vivo? [Um fim de semana por mês ao vivo, com aulas gravadas: confirmar.]` | Se o formato vale para esta turma. |
| W-A21 | faq | `A segunda pós é completa? [Confirmar.] Ela é gravada em 2026.` | Se é completa. Ficou "Ela é gravada em 2026." |
| W-A22 | faq | `Haverá replay da aula? [Confirmar.]` | Replay. |
| W-A23 | faq | `Quem pode fazer? [Confirmar o requisito de graduação.]` | Requisito de graduação. |
| W-A24 | faq | `Sim, pela instituição certificadora [nome e ato de cada pós].` | Nome e ato. Ficou "Sim, pela instituição certificadora." |
| W-A25 | rodape | `Instituição certificadora e ato de reconhecimento: [inserir].` | Instituição e ato. |

### B. Entrou no JSON, mas a lista dela pede para confirmar
| # | Campo | Texto na página | Pergunta dela |
|---|---|---|---|
| W-B1 | pos.itens | "18 meses, 360 horas, 100% online, Sem TCC" e fim de semana ao vivo | "Valem para esta turma? Tem TCC?" (item 6). O texto diz "Sem TCC" e a lista pergunta "Tem TCC?". |
| W-B2 | pos.itens | "+4.000 alunos certificados · 18 professores" | Qual número a PTA comprova: 4.000 e 18 da pós ou 10.000 da PTA (item 8). No PDF esse trecho do bloco da pós não tem colchetes; no selo tem. |
| W-B3 | professor.bio | "Treinador de atletas de elite" | Sem colchetes, mas a lista "O que evitar" pede documentação para frases desse tipo (ex.: "treinador nível Olympia"). |
| W-B4 | bonus.itens | "Workshop de certificação … (exclusivo desta noite)" | Item 4: é o mesmo produto de 27/09 a R$ 19,90? |
| W-B5 | bonus.itens | "4 ebooks de Biomecânica" | Fazem sentido para o público do Walter? Vale posicionar como complemento (item 9). |
| W-B6 | pague1leve2.nota e faq | "gravada em 2026" | Item 7: gravada em 2026 ou com encontros ao vivo? |
| W-B7 | pague1leve2.pagamento | "Parcelamento facilitado, que não consome o limite do cartão." | Regras e aprovação ainda a confirmar (W-A12). |
| W-B8 | pos.itens | "portaria nº 1.058, de 27/12/2021" | A portaria está sem colchetes, mas sem a IES (W-A9). Conferir se a portaria é da pós certa. |

### C. Variações de H1 para teste A/B (não entram na página)
- (B) "Ter 10/11, 20h30: Bodybuilding ao vivo com o Walter e a condição Black da PTA." (no PDF: `[Ter 10/11], 20h30: …`)
- (C) "Pague a Pós em Bodybuilding e leve uma segunda pós. Os valores, ao vivo com o Walter."

### D. Sugestões de tema, para validar com o Walter (hipóteses, não confirmadas)
1. "Glúteos e estética corporal: a arquitetura muscular na prescrição" (tema que ele já apresentou em palestra em 2025).
2. "Hipertrofia sem achismo: o que decide a resposta de cada aluno" (liga à ciência da hipertrofia, área dele no evento de setembro).
3. "Do aluno estético ao atleta: como conduzir a primeira preparação".
Atenção do PDF: o evento de 27/09 já cobriu ciência da hipertrofia, prescrição, preparação de palco e saúde articular. Para quem estava lá, a aula da Black precisa de ângulo novo; as opções 1 e 3 são as que menos repetem.

### E. "O que preciso confirmar" (lista dela, copiada)
1. Tema da aula do Walter, sem repetir o que foi dado em 27/09.
2. Data da noite do Walter (a ordem entre os professores).
3. Cupom Ouro × Black: quem comprou a certificação de 27/09 recebeu um cupom para a pós. Ele vale na Black, é substituído ou acumula?
4. Workshop de certificação: é o mesmo produto vendido a R$ 19,90 em 27/09? Se for, quem comprou o ingresso já o tem, e o bônus perde valor para essa audiência.
5. Turma: em qual turma entram os alunos da Black, e a regra para quem já é aluno da pós.
6. Formato da pós: 18 meses, 360 horas, um fim de semana por mês ao vivo e com gravação valem para esta turma? Tem TCC?
7. Segunda pós: gravada em 2026 ou com encontros ao vivo, como diz a página de Musculação e Periodização Avançada? Carga horária e certificado.
8. Números de prova: +4.000 alunos certificados e 18 professores (da pós), ou +10.000 alunos formados (da PTA). Qual a PTA consegue comprovar?
9. Ebooks de Biomecânica: fazem sentido para o público do Walter? Vale posicionar como complemento.
10. Replay: haverá ou não.

## 3. Carlos Garon · Treinamento Feminino

### A. Ficou de fora do JSON
| # | Campo | Texto original (PDF) | O que falta confirmar |
|---|---|---|---|
| C-A1 | hero.selos | `[+10.000 alunos formados]` | Número que a PTA comprova. |
| C-A2 | na_noite[1] | `Aula ao vivo: [tema da aula: escolher]` | Tema, e se a audiência já viu o tema de glúteo na Pré-especialização. Ficou "Aula ao vivo". |
| C-A3 | na_noite[2] | `Treinamento Feminino na prática: [demonstrações e casos: confirmar]` | Demonstrações e casos. Ficou "Treinamento Feminino na prática". |
| C-A4 | na_noite[4] | `Perguntas ao vivo com o Carlos. [Confirmar tempo de perguntas.]` | Se haverá tempo de perguntas. |
| C-A5 | professor.bio | `Professor da Pós em Treinamento Feminino da PTA [confirmar].` | Se ele é professor da pós. A frase inteira ficou fora porque o "[confirmar]" vale para ela toda (diferente do Walter, onde o colchete só pergunta "se é coordenador"). |
| C-A6 | professor.bio | `[Títulos de atletas e frases como "treinador Olympia": só com documentação]` | Só entram com documentação. |
| C-A7 | pos.titulo | `Pós-graduação em Treinamento Feminino [confirmar o nome oficial no certificado]` | Nome oficial. Ficou "Pós-graduação em Treinamento Feminino". Ver C-B7. |
| C-A8 | pos.itens | `Início da turma: [data e turma] · Garantia de 30 dias` | Data e turma. Ficou só "Garantia de 30 dias" (ver C-B3). |
| C-A9 | pague1leve2.nota | `[Mesma carga horária, certificado e formato: confirmar.]` | Igual a A10 do André. |
| C-A10 | pague1leve2.pagamento | `[Regras e aprovação: confirmar.]` | Igual a A11 do André. |
| C-A11 | bonus.itens | `Workshop intensivo prático em Treinamento Feminino [conteúdo e formato: confirmar] (exclusivo desta noite)` | Conteúdo e formato. Ficou o nome e "exclusivo desta noite". |
| C-A12 | bonus | `Workshop 10k com consultoria online [1 linha dizendo o que é]` | A linha de explicação (0.9). |
| C-A13 | bonus | `[Momento de entrega dos bônus: confirmar. Opcional: bônus surpresa só para quem estiver ao vivo.]` | Quando os bônus são entregues; bônus surpresa. |
| C-A14 | prova.itens | `[Número de alunos da pós em Treinamento Feminino: confirmar]` | Número de alunos da pós. |
| C-A15 | prova.itens | `3 depoimentos reais de profissionais que treinam mulheres, com autorização e sem promessa de renda` | Orientação (0.10). |
| C-A16 | faq | `Já sou aluno da Pós em Treinamento Feminino. Posso participar? [Definir a regra.]` | Regra para aluno atual. |
| C-A17 | faq | `A Pós em Treinamento Feminino é ao vivo? [Um fim de semana por mês ao vivo, com aulas gravadas: confirmar.]` | Se o formato vale para esta turma. |
| C-A18 | faq | `A segunda pós é completa? [Confirmar.] Ela é gravada em 2026.` | Se é completa. Ficou "Ela é gravada em 2026." |
| C-A19 | faq | `Há garantia? [A página da pós cita garantia de 30 dias: confirmar se vale na Black.]` | Se a garantia vale na compra pela Black. Pergunta e resposta fora. |
| C-A20 | faq | `Haverá replay da aula? [Confirmar.]` | Replay. |
| C-A21 | faq | `Quem pode fazer? [Confirmar o requisito de graduação.]` | Requisito de graduação. |
| C-A22 | faq | `Sim, pela instituição certificadora [nome e ato de cada pós].` | Nome e ato. Ficou "Sim, pela instituição certificadora." |
| C-A23 | rodape | `Instituição certificadora e ato de reconhecimento: [inserir].` | Instituição e ato. |

### B. Entrou no JSON, mas a lista dela pede para confirmar
| # | Campo | Texto na página | Pergunta dela |
|---|---|---|---|
| C-B1 | pos.itens | "18 meses, 360 horas, 100% online, ao vivo e gravado, Sem TCC" e fim de semana ao vivo | "Valem para esta turma? Tem TCC?" (item 6). No PDF a linha termina em "Sem TCC]" com um colchete de fechamento sem abertura; tirei o colchete solto. Pode ser que a linha inteira devesse estar entre colchetes. |
| C-B2 | prova.itens | "+10.000 alunos formados · Professores-referência com foco em aplicação prática" | Neste bloco o número está SEM colchetes, mas no selo está COM e o item 10 da lista pergunta qual número a PTA comprova. Se ela não confirmar, deixar só "Professores-referência com foco em aplicação prática". |
| C-B3 | pos.itens | "Garantia de 30 dias" | Item 7: a garantia da página da pós vale na Black? Está sem colchetes na linha, mas a FAQ ("Há garantia?") ficou toda como pendência. |
| C-B4 | bonus.itens | "Workshop intensivo prático … (exclusivo desta noite)" | Item 4: produto novo ou já vendido? Se já foi, quem comprou o tem. |
| C-B5 | bonus.itens | "4 ebooks de Biomecânica" | Fazem sentido para o público do Carlos? (item 11) |
| C-B6 | pague1leve2.nota e faq | "gravada em 2026" | Item 8: gravada em 2026 ou com encontros ao vivo? |
| C-B7 | pos.titulo e todo o texto | "Treinamento Feminino" | Item 9: o certificado diz "Treinamento Feminino", "Fisiologia, Estética e Treinamento Feminino" ou "Saúde da Mulher"? O nome está em H1, sub, botões, FAQ e título da seção. |
| C-B8 | pague1leve2.pagamento | "Parcelamento facilitado, que não consome o limite do cartão." | Regras e aprovação ainda a confirmar (C-A10). |
| C-B9 | professor.bio | "Especialista em … Nutrição Esportiva pela IFBB Academy" | Sem colchetes; a lista "O que evitar" pede para não atribuir ao Carlos credenciais de outros professores da PTA. Conferir. |

### C. Variações de H1 para teste A/B (não entram na página)
- (B) "Qua 11/11, 20h30: Treinamento Feminino ao vivo com o Carlos e a condição Black da PTA." (no PDF: `[Qua 11/11], 20h30: …`)
- (C) "Pague a Pós em Treinamento Feminino e leve uma segunda pós. Os valores, ao vivo com o Carlos."

### D. Sugestões de tema, para validar com o Carlos (hipóteses, não confirmadas)
1. "Estratégias avançadas de treino de glúteo para hipertrofia e estética feminina" (tema que a página da Pré-especialização em Treinamento Feminino já atribui a ele).
2. "Como ajustar a prescrição à fisiologia hormonal da aluna" (usa o eixo da pós: fisiologia hormonal, emagrecimento e hipertrofia; confirmar se é uma aula dele).
3. "Emagrecimento e hipertrofia feminina: o que muda na prescrição".
Atenção do PDF: se o público do Carlos já assistiu à Pré-especialização, a opção 1 pode repetir conteúdo.

### E. "O que preciso confirmar" (lista dela, copiada)
1. Tema da aula do Carlos, e se a audiência dele já viu o tema de glúteo na Pré-especialização.
2. Data da noite do Carlos (a ordem entre os professores).
3. Evento anterior de Treinamento Feminino: a página da Pré-especialização cita um evento em 07/12 (sem ano no trecho que li). Há um evento recente ou próximo? Isso mostra se o público do Carlos acabou de receber outra oferta, como aconteceu em agosto (Biomecânica) e setembro (Bodybuilding).
4. Workshop intensivo prático: é um produto novo ou já foi vendido? Se já foi, quem comprou o tem, e o bônus perde valor para essa audiência.
5. Turma: a página da pós indica "Turma 2026 confirmada". Em qual turma entram os alunos da Black, e qual é a regra para quem já é aluno?
6. Formato da pós: 18 meses, 360 horas, um fim de semana por mês ao vivo e com gravação valem para esta turma? Tem TCC?
7. Garantia de 30 dias: a página da pós a cita. Vale também na compra pela Black?
8. Segunda pós: gravada em 2026 ou com encontros ao vivo, como diz a página de Musculação e Periodização Avançada? Carga horária e certificado.
9. Nome oficial da pós: "Treinamento Feminino", "Fisiologia, Estética e Treinamento Feminino" ou "Saúde da Mulher", que aparece em páginas antigas. Qual consta no certificado?
10. Números de prova: +10.000 alunos formados (da PTA) e o número de alunos da pós em Treinamento Feminino. Qual a PTA consegue comprovar?
11. Ebooks de Biomecânica: fazem sentido para o público do Carlos? Vale posicionar como complemento.
12. Replay: haverá ou não.

## 4. Diferenças entre a página-mãe e as individuais (para ela decidir)
- Walter: a mãe diz "PhD em Educação Física e coordenador da pós"; a individual diz "Doutor e pós-doutor" e "[confirmar se é coordenador]". A individual ficou sem "coordenador".
- Replay, "Quem pode fazer?" e "A segunda pós é completa?": a mãe responde, as individuais deixam entre colchetes (item 0.3).
- Número de alunos: mãe usa +10.000 nos selos; individuais do André e do Carlos têm o mesmo número entre colchetes; a do Walter troca por +4.000 da pós. A lista do André fala em "10 mil ou 20 mil".
- A mãe usa "MAIOR" no H1 e a própria lista "O que evitar" pede para evitar "Maior". As individuais não usam a palavra.
