import { useState } from 'react';
import { lerRascunho, validarRascunho } from '../rascunho.js';
import CampoPedido from './CampoPedido.jsx';
import SeletorDestinatario from './SeletorDestinatario.jsx';
import './PedidoForm.css';

function errosPorCampo(erros) {
  if (!Array.isArray(erros)) return erros ?? {};
  return Object.fromEntries(erros.map(({ campo, mensagem }) => [campo, mensagem]));
}

export default function PedidoForm({
  categorias = [], destinatarios = [], erros, carregando = false, onSubmit, onCancel,
}) {
  const [modo, setModo] = useState('nenhum');
  const [errosLocais, setErrosLocais] = useState({});
  const [errosCancelados, setErrosCancelados] = useState(null);
  const externos = erros === errosCancelados ? {} : errosPorCampo(erros);
  const mensagens = { ...externos, ...errosLocais };

  function salvar(evento) {
    evento.preventDefault();
    if (carregando) return;
    const form = evento.currentTarget;
    const dados = lerRascunho(new FormData(form));
    const problemas = validarRascunho(dados);
    setErrosLocais(problemas);
    const [primeiroCampo] = Object.keys(problemas);
    if (primeiroCampo) {
      form.elements.namedItem(primeiroCampo).focus();
      return;
    }
    setErrosCancelados(null);
    onSubmit(dados);
  }

  function editar(evento) {
    const { name, value } = evento.target;
    if (!Object.keys(errosLocais).length) return;
    if (name === 'modoDestinatario') {
      setErrosLocais(Object.fromEntries(Object.entries(errosLocais).filter(([campo]) => !campo.startsWith('destinatario'))));
    } else if (errosLocais[name] && value.trim()) {
      const restantes = { ...errosLocais };
      delete restantes[name];
      setErrosLocais(restantes);
    }
  }

  function cancelar(evento) {
    evento.currentTarget.form.reset();
    setModo('nenhum');
    setErrosLocais({});
    setErrosCancelados(erros);
    onCancel();
  }

  return (
    <form className="pedido-form" aria-label="Criar pedido de desculpa" aria-busy={carregando}
      noValidate onSubmit={salvar} onChange={editar}>
      <p>Para salvar um rascunho, só o título é obrigatório.</p>
      <fieldset className="pedido-form__campos" disabled={carregando}>
        <CampoPedido name="titulo" rotulo="Título" erro={mensagens.titulo} required maxLength={100} />
        <CampoPedido as="textarea" name="situacao" rotulo="Situação" erro={mensagens.situacao} maxLength={500} rows={3} />
        <CampoPedido as="select" name="categoriaId" rotulo="Categoria" erro={mensagens.categoriaId} defaultValue="">
          <option value="">Sem categoria</option>
          {categorias.map(({ id, nome }) => <option key={id} value={id}>{nome}</option>)}
        </CampoPedido>
        <CampoPedido as="textarea" name="contexto" rotulo="Contexto" erro={mensagens.contexto} maxLength={500} rows={3} />
        <SeletorDestinatario modo={modo} onModoChange={setModo} destinatarios={destinatarios} erros={mensagens} />
        <div className="pedido-form__acoes">
          <button type="submit">{carregando ? 'Salvando rascunho…' : 'Salvar rascunho'}</button>
          <button type="button" onClick={cancelar}>Cancelar</button>
        </div>
      </fieldset>
    </form>
  );
}
