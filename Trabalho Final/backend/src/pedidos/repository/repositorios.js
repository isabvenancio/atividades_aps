class PedidoRepositorySqlite {
  constructor(banco) {
    this.gravar = banco.prepare(`
      INSERT INTO pedidos (
        id, conta_id, titulo, estado, situacao, contexto, categoria_id, categoria_nome,
        destinatario_nome, destinatario_tipo, destinatario_proximidade, destinatario_origem, criado_em
      ) VALUES (
        @id, @contaId, @titulo, @estado, @situacao, @contexto, @categoriaId, @categoriaNome,
        @nome, @tipo, @proximidade, @origem, @criadoEm
      )
    `);
  }

  inserir(pedido) {
    const { categoria, destinatario } = pedido;
    this.gravar.run({
      id: pedido.id,
      contaId: pedido.contaId,
      titulo: pedido.titulo,
      estado: pedido.estado,
      situacao: pedido.situacao,
      contexto: pedido.contexto,
      categoriaId: categoria?.id ?? null,
      categoriaNome: categoria?.nome ?? null,
      nome: destinatario?.nome ?? null,
      tipo: destinatario?.tipo ?? null,
      proximidade: destinatario?.proximidade ?? null,
      origem: destinatario?.origem ?? null,
      criadoEm: pedido.criadoEm.toISOString(),
    });
  }
}

class CategoriaRepositorySqlite {
  constructor(banco) {
    this.porId = banco.prepare('SELECT id, nome FROM categorias WHERE ativa = 1 AND id = ?');
    this.ativas = banco.prepare(`
      SELECT id, nome, descricao FROM categorias WHERE ativa = 1 ORDER BY nome, id
    `);
  }

  buscarAtivaPorId(id) {
    return this.porId.get(id) ?? null;
  }

  listarAtivas() {
    return this.ativas.all();
  }
}

class DestinatarioRepositorySqlite {
  constructor(banco) {
    this.porId = banco.prepare(`
      SELECT id, nome, tipo, proximidade FROM destinatarios WHERE conta_id = ? AND id = ?
    `);
    this.porConta = banco.prepare(`
      SELECT id, nome, tipo, proximidade FROM destinatarios WHERE conta_id = ? ORDER BY nome, id
    `);
  }

  buscarDaConta(contaId, id) {
    return this.porId.get(contaId, id) ?? null;
  }

  listarDaConta(contaId) {
    return this.porConta.all(contaId);
  }
}

module.exports = { PedidoRepositorySqlite, CategoriaRepositorySqlite, DestinatarioRepositorySqlite };
