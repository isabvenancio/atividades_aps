class PedidoController {
  constructor({ pedidoService }) {
    this.pedidoService = pedidoService;
  }

  async criar(req, res) {
    const pedido = await this.pedidoService.criarRascunho(req.contaId, req.body);
    res.status(201).json(pedido);
  }
}

module.exports = { PedidoController };
