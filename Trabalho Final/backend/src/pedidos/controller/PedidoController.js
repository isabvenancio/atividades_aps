class PedidoController {
  constructor({ pedidoService, categoriaRepository, destinatarioRepository }) {
    this.pedidoService = pedidoService;
    this.categoriaRepository = categoriaRepository;
    this.destinatarioRepository = destinatarioRepository;
  }

  async criar(req, res) {
    const pedido = await this.pedidoService.criarRascunho(req.contaId, req.body);
    res.status(201).json(pedido);
  }

  listarCategorias(req, res) {
    res.json(this.categoriaRepository.listarAtivas());
  }

  listarDestinatarios(req, res) {
    const destinatarios = this.destinatarioRepository.listarDaConta(req.contaId);
    res.set('Cache-Control', 'private, no-store').json(destinatarios);
  }
}

module.exports = { PedidoController };
