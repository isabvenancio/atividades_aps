# Frontend — React (Vite)

Interface do VazaApp. Cada funcionalidade fica em `src/features/<nome>/` com `components/`, `api/` e `pages/`.

## Como rodar

Requer Node 20 ou superior. Para chamar a API, suba também o [backend](../backend/README.md).

```bash
cd trabalho-final/frontend
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
    ├── cadastro-conta/   # UC-001 (T07 a T11)
    └── criar-pedido/     # UC-013 (P07 a P11)
```

## Dependências que entram nas tasks

| Pacote | Task |
|---|---|
| `react-router-dom` | T11 |

## Contrato com o back

- UC-001: [`../docs/uc-001-especificacao.md`](../docs/uc-001-especificacao.md), seção 5.
- UC-013: [`../docs/uc-013-especificacao.md`](../docs/uc-013-especificacao.md), seção 5.
