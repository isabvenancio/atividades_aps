import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PedidoForm from './PedidoForm.jsx';

// B02 (CSC-36): erros devolvidos pela API (400) no formulário.

const campo = (rotulo) => screen.getByLabelText(rotulo, { exact: true });

function abrirFormulario(props) {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  const utils = render(
    <PedidoForm destinatarios={[{ id: 'dest-rita', nome: 'Rita' }]} onSubmit={onSubmit} onCancel={vi.fn()} {...props} />,
  );
  return { user, onSubmit, ...utils };
}

test('o erro do servidor some quando o usuário corrige o campo e os outros continuam', async () => {
  const erros = [
    { campo: 'titulo', mensagem: 'Título recusado pelo servidor.' },
    { campo: 'situacao', mensagem: 'Situação longa demais.' },
  ];
  const { user } = abrirFormulario({ erros });
  expect(campo('Título')).toHaveAccessibleDescription('Título recusado pelo servidor.');

  await user.type(campo('Título'), 'Atraso na reunião');

  expect(campo('Título')).not.toHaveAttribute('aria-invalid');
  expect(screen.queryByText('Título recusado pelo servidor.')).not.toBeInTheDocument();
  expect(campo('Situação')).toHaveAccessibleDescription('Situação longa demais.');
});

test('uma nova resposta do servidor mostra de novo o erro de um campo já corrigido', async () => {
  const primeira = [{ campo: 'titulo', mensagem: 'Título recusado pelo servidor.' }];
  const { user, rerender } = abrirFormulario({ erros: primeira });
  await user.type(campo('Título'), 'Novo título');
  expect(screen.queryByText('Título recusado pelo servidor.')).not.toBeInTheDocument();

  const segunda = [{ campo: 'titulo', mensagem: 'Título ainda recusado.' }];
  rerender(<PedidoForm destinatarios={[]} erros={segunda} onSubmit={vi.fn()} onCancel={vi.fn()} />);

  expect(campo('Título')).toHaveAccessibleDescription('Título ainda recusado.');
});

test('erro do servidor num subcampo aparece no campo certo do destinatário direto', async () => {
  const props = { destinatarios: [], onSubmit: vi.fn(), onCancel: vi.fn() };
  const { user, rerender } = abrirFormulario(props);
  await user.selectOptions(campo('Destinatário'), 'Informar direto');

  // A resposta 400 chega com o usuário já no modo direto.
  rerender(<PedidoForm {...props} erros={[{ campo: 'destinatario.tipo', mensagem: 'Escolha um tipo de destinatário válido.' }]} />);

  expect(campo('Tipo')).toHaveAttribute('aria-invalid', 'true');
  expect(campo('Tipo')).toHaveAccessibleDescription('Escolha um tipo de destinatário válido.');
  expect(campo('Nome')).not.toHaveAttribute('aria-invalid');
});

test('trocar o modo do destinatário descarta os erros do servidor sobre o destinatário', async () => {
  const { user } = abrirFormulario({
    erros: [
      { campo: 'destinatario', mensagem: 'Informe um destinatário cadastrado ou um destinatário direto, não os dois.' },
      { campo: 'titulo', mensagem: 'Título recusado pelo servidor.' },
    ],
  });
  expect(campo('Destinatário')).toHaveAttribute('aria-invalid', 'true');

  await user.selectOptions(campo('Destinatário'), 'Escolher cadastrado');

  expect(campo('Destinatário')).not.toHaveAttribute('aria-invalid');
  expect(campo('Título')).toHaveAccessibleDescription('Título recusado pelo servidor.');
});

test('sem destinatários cadastrados, o modo cadastrado orienta a informar direto', async () => {
  const { user } = abrirFormulario({ destinatarios: [] });
  await user.selectOptions(campo('Destinatário'), 'Escolher cadastrado');

  expect(screen.getByText(/ainda não tem destinatários cadastrados/i)).toBeInTheDocument();
});

test('com destinatários cadastrados, a orientação não aparece', async () => {
  const { user } = abrirFormulario();
  await user.selectOptions(campo('Destinatário'), 'Escolher cadastrado');

  expect(screen.queryByText(/ainda não tem destinatários cadastrados/i)).not.toBeInTheDocument();
});
