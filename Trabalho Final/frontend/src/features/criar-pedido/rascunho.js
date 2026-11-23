export function lerRascunho(campos) {
  const dados = { titulo: campos.get('titulo').trim() };
  for (const campo of ['situacao', 'categoriaId', 'contexto']) {
    const valor = campos.get(campo).trim();
    if (valor) dados[campo] = valor;
  }

  const modo = campos.get('modoDestinatario');
  if (modo === 'cadastrado') {
    dados.destinatarioId = campos.get('destinatarioId');
  } else if (modo === 'direto') {
    dados.destinatario = {
      nome: campos.get('destinatario.nome').trim(),
      tipo: campos.get('destinatario.tipo'),
      proximidade: campos.get('destinatario.proximidade'),
    };
  }
  return dados;
}

export function validarRascunho(dados) {
  const erros = {};
  if (!dados.titulo) erros.titulo = 'Informe um título para o pedido.';
  if (dados.destinatarioId === '') erros.destinatarioId = 'Selecione um destinatário cadastrado.';
  if (dados.destinatario) {
    const { nome, tipo, proximidade } = dados.destinatario;
    if (!nome) erros['destinatario.nome'] = 'Informe o nome do destinatário.';
    if (!tipo) erros['destinatario.tipo'] = 'Escolha o tipo de destinatário.';
    if (!proximidade) erros['destinatario.proximidade'] = 'Escolha a proximidade com o destinatário.';
  }
  return erros;
}
