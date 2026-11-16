# UC-013 — Criar pedido de desculpa (especificação para implementação)

> Resumo operacional do UC-013 de `Atividade 26 de Agosto/casos_de_uso.pdf`, com rastreabilidade em RF-013, RN-003, RN-007 e RN-008. O documento original continua sendo a fonte oficial. Este arquivo existe para o front e o back trabalharem em paralelo sobre o mesmo contrato.

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

Cenários adicionais propostos pelo grupo (cobrem E1 e RN-003):

| CT | Cenário | Esperado |
|---|---|---|
| CT-013.4 (proposto) | Criar pedido sem sessão ou com token inválido | 401; nenhum pedido criado |
| CT-013.5 (proposto) | Escolher `destinatarioId` que pertence a **outra** conta | 404 genérico; nenhum pedido criado; nenhum dado do outro usuário na resposta |

## 4. Decisões propostas (confirmar com o grupo)

- **Título:** obrigatório, após `trim()` entre 1 e 100 caracteres.
- **Situação e contexto:** opcionais, até 500 caracteres cada.
- **Categoria:** opcional no rascunho, mas, se informada, precisa existir **e estar ativa** (CT-013.2 pede categoria ativa).
- **Destinatário:** envie `destinatarioId` **ou** `destinatario`, nunca os dois (400). `tipo` ∈ `familiar | amigo | colega | superior | outro`; `proximidade` ∈ `baixa | media | alta` (a interface mostra "média"). Nome obrigatório.
- **Fotografia:** o pedido grava `destinatario_nome`, `destinatario_tipo`, `destinatario_proximidade` e `destinatario_origem` (`cadastrado` ou `direto`). Alterar o cadastro depois **não** muda o pedido.
- **Estado:** o servidor define `rascunho`. O cliente não envia estado nem dono do pedido; o dono vem da sessão.
- **"Pronto para gerar"** (RN-008) exige situação, categoria ativa e destinatário com tipo e proximidade válidos. A resposta traz `dadosFaltantesParaGerar` com os que faltam.
- **Sessão provisória:** o login (UC-002) ainda não existe. Usamos um middleware `autenticar` com `Authorization: Bearer dev:<contaId>`, ativo **só fora de produção**. Quando o UC-002 existir, só a implementação do middleware muda. O resto do código usa `req.contaId`.
- **Categorias e destinatários** ainda não têm cadastro (UC-009 e UC-027). Esta entrega usa dados de teste (`npm run seed`) e endpoints **somente de leitura**.

Registrar a decisão final aqui no PR da P13.

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

`200` → `[{ "id": "dest-rita", "nome": "Rita", "tipo": "colega", "proximidade": "media" }]`. Retorna **apenas os da conta da sessão**.

Regras do contrato:
- Mensagens em português, sem código interno nem stack trace (RNF-003).
- O corpo nunca informa a conta dona nem o estado; ambos vêm do servidor.
- Nenhuma resposta revela dados de outra conta (RN-003).

## 6. Arquitetura

Mesma organização do UC-001: módulo por funcionalidade, camadas dentro dele.

```
trabalho-final/
├── backend/src/
│   ├── compartilhado/auth/   # middleware autenticar (sessão provisória)            → P05
│   ├── pedidos/
│   │   ├── domain/           # Pedido, PedidoPolicy                                 → P01
│   │   ├── service/          # PedidoService.criarRascunho                          → P02, P03
│   │   ├── repository/       # PedidoRepository, DestinatarioRepository,
│   │   │                     # CategoriaRepository (SQLite) + seed                  → P04
│   │   └── controller/       # POST /api/pedidos, GET /api/categorias,
│   │                         # GET /api/destinatarios                               → P05, P06, P12
└── frontend/src/features/criar-pedido/
    ├── components/           # PedidoForm, SeletorDestinatario                      → P07, P08, P09
    ├── api/                  # pedidoApi.js, useCriarPedido                         → P10
    └── pages/                # CriarPedidoPage, RascunhoSalvo                       → P11
```

Dependências: `controller → service → domain` e `service → repository`. O domínio não importa Express nem SQLite.

## 7. Diagrama de sequência

Fonte oficial: `Atividade 4/Diagramas Sequencias/UC-013.svg`.
