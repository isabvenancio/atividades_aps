const { randomUUID } = require('node:crypto');
const { Pedido } = require('../domain/Pedido');
const { validar, normalizar } = require('../domain/PedidoPolicy');
const {
  DadosInvalidosError,
  SessaoInvalidaError,
  DestinatarioNaoEncontradoError,
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
    const categoria = await this.#resolverCategoria(valores.categoriaId);
    const destinatario = await this.#resolverDestinatario(contaId, valores);

    const pedido = Pedido.novoRascunho({
      id: this.gerarId(),
      contaId,
      titulo: valores.titulo,
      situacao: valores.situacao,
      categoria,
      contexto: valores.contexto,
      destinatario,
      criadoEm: this.agora(),
    });

    try {
      await this.pedidoRepository.inserir(pedido);
    } catch (erro) {
      throw new FalhaAoSalvarError(erro); // E2
    }

    return pedido.paraResposta();
  }

  async #resolverCategoria(categoriaId) {
    if (!categoriaId) return null;

    const categoria = await this.categoriaRepository.buscarAtivaPorId(categoriaId);
    if (!categoria) {
      throw new DadosInvalidosError([
        { campo: 'categoriaId', mensagem: 'Escolha uma categoria ativa.' },
      ]);
    }
    return categoria;
  }

  async #resolverDestinatario(contaId, valores) {
    // A2: cadastrado. Busca somente na coleção da conta (RN-003) e copia os dados do momento.
    if (valores.destinatarioId) {
      const cadastrado = await this.destinatarioRepository.buscarDaConta(
        contaId,
        valores.destinatarioId,
      );
      if (!cadastrado) throw new DestinatarioNaoEncontradoError(); // E1

      return {
        nome: cadastrado.nome,
        tipo: cadastrado.tipo,
        proximidade: cadastrado.proximidade,
        origem: 'cadastrado',
      };
    }

    // A3: direto. Usa os dados no pedido, sem criar registro na coleção de destinatários.
    if (valores.destinatario) {
      return { ...valores.destinatario, origem: 'direto' };
    }

    return null; // A1
  }
}

module.exports = { PedidoService };
