import CampoPedido from './CampoPedido.jsx';
import './PedidoForm.css';

function errosPorCampo(erros) {
  if (!Array.isArray(erros)) return erros ?? {};
  return Object.fromEntries(erros.map(({ campo, mensagem }) => [campo, mensagem]));
}

export default function PedidoForm({
  categorias = [], destinatarios = [], erros, carregando = false, onSubmit, onCancel,
}) {
  const mensagens = errosPorCampo(erros);

  function salvar(evento) {
    evento.preventDefault();
    if (carregando) return;
    const campos = new FormData(evento.currentTarget);
    const dados = { titulo: campos.get('titulo').trim() };
    for (const campo of ['situacao', 'categoriaId', 'contexto', 'destinatarioId']) {
      const valor = campos.get(campo).trim();
      if (valor) dados[campo] = valor;
    }
    onSubmit(dados);
  }

  function cancelar(evento) {
    evento.currentTarget.form.reset();
    onCancel();
  }

  return (
    <form className="pedido-form" aria-label="Criar pedido de desculpa" aria-busy={carregando} onSubmit={salvar}>
      <p>Para salvar um rascunho, só o título é obrigatório.</p>
      <fieldset className="pedido-form__campos" disabled={carregando}>
        <CampoPedido name="titulo" rotulo="Título" erro={mensagens.titulo} required maxLength={100} />
        <CampoPedido as="textarea" name="situacao" rotulo="Situação" erro={mensagens.situacao} maxLength={500} rows={3} />
        <CampoPedido as="select" name="categoriaId" rotulo="Categoria" erro={mensagens.categoriaId} defaultValue="">
          <option value="">Sem categoria</option>
          {categorias.map(({ id, nome }) => <option key={id} value={id}>{nome}</option>)}
        </CampoPedido>
        <CampoPedido as="textarea" name="contexto" rotulo="Contexto" erro={mensagens.contexto} maxLength={500} rows={3} />
        <CampoPedido as="select" name="destinatarioId" rotulo="Destinatário" erro={mensagens.destinatarioId} defaultValue="">
          <option value="">Nenhum</option>
          {destinatarios.map(({ id, nome }) => <option key={id} value={id}>{nome}</option>)}
        </CampoPedido>
        <div className="pedido-form__acoes">
          <button type="submit">{carregando ? 'Salvando rascunho…' : 'Salvar rascunho'}</button>
          <button type="button" onClick={cancelar}>Cancelar</button>
        </div>
      </fieldset>
    </form>
  );
}
