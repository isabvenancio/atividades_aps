import CampoPedido from './CampoPedido.jsx';
import './PedidoForm.css';

export default function PedidoForm({ categorias = [], destinatarios = [], onSubmit, onCancel }) {
  function salvar(evento) {
    evento.preventDefault();
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
    <form className="pedido-form" aria-label="Criar pedido de desculpa" onSubmit={salvar}>
      <p>Para salvar um rascunho, só o título é obrigatório.</p>
      <CampoPedido name="titulo" rotulo="Título" required maxLength={100} />
      <CampoPedido as="textarea" name="situacao" rotulo="Situação" maxLength={500} rows={3} />
      <CampoPedido as="select" name="categoriaId" rotulo="Categoria" defaultValue="">
        <option value="">Sem categoria</option>
        {categorias.map(({ id, nome }) => <option key={id} value={id}>{nome}</option>)}
      </CampoPedido>
      <CampoPedido as="textarea" name="contexto" rotulo="Contexto" maxLength={500} rows={3} />
      <CampoPedido as="select" name="destinatarioId" rotulo="Destinatário" defaultValue="">
        <option value="">Nenhum</option>
        {destinatarios.map(({ id, nome }) => <option key={id} value={id}>{nome}</option>)}
      </CampoPedido>
      <div className="pedido-form__acoes">
        <button type="submit">Salvar rascunho</button>
        <button type="button" onClick={cancelar}>Cancelar</button>
      </div>
    </form>
  );
}
