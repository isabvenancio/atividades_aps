const { PedidoService } = require('../../src/pedidos/service/PedidoService');
const {
  DadosInvalidosError,
  SessaoInvalidaError,
  DestinatarioNaoEncontradoError,
  FalhaAoSalvarError,
} = require('../../src/pedidos/domain/erros');
const {
  PedidoRepositoryFake,
  CategoriaRepositoryFake,
  DestinatarioRepositoryFake,
  capturarErro,
} = require('./fakes');

const CONTA = 'conta-1';
const OUTRA_CONTA = 'conta-2';

let pedidos;
let categorias;
let destinatarios;
let service;

function montar({ falhar = false } = {}) {
  pedidos = new PedidoRepositoryFake({ falhar });
  categorias = new CategoriaRepositoryFake([
    { id: 'cat-trabalho', nome: 'Trabalho', ativa: true },
    { id: 'cat-antiga', nome: 'Antiga', ativa: false },
  ]);
  destinatarios = new DestinatarioRepositoryFake([
    { id: 'dest-rita', contaId: CONTA, nome: 'Rita', tipo: 'colega', proximidade: 'media' },
    { id: 'dest-paulo', contaId: OUTRA_CONTA, nome: 'Paulo', tipo: 'amigo', proximidade: 'alta' },
  ]);
  service = new PedidoService({
    pedidoRepository: pedidos,
    categoriaRepository: categorias,
    destinatarioRepository: destinatarios,
    gerarId: () => 'ped-1',
    agora: () => new Date('2026-11-23T14:03:11.000Z'),
  });
}

beforeEach(() => montar());

describe('PedidoService.criarRascunho', () => {
  test('CT-013.1: salva só com título e informa o que falta para gerar', async () => {
    const resposta = await service.criarRascunho(CONTA, { titulo: 'Atraso na reunião' });

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
    expect(pedidos.pedidos).toHaveLength(1);
    expect(pedidos.pedidos[0].contaId).toBe(CONTA);
  });

  test('CT-013.2: destinatário direto é usado no pedido e não cria cadastro', async () => {
    const resposta = await service.criarRascunho(CONTA, {
      titulo: 'Atraso na reunião',
      situacao: 'Cheguei 30 minutos atrasado.',
      categoriaId: 'cat-trabalho',
      destinatario: { nome: 'Rita', tipo: 'superior', proximidade: 'baixa' },
    });

    expect(resposta.destinatario).toEqual({
      nome: 'Rita',
      tipo: 'superior',
      proximidade: 'baixa',
      origem: 'direto',
    });
    expect(resposta.categoria).toEqual({ id: 'cat-trabalho', nome: 'Trabalho' });
    expect(resposta.dadosFaltantesParaGerar).toEqual([]);
    expect(destinatarios.destinatarios).toHaveLength(2); // nenhum destinatário novo
    expect(destinatarios.buscas).toBe(0); // nem consultou a coleção
  });

  test('A2: destinatário cadastrado é copiado para o pedido', async () => {
    const resposta = await service.criarRascunho(CONTA, {
      titulo: 'Atraso na reunião',
      destinatarioId: 'dest-rita',
    });

    expect(resposta.destinatario).toEqual({
      nome: 'Rita',
      tipo: 'colega',
      proximidade: 'media',
      origem: 'cadastrado',
    });
    expect(destinatarios.destinatarios).toHaveLength(2);
  });

  test('CT-013.3: alterar o cadastro depois não muda o pedido', async () => {
    await service.criarRascunho(CONTA, { titulo: 'T', destinatarioId: 'dest-rita' });

    const cadastro = destinatarios.destinatarios.find((d) => d.id === 'dest-rita');
    cadastro.tipo = 'amigo';
    cadastro.proximidade = 'alta';

    const salvo = pedidos.pedidos[0];
    expect(salvo.destinatario.tipo).toBe('colega');
    expect(salvo.destinatario.proximidade).toBe('media');
  });

  test('CT-013.5: destinatário de outra conta é recusado sem criar pedido (RN-003)', async () => {
    const erro = await capturarErro(
      service.criarRascunho(CONTA, { titulo: 'T', destinatarioId: 'dest-paulo' }),
    );

    expect(erro).toBeInstanceOf(DestinatarioNaoEncontradoError);
    expect(pedidos.pedidos).toHaveLength(0);
  });

  test('destinatário inexistente tem o mesmo erro que o de outra conta', async () => {
    const erro = await capturarErro(
      service.criarRascunho(CONTA, { titulo: 'T', destinatarioId: 'nao-existe' }),
    );

    expect(erro).toBeInstanceOf(DestinatarioNaoEncontradoError);
    expect(erro.message).toBe('Destinatário não encontrado.');
  });

  test('A5: título vazio é recusado e nada é gravado', async () => {
    const erro = await capturarErro(service.criarRascunho(CONTA, { titulo: '  ' }));

    expect(erro).toBeInstanceOf(DadosInvalidosError);
    expect(erro.campos).toEqual([{ campo: 'titulo', mensagem: 'Informe um título para o pedido.' }]);
    expect(pedidos.pedidos).toHaveLength(0);
  });

  test('recusa destinatarioId e destinatario ao mesmo tempo', async () => {
    const erro = await capturarErro(
      service.criarRascunho(CONTA, {
        titulo: 'T',
        destinatarioId: 'dest-rita',
        destinatario: { nome: 'Rita', tipo: 'colega', proximidade: 'media' },
      }),
    );

    expect(erro).toBeInstanceOf(DadosInvalidosError);
    expect(erro.campos[0].campo).toBe('destinatario');
    expect(pedidos.pedidos).toHaveLength(0);
  });

  test('categoria inativa ou inexistente é recusada', async () => {
    const inativa = await capturarErro(
      service.criarRascunho(CONTA, { titulo: 'T', categoriaId: 'cat-antiga' }),
    );
    const inexistente = await capturarErro(
      service.criarRascunho(CONTA, { titulo: 'T', categoriaId: 'cat-x' }),
    );

    expect(inativa).toBeInstanceOf(DadosInvalidosError);
    expect(inativa.campos).toEqual([
      { campo: 'categoriaId', mensagem: 'Escolha uma categoria ativa.' },
    ]);
    expect(inexistente).toBeInstanceOf(DadosInvalidosError);
    expect(pedidos.pedidos).toHaveLength(0);
  });

  test('E1: sem conta (sessão inválida) não cria pedido', async () => {
    const erro = await capturarErro(service.criarRascunho(undefined, { titulo: 'T' }));

    expect(erro).toBeInstanceOf(SessaoInvalidaError);
    expect(pedidos.pedidos).toHaveLength(0);
  });

  test('E2: falha ao salvar não confirma o pedido', async () => {
    montar({ falhar: true });

    const erro = await capturarErro(service.criarRascunho(CONTA, { titulo: 'T' }));

    expect(erro).toBeInstanceOf(FalhaAoSalvarError);
    expect(erro.causa.message).toBe('banco indisponível');
    expect(pedidos.pedidos).toHaveLength(0);
  });

  test('a resposta nunca expõe a conta dona do pedido', async () => {
    const resposta = await service.criarRascunho(CONTA, { titulo: 'T' });

    expect(Object.keys(resposta)).not.toContain('contaId');
  });

  test('sem gerarId e agora injetados, usa UUID e a data atual', async () => {
    const padrao = new PedidoService({
      pedidoRepository: pedidos,
      categoriaRepository: categorias,
      destinatarioRepository: destinatarios,
    });
    const antes = Date.now();

    const resposta = await padrao.criarRascunho(CONTA, { titulo: 'T' });

    expect(resposta.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(Date.parse(resposta.criadoEm)).toBeGreaterThanOrEqual(antes);
  });
});
