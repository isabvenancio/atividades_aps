// Erros do módulo de pedidos. O controller (P05) converte cada um na resposta HTTP do contrato.

class DadosInvalidosError extends Error {
  // campos: [{ campo, mensagem }]  ->  400 DADOS_INVALIDOS
  constructor(campos) {
    super('Dados inválidos.');
    this.name = 'DadosInvalidosError';
    this.campos = campos;
  }
}

class SessaoInvalidaError extends Error {
  // -> 401 SESSAO_INVALIDA
  constructor() {
    super('Sessão inválida.');
    this.name = 'SessaoInvalidaError';
  }
}

class DestinatarioNaoEncontradoError extends Error {
  // Inexistente ou de outra conta, sem diferenciar (RN-003)  ->  404 DESTINATARIO_NAO_ENCONTRADO
  constructor() {
    super('Destinatário não encontrado.');
    this.name = 'DestinatarioNaoEncontradoError';
  }
}

class FalhaAoSalvarError extends Error {
  // -> 500 FALHA_AO_SALVAR
  constructor(causa) {
    super('Não foi possível salvar o pedido.');
    this.name = 'FalhaAoSalvarError';
    this.causa = causa;
  }
}

module.exports = {
  DadosInvalidosError,
  SessaoInvalidaError,
  DestinatarioNaoEncontradoError,
  FalhaAoSalvarError,
};
