const express = require('express');

function criarApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/saude', (req, res) => {
    res.json({ status: 'ok' });
  });

  // As rotas do módulo de pedidos (UC-013) entram aqui nas tasks P05 e P06.

  return app;
}

module.exports = { criarApp };
