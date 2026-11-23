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

test.each(['', '   '])('A5: bloqueia título vazio (%j) e preserva os dados para corrigir', async (titulo) => {
  const { user, onSubmit } = abrirFormulario();
  if (titulo) await user.type(campo('Título'), titulo);
  await user.type(campo('Situação'), 'Perdi o horário.');
  await user.selectOptions(campo('Categoria'), 'Trabalho');
  await salvar(user);

  expect(onSubmit).not.toHaveBeenCalled();
  expect(campo('Título')).toHaveFocus();
  expect(campo('Título')).toHaveAttribute('aria-invalid', 'true');
  expect(campo('Título')).toHaveAccessibleDescription('Informe um título para o pedido.');
  expect(campo('Situação')).toHaveValue('Perdi o horário.');
  expect(campo('Categoria')).toHaveValue('cat-trabalho');

  await user.type(campo('Título'), 'Meu atraso');
  await salvar(user);
  expect(onSubmit.mock.calls).toEqual([[{ titulo: 'Meu atraso', situacao: 'Perdi o horário.', categoriaId: 'cat-trabalho' }]]);
});

test('aponta o primeiro dado ausente no modo direto e exige uma escolha no modo cadastrado', async () => {
  const { user, onSubmit } = abrirFormulario();
  await user.type(campo('Título'), 'Uma conversa');
  await user.selectOptions(campo('Destinatário'), 'Informar direto');
  await user.type(campo('Nome'), '   ');
  await salvar(user);

  expect(campo('Nome')).toHaveFocus();
  expect(campo('Nome')).toHaveAccessibleDescription('Informe o nome do destinatário.');
  expect(campo('Tipo')).toHaveAttribute('aria-invalid', 'true');
  expect(campo('Proximidade')).toHaveAttribute('aria-invalid', 'true');
  expect(onSubmit).not.toHaveBeenCalled();

  await user.selectOptions(campo('Destinatário'), 'Escolher cadastrado');
  await salvar(user);
  expect(campo('Destinatário cadastrado')).toHaveFocus();
  expect(campo('Destinatário cadastrado')).toHaveAccessibleDescription('Selecione um destinatário cadastrado.');
  expect(onSubmit).not.toHaveBeenCalled();
});

test('A6: cancelar descarta os campos, o destinatário e os erros sem enviar', async () => {
  const { user, onSubmit, onCancel } = abrirFormulario({ erros: { contexto: 'Revise o contexto.' } });
  await user.type(campo('Título'), 'Rascunho que vou descartar');
  await user.type(campo('Situação'), 'Fiquei de ligar.');
  await user.selectOptions(campo('Categoria'), 'Trabalho');
  // O Contexto fica sem edição: corrigir o campo já esconderia o erro do servidor (B02).
  await user.selectOptions(campo('Destinatário'), 'Informar direto');
  await user.type(campo('Nome'), 'Rita');
  await user.selectOptions(campo('Tipo'), 'Colega');
  await salvar(user);
  expect(campo('Proximidade')).toHaveAccessibleDescription('Escolha a proximidade com o destinatário.');
  expect(campo('Contexto')).toHaveAccessibleDescription('Revise o contexto.');
  await user.click(screen.getByRole('button', { name: 'Cancelar' }));

  expect(onCancel).toHaveBeenCalledOnce();
  expect(onSubmit).not.toHaveBeenCalled();
  for (const rotulo of ['Título', 'Situação', 'Categoria', 'Contexto']) {
    expect(campo(rotulo)).toHaveValue('');
  }
  expect(campo('Destinatário')).toHaveValue('nenhum');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  await user.selectOptions(campo('Destinatário'), 'Informar direto');
  for (const rotulo of ['Nome', 'Tipo', 'Proximidade']) {
    expect(campo(rotulo)).toHaveValue('');
  }
});
