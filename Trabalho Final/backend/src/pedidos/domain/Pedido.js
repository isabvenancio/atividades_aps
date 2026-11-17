const { ESTADO_RASCUNHO, TIPOS_DESTINATARIO, PROXIMIDADES } = require('./constantes');

function destinatarioCompleto(destinatario) {
  return Boolean(
    destinatario &&
      destinatario.nome &&
      TIPOS_DESTINATARIO.includes(destinatario.tipo) &&
      PROXIMIDADES.includes(destinatario.proximidade),
  );
}

/**
 * Pedido de desculpa. Nesta etapa (UC-013) só existe em estado `rascunho`.
 * Guarda uma "fotografia" do destinatário: uma cópia dos dados do momento (CA-013.3),
 * que não muda se o cadastro do destinatário for alterado depois.
 */
class Pedido {
  constructor({
    id,
    contaId,
    titulo,
    situacao = null,
    categoria = null,
    contexto = null,
    destinatario = null,
    estado = ESTADO_RASCUNHO,
    criadoEm,
  }) {
    this.id = id;
    this.contaId = contaId;
    this.titulo = titulo;
    this.situacao = situacao;
    this.categoria = categoria ? { id: categoria.id, nome: categoria.nome } : null;
    this.contexto = contexto;
    this.destinatario = destinatario
      ? {
          nome: destinatario.nome,
          tipo: destinatario.tipo,
          proximidade: destinatario.proximidade,
          origem: destinatario.origem,
        }
      : null;
    this.estado = estado;
    this.criadoEm = criadoEm;
  }

  static novoRascunho(dados) {
    return new Pedido({ ...dados, estado: ESTADO_RASCUNHO });
  }

  // RN-008: para gerar sugestão são necessários situação, categoria e destinatário com tipo e proximidade válidos.
  get dadosFaltantesParaGerar() {
    const faltam = [];
    if (!this.situacao) faltam.push('situacao');
    if (!this.categoria) faltam.push('categoria');
    if (!destinatarioCompleto(this.destinatario)) faltam.push('destinatario');
    return faltam;
  }

  // Formato da resposta 201 do contrato. Não expõe a conta dona do pedido.
  paraResposta() {
    return {
      id: this.id,
      titulo: this.titulo,
      estado: this.estado,
      situacao: this.situacao,
      categoria: this.categoria ? { ...this.categoria } : null,
      destinatario: this.destinatario ? { ...this.destinatario } : null,
      contexto: this.contexto,
      dadosFaltantesParaGerar: this.dadosFaltantesParaGerar,
      criadoEm: this.criadoEm.toISOString(),
    };
  }
}

module.exports = { Pedido };
