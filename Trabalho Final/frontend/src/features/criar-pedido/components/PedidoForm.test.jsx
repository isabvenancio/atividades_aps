import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PedidoForm from './PedidoForm.jsx';

test('permite percorrer os campos e acionar Cancelar pelo teclado', async () => {
  const user = userEvent.setup();
  const onCancel = vi.fn();
  const onSubmit = vi.fn();
  render(<PedidoForm onSubmit={onSubmit} onCancel={onCancel} />);

  expect(screen.getByText(/só o título é obrigatório/i)).toBeVisible();
  const controles = [
    screen.getByRole('textbox', { name: 'Título' }),
    screen.getByRole('textbox', { name: 'Situação' }),
    screen.getByRole('combobox', { name: 'Categoria' }),
    screen.getByRole('textbox', { name: 'Contexto' }),
    screen.getByRole('combobox', { name: 'Destinatário' }),
    screen.getByRole('button', { name: 'Salvar rascunho' }),
    screen.getByRole('button', { name: 'Cancelar' }),
  ];
  for (const controle of controles) {
    await user.tab();
    expect(controle).toHaveFocus();
  }
  await user.keyboard('{Enter}');
  expect(onCancel).toHaveBeenCalledOnce();
  expect(onSubmit).not.toHaveBeenCalled();
});

test('associa o erro ao campo e impede novo envio enquanto salva', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  const props = { onSubmit, onCancel: vi.fn(), erros: [{ campo: 'categoriaId', mensagem: 'Categoria inativa.' }] };
  const { rerender } = render(<PedidoForm {...props} />);

  expect(screen.getByRole('combobox', { name: 'Categoria' })).toHaveAccessibleDescription('Categoria inativa.');
  await user.type(screen.getByRole('textbox', { name: 'Título' }), 'Reunião');
  rerender(<PedidoForm {...props} carregando />);
  const salvar = screen.getByRole('button', { name: /salvando rascunho/i });
  expect(salvar).toBeDisabled();
  await user.click(salvar);
  expect(onSubmit).not.toHaveBeenCalled();
  rerender(<PedidoForm {...props} erros={[]} />);
  expect(screen.getByRole('textbox', { name: 'Título' })).toHaveValue('Reunião');
  await user.click(screen.getByRole('button', { name: 'Salvar rascunho' }));
  expect(onSubmit).toHaveBeenCalledWith({ titulo: 'Reunião' });
});
