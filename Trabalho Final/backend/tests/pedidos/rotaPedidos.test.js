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

afterEach(() => {
  jest.restoreAllMocks();
  banco.close();
});

function postar() {
  return request(app).post('/api/pedidos').set('Authorization', 'Bearer dev:conta-dev');
}

test('201 usa a conta da sessão e o estado definido pelo servidor', async () => {
  const resposta = await postar().send({ titulo: 'Reunião', contaId: 'outra', estado: 'enviado' });
  expect(resposta.status).toBe(201);
  expect(resposta.body).toMatchObject({
    titulo: 'Reunião', estado: 'rascunho', dadosFaltantesParaGerar: ['situacao', 'categoria', 'destinatario'],
  });
  expect(resposta.body).not.toHaveProperty('contaId');
  expect(banco.prepare('SELECT conta_id, estado FROM pedidos WHERE id = ?').get(resposta.body.id))
    .toEqual({ conta_id: 'conta-dev', estado: 'rascunho' });
});

test('400 informa o campo que precisa de correção, inclusive para JSON inválido', async () => {
  const semTitulo = await postar().send({ titulo: ' ' });
  expect(semTitulo.status).toBe(400);
  expect(semTitulo.body).toMatchObject({ erro: 'DADOS_INVALIDOS', campos: [{ campo: 'titulo' }] });
  const invalido = await postar().type('json').send('{');
  expect(invalido.status).toBe(400);
  expect(invalido.body).toMatchObject({ erro: 'DADOS_INVALIDOS', campos: [{ campo: 'corpo' }] });
});

test('401 exige sessão antes de processar o corpo do pedido', async () => {
  const resposta = await request(app).post('/api/pedidos').type('json').send('{');
  expect(resposta.status).toBe(401);
  expect(resposta.body).toEqual({ erro: 'SESSAO_INVALIDA', mensagem: 'Entre na sua conta para continuar.' });
});

test.each(['dest-caio', 'inexistente'])('404 tem a mesma resposta para %s', async (id) => {
  const resposta = await postar().send({ titulo: 'Reunião', destinatarioId: id });
  expect(resposta.status).toBe(404);
  expect(resposta.body).toEqual({
    erro: 'DESTINATARIO_NAO_ENCONTRADO', mensagem: 'Destinatário não encontrado.',
  });
  expect(banco.prepare('SELECT COUNT(*) FROM pedidos').pluck().get()).toBe(0);
});

test('500 em uma falha de escrita não confirma o pedido nem expõe detalhes do banco', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {}); // silencia o registro esperado do B01
  banco.pragma('query_only = ON');
  const resposta = await postar().send({ titulo: 'Reunião' });
  expect(resposta.status).toBe(500);
  expect(resposta.body).toEqual({
    erro: 'FALHA_AO_SALVAR', mensagem: 'Não foi possível salvar o pedido. Tente novamente.',
  });
  expect(banco.prepare('SELECT COUNT(*) FROM pedidos').pluck().get()).toBe(0);
});

test('500 registra o erro no servidor com o método e a rota (B01)', async () => {
  const registro = jest.spyOn(console, 'error').mockImplementation(() => {});
  banco.pragma('query_only = ON');
  await postar().send({ titulo: 'Reunião' });
  expect(registro).toHaveBeenCalledWith('[POST /api/pedidos] Erro não tratado:', expect.objectContaining({ message: expect.any(String) }));
});

test('respostas 400, 401 e 404 não poluem o registro do servidor', async () => {
  const registro = jest.spyOn(console, 'error').mockImplementation(() => {});
  await postar().send({ titulo: ' ' });
  await request(app).post('/api/pedidos').send({ titulo: 'Reunião' });
  await postar().send({ titulo: 'Reunião', destinatarioId: 'dest-caio' });
  expect(registro).not.toHaveBeenCalled();
});
