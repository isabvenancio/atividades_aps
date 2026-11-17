# Frontend — React (Vite)

Interface do VazaApp. Cada funcionalidade fica em `src/features/<nome>/` com `components/`, `api/` e `pages/`.

## Como rodar

Requer Node 20 ou superior. Para chamar a API, suba também o [backend](../backend/README.md). A partir da raiz do repositório:

```bash
cd "Trabalho Final/frontend"
npm install
npm run dev      # http://localhost:5173 (as chamadas /api vão para http://localhost:3000)
npm test         # Vitest + Testing Library
npm run lint     # ESLint
npm run build    # build de produção em dist/
```

## Estrutura

```
frontend/src/
├── main.jsx
├── App.jsx
├── setupTests.js
└── features/
    └── criar-pedido/     # UC-013 (P07 a P11)
```

## Dependências que entram nas tasks

| Pacote | Task |
|---|---|
| `react-router-dom` | P11 (rota `/pedidos/novo`) |

## Contrato com o back

UC-013: [`../docs/uc-013-especificacao.md`](../docs/uc-013-especificacao.md), seção 5.
