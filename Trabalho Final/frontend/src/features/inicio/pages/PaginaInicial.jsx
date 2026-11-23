import './PaginaInicial.css';

const passos = [
  {
    titulo: 'Dê um título',
    texto: 'Só o título é obrigatório para salvar um rascunho. O resto você completa quando tiver.',
  },
  {
    titulo: 'Conte o que aconteceu',
    texto: 'Descreva a situação, escolha uma categoria e acrescente o contexto que ajudar.',
  },
  {
    titulo: 'Diga para quem é',
    texto: 'Escolha alguém que você já cadastrou ou informe na hora o nome, o tipo de relação e a proximidade.',
  },
];

const andamento = [
  { item: 'Salvar o rascunho do pedido, com validação e dados protegidos por conta', pronto: true },
  { item: 'Listas de categorias e de destinatários da conta', pronto: true },
  { item: 'Formulário com validação e navegação por teclado', pronto: true },
  { item: 'Tela de criação ligada ao servidor', pronto: false },
];

export default function PaginaInicial() {
  return (
    <div className="inicio">
      <section className="inicio__destaque" aria-labelledby="inicio-titulo">
        <p className="inicio__selo">UC-013 · Criar pedido de desculpa</p>
        <h1 id="inicio-titulo">Peça desculpas do jeito certo.</h1>
        <p className="inicio__resumo">
          O VazaApp ajuda a montar pedidos de desculpa personalizados, levando em conta a situação,
          a pessoa e a proximidade entre vocês.
        </p>
      </section>

      <section className="inicio__secao" aria-labelledby="inicio-como-funciona">
        <h2 id="inicio-como-funciona">Como funciona o pedido</h2>
        <ol className="inicio__passos">
          {passos.map(({ titulo, texto }, indice) => (
            <li key={titulo} className="inicio__cartao">
              <span className="inicio__numero" aria-hidden="true">{indice + 1}</span>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </li>
          ))}
        </ol>
        <p className="inicio__nota">
          O rascunho fica salvo, e o VazaApp mostra o que ainda falta para gerar a sugestão de desculpa.
        </p>
      </section>

      <section className="inicio__secao" aria-labelledby="inicio-andamento">
        <h2 id="inicio-andamento">Andamento desta entrega</h2>
        <ul className="inicio__andamento">
          {andamento.map(({ item, pronto }) => (
            <li key={item} className={pronto ? 'inicio__item inicio__item--pronto' : 'inicio__item'}>
              <span className="inicio__situacao">{pronto ? 'Pronto' : 'Em desenvolvimento'}</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
