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
