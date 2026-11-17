const { randomUUID } = require('node:crypto');
const { Pedido } = require('../domain/Pedido');
const { validar, normalizar } = require('../domain/PedidoPolicy');
const {
  DadosInvalidosError,
  SessaoInvalidaError,
  FalhaAoSalvarError,
} = require('../domain/erros');

/**
 * UC-013 — Criar pedido de desculpa (rascunho).
 *
 * Os repositórios entram por injeção de dependência. Contrato esperado de cada um:
 *   pedidoRepository.inserir(pedido)                      -> grava um Pedido
 *   categoriaRepository.buscarAtivaPorId(id)              -> { id, nome } ou null (inexistente ou inativa)
 *   destinatarioRepository.buscarDaConta(contaId, id)     -> { id, nome, tipo, proximidade } ou null
 */
class PedidoService {
  constructor({
    pedidoRepository,
    categoriaRepository,
    destinatarioRepository,
    gerarId = randomUUID,
    agora = () => new Date(),
  }) {
    this.pedidoRepository = pedidoRepository;
    this.categoriaRepository = categoriaRepository;
    this.destinatarioRepository = destinatarioRepository;
    this.gerarId = gerarId;
    this.agora = agora;
  }

  async criarRascunho(contaId, dados) {
    if (!contaId) throw new SessaoInvalidaError(); // E1

    const problemas = validar(dados);
    if (problemas.length > 0) throw new DadosInvalidosError(problemas); // A5

    const valores = normalizar(dados);

    const pedido = Pedido.novoRascunho({
      id: this.gerarId(),
      contaId,
      titulo: valores.titulo,
      situacao: valores.situacao,
      categoria: null,
      contexto: valores.contexto,
      destinatario: null,
      criadoEm: this.agora(),
    });

    try {
      await this.pedidoRepository.inserir(pedido);
    } catch (erro) {
      throw new FalhaAoSalvarError(erro); // E2
    }

    return pedido.paraResposta();
  }
}

module.exports = { PedidoService };
