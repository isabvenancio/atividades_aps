# Plano de trabalho — UC-013 Criar pedido de desculpa (VazaApp)

Segundo caso de uso do trabalho final. Mesmo repositório, mesmo grupo e **as mesmas regras** de branch, commit, PR, merge e Definition of Done do [`plano-de-trabalho.md`](plano-de-trabalho.md) (seções 1 e 2). Aqui estão só o que muda no UC-013. Especificação e contrato da API: [`uc-013-especificacao.md`](uc-013-especificacao.md).

> Cada integrante faz **os próprios commits e PRs**, com a própria conta do GitHub.

## 1. Branches

```
main
 └── feature/uc-013-criar-pedido-desculpa   ← branch do caso de uso (integração)
      ├── isabella/P01-dominio-pedido
      ├── carolina/P04-repositorios-sqlite
      ├── matheus/P07-formulario-pedido
      ├── gabriela/P10-cliente-api-hook
      └── ... uma por task
```

**Base da branch do caso de uso:** o UC-013 reaproveita a estrutura `backend/` e `frontend/` criada na **T00** do UC-001. Então:
- se a T00 já foi integrada em `feature/uc-001-cadastrar-conta`, crie a branch do UC-013 a partir dela (padrão do script);
- se o UC-001 já foi para a `main`, use `BASE=main`.

```bash
bash trabalho-final/scripts/criar-branches-uc-013.sh              # base: feature/uc-001-cadastrar-conta
BASE=main bash trabalho-final/scripts/criar-branches-uc-013.sh     # base: main
```

O PR final (`feature/uc-013-criar-pedido-desculpa` → `main`) só deve ser aberto depois que o UC-001 estiver na `main`, para o diff mostrar apenas o UC-013.

## 2. Quem faz o quê

Os papéis giram em relação ao UC-001, para todo mundo trabalhar em front e back ao longo do projeto.

| Integrante | Foco no UC-013 | Tasks |
|---|---|---|
| **Isabella Barela Venancio** | Back: domínio e serviço; documentação final | P01, P02, P03, P13 |
| **Carolina Yumi Toyota** | Back: persistência, autenticação provisória e endpoints | P04, P05, P06 |
| **Matheus Lara Campos** | Front: formulário, validação e testes | P07, P08, P09 |
| **Gabriela Borborema Paes Barreto** | Front: integração e página; testes da API | P10, P11, P12 |

## 3. Tasks

Dependência = "só faz merge depois de". Revisor = quem aprova o PR. Commits no formato `tipo(escopo): descrição [PNN] [VAZ-xx]`.

### História 1 — Salvar rascunho só com o título (CA-013.1 · A1, A5, A6, E1, E2)

**P01 — Domínio do pedido e política de validação** · Isabella · `isabella/P01-dominio-pedido` · depende de T00 (UC-001) · revisor: Carolina
- `backend/src/pedidos/domain/Pedido.js` e `PedidoPolicy.js`: validar título (1–100), situação e contexto (até 500), destinatário (nome, tipo, proximidade, conforme RN-007) e a regra "destinatário **ou** `destinatarioId`, não os dois".
- `Pedido` calcula `dadosFaltantesParaGerar` (situação, categoria, destinatário) e nasce no estado `rascunho`.
- A política devolve a lista de problemas por campo (`[{campo, mensagem}]`) sem lançar exceção.
- **Pronto quando:** os testes do domínio passam e o módulo não importa Express nem SQLite.

**P02 — Serviço `criarRascunho`** · Isabella · `isabella/P02-servico-criar-rascunho` · depende de P01 · revisor: Carolina
- `PedidoService.criarRascunho(contaId, dados)`: valida → se vier `destinatarioId`, busca **na coleção da conta** (inexistente ou de outra conta = `DestinatarioNaoEncontradoError`) → monta a fotografia do destinatário → se vier `categoriaId`, exige categoria **ativa** → grava → devolve o pedido com `dadosFaltantesParaGerar`.
- Repositórios entram por injeção de dependência (para testar com repositórios falsos).
- **Pronto quando:** o serviço funciona com repositórios falsos, sem criar destinatário novo em A3.

**P05 — Endpoint `POST /api/pedidos` e autenticação provisória** · Carolina · `carolina/P05-endpoint-pedidos` · depende de P02 e P04 · revisor: Isabella
- Middleware `autenticar` (`Authorization: Bearer dev:<contaId>`, só fora de produção) que preenche `req.contaId`; sem token válido → 401 `SESSAO_INVALIDA`.
- `PedidoController` + rota seguindo o contrato (201, 400, 401, 404, 500) com middleware de erro central.
- **Pronto quando:** as cinco respostas do contrato são reproduzíveis com Postman ou `curl`.

**P07 — Componente `PedidoForm`** · Matheus · `matheus/P07-formulario-pedido` · depende de T00 (UC-001) · revisor: Gabriela
- Campos título (obrigatório), situação, categoria (lista), contexto e destinatário, com `<label>` em cada input, ordem de tabulação correta e **Salvar rascunho** / **Cancelar** acessíveis por teclado (RNF-003). Aviso de que só o título é obrigatório (passo 2).
- Componente puro: recebe `categorias`, `destinatarios`, `erros`, `carregando`, `onSubmit` e `onCancel`. Não chama a API.
- **Pronto quando:** o formulário renderiza e dispara os callbacks.

**P08 — Validação no cliente, modos de destinatário e cancelamento** · Matheus · `matheus/P08-validacao-destinatario-cancelar` · depende de P07 · revisor: Gabriela
- Título vazio mostra a mensagem junto do campo e **não** envia (A5), mantendo o que foi digitado.
- `SeletorDestinatario` com três modos: **nenhum**, **escolher cadastrado** (A2) e **informar direto** (A3: nome, tipo e proximidade). Só envia `destinatarioId` **ou** `destinatario`.
- **Cancelar** limpa tudo e volta sem chamar a API (A6).
- **Pronto quando:** nunca é enviada uma requisição com título vazio nem com os dois tipos de destinatário.

**P11 — Página `CriarPedidoPage` e tela de rascunho salvo** · Gabriela · `gabriela/P11-pagina-criar-pedido` · depende de P07, P08 e P10 · revisor: Matheus
- Rota `/pedidos/novo`. Carrega categorias e destinatários ao abrir, liga o formulário ao hook da P10 e, no sucesso, mostra `RascunhoSalvo`: "Rascunho salvo" com a lista de **dados que ainda faltam** para gerar uma sugestão (A1, passo 6) e **sem** botão de gerar quando faltar algo.
- **Pronto quando:** o fluxo de CT-013.1 funciona de ponta a ponta com o back rodando.

### História 2 — Associar o destinatário ao pedido (CA-013.2, CA-013.3 · A2, A3, RN-003, RN-007)

**P03 — Testes unitários do serviço** · Isabella · `isabella/P03-testes-servico` · depende de P02 · revisor: Matheus
- CT-013.1, CT-013.2 (destinatário direto: nenhum registro novo no repositório de destinatários), CT-013.3 (alterar o cadastro depois **não** muda o pedido), CT-013.5 (destinatário de outra conta) e E2 (repositório falso que falha).
- **Pronto quando:** todos os ramos de `criarRascunho` estão cobertos.

**P04 — Repositórios SQLite e dados de teste** · Carolina · `carolina/P04-repositorios-sqlite` · depende de T00 (UC-001) · revisor: Isabella
- Tabelas `pedidos` (com colunas `destinatario_nome`, `destinatario_tipo`, `destinatario_proximidade`, `destinatario_origem`, `conta_id`, `estado`), `categorias` (`ativa`) e `destinatarios` (`conta_id`). Repositórios: `PedidoRepository.inserir`, `CategoriaRepository.buscarAtivaPorId` e `listarAtivas`, `DestinatarioRepository.buscarDaConta(contaId, id)` e `listarDaConta`.
- `npm run seed`: 2 categorias ativas, 1 inativa, uma conta de desenvolvimento e destinatários de duas contas diferentes.
- **Pronto quando:** `buscarDaConta` não devolve destinatário de outra conta.

**P06 — Endpoints de apoio `GET /api/categorias` e `GET /api/destinatarios`** · Carolina · `carolina/P06-endpoints-apoio` · depende de P04 · revisor: Gabriela
- Somente leitura, ambos protegidos pelo middleware da P05. Categorias: só as ativas. Destinatários: só os da conta da sessão.
- **Pronto quando:** duas contas diferentes recebem listas diferentes.

**P09 — Testes do front (formulário)** · Matheus · `matheus/P09-testes-formulario` · depende de P08 · revisor: Isabella
- Vitest + Testing Library: salvar só com título (CT-013.1), destinatário direto envia `destinatario` e não `destinatarioId` (CT-013.2), cadastrado envia `destinatarioId`, título vazio não envia e cancelar não envia.
- **Pronto quando:** `npm test` do `frontend/` passa e cobre esses comportamentos.

**P10 — Cliente da API e hook `useCriarPedido`** · Gabriela · `gabriela/P10-cliente-api-hook` · depende de T00 (UC-001); usa mock do contrato até a P05 · revisor: Matheus
- `pedidoApi.js` (`fetch` para `POST /api/pedidos`, `GET /api/categorias`, `GET /api/destinatarios`, com o header de sessão provisória) e hook com estados `ocioso | carregando | sucesso | erro`.
- **400:** mapeia `campos` para os erros do formulário. **401:** pede para entrar. **404:** "Destinatário não encontrado". **500/rede:** "Tentar novamente" mantendo os dados (E2).
- **Pronto quando:** o hook é testado com `fetch` simulado para 201, 400, 401, 404 e 500.

**P12 — Testes de integração da API e documentação** · Gabriela · `gabriela/P12-testes-integracao-api` · depende de P05 e P06 · revisor: Carolina
- Supertest com banco em memória: 201 só com título, 201 com destinatário direto (e **0** destinatários novos), 201 com cadastrado (e fotografia preservada após alterar o cadastro), 400 sem título, 401 sem token, 404 com destinatário de outra conta e 500 simulado. Nenhuma resposta traz dado de outra conta.
- Documentar os endpoints no `backend/README.md` com exemplos.
- **Pronto quando:** todos os cenários passam.

### Fechamento

**P13 — Documentação, evidências e PR final** · Isabella · `isabella/P13-documentacao-final` · depende de todas · revisor: Matheus
- Preencher a rastreabilidade UC-013 ↔ tasks ↔ PRs ("Tarefas relacionadas" e "Casos de teste relacionados" estavam "A definir"), registrar as decisões da seção 4 da especificação, um GIF curto do fluxo e as instruções de execução (incluindo `npm run seed`) no `README.md` de `trabalho-final/`.
- Abrir o PR `feature/uc-013-criar-pedido-desculpa` → `main` com o resumo das tasks e os links dos PRs.

## 4. Ordem e sprints

```
Sprint 1 — Base                        Sprint 2 — Integração e testes
  P01 ► P02                              P03 · P05 · P08 ► P09
  P04 ► P06                              P11 · P12 · P13
  P07 · P10
```

| Sprint | Meta (Sprint Goal) | Tasks |
|---|---|---|
| 1 | O back sabe validar um pedido e ler categorias e destinatários; o front tem o formulário e o cliente da API | P01, P02, P04, P06, P07, P10 |
| 2 | O usuário salva um rascunho de ponta a ponta, com destinatário cadastrado ou direto, sem acessar dados de outra conta | P03, P05, P08, P09, P11, P12, P13 |

## 5. Jira

Importe [`jira/jira-import-uc-013.csv`](jira/jira-import-uc-013.csv) como no UC-001 (passos na seção 6 do plano anterior). Estrutura:

```
Epic    UC-013 Criar pedido de desculpa
├── Story  História 1 — Salvar rascunho só com o título               (8 pts)
│   └── Sub-tasks: P01, P02, P05, P07, P08, P11
├── Story  História 2 — Associar o destinatário ao pedido             (8 pts)
│   └── Sub-tasks: P03, P04, P06, P09, P10, P12
└── Task   P13 Documentação, evidências e PR final
```

## 6. Painel de acompanhamento

| Task | Responsável | Branch | Chave Jira | PR | Status |
|---|---|---|---|---|---|
| P01 | Isabella | `isabella/P01-dominio-pedido` | | | |
| P02 | Isabella | `isabella/P02-servico-criar-rascunho` | | | |
| P03 | Isabella | `isabella/P03-testes-servico` | | | |
| P04 | Carolina | `carolina/P04-repositorios-sqlite` | | | |
| P05 | Carolina | `carolina/P05-endpoint-pedidos` | | | |
| P06 | Carolina | `carolina/P06-endpoints-apoio` | | | |
| P07 | Matheus | `matheus/P07-formulario-pedido` | | | |
| P08 | Matheus | `matheus/P08-validacao-destinatario-cancelar` | | | |
| P09 | Matheus | `matheus/P09-testes-formulario` | | | |
| P10 | Gabriela | `gabriela/P10-cliente-api-hook` | | | |
| P11 | Gabriela | `gabriela/P11-pagina-criar-pedido` | | | |
| P12 | Gabriela | `gabriela/P12-testes-integracao-api` | | | |
| P13 | Isabella | `isabella/P13-documentacao-final` | | | |
