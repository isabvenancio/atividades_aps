import { render, screen, within } from '@testing-library/react';
import PaginaInicial from './PaginaInicial.jsx';

test('apresenta os três passos do pedido na ordem do UC-013', () => {
  render(<PaginaInicial />);

  const secao = screen.getByRole('region', { name: 'Como funciona o pedido' });
  const passos = within(secao).getAllByRole('listitem');
  expect(passos.map((passo) => within(passo).getByRole('heading', { level: 3 }).textContent)).toEqual([
    'Dê um título',
    'Conte o que aconteceu',
    'Diga para quem é',
  ]);
  expect(secao).toHaveTextContent('Só o título é obrigatório');
});

test('mostra o que já está pronto e o que ainda está em desenvolvimento', () => {
  render(<PaginaInicial />);

  const itens = within(screen.getByRole('region', { name: 'Andamento desta entrega' })).getAllByRole('listitem');
  expect(itens.filter((item) => item.textContent.startsWith('Pronto'))).toHaveLength(3);
  expect(itens.filter((item) => item.textContent.startsWith('Em desenvolvimento'))).toHaveLength(1);
});
