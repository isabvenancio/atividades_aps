const request = require('supertest');
const { criarApp } = require('../../src/app');
const { abrirBanco } = require('../../src/pedidos/repository/banco');
const { popularBanco } = require('../../src/pedidos/repository/seed');

let banco;
let app;

beforeEach(() => {
  banco = abrirBanco(':memory:');
  popularBanco(banco);
  app = criarApp({ banco });
});

afterEach(() => banco.close());

test('GET /api/categorias devolve apenas as categorias ativas no formato do formulário', async () => {
  const resposta = await request(app).get('/api/categorias').set('Authorization', 'Bearer dev:conta-dev');
  expect(resposta.status).toBe(200);
  expect(resposta.body).toEqual([
    { id: 'cat-familia', nome: 'Família', descricao: 'Situações em família.' },
    { id: 'cat-trabalho', nome: 'Trabalho', descricao: 'Situações do trabalho.' },
  ]);
});

test('GET /api/categorias exige uma sessão', async () => {
  const resposta = await request(app).get('/api/categorias');
  expect(resposta.status).toBe(401);
  expect(resposta.body.erro).toBe('SESSAO_INVALIDA');
});
