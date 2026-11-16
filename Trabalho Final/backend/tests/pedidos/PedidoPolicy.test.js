const { validar, normalizar } = require('../../src/pedidos/domain/PedidoPolicy');

const campos = (problemas) => problemas.map((p) => p.campo);

describe('PedidoPolicy.validar', () => {
  test('aceita só o título (A1, CT-013.1)', () => {
    expect(validar({ titulo: 'Atraso na reunião' })).toEqual([]);
  });

  test('exige título (A5)', () => {
    expect(campos(validar({}))).toEqual(['titulo']);
    expect(campos(validar({ titulo: '   ' }))).toEqual(['titulo']);
    expect(campos(validar(undefined))).toEqual(['titulo']);
  });

  test('limita o título a 100 caracteres', () => {
    expect(validar({ titulo: 'a'.repeat(100) })).toEqual([]);
    expect(campos(validar({ titulo: 'a'.repeat(101) }))).toEqual(['titulo']);
  });

  test('limita situação e contexto a 500 caracteres', () => {
    const longo = 'x'.repeat(501);
    expect(campos(validar({ titulo: 'T', situacao: longo, contexto: longo }))).toEqual([
      'situacao',
      'contexto',
    ]);
    expect(validar({ titulo: 'T', situacao: 'x'.repeat(500) })).toEqual([]);
  });

  test('rejeita título, situação e contexto que não são texto', () => {
    expect(campos(validar({ titulo: 10 }))).toEqual(['titulo']);
    expect(campos(validar({ titulo: 'T', situacao: 5, contexto: true }))).toEqual([
      'situacao',
      'contexto',
    ]);
  });

  test('aceita destinatário direto válido (A3, CT-013.2)', () => {
    const dados = {
      titulo: 'T',
      destinatario: { nome: 'Rita', tipo: 'superior', proximidade: 'baixa' },
    };
    expect(validar(dados)).toEqual([]);
  });

  test('exige nome, tipo e proximidade no destinatário direto (RN-007)', () => {
    expect(campos(validar({ titulo: 'T', destinatario: {} }))).toEqual([
      'destinatario.nome',
      'destinatario.tipo',
      'destinatario.proximidade',
    ]);
  });

  test('rejeita tipo e proximidade fora do domínio', () => {
    const dados = {
      titulo: 'T',
      destinatario: { nome: 'Rita', tipo: 'vizinho', proximidade: 'média' },
    };
    expect(campos(validar(dados))).toEqual(['destinatario.tipo', 'destinatario.proximidade']);
  });

  test('rejeita destinatário direto que não é objeto', () => {
    expect(campos(validar({ titulo: 'T', destinatario: 'Rita' }))).toEqual(['destinatario']);
  });

  test('aceita destinatário cadastrado pelo id (A2)', () => {
    expect(validar({ titulo: 'T', destinatarioId: 'dest-rita' })).toEqual([]);
  });

  test('não aceita destinatarioId e destinatario ao mesmo tempo', () => {
    const dados = {
      titulo: 'T',
      destinatarioId: 'dest-rita',
      destinatario: { nome: 'Rita', tipo: 'colega', proximidade: 'media' },
    };
    expect(campos(validar(dados))).toEqual(['destinatario']);
  });

  test('trata null e vazio como não informado', () => {
    const dados = { titulo: 'T', situacao: '', destinatario: null, destinatarioId: ' ' };
    expect(validar(dados)).toEqual([]);
  });

  test('devolve mensagens em português por campo', () => {
    expect(validar({})).toEqual([{ campo: 'titulo', mensagem: 'Informe um título para o pedido.' }]);
  });
});

describe('PedidoPolicy.normalizar', () => {
  test('remove espaços e troca vazio por null', () => {
    const resultado = normalizar({ titulo: '  Atraso  ', situacao: '   ', contexto: ' ctx ' });

    expect(resultado).toEqual({
      titulo: 'Atraso',
      situacao: null,
      contexto: 'ctx',
      categoriaId: null,
      destinatarioId: null,
      destinatario: null,
    });
  });

  test('mantém só o destinatário direto, já limpo', () => {
    const resultado = normalizar({
      titulo: 'T',
      destinatario: { nome: ' Rita ', tipo: 'superior', proximidade: 'baixa' },
    });

    expect(resultado.destinatario).toEqual({ nome: 'Rita', tipo: 'superior', proximidade: 'baixa' });
    expect(resultado.destinatarioId).toBeNull();
  });

  test('mantém só o id quando o destinatário é cadastrado', () => {
    const resultado = normalizar({ titulo: 'T', destinatarioId: ' dest-rita ' });

    expect(resultado.destinatarioId).toBe('dest-rita');
    expect(resultado.destinatario).toBeNull();
  });
});
