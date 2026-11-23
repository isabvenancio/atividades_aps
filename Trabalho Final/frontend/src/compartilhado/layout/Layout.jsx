import './Layout.css';

const integrantes = [
  'Isabella Barela Venancio',
  'Carolina Yumi Toyota',
  'Matheus Lara Campos',
  'Gabriela Borborema Paes Barreto',
];

export default function Layout({ children }) {
  return (
    <div className="layout">
      <a className="layout__pular" href="#conteudo">Pular para o conteúdo</a>

      <header className="layout__cabecalho">
        <div className="layout__faixa">
          <span className="layout__marca">
            <span className="layout__logo" aria-hidden="true">V</span>
            VazaApp
          </span>
          <span className="layout__lema">Sugestões de desculpas personalizadas</span>
        </div>
      </header>

      <main id="conteudo" className="layout__conteudo" tabIndex={-1}>
        {children}
      </main>

      <footer className="layout__rodape">
        <div className="layout__faixa layout__faixa--rodape">
          <p>Análise e Projeto de Software · UEM · Prof. Dr. João Choma</p>
          <p>{integrantes.join(' · ')}</p>
        </div>
      </footer>
    </div>
  );
}
