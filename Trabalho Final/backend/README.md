# Backend — Node.js + Express

API do VazaApp. Módulos por funcionalidade, com as camadas dentro de cada um (`domain`, `service`, `repository`, `controller`).

## Como rodar

Requer Node 20 ou superior.

```bash
cd trabalho-final/backend
npm install
npm run dev      # API em http://localhost:3000
npm test         # Jest + Supertest
npm run lint     # ESLint
```

Teste rápido: `curl http://localhost:3000/api/saude` deve responder `{"status":"ok"}`.

## Estrutura

```
backend/
├── src/
│   ├── app.js        # monta o Express (usado também nos testes)
│   ├── server.js     # sobe o servidor
│   ├── contas/       # UC-001 (T01 a T06)
│   └── pedidos/      # UC-013 (P01 a P06)
└── tests/            # testes de integração com Supertest
```

`app.js` exporta `criarApp()` para os testes subirem a API sem abrir porta.

## Dependências que entram nas tasks

Cada task instala o que precisa, para o `package.json` mostrar quem trouxe o quê:

| Pacote | Task |
|---|---|
| `bcryptjs` | T02 |
| `better-sqlite3` | T04 |

## Contrato da API

- UC-001: [`../docs/uc-001-especificacao.md`](../docs/uc-001-especificacao.md), seção 5.
- UC-013: [`../docs/uc-013-especificacao.md`](../docs/uc-013-especificacao.md), seção 5.

Os exemplos de requisição e resposta de cada endpoint entram aqui nas tasks T06 e P12.
