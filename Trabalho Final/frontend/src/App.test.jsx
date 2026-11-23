import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

describe('App', () => {
  test('mostra o nome do aplicativo no cabeçalho e a página inicial no conteúdo', () => {
    render(<App />);

    expect(within(screen.getByRole('banner')).getByText('VazaApp')).toBeInTheDocument();
    expect(within(screen.getByRole('main')).getByRole('heading', { level: 1 })).toHaveTextContent(
      'Peça desculpas do jeito certo.',
    );
  });

  test('o primeiro Tab leva ao link que pula para o conteúdo principal (RNF-003)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab();
    const pular = screen.getByRole('link', { name: 'Pular para o conteúdo' });
    expect(pular).toHaveFocus();
    expect(pular).toHaveAttribute('href', '#conteudo');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'conteudo');
  });

  test('o rodapé identifica a disciplina e os integrantes', () => {
    render(<App />);

    const rodape = screen.getByRole('contentinfo');
    expect(rodape).toHaveTextContent('Análise e Projeto de Software');
    expect(rodape).toHaveTextContent('Prof. Dr. João Choma');
    for (const nome of ['Isabella', 'Carolina', 'Matheus', 'Gabriela']) {
      expect(rodape).toHaveTextContent(nome);
    }
  });
});
