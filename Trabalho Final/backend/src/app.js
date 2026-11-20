const express = require('express');
const { autenticar } = require('./compartilhado/auth/autenticar');
const { abrirBanco } = require('./pedidos/repository/banco');
const {
  PedidoRepositorySqlite,
  CategoriaRepositorySqlite,
  DestinatarioRepositorySqlite,
} = require('./pedidos/repository/repositorios');
const { PedidoService } = require('./pedidos/service/PedidoService');
const { PedidoController } = require('./pedidos/controller/PedidoController');
const { tratarErro } = require('./pedidos/controller/tratarErro');

function criarApp({ banco = abrirBanco() } = {}) {
  const app = express();
  app.locals.banco = banco;
  const categoriaRepository = new CategoriaRepositorySqlite(banco);
  const destinatarioRepository = new DestinatarioRepositorySqlite(banco);
  const pedidoService = new PedidoService({
    pedidoRepository: new PedidoRepositorySqlite(banco),
    categoriaRepository,
    destinatarioRepository,
  });
  const controller = new PedidoController({ pedidoService, categoriaRepository });

  app.get('/api/saude', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/pedidos', autenticar, express.json(), (req, res, next) => {
    controller.criar(req, res).catch(next);
  });
  app.get('/api/categorias', autenticar, (req, res) => controller.listarCategorias(req, res));
  app.use(tratarErro);

  return app;
}

module.exports = { criarApp };
