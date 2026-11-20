const { abrirBanco } = require('../../src/pedidos/repository/banco');
const { popularBanco } = require('../../src/pedidos/repository/seed');

test('o seed pode ser repetido e preserva os dados existentes', () => {
  const banco = abrirBanco(':memory:');
  try {
    popularBanco(banco);
    banco.prepare('UPDATE destinatarios SET nome = ? WHERE id = ?').run('Ana', 'dest-rita');
    popularBanco(banco);

    expect(banco.prepare('SELECT ativa, COUNT(*) AS n FROM categorias GROUP BY ativa ORDER BY ativa').all())
      .toEqual([{ ativa: 0, n: 1 }, { ativa: 1, n: 2 }]);
    expect(banco.prepare('SELECT conta_id, nome FROM destinatarios ORDER BY conta_id').all())
      .toEqual([{ conta_id: 'conta-dev', nome: 'Ana' }, { conta_id: 'conta-outra', nome: 'Caio' }]);
  } finally {
    banco.close();
  }
});
