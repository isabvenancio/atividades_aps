const { abrirBanco } = require('./banco');

function popularBanco(banco) {
  const categoria = banco.prepare(`
    INSERT INTO categorias (id, nome, descricao, ativa) VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO NOTHING
  `);
  const destinatario = banco.prepare(`
    INSERT INTO destinatarios (id, conta_id, nome, tipo, proximidade) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO NOTHING
  `);

  banco.transaction(() => {
    categoria.run('cat-trabalho', 'Trabalho', 'Situações do trabalho.', 1);
    categoria.run('cat-familia', 'Família', 'Situações em família.', 1);
    categoria.run('cat-arquivada', 'Arquivada', 'Categoria fora de uso.', 0);
    destinatario.run('dest-rita', 'conta-dev', 'Rita', 'colega', 'media');
    destinatario.run('dest-caio', 'conta-outra', 'Caio', 'amigo', 'alta');
  })();
}

if (require.main === module) {
  const banco = abrirBanco();
  try {
    popularBanco(banco);
    console.log('Dados de teste disponíveis para conta-dev e conta-outra.');
  } finally {
    banco.close();
  }
}

module.exports = { popularBanco };
