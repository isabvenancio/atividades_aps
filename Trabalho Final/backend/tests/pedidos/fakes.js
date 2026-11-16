// Repositórios falsos (em memória) para testar o PedidoService sem banco.

class PedidoRepositoryFake {
  constructor({ falhar = false } = {}) {
    this.pedidos = [];
    this.falhar = falhar;
  }

  async inserir(pedido) {
    if (this.falhar) throw new Error('banco indisponível');
    this.pedidos.push(pedido);
  }
}

class CategoriaRepositoryFake {
  constructor(categorias = []) {
    this.categorias = categorias; // [{ id, nome, ativa }]
  }

  async buscarAtivaPorId(id) {
    const categoria = this.categorias.find((c) => c.id === id && c.ativa);
    return categoria ? { id: categoria.id, nome: categoria.nome } : null;
  }
}

class DestinatarioRepositoryFake {
  constructor(destinatarios = []) {
    this.destinatarios = destinatarios; // [{ id, contaId, nome, tipo, proximidade }]
    this.buscas = 0;
  }

  async buscarDaConta(contaId, id) {
    this.buscas += 1;
    const encontrado = this.destinatarios.find((d) => d.contaId === contaId && d.id === id);
    return encontrado ? { ...encontrado } : null;
  }
}

// Espera uma promessa falhar e devolve o erro (para checar tipo e campos).
async function capturarErro(promessa) {
  try {
    await promessa;
  } catch (erro) {
    return erro;
  }
  throw new Error('Era esperado um erro, mas a operação terminou com sucesso.');
}

module.exports = {
  PedidoRepositoryFake,
  CategoriaRepositoryFake,
  DestinatarioRepositoryFake,
  capturarErro,
};
