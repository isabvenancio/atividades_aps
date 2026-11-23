const { abrirBanco } = require('../../src/pedidos/repository/banco');
const { popularBanco } = require('../../src/pedidos/repository/seed');
const {
  PedidoRepositorySqlite,
  CategoriaRepositorySqlite,
  DestinatarioRepositorySqlite,
} = require('../../src/pedidos/repository/repositorios');
const { PedidoService } = require('../../src/pedidos/service/PedidoService');

let banco;
let categorias;
let destinatarios;

beforeEach(() => {
  banco = abrirBanco(':memory:');
  popularBanco(banco);
  categorias = new CategoriaRepositorySqlite(banco);
  destinatarios = new DestinatarioRepositorySqlite(banco);
});

afterEach(() => banco.close());

test('a busca por ID e a listagem excluem categorias inativas', () => {
  expect(categorias.buscarAtivaPorId('cat-trabalho')).toEqual({ id: 'cat-trabalho', nome: 'Trabalho' });
  expect(categorias.buscarAtivaPorId('cat-arquivada')).toBeNull();
  expect(categorias.listarAtivas().map((categoria) => categoria.id)).toEqual(['cat-familia', 'cat-trabalho']);
});

test('um destinatário só aparece nas consultas da própria conta', () => {
  const rita = { id: 'dest-rita', nome: 'Rita', tipo: 'colega', proximidade: 'media' };
  expect(destinatarios.buscarDaConta('conta-dev', 'dest-rita')).toEqual(rita);
  expect(destinatarios.buscarDaConta('conta-outra', 'dest-rita')).toBeNull();
  expect(destinatarios.listarDaConta('conta-dev')).toEqual([rita]);
  expect(destinatarios.listarDaConta('conta-sem-cadastro')).toEqual([]);
});

test('o rascunho guarda a conta e uma cópia dos dados do destinatário', async () => {
  const servico = new PedidoService({
    pedidoRepository: new PedidoRepositorySqlite(banco),
    categoriaRepository: categorias,
    destinatarioRepository: destinatarios,
  });
  const pedido = await servico.criarRascunho('conta-dev', {
    titulo: 'Reunião',
    categoriaId: 'cat-trabalho',
    destinatarioId: 'dest-rita',
  });
  banco.prepare('UPDATE destinatarios SET tipo = ?, proximidade = ? WHERE id = ?')
    .run('amigo', 'alta', 'dest-rita');

  expect(banco.prepare('SELECT * FROM pedidos WHERE id = ?').get(pedido.id)).toMatchObject({
    conta_id: 'conta-dev',
    estado: 'rascunho',
    categoria_id: 'cat-trabalho',
    destinatario_nome: 'Rita',
    destinatario_tipo: 'colega',
    destinatario_proximidade: 'media',
    destinatario_origem: 'cadastrado',
  });
});
