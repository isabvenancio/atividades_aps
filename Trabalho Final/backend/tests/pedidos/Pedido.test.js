const { Pedido } = require('../../src/pedidos/domain/Pedido');

const criadoEm = new Date('2026-11-23T14:03:11.000Z');

function novo(extra = {}) {
  return Pedido.novoRascunho({
    id: 'ped-1',
    contaId: 'conta-1',
    titulo: 'Atraso na reunião',
    criadoEm,
    ...extra,
  });
}

describe('Pedido', () => {
  test('nasce em rascunho', () => {
    expect(novo().estado).toBe('rascunho');
  });

  test('só com título, faltam situação, categoria e destinatário (CT-013.1)', () => {
    expect(novo().dadosFaltantesParaGerar).toEqual(['situacao', 'categoria', 'destinatario']);
  });

  test('com tudo informado, não falta nada', () => {
    const pedido = novo({
      situacao: 'Cheguei atrasado.',
      categoria: { id: 'cat-trabalho', nome: 'Trabalho' },
      destinatario: { nome: 'Rita', tipo: 'superior', proximidade: 'baixa', origem: 'direto' },
    });

    expect(pedido.dadosFaltantesParaGerar).toEqual([]);
  });

  test('destinatário com tipo ou proximidade inválidos ainda conta como faltando', () => {
    const pedido = novo({
      situacao: 'S',
      categoria: { id: 'c', nome: 'C' },
      destinatario: { nome: 'Rita', tipo: 'vizinho', proximidade: 'baixa', origem: 'direto' },
    });

    expect(pedido.dadosFaltantesParaGerar).toEqual(['destinatario']);
  });

  test('guarda uma cópia do destinatário (fotografia, CA-013.3)', () => {
    const origem = { nome: 'Rita', tipo: 'colega', proximidade: 'media', origem: 'cadastrado' };
    const pedido = novo({ destinatario: origem });

    origem.tipo = 'amigo';
    origem.proximidade = 'alta';

    expect(pedido.destinatario.tipo).toBe('colega');
    expect(pedido.destinatario.proximidade).toBe('media');
  });

  test('a resposta segue o contrato e não expõe a conta dona', () => {
    const resposta = novo().paraResposta();

    expect(resposta).toEqual({
      id: 'ped-1',
      titulo: 'Atraso na reunião',
      estado: 'rascunho',
      situacao: null,
      categoria: null,
      destinatario: null,
      contexto: null,
      dadosFaltantesParaGerar: ['situacao', 'categoria', 'destinatario'],
      criadoEm: '2026-11-23T14:03:11.000Z',
    });
    expect(Object.keys(resposta)).not.toContain('contaId');
  });
});
