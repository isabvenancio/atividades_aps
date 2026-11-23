# UC-013 — Rastreabilidade

Liga os requisitos e cenários do UC-013 aos testes automatizados, às tasks, ao Jira e aos PRs. Situação em 23/11/2026: P01 a P09, D01 e D02 integradas; B01 e B02 em PR; P10 a P12 ainda não feitas.

Este conteúdo preenche os campos "Tarefas relacionadas" e "Casos de teste relacionados" do UC-013, que estavam "A definir" no documento de casos de uso.

## 1. Requisitos e regras

| Item | Onde está garantido | Testes |
|---|---|---|
| RF-013 — criar pedido de desculpa | `PedidoService.criarRascunho`, `POST /api/pedidos`, `PedidoForm` | `PedidoService.test.js`, `rotaPedidos.test.js`, `PedidoForm.fluxos.test.jsx` |
| RN-003 — propriedade dos dados | `autenticar` (conta da sessão), `DestinatarioRepositorySqlite.buscarDaConta` e `listarDaConta` | `repositorios.test.js`, `rotasApoio.test.js`, CT-013.5 |
| RN-007 — destinatário válido | `PedidoPolicy.validar`, `SeletorDestinatario`, `validarRascunho` | `PedidoPolicy.test.js`, `PedidoForm.fluxos.test.jsx` |
| RN-008 — dados para gerar | `Pedido.dadosFaltantesParaGerar` | `Pedido.test.js`, CT-013.1 |
| RNF-003 — usabilidade e acessibilidade | rótulos e erros ligados aos campos, navegação por teclado, mensagens em português, link para pular ao conteúdo | `PedidoForm.test.jsx`, `App.test.jsx` |

## 2. Casos de teste ↔ testes automatizados

| Caso de teste | Back-end | Front-end |
|---|---|---|
| **CT-013.1** — salvar só com título | `PedidoService.test.js`: "CT-013.1: salva só com título e informa o que falta para gerar"; `Pedido.test.js`; `rotaPedidos.test.js`: "201 usa a conta da sessão…" | `PedidoForm.fluxos.test.jsx`: "CT-013.1: salva pelo teclado um rascunho com apenas o título" |
| **CT-013.2** — destinatário direto sem criar cadastro | `PedidoService.test.js`: "CT-013.2: destinatário direto é usado no pedido e não cria cadastro" | `PedidoForm.fluxos.test.jsx`: "CT-013.2: trocar do cadastro para o modo direto…" |
| **CT-013.3** — fotografia preservada | `PedidoService.test.js`: "CT-013.3: alterar o cadastro depois não muda o pedido"; `repositorios.test.js`: "o rascunho guarda a conta e uma cópia dos dados do destinatário" | — |
| **CT-013.4** — sem sessão ou token inválido | `autenticar.test.js`; `rotaPedidos.test.js`: "401 exige sessão…"; `rotasApoio.test.js`: "GET … exige uma sessão" | — |
| **CT-013.5** — destinatário de outra conta | `PedidoService.test.js`: "CT-013.5: destinatário de outra conta é recusado…"; `rotaPedidos.test.js`: "404 tem a mesma resposta para dest-caio / inexistente" | — |
| **A2** — destinatário cadastrado | `PedidoService.test.js`: "A2: destinatário cadastrado é copiado para o pedido" | `PedidoForm.fluxos.test.jsx`: "A2: trocar do modo direto para um cadastro…" |
| **A5** — título vazio ou dado inválido | `PedidoPolicy.test.js`; `PedidoService.test.js`: "A5: título vazio é recusado…"; `rotaPedidos.test.js`: "400 informa o campo…" | `PedidoForm.fluxos.test.jsx`: "A5: bloqueia título vazio…"; `PedidoForm.erros.test.jsx` (B02) |
| **A6** — cancelar | — | `PedidoForm.fluxos.test.jsx`: "A6: cancelar descarta os campos…" |
| **E1** — sessão inválida | `PedidoService.test.js`: "E1: sem conta…"; `autenticar.test.js` | — |
| **E2** — falha ao salvar | `PedidoService.test.js`: "E2: falha ao salvar não confirma o pedido"; `rotaPedidos.test.js`: "500 em uma falha de escrita…" e "500 registra o erro…" (B01) | — |

Os testes de integração da API (P12) e da página (P11) vão completar as linhas que ainda não têm teste no front.

## 3. Tasks ↔ Jira ↔ PRs

| Task | Jira | PR | Situação |
|---|---|---|---|
| T00 Estrutura do repositório | CSC-3 | [#5](https://github.com/isabvenancio/atividades_aps/pull/5) | Feito |
| P01 Domínio do pedido | CSC-21 | [#6](https://github.com/isabvenancio/atividades_aps/pull/6) | Feito |
| P02 Serviço `criarRascunho` | CSC-22 | [#7](https://github.com/isabvenancio/atividades_aps/pull/7) | Feito |
| P03 Testes do serviço | CSC-27 | [#8](https://github.com/isabvenancio/atividades_aps/pull/8) | Feito |
| P04 Repositórios SQLite | CSC-28 | [#10](https://github.com/isabvenancio/atividades_aps/pull/10) | Feito |
| P05 `POST /api/pedidos` e sessão | CSC-23 | [#11](https://github.com/isabvenancio/atividades_aps/pull/11) | Feito |
| P06 Endpoints de apoio | CSC-29 | [#12](https://github.com/isabvenancio/atividades_aps/pull/12) | Feito |
| P07 `PedidoForm` | CSC-24 | [#13](https://github.com/isabvenancio/atividades_aps/pull/13) | Feito |
| P08 Validação e destinatário | CSC-25 | [#14](https://github.com/isabvenancio/atividades_aps/pull/14) | Feito |
| P09 Testes do formulário | CSC-30 | [#15](https://github.com/isabvenancio/atividades_aps/pull/15) | Feito |
| D01 Diagrama de classes | CSC-33 | — (direto na branch de feature) | Feito |
| D02 Layout e página inicial | CSC-34 | [#17](https://github.com/isabvenancio/atividades_aps/pull/17) | Feito |
| B01 Erro 500 sem registro | CSC-35 | branch `isabella/B01-log-erro-500` | Em análise |
| B02 Erros do servidor no formulário | CSC-36 | branch `isabella/B02-erros-servidor-formulario` | Em análise |
| P10 Cliente da API | CSC-31 | — | A fazer |
| P11 Página de criação | CSC-26 | — | A fazer |
| P12 Testes de integração | CSC-32 | — | A fazer |
| P13 Documentação e PR final | CSC-5 | — | Fazendo |

Atualizar esta tabela e a do painel do plano quando cada PR for integrado.
