const request = require('supertest');
const { criarApp } = require('../src/app');

describe('GET /api/saude', () => {
  test('responde 200 com status ok', async () => {
    const resposta = await request(criarApp()).get('/api/saude');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({ status: 'ok' });
  });
});
