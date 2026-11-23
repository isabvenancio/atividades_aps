# Plano de trabalho — UC-013 Criar pedido de desculpa (VazaApp)

Caso de uso implementado no trabalho final de Análise e Projeto de Software (UEM, Prof. Dr. João Choma). Este documento reúne as regras de branch, commit, PR, merge e Definition of Done, as tasks e o acompanhamento. Especificação e contrato da API: [`uc-013-especificacao.md`](uc-013-especificacao.md).

> Cada integrante faz **os próprios commits e PRs**, com a própria conta do GitHub. O professor avalia Jira, commits, PRs e merges, então a autoria precisa ser real.

## 1. Branches

```
main                                          ← só recebe o PR final (P13)
 └── feature/uc-013-criar-pedido-desculpa     ← branch do caso de uso (integração)
      ├── isabella/T00-estrutura-repositorio
      ├── isabella/P01-dominio-pedido
      ├── carolina/P04-repositorios-sqlite
      ├── matheus/P07-formulario-pedido
      ├── gabriela/P10-cliente-api-hook
      └── ... uma por task, sempre com o nome do integrante na frente
```

- A branch de integração nasce da `main`.
- Toda branch de task nasce de `feature/uc-013-criar-pedido-desculpa` e volta para ela por PR.
- Só o PR final (`feature/uc-013-criar-pedido-desculpa` → `main`) mexe na `main`.
- Convenção de nome: `<integrante>/<PNN>-descricao`.
- As branches podem ser criadas com o script (rode na raiz do repositório):

```bash
bash "Trabalho Final/scripts/criar-branches-uc-013.sh" --dry-run   # mostra o que faria
bash "Trabalho Final/scripts/criar-branches-uc-013.sh"             # cria e publica tudo
bash "Trabalho Final/scripts/criar-branches-uc-013.sh" matheus     # só as branches do Matheus
```

## 2. Regras de trabalho

### Commits
- Pequenos e com mensagem clara, no formato `tipo(escopo): descrição [PNN] [CSC-xx]`.
- Tipos: `feat`, `fix`, `test`, `docs`, `chore`, `refactor`. Escopos: `back`, `front`, `docs`, `repo`.
- Exemplo: `feat(back): política de validação do pedido [P01] [CSC-21]`.
- Mínimo de 2 a 3 commits por task.
- Rode `npm test` e `npm run lint` antes de cada commit relevante.
- Nunca coloque senha, token ou `.env` no Git (o `.env.example` pode).

### Pull Requests e merge
- Um PR por task, sempre para `feature/uc-013-criar-pedido-desculpa`, usando o template `.github/pull_request_template.md`.
- Título do PR: `[PNN][CSC-xx] Nome da task`.
- O PR precisa de **1 aprovação** de outra pessoa (o revisor da tabela da seção 4).
- O merge é feito pela Isabella, com **"Create a merge commit"** (não usar squash), para os commits ficarem visíveis.
- Nunca commitar direto na `main`, nunca usar `push --force` e não apagar branches.

### Definition of Done
Uma task só está pronta quando:
1. os critérios de aceite da task foram verificados;
2. `npm test` e `npm run lint` passam;
3. o PR foi revisado por outra pessoa e integrado;
4. o link do PR e a evidência foram anexados no item do Jira;
5. a documentação foi atualizada, quando a task muda contrato ou comportamento.

## 3. Quem faz o quê

| Integrante | Foco no UC-013 | Tasks |
|---|---|---|
| **Isabella Barela Venancio** | Estrutura do repositório; back: domínio e serviço; diagrama de classes; documentação final | T00, P01, P02, P03, D01, P13 |
| **Carolina Yumi Toyota** | Back: persistência, autenticação provisória e endpoints | P04, P05, P06 |
| **Matheus Lara Campos** | Front: formulário, validação e testes | P07, P08, P09 |
| **Gabriela Borborema Paes Barreto** | Front: integração e página; testes da API | P10, P11, P12 |

## 4. Tasks

Dependência = "só faz merge depois de". Revisor = quem aprova o PR.

### Preparação

**T00 — Estrutura do repositório (backend, frontend e CI)** · Isabella · `isabella/T00-estrutura-repositorio` · CSC-3 · sem dependência · revisor: Matheus
- `Trabalho Final/backend` (Node.js 20 + Express, Jest + Supertest, ESLint), `Trabalho Final/frontend` (React com Vite, Vitest + Testing Library, ESLint), `.gitignore` e workflow do GitHub Actions rodando teste e lint dos dois.
- **Pronto quando:** `npm install`, `npm test` e `npm run lint` passam no back e no front, `npm run build` passa no front e o CI roda no PR.

### História 1 — Salvar rascunho só com o título (CSC-8 · CA-013.1 · A1, A5, A6, E1, E2)

**P01 — Domínio do pedido e política de validação** · Isabella · `isabella/P01-dominio-pedido` · CSC-21 · depende de T00 · revisor: Carolina
- `backend/src/pedidos/domain/Pedido.js` e `PedidoPolicy.js`: validar título (1–100), situação e contexto (até 500), destinatário (nome, tipo, proximidade, conforme RN-007) e a regra "destinatário **ou** `destinatarioId`, não os dois".
- `Pedido` calcula `dadosFaltantesParaGerar` (situação, categoria, destinatário) e nasce no estado `rascunho`.
- A política devolve a lista de problemas por campo (`[{campo, mensagem}]`) sem lançar exceção.
- **Pronto quando:** os testes do domínio passam e o módulo não importa Express nem SQLite.

**P02 — Serviço `criarRascunho`** · Isabella · `isabella/P02-servico-criar-rascunho` · CSC-22 · depende de P01 · revisor: Carolina
- `PedidoService.criarRascunho(contaId, dados)`: valida → se vier `destinatarioId`, busca **na coleção da conta** (inexistente ou de outra conta = `DestinatarioNaoEncontradoError`) → monta a fotografia do destinatário → se vier `categoriaId`, exige categoria **ativa** → grava → devolve o pedido com `dadosFaltantesParaGerar`.
- Repositórios entram por injeção de dependência (para testar com repositórios falsos).
- **Pronto quando:** o serviço funciona com repositórios falsos, sem criar destinatário novo em A3.

**P05 — Endpoint `POST /api/pedidos` e autenticação provisória** · Carolina · `carolina/P05-endpoint-pedidos` · CSC-23 · depende de P02 e P04 · revisor: Isabella
- Middleware `autenticar` (`Authorization: Bearer dev:<contaId>`, só fora de produção) que preenche `req.contaId`; sem token válido → 401 `SESSAO_INVALIDA`.
- `PedidoController` + rota seguindo o contrato (201, 400, 401, 404, 500) com middleware de erro central.
- **Pronto quando:** as cinco respostas do contrato são reproduzíveis com Postman ou `curl`.

**P07 — Componente `PedidoForm`** · Matheus · `matheus/P07-formulario-pedido` · CSC-24 · depende de T00 · revisor: Gabriela
- Campos título (obrigatório), situação, categoria (lista), contexto e destinatário, com `<label>` em cada input, ordem de tabulação correta e **Salvar rascunho** / **Cancelar** acessíveis por teclado (RNF-003). Aviso de que só o título é obrigatório (passo 2).
- Componente puro: recebe `categorias`, `destinatarios`, `erros`, `carregando`, `onSubmit` e `onCancel`. Não chama a API.
- **Pronto quando:** o formulário renderiza e dispara os callbacks.

**P08 — Validação no cliente, modos de destinatário e cancelamento** · Matheus · `matheus/P08-validacao-destinatario-cancelar` · CSC-25 · depende de P07 · revisor: Gabriela
- Título vazio mostra a mensagem junto do campo e **não** envia (A5), mantendo o que foi digitado.
- `SeletorDestinatario` com três modos: **nenhum**, **escolher cadastrado** (A2) e **informar direto** (A3: nome, tipo e proximidade). Só envia `destinatarioId` **ou** `destinatario`.
- **Cancelar** limpa tudo e volta sem chamar a API (A6).
- **Pronto quando:** nunca é enviada uma requisição com título vazio nem com os dois tipos de destinatário.

**P11 — Página `CriarPedidoPage` e tela de rascunho salvo** · Gabriela · `gabriela/P11-pagina-criar-pedido` · CSC-26 · depende de P07, P08 e P10 · revisor: Matheus
- Rota `/pedidos/novo`. Carrega categorias e destinatários ao abrir, liga o formulário ao hook da P10 e, no sucesso, mostra `RascunhoSalvo`: "Rascunho salvo" com a lista de **dados que ainda faltam** para gerar uma sugestão (A1, passo 6) e **sem** botão de gerar quando faltar algo.
- **Pronto quando:** o fluxo de CT-013.1 funciona de ponta a ponta com o back rodando.

### História 2 — Associar o destinatário ao pedido (CSC-9 · CA-013.2, CA-013.3 · A2, A3, RN-003, RN-007)

**P03 — Testes unitários do serviço** · Isabella · `isabella/P03-testes-servico` · CSC-27 · depende de P02 · revisor: Matheus
- CT-013.1, CT-013.2 (destinatário direto: nenhum registro novo no repositório de destinatários), CT-013.3 (alterar o cadastro depois **não** muda o pedido), CT-013.5 (destinatário de outra conta) e E2 (repositório falso que falha).
- **Pronto quando:** todos os ramos de `criarRascunho` estão cobertos.

**P04 — Repositórios SQLite e dados de teste** · Carolina · `carolina/P04-repositorios-sqlite` · CSC-28 · depende de T00 · revisor: Isabella
- Tabelas `pedidos` (com colunas `destinatario_nome`, `destinatario_tipo`, `destinatario_proximidade`, `destinatario_origem`, `conta_id`, `estado`), `categorias` (`ativa`) e `destinatarios` (`conta_id`). Repositórios: `PedidoRepository.inserir`, `CategoriaRepository.buscarAtivaPorId` e `listarAtivas`, `DestinatarioRepository.buscarDaConta(contaId, id)` e `listarDaConta`.
- `npm run seed`: 2 categorias ativas, 1 inativa, uma conta de desenvolvimento e destinatários de duas contas diferentes.
- **Pronto quando:** `buscarDaConta` não devolve destinatário de outra conta.

**P06 — Endpoints de apoio `GET /api/categorias` e `GET /api/destinatarios`** · Carolina · `carolina/P06-endpoints-apoio` · CSC-29 · depende de P04 · revisor: Gabriela
- Somente leitura, ambos protegidos pelo middleware da P05. Categorias: só as ativas. Destinatários: só os da conta da sessão.
- **Pronto quando:** duas contas diferentes recebem listas diferentes.

**P09 — Testes do front (formulário)** · Matheus · `matheus/P09-testes-formulario` · CSC-30 · depende de P08 · revisor: Isabella
- Vitest + Testing Library: salvar só com título (CT-013.1), destinatário direto envia `destinatario` e não `destinatarioId` (CT-013.2), cadastrado envia `destinatarioId`, título vazio não envia e cancelar não envia.
- **Pronto quando:** `npm test` do `frontend/` passa e cobre esses comportamentos.

**P10 — Cliente da API e hook `useCriarPedido`** · Gabriela · `gabriela/P10-cliente-api-hook` · CSC-31 · depende de T00; usa mock do contrato até a P05 · revisor: Matheus
- `pedidoApi.js` (`fetch` para `POST /api/pedidos`, `GET /api/categorias`, `GET /api/destinatarios`, com o header de sessão provisória) e hook com estados `ocioso | carregando | sucesso | erro`.
- **400:** mapeia `campos` para os erros do formulário. **401:** pede para entrar. **404:** "Destinatário não encontrado". **500/rede:** "Tentar novamente" mantendo os dados (E2).
- **Pronto quando:** o hook é testado com `fetch` simulado para 201, 400, 401, 404 e 500.

**P12 — Testes de integração da API e documentação** · Gabriela · `gabriela/P12-testes-integracao-api` · CSC-32 · depende de P05 e P06 · revisor: Carolina
- Supertest com banco em memória: 201 só com título, 201 com destinatário direto (e **0** destinatários novos), 201 com cadastrado (e fotografia preservada após alterar o cadastro), 400 sem título, 401 sem token, 404 com destinatário de outra conta e 500 simulado. Nenhuma resposta traz dado de outra conta.
- Documentar os endpoints no `backend/README.md` com exemplos.
- **Pronto quando:** todos os cenários passam.

### Modelagem

**D01 — Diagrama de classes do UC-013** · Isabella · sem branch própria (commits direto na `feature/uc-013-criar-pedido-desculpa`) · CSC-33 · depende de P01 e P02; atualizado depois de P04 a P09
- [`diagrama-classes-uc-013.md`](diagrama-classes-uc-013.md): diagrama de domínio e diagrama de projeto em camadas (back-end, front-end, erros e banco de dados), com responsabilidades, regras de dependência e rastreabilidade até os diretórios.
- Segue a aula de Diagrama de Classes e a lista da Atividade 6. Pedido pelo professor em "Para concluir".
- **Pronto quando:** o documento reflete o código integrado e os diagramas renderizam no GitHub. Atualizar de novo na P13, depois da P10 e da P11.

### Fechamento

**P13 — Documentação, evidências e PR final** · Isabella · `isabella/P13-documentacao-final` · CSC-5 · depende de todas · revisor: Matheus
- Preencher a rastreabilidade UC-013 ↔ tasks ↔ PRs ("Tarefas relacionadas" e "Casos de teste relacionados" estavam "A definir"), registrar as decisões da seção 4 da especificação, um GIF curto do fluxo e as instruções de execução (incluindo `npm run seed`) no `README.md` de `Trabalho Final/`.
- Corrigir no documento de casos de uso a frase que diz que o grupo não utilizou o Jira, com o link do board.
- Abrir o PR `feature/uc-013-criar-pedido-desculpa` → `main` com o resumo das tasks e os links dos PRs.

## 5. Ordem e sprints

O board do Jira não tem sprints; elas são marcadas com as labels `sprint-1` e `sprint-2`.

```
Sprint 1 — Base                        Sprint 2 — Integração e testes
  T00 ► P01 ► P02                        P03 · P05 · P08 ► P09
  T00 ► P04 ► P06                        P11 · P12 · P13
  T00 ► P07 · P10                        D01
```

| Sprint | Meta (Sprint Goal) | Tasks |
|---|---|---|
| 1 | O repositório tem a estrutura e o CI; o back sabe validar um pedido e ler categorias e destinatários; o front tem o formulário e o cliente da API | T00, P01, P02, P04, P06, P07, P10 |
| 2 | O usuário salva um rascunho de ponta a ponta, com destinatário cadastrado ou direto, sem acessar dados de outra conta | P03, P05, P08, P09, P11, P12, D01, P13 |

## 6. Jira

Board: <https://uem-team-rgets2wn.atlassian.net> — projeto **CSC** ("CORRAM! O sistema caiu!"). Os itens já estão criados:

```
Epic     CSC-2  UC-013 Criar pedido de desculpa
├── Story  CSC-8  História 1 — Salvar rascunho só com o título
│   └── Sub-tasks: P01 (CSC-21), P02 (CSC-22), P05 (CSC-23), P07 (CSC-24), P08 (CSC-25), P11 (CSC-26)
├── Story  CSC-9  História 2 — Associar o destinatário ao pedido
│   └── Sub-tasks: P03 (CSC-27), P04 (CSC-28), P06 (CSC-29), P09 (CSC-30), P10 (CSC-31), P12 (CSC-32)
├── Task   CSC-33 D01 Diagrama de classes do UC-013
└── Task   CSC-5  P13 Documentação, evidências e PR final
Task       CSC-3  T00 Estruturar o repositório (pré-requisito)
```

Colunas: **A fazer → Fazendo → Em análise → Feito**.
- **Fazendo:** ao começar a task.
- **Em análise:** quando o PR é aberto (anexe o link do PR no item).
- **Feito:** quando o PR é integrado e as evidências estão anexadas.

## 7. Painel de acompanhamento

| Task | Responsável | Branch | Chave Jira | Revisor | PR | Status |
|---|---|---|---|---|---|---|
| T00 | Isabella | `isabella/T00-estrutura-repositorio` | CSC-3 | Matheus | | |
| P01 | Isabella | `isabella/P01-dominio-pedido` | CSC-21 | Carolina | | |
| P02 | Isabella | `isabella/P02-servico-criar-rascunho` | CSC-22 | Carolina | | |
| P03 | Isabella | `isabella/P03-testes-servico` | CSC-27 | Matheus | | |
| P04 | Carolina | `carolina/P04-repositorios-sqlite` | CSC-28 | Isabella | | |
| P05 | Carolina | `carolina/P05-endpoint-pedidos` | CSC-23 | Isabella | | |
| P06 | Carolina | `carolina/P06-endpoints-apoio` | CSC-29 | Gabriela | | |
| P07 | Matheus | `matheus/P07-formulario-pedido` | CSC-24 | Gabriela | | |
| P08 | Matheus | `matheus/P08-validacao-destinatario-cancelar` | CSC-25 | Gabriela | | |
| P09 | Matheus | `matheus/P09-testes-formulario` | CSC-30 | Isabella | | |
| P10 | Gabriela | `gabriela/P10-cliente-api-hook` | CSC-31 | Matheus | | |
| P11 | Gabriela | `gabriela/P11-pagina-criar-pedido` | CSC-26 | Matheus | | |
| P12 | Gabriela | `gabriela/P12-testes-integracao-api` | CSC-32 | Carolina | | |
| D01 | Isabella | — (direto na `feature/uc-013-criar-pedido-desculpa`) | CSC-33 | — | — | Feito |
| P13 | Isabella | `isabella/P13-documentacao-final` | CSC-5 | Matheus | | |
