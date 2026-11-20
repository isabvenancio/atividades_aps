import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PedidoForm from './PedidoForm.jsx';

function abrirFormulario(props = {}) {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  render(
    <PedidoForm
      categorias={[{ id: 'cat-trabalho', nome: 'Trabalho' }]}
      destinatarios={[{ id: 'dest-rita', nome: 'Rita', tipo: 'colega', proximidade: 'media' }]}
      onSubmit={onSubmit} onCancel={onCancel} {...props}
    />,
  );
  return { user, onSubmit, onCancel };
}

const campo = (rotulo) => screen.getByLabelText(rotulo, { exact: true });
const salvar = (user) => user.click(screen.getByRole('button', { name: 'Salvar rascunho' }));

test('CT-013.1: salva pelo teclado um rascunho com apenas o título', async () => {
  const { user, onSubmit, onCancel } = abrirFormulario();
  await user.type(campo('Título'), '  Atraso na reunião  {Enter}');

  expect(onSubmit).toHaveBeenCalledOnce();
  expect(onSubmit).toHaveBeenCalledWith({ titulo: 'Atraso na reunião' });
  expect(onCancel).not.toHaveBeenCalled();
});

test('CT-013.2: trocar do cadastro para o modo direto envia apenas os dados informados', async () => {
  const { user, onSubmit } = abrirFormulario();
  await user.type(campo('Título'), 'Atraso na reunião');
  await user.type(campo('Situação'), 'Cheguei atrasado.');
  await user.selectOptions(campo('Categoria'), 'Trabalho');
  await user.type(campo('Contexto'), 'Segunda-feira.');
  await user.selectOptions(campo('Destinatário'), 'Escolher cadastrado');
  await user.selectOptions(campo('Destinatário cadastrado'), 'Rita');
  await user.selectOptions(campo('Destinatário'), 'Informar direto');
  await user.type(campo('Nome'), '  Lia  ');
  await user.selectOptions(campo('Tipo'), 'Superior');
  await user.selectOptions(campo('Proximidade'), 'Média');
  await salvar(user);

  expect(onSubmit.mock.calls).toEqual([[{
    titulo: 'Atraso na reunião',
    situacao: 'Cheguei atrasado.',
    categoriaId: 'cat-trabalho',
    contexto: 'Segunda-feira.',
    destinatario: { nome: 'Lia', tipo: 'superior', proximidade: 'media' },
  }]]);
});

test('A2: trocar do modo direto para um cadastro envia somente o ID escolhido', async () => {
  const { user, onSubmit } = abrirFormulario();
  await user.type(campo('Título'), 'Ligação perdida');
  await user.selectOptions(campo('Destinatário'), 'Informar direto');
  await user.type(campo('Nome'), 'Nina');
  await user.selectOptions(campo('Tipo'), 'Amigo');
  await user.selectOptions(campo('Proximidade'), 'Alta');
  await user.selectOptions(campo('Destinatário'), 'Escolher cadastrado');
  await user.selectOptions(campo('Destinatário cadastrado'), 'Rita');
  await salvar(user);

  expect(onSubmit.mock.calls).toEqual([[{ titulo: 'Ligação perdida', destinatarioId: 'dest-rita' }]]);
});

test('voltar ao modo Nenhum descarta a escolha anterior', async () => {
  const { user, onSubmit } = abrirFormulario();
  await user.type(campo('Título'), 'Atraso');
  await user.selectOptions(campo('Destinatário'), 'Escolher cadastrado');
  await user.selectOptions(campo('Destinatário cadastrado'), 'Rita');
  await user.selectOptions(campo('Destinatário'), 'Nenhum');
  await salvar(user);

  expect(onSubmit.mock.calls).toEqual([[{ titulo: 'Atraso' }]]);
});
