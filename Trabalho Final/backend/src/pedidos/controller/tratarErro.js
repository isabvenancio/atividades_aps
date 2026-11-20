const {
  DadosInvalidosError,
  SessaoInvalidaError,
  DestinatarioNaoEncontradoError,
} = require('../domain/erros');

function tratarErro(erro, req, res, next) {
  if (res.headersSent) return next(erro);

  if (erro instanceof SessaoInvalidaError) {
    return res.status(401).json({ erro: 'SESSAO_INVALIDA', mensagem: 'Entre na sua conta para continuar.' });
  }
  if (erro instanceof DestinatarioNaoEncontradoError) {
    return res.status(404).json({ erro: 'DESTINATARIO_NAO_ENCONTRADO', mensagem: 'Destinatário não encontrado.' });
  }
  if (erro.type === 'entity.parse.failed' || erro.type === 'entity.too.large') {
    erro = new DadosInvalidosError([{ campo: 'corpo', mensagem: 'Envie um objeto JSON válido dentro do limite de tamanho.' }]);
  }
  if (erro instanceof DadosInvalidosError) {
    return res.status(400).json({
      erro: 'DADOS_INVALIDOS',
      mensagem: 'Corrija os campos indicados e tente novamente.',
      campos: erro.campos,
    });
  }
  return res.status(500).json({
    erro: 'FALHA_AO_SALVAR',
    mensagem: 'Não foi possível salvar o pedido. Tente novamente.',
  });
}

module.exports = { tratarErro };
