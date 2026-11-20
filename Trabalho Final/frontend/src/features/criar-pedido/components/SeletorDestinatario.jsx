import CampoPedido from './CampoPedido.jsx';

const tipos = { familiar: 'Familiar', amigo: 'Amigo', colega: 'Colega', superior: 'Superior', outro: 'Outro' };
const proximidades = { baixa: 'Baixa', media: 'Média', alta: 'Alta' };

export default function SeletorDestinatario({ modo, onModoChange, destinatarios, erros }) {
  return (
    <>
      <CampoPedido as="select" name="modoDestinatario" rotulo="Destinatário" erro={erros.destinatario}
        value={modo} onChange={(evento) => onModoChange(evento.target.value)}>
        <option value="nenhum">Nenhum</option>
        <option value="cadastrado">Escolher cadastrado</option>
        <option value="direto">Informar direto</option>
      </CampoPedido>
      {modo === 'cadastrado' && (
        <CampoPedido as="select" name="destinatarioId" rotulo="Destinatário cadastrado"
          erro={erros.destinatarioId} defaultValue="" required>
          <option value="">Selecione um destinatário</option>
          {destinatarios.map(({ id, nome }) => <option key={id} value={id}>{nome}</option>)}
        </CampoPedido>
      )}
      {modo === 'direto' && (
        <fieldset className="pedido-form__destinatario">
          <legend>Dados do destinatário</legend>
          <CampoPedido name="destinatario.nome" rotulo="Nome" erro={erros['destinatario.nome']}
            maxLength={100} required />
          <CampoPedido as="select" name="destinatario.tipo" rotulo="Tipo" erro={erros['destinatario.tipo']}
            defaultValue="" required>
            <option value="">Selecione o tipo</option>
            {Object.entries(tipos).map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}
          </CampoPedido>
          <CampoPedido as="select" name="destinatario.proximidade" rotulo="Proximidade"
            erro={erros['destinatario.proximidade']} defaultValue="" required>
            <option value="">Selecione a proximidade</option>
            {Object.entries(proximidades).map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}
          </CampoPedido>
        </fieldset>
      )}
    </>
  );
}
