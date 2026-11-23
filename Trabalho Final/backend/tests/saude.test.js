const request = require('supertest');
const { criarApp } = require('../src/app');
const { abrirBanco } = require('../src/pedidos/repository/banco');

describe('GET /api/saude', () => {
  test('responde 200 com status ok', async () => {
    const banco = abrirBanco(':memory:');
    try {
      const resposta = await request(criarApp({ banco })).get('/api/saude');
      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual({ status: 'ok' });
    } finally {
      banco.close();
    }
  });
});
