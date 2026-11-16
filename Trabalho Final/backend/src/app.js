const express = require('express');

function criarApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/saude', (req, res) => {
    res.json({ status: 'ok' });
  });

  // As rotas de cada módulo entram aqui:
  //   contas  -> UC-001 (tasks T05 e T06)
  //   pedidos -> UC-013 (tasks P05 e P06)

  return app;
}

module.exports = { criarApp };
