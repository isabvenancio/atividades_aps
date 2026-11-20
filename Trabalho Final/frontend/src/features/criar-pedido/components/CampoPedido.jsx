import { useId } from 'react';

export default function CampoPedido({ rotulo, as: Controle = 'input', children, ...props }) {
  const id = useId();

  return (
    <div className="pedido-form__campo">
      <label htmlFor={id}>{rotulo}</label>
      <Controle id={id} {...props}>{children}</Controle>
    </div>
  );
}
