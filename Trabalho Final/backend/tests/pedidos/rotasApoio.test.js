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

test.each(['/api/categorias', '/api/destinatarios'])('GET %s exige uma sessão', async (rota) => {
  const resposta = await request(app).get(rota);
  expect(resposta.status).toBe(401);
  expect(resposta.body.erro).toBe('SESSAO_INVALIDA');
});

test('GET /api/destinatarios usa a conta da sessão mesmo com outra conta na consulta', async () => {
  const primeira = await request(app).get('/api/destinatarios').query({ contaId: 'conta-outra' })
    .set('Authorization', 'Bearer dev:conta-dev');
  const segunda = await request(app).get('/api/destinatarios').set('Authorization', 'Bearer dev:conta-outra');
  expect(primeira.status).toBe(200);
  expect(primeira.headers['cache-control']).toContain('no-store');
  expect(primeira.body).toEqual([{ id: 'dest-rita', nome: 'Rita', tipo: 'colega', proximidade: 'media' }]);
  expect(segunda.status).toBe(200);
  expect(segunda.body).toEqual([{ id: 'dest-caio', nome: 'Caio', tipo: 'amigo', proximidade: 'alta' }]);
});

test('uma conta sem destinatários recebe uma lista vazia', async () => {
  const resposta = await request(app).get('/api/destinatarios').set('Authorization', 'Bearer dev:conta-nova');
  expect(resposta.status).toBe(200);
  expect(resposta.body).toEqual([]);
});
