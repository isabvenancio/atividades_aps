class PedidoController {
  constructor({ pedidoService, categoriaRepository }) {
    this.pedidoService = pedidoService;
    this.categoriaRepository = categoriaRepository;
  }

  async criar(req, res) {
    const pedido = await this.pedidoService.criarRascunho(req.contaId, req.body);
    res.status(201).json(pedido);
  }

  listarCategorias(req, res) {
    res.json(this.categoriaRepository.listarAtivas());
  }
}

module.exports = { PedidoController };
