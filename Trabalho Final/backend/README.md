# Backend — Node.js + Express

API do VazaApp. Módulos por funcionalidade, com as camadas dentro de cada um (`domain`, `service`, `repository`, `controller`).

## Como rodar

Requer Node 20 ou superior. A partir da raiz do repositório:

```bash
cd "Trabalho Final/backend"
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
│   └── pedidos/      # UC-013 (P01 a P06)
└── tests/            # testes unitários e de integração (Supertest)
```

`app.js` exporta `criarApp()` para os testes subirem a API sem abrir porta.

## Dependências que entram nas tasks

Cada task instala o que precisa, para o `package.json` mostrar quem trouxe o quê:

| Pacote | Task |
|---|---|
| `better-sqlite3` | P04 |

## Contrato da API

UC-013: [`../docs/uc-013-especificacao.md`](../docs/uc-013-especificacao.md), seção 5.

Os exemplos de requisição e resposta de cada endpoint entram aqui na task P12.
