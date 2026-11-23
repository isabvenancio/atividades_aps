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
├── App.jsx               # Layout + página atual
├── setupTests.js
├── estilos/
│   └── tema.css          # cores, tipografia e estilos base (variáveis CSS)
├── compartilhado/
│   └── layout/           # cabeçalho, conteúdo principal e rodapé
└── features/
    ├── inicio/           # página inicial (D02)
    └── criar-pedido/     # UC-013 (P07 a P11)
```

As cores e medidas ficam em variáveis no `tema.css` (por exemplo, `var(--cor-primaria)` e `var(--raio)`). Use essas variáveis nos componentes novos em vez de valores fixos.

## Dependências que entram nas tasks

| Pacote | Task |
|---|---|
| `react-router-dom` | P11 (rota `/pedidos/novo`) |

## Contrato com o back

UC-013: [`../docs/uc-013-especificacao.md`](../docs/uc-013-especificacao.md), seção 5.
