# VazaApp — Trabalho final: UC-013 Criar pedido de desculpa

Implementação do caso de uso **UC-013 — Criar pedido de desculpa** (RF-013; RN-003, RN-007 e RN-008), do trabalho final de Análise e Projeto de Software (UEM, Prof. Dr. João Choma).

O usuário salva um **rascunho** de pedido de desculpa só com o título e acrescenta, quando tiver, a situação, a categoria, o contexto e o destinatário. O destinatário pode ser escolhido entre os cadastrados ou informado na hora. O pedido guarda uma cópia (fotografia) dos dados do destinatário, e a resposta informa o que ainda falta para gerar uma sugestão.

## Como rodar

Requer **Node 20 ou superior**. Use dois terminais, a partir da raiz do repositório.

**Back-end (API REST + SQLite), terminal 1:**

```bash
cd "Trabalho Final/backend"
npm install
npm run seed     # cria o banco SQLite com dados de teste
npm run dev      # API em http://localhost:3000
```

**Front-end (React + Vite), terminal 2:**

```bash
cd "Trabalho Final/frontend"
npm install
npm run dev      # http://localhost:5173 (as chamadas /api vão para a porta 3000)
```

O `npm run seed` cria duas categorias ativas (Trabalho e Família) e uma arquivada. A conta `conta-dev` tem a destinatária Rita, e a conta `conta-outra` tem o Caio. Enquanto o login (UC-002) não existe, a sessão é provisória: o cabeçalho `Authorization: Bearer dev:<conta>` identifica a conta, só fora de produção.

**Exemplo de chamada (PowerShell):**

```powershell
Invoke-RestMethod http://localhost:3000/api/pedidos -Method Post -ContentType "application/json" -Headers @{ Authorization = "Bearer dev:conta-dev" } -Body '{"titulo":"Atraso na reuniao"}'
```

## Testes

Em cada pasta (`backend` e `frontend`):

```bash
npm test
npm run lint
```

No front, `npm run build` confere também o build de produção.

O CI do GitHub (`.github/workflows`) roda o lint e os testes do back e do front em cada push e PR. A relação entre os casos de teste do UC-013 e os testes automatizados está em [`docs/rastreabilidade-uc-013.md`](docs/rastreabilidade-uc-013.md).

## Estrutura

```
Trabalho Final/
├── backend/     # Node.js, Express, SQLite (better-sqlite3), Jest + Supertest
├── frontend/    # React com Vite, Vitest + Testing Library
├── docs/        # especificação, plano, diagrama de classes e rastreabilidade
└── scripts/     # criação das branches das tasks
```

Detalhes de cada parte: [backend/README.md](backend/README.md) e [frontend/README.md](frontend/README.md).

## Documentação

| Documento | Conteúdo |
|---|---|
| [Especificação](docs/uc-013-especificacao.md) | Fluxos do UC, critérios de aceite, decisões adotadas, contrato da API e arquitetura |
| [Diagrama de classes](docs/diagrama-classes-uc-013.md) | Domínio, projeto em camadas, banco de dados e rastreabilidade até os diretórios |
| [Rastreabilidade](docs/rastreabilidade-uc-013.md) | Casos de teste ↔ testes automatizados ↔ tasks ↔ PRs |
| [Plano de trabalho](docs/plano-uc-013.md) | Branches, regras de commit e PR, tasks, sprints, Jira e painel de acompanhamento |
| [Diagrama de sequência](../Atividades/Atividade%204/Diagramas%20Sequencias/UC-013.svg) | Comportamento do UC-013 |
| [Casos de uso](../Atividades/Atividade%2026%20de%20Agosto/casos_de_uso.pdf), [regras de negócio](../Atividades/Atividade%202/regras_de_negocio.pdf) e [requisitos](../Atividades/Atividade%202/requisitos.pdf) | Documentos de análise de origem |

O acompanhamento das tasks é feito no Jira (projeto CSC, épico CSC-2), e cada task tem uma branch e um PR no GitHub.

## Equipe

| Integrante | Parte no UC-013 |
|---|---|
| Isabella Barela Venancio | Estrutura do repositório, domínio e serviço, diagrama de classes, layout do front, correções e documentação final |
| Carolina Yumi Toyota | Persistência SQLite, sessão provisória e endpoints |
| Matheus Lara Campos | Formulário, validação no cliente e testes do front |
| Gabriela Borborema Paes Barreto | Cliente da API, página de criação e testes de integração |
