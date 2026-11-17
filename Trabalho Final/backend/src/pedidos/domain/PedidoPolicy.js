const {
  TIPOS_DESTINATARIO,
  PROXIMIDADES,
  LIMITE_TITULO,
  LIMITE_TEXTO,
  LIMITE_NOME,
} = require('./constantes');

const ehTexto = (valor) => typeof valor === 'string';
const ehObjeto = (valor) => valor !== null && typeof valor === 'object' && !Array.isArray(valor);
const informado = (valor) =>
  valor !== undefined && valor !== null && !(ehTexto(valor) && valor.trim() === '');

function validarTextoOpcional(valor, campo, nomeComArtigo, adicionar) {
  if (!informado(valor)) return;
  if (!ehTexto(valor)) {
    adicionar(campo, `${nomeComArtigo} deve ser um texto.`);
  } else if (valor.trim().length > LIMITE_TEXTO) {
    adicionar(campo, `${nomeComArtigo} deve ter até ${LIMITE_TEXTO} caracteres.`);
  }
}

function validarDestinatarioDireto(destinatario, adicionar) {
  if (!ehObjeto(destinatario)) {
    adicionar('destinatario', 'Informe nome, tipo e proximidade do destinatário.');
    return;
  }

  if (!informado(destinatario.nome) || !ehTexto(destinatario.nome)) {
    adicionar('destinatario.nome', 'Informe o nome do destinatário.');
  } else if (destinatario.nome.trim().length > LIMITE_NOME) {
    adicionar(
      'destinatario.nome',
      `O nome do destinatário deve ter até ${LIMITE_NOME} caracteres.`,
    );
  }

  if (!TIPOS_DESTINATARIO.includes(destinatario.tipo)) {
    adicionar('destinatario.tipo', 'Escolha um tipo de destinatário válido.');
  }

  if (!PROXIMIDADES.includes(destinatario.proximidade)) {
    adicionar(
      'destinatario.proximidade',
      'Escolha uma proximidade válida (baixa, média ou alta).',
    );
  }
}

/**
 * Valida os dados de um novo rascunho (UC-013, RN-007, RN-008).
 * Não lança exceção: devolve a lista de problemas por campo ([] quando está tudo certo).
 * Não consulta repositórios: existência da categoria e titularidade do destinatário são do serviço.
 */
function validar(dados) {
  const problemas = [];
  const adicionar = (campo, mensagem) => problemas.push({ campo, mensagem });
  const entrada = ehObjeto(dados) ? dados : {};

  if (!informado(entrada.titulo)) {
    adicionar('titulo', 'Informe um título para o pedido.');
  } else if (!ehTexto(entrada.titulo)) {
    adicionar('titulo', 'O título deve ser um texto.');
  } else if (entrada.titulo.trim().length > LIMITE_TITULO) {
    adicionar('titulo', `O título deve ter até ${LIMITE_TITULO} caracteres.`);
  }

  validarTextoOpcional(entrada.situacao, 'situacao', 'A situação', adicionar);
  validarTextoOpcional(entrada.contexto, 'contexto', 'O contexto', adicionar);

  if (informado(entrada.categoriaId) && !ehTexto(entrada.categoriaId)) {
    adicionar('categoriaId', 'Escolha uma categoria válida.');
  }

  const temCadastrado = informado(entrada.destinatarioId);
  const temDireto = entrada.destinatario !== undefined && entrada.destinatario !== null;

  if (temCadastrado && temDireto) {
    adicionar(
      'destinatario',
      'Informe um destinatário cadastrado ou um destinatário direto, não os dois.',
    );
  } else if (temCadastrado) {
    if (!ehTexto(entrada.destinatarioId)) {
      adicionar('destinatarioId', 'Escolha um destinatário válido.');
    }
  } else if (temDireto) {
    validarDestinatarioDireto(entrada.destinatario, adicionar);
  }

  return problemas;
}

/**
 * Limpa os dados já validados: remove espaços e troca vazio por null.
 * Chame somente depois de `validar` devolver [].
 */
function normalizar(dados) {
  const texto = (valor) => (informado(valor) ? valor.trim() : null);
  const destinatarioId = texto(dados.destinatarioId);
  const direto = dados.destinatario;

  return {
    titulo: dados.titulo.trim(),
    situacao: texto(dados.situacao),
    contexto: texto(dados.contexto),
    categoriaId: texto(dados.categoriaId),
    destinatarioId,
    destinatario:
      !destinatarioId && ehObjeto(direto)
        ? { nome: direto.nome.trim(), tipo: direto.tipo, proximidade: direto.proximidade }
        : null,
  };
}

module.exports = { validar, normalizar };
