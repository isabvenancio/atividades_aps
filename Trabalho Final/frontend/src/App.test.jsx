import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('App', () => {
  test('mostra o nome do aplicativo', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /vazaapp/i })).toBeInTheDocument();
  });
});
