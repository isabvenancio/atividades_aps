import { useId } from 'react';

export default function CampoPedido({ rotulo, erro, as: Controle = 'input', children, ...props }) {
  const id = useId();

  return (
    <div className="pedido-form__campo">
      <label htmlFor={id}>{rotulo}</label>
      <Controle id={id} aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined} {...props}>
        {children}
      </Controle>
      {erro && <span id={`${id}-erro`} role="alert">{erro}</span>}
    </div>
  );
}
