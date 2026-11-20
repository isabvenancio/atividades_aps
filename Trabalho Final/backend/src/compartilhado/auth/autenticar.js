const { SessaoInvalidaError } = require('../../pedidos/domain/erros');

function autenticar(req, res, next) {
  const ambiente = process.env.NODE_ENV || 'development';
  const permiteSessaoDev = ambiente === 'development' || ambiente === 'test';
  const sessao = /^Bearer +dev:([a-z0-9._-]+)$/i.exec(req.get('Authorization') || '');

  if (!permiteSessaoDev || !sessao) return next(new SessaoInvalidaError());

  req.contaId = sessao[1];
  return next();
}

module.exports = { autenticar };
