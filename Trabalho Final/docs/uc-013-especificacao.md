# UC-013 — Criar pedido de desculpa (especificação para implementação)

> Resumo operacional do UC-013 de `Atividades/Atividade 26 de Agosto/casos_de_uso.pdf`, com rastreabilidade em RF-013, RN-003, RN-007 e RN-008. O documento original continua sendo a fonte oficial. Este arquivo existe para o front e o back trabalharem em paralelo sobre o mesmo contrato.

## 1. Resumo

| Item | Conteúdo |
|---|---|
| Objetivo | Salvar um **rascunho** de pedido com situação e destinatário quando disponíveis |
| Ator principal | Usuário |
| Precondição | Sessão válida de Usuário. Não exige pedido anterior nem destinatário cadastrado |
| Entradas | `titulo` (obrigatório); `situacao`, `categoriaId`, `contexto` e destinatário (opcionais nesta etapa) |
| Destinatário | Escolhido da coleção própria (`destinatarioId`) **ou** informado direto (`destinatario` com nome, tipo e proximidade) |
| Pós-condição (sucesso) | Pedido próprio no estado `rascunho`, com título e **fotografia** (cópia) dos dados informados. Nenhuma sugestão é gerada |
| Pós-condição (falha/cancelamento) | Nenhum pedido novo é confirmado |
| Requisitos | RF-013 · RN-003 (propriedade) · RN-007 (destinatário válido) · RN-008 (dados do pedido) |

## 2. Fluxos

**Principal**
1. O usuário solicita criar um pedido de desculpa.
2. O sistema informa que o título é obrigatório e mostra os dados opcionais.
3. O usuário informa o título, acrescenta o que tiver e confirma.
4. O sistema valida o título e os dados; se há destinatário, valida nome, tipo e proximidade e, se vier de cadastro, a titularidade.
5. O sistema registra o pedido como rascunho do usuário, com a fotografia dos dados (inclusive do destinatário).
6. O sistema confirma o rascunho e informa quais dados ainda faltam para gerar uma sugestão.

**Alternativos e exceções**

| Id | Quando | Comportamento |
|---|---|---|
| A1 | Só título (passo 3) | Salva o rascunho; a geração **não** é apresentada como disponível |
| A2 | Escolhe destinatário cadastrado (passo 3) | Usa nome, tipo e proximidade dele na fotografia; **não** cria novo cadastro |
| A3 | Informa destinatário direto (passo 3) | Usa os dados no pedido; **não** cria registro na coleção de destinatários |
| A4 | Usa contexto do perfil (passo 3) | **Fora do escopo desta entrega** (perfil, UC-007/008, ainda não existe). `contexto` é texto livre |
| A5 | Título vazio ou dado inválido (passo 4) | Informa o problema, mantém os dados e volta ao passo 3; nada é gravado |
| A6 | Cancela antes de confirmar (passo 3) | Encerra sem criar pedido |
| E1 | Sessão inválida ou destinatário de outra conta (passos 1, 4 ou 5) | Recusa sem criar pedido e sem revelar dados de outra conta |
| E2 | Falha ao salvar (passo 5) | Informa que não concluiu e não confirma o pedido como registrado |

## 3. Critérios de aceite e cenários de teste

| CA | Critério | CT | Cenário | Esperado |
|---|---|---|---|---|
| CA-013.1 | Título basta para salvar rascunho, sem liberar geração incompleta | CT-013.1 | Salvar título `Atraso na reunião`, sem situação, categoria e destinatário | Rascunho criado; resposta lista o que falta para gerar |
| CA-013.2 | Destinatário direto permite criar pedido sem cadastro reutilizável | CT-013.2 | Título, situação, categoria ativa e destinatário direto `Rita / superior / baixa` | Rascunho salvo com esses dados; **nenhum** destinatário novo na coleção |
| CA-013.3 | Escolher destinatário guarda a fotografia do momento | CT-013.3 | Criar rascunho com `Rita / colega / média`; depois alterar o cadastro para `amigo / alta` | O pedido continua `colega / média` |

Cenários adicionais propostos pelo grupo e implementados (cobrem E1 e RN-003):

| CT | Cenário | Esperado |
|---|---|---|
| CT-013.4 | Criar pedido sem sessão ou com token inválido | 401; nenhum pedido criado |
| CT-013.5 | Escolher `destinatarioId` que pertence a **outra** conta | 404 genérico; nenhum pedido criado; nenhum dado do outro usuário na resposta |

Os testes automatizados de cada cenário estão em [`rastreabilidade-uc-013.md`](rastreabilidade-uc-013.md).

## 4. Decisões adotadas

As decisões abaixo foram propostas no início do trabalho e implementadas como estão. A coluna "Onde" aponta o código que as garante.

| Decisão | Onde |
|---|---|
| **Título:** obrigatório, após `trim()` entre 1 e 100 caracteres. | `PedidoPolicy.validar` (`LIMITE_TITULO`); no front, `validarRascunho` e `maxLength` |
| **Situação e contexto:** opcionais, até 500 caracteres cada. | `PedidoPolicy.validar` (`LIMITE_TEXTO`) |
| **Categoria:** opcional no rascunho, mas, se informada, precisa existir **e estar ativa** (CT-013.2 pede categoria ativa). | `PedidoService` com `CategoriaRepository.buscarAtivaPorId` |
| **Destinatário:** envie `destinatarioId` **ou** `destinatario`, nunca os dois (400). `tipo` ∈ `familiar \| amigo \| colega \| superior \| outro`; `proximidade` ∈ `baixa \| media \| alta` (a interface mostra "média"). Nome obrigatório, até 100 caracteres. | `PedidoPolicy.validar`; no front, `SeletorDestinatario` e `lerRascunho` |
| **Fotografia:** o pedido grava `destinatario_nome`, `destinatario_tipo`, `destinatario_proximidade` e `destinatario_origem` (`cadastrado` ou `direto`). Alterar o cadastro depois **não** muda o pedido. | `Pedido`, `PedidoService` e tabela `pedidos` |
| **Estado:** o servidor define `rascunho`. O cliente não envia estado nem dono do pedido; o dono vem da sessão. | `Pedido.novoRascunho` e `autenticar` |
| **"Pronto para gerar"** (RN-008) exige situação, categoria ativa e destinatário com tipo e proximidade válidos. A resposta traz `dadosFaltantesParaGerar` com os que faltam. | `Pedido.dadosFaltantesParaGerar` |
| **Sessão provisória:** o login (UC-002) ainda não existe. O middleware `autenticar` aceita `Authorization: Bearer dev:<contaId>` **só fora de produção** (`NODE_ENV` igual a `development` ou `test`; sem `NODE_ENV` definido, vale `development`). Quando o UC-002 existir, só a implementação do middleware muda. O resto do código usa `req.contaId`. | `compartilhado/auth/autenticar.js` |
| **Categorias e destinatários** ainda não têm cadastro (UC-009 e UC-027). Esta entrega usa dados de teste (`npm run seed`) e endpoints **somente de leitura**. | `seed.js`, `GET /api/categorias`, `GET /api/destinatarios` |
| **Erros inesperados** respondem 500 sem detalhes internos e ficam registrados no console do servidor (B01). | `tratarErro` |

Atenção para a implantação: como a sessão de desenvolvimento vale quando `NODE_ENV` não está definido, um servidor publicado precisa rodar com `NODE_ENV=production`.

## 5. Contrato da API

Todas as rotas exigem `Authorization: Bearer dev:<contaId>`. Sem ele ou com valor inválido a resposta é:

```json
401 { "erro": "SESSAO_INVALIDA", "mensagem": "Entre na sua conta para continuar." }
```

### `POST /api/pedidos`

**Request** — destinatário cadastrado (A2)

```json
{
  "titulo": "Atraso na reunião",
  "situacao": "Cheguei 30 minutos atrasado na reunião de segunda.",
  "categoriaId": "cat-trabalho",
  "contexto": "Foi a terceira vez neste mês.",
  "destinatarioId": "dest-rita"
}
```

**Request** — destinatário direto (A3)

```json
{
  "titulo": "Atraso na reunião",
  "destinatario": { "nome": "Rita", "tipo": "superior", "proximidade": "baixa" }
}
```

Só `titulo` é obrigatório (A1): `{ "titulo": "Atraso na reunião" }`.

**201 Created**

```json
{
  "id": "5d0c1f90-3a1b-4e55-8b8a-7a6a0c9e1b21",
  "titulo": "Atraso na reunião",
  "estado": "rascunho",
  "situacao": null,
  "categoria": null,
  "destinatario": null,
  "contexto": null,
  "dadosFaltantesParaGerar": ["situacao", "categoria", "destinatario"],
  "criadoEm": "2026-11-23T14:03:11.000Z"
}
```

Com destinatário e categoria, `destinatario` vem como `{ "nome": "Rita", "tipo": "superior", "proximidade": "baixa", "origem": "direto" }` e `categoria` como `{ "id": "cat-trabalho", "nome": "Trabalho" }`.

**400 Bad Request** — A5 (nada é gravado)

```json
{
  "erro": "DADOS_INVALIDOS",
  "mensagem": "Corrija os campos indicados e tente novamente.",
  "campos": [
    { "campo": "titulo", "mensagem": "Informe um título para o pedido." },
    { "campo": "destinatario.tipo", "mensagem": "Escolha um tipo de destinatário válido." }
  ]
}
```

Quando o corpo não é um JSON válido ou passa do limite de tamanho, a resposta é a mesma, com `campos: [{ "campo": "corpo", "mensagem": "Envie um objeto JSON válido dentro do limite de tamanho." }]`.

**404 Not Found** — E1 (destinatário de outra conta ou inexistente, sem diferenciar)

```json
{ "erro": "DESTINATARIO_NAO_ENCONTRADO", "mensagem": "Destinatário não encontrado." }
```

**500 Internal Server Error** — E2

```json
{ "erro": "FALHA_AO_SALVAR", "mensagem": "Não foi possível salvar o pedido. Tente novamente." }
```

### `GET /api/categorias` — apoio ao formulário

`200` → `[{ "id": "cat-trabalho", "nome": "Trabalho", "descricao": "…" }]`. Retorna **apenas categorias ativas**.

### `GET /api/destinatarios` — apoio ao formulário

`200` → `[{ "id": "dest-rita", "nome": "Rita", "tipo": "colega", "proximidade": "media" }]`. Retorna **apenas os da conta da sessão**, com `Cache-Control: private, no-store`, porque são dados pessoais.

**Erros das rotas de apoio:** 401 `SESSAO_INVALIDA` sem sessão, como nas outras rotas. Se a consulta falhar:

```json
500 { "erro": "FALHA_AO_CONSULTAR", "mensagem": "Não foi possível carregar os dados. Tente novamente." }
```

Regras do contrato:
- Mensagens em português, sem código interno nem stack trace (RNF-003).
- O corpo nunca informa a conta dona nem o estado; ambos vêm do servidor.
- Nenhuma resposta revela dados de outra conta (RN-003).

## 6. Arquitetura

Organização por funcionalidade, com camadas dentro do módulo. A estrutura base (backend, frontend e CI) vem da T00.

```
Trabalho Final/
├── backend/src/
│   ├── app.js                # criarApp(): monta repositórios, serviço e rotas       → P05, P06
│   ├── compartilhado/auth/   # autenticar.js (sessão provisória)                    → P05
│   ├── pedidos/
│   │   ├── domain/           # Pedido, PedidoPolicy, constantes, erros              → P01
│   │   ├── service/          # PedidoService.criarRascunho                          → P02, P03
│   │   ├── repository/       # banco.js (tabelas), repositorios.js
│   │   │                     # (PedidoRepositorySqlite, CategoriaRepositorySqlite,
│   │   │                     # DestinatarioRepositorySqlite), seed.js               → P04
│   │   └── controller/       # PedidoController (POST /api/pedidos,
│   │                         # GET /api/categorias, GET /api/destinatarios),
│   │                         # tratarErro                                           → P05, P06, P12
└── frontend/src/features/criar-pedido/
    ├── rascunho.js           # lerRascunho, validarRascunho                         → P08
    ├── components/           # PedidoForm, CampoPedido, SeletorDestinatario         → P07, P08, P09
    ├── api/                  # pedidoApi.js, useCriarPedido                         → P10
    └── pages/                # CriarPedidoPage, RascunhoSalvo                       → P11
```

Dependências: `controller → service → domain` e `service → repository`. O domínio não importa Express nem SQLite. Situação em 23/11/2026: P01 a P09 implementadas; `api/` e `pages/` (P10 e P11) ainda não existem.

## 7. Diagrama de sequência

Fonte oficial: `Atividades/Atividade 4/Diagramas Sequencias/UC-013.svg`.

## 8. Diagrama de classes

[`diagrama-classes-uc-013.md`](diagrama-classes-uc-013.md): domínio, camadas do back-end, componentes do front-end, erros e banco de dados, com rastreabilidade para as linhas de vida do diagrama de sequência e para as tasks. Task D01 (CSC-33).
