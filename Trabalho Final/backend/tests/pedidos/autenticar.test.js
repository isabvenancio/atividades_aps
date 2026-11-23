const { autenticar } = require('../../src/compartilhado/auth/autenticar');
const { SessaoInvalidaError } = require('../../src/pedidos/domain/erros');

const ambienteOriginal = process.env.NODE_ENV;
afterEach(() => { process.env.NODE_ENV = ambienteOriginal; });

test('a identidade vem do cabeçalho da sessão de desenvolvimento', () => {
  process.env.NODE_ENV = 'development';
  const req = { get: () => 'Bearer dev:conta-dev', body: { contaId: 'outra' } };
  const next = jest.fn();
  autenticar(req, {}, next);
  expect(req.contaId).toBe('conta-dev');
  expect(next).toHaveBeenCalledWith();
});

test.each([undefined, 'Bearer', 'Bearer dev:', 'Bearer dev:duas contas', 'Basic dev:conta-dev'])(
  'recusa uma sessão inválida (%s)',
  (cabecalho) => {
    const req = { get: () => cabecalho };
    const next = jest.fn();
    autenticar(req, {}, next);
    expect(next).toHaveBeenCalledWith(expect.any(SessaoInvalidaError));
    expect(req.contaId).toBeUndefined();
  },
);

test('a sessão provisória fica desativada em produção', () => {
  process.env.NODE_ENV = 'production';
  const next = jest.fn();
  autenticar({ get: () => 'Bearer dev:conta-dev' }, {}, next);
  expect(next).toHaveBeenCalledWith(expect.any(SessaoInvalidaError));
});
