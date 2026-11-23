# Backend — Node.js + Express

API do VazaApp. Módulos por funcionalidade, com as camadas dentro de cada um (`domain`, `service`, `repository`, `controller`).

## Como rodar

Requer Node 20 ou superior. A partir da raiz do repositório:

```bash
cd "Trabalho Final/backend"
npm install
npm run seed     # prepara o SQLite com dados de desenvolvimento
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

## Dados de desenvolvimento

O backend usa SQLite com `better-sqlite3`. Por padrão, o arquivo fica em `backend/vazaapp.sqlite`. Defina `SQLITE_PATH` para usar outro arquivo ou passe `:memory:` a `abrirBanco` nos testes.

`npm run seed` prepara duas categorias ativas, Trabalho e Família, e uma arquivada. A conta de desenvolvimento `conta-dev` tem a destinatária Rita (`dest-rita`). A segunda conta, `conta-outra`, tem Caio (`dest-caio`). A carga pode ser repetida e preserva os dados já gravados.

Em desenvolvimento e nos testes, o cabeçalho `Authorization: Bearer dev:conta-dev` identifica a sessão. Em produção esse mecanismo fica desativado. O rascunho pertence à conta identificada pelo cabeçalho.

## Contrato da API

UC-013: [`../docs/uc-013-especificacao.md`](../docs/uc-013-especificacao.md), seção 5.

Os exemplos de requisição e resposta de cada endpoint entram aqui na task P12.
