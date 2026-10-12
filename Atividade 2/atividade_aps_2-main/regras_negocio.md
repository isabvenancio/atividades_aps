# Regras de Negócio — VazaApp

## RN-01 — Associação do pedido ao usuário

**Título:**  
Associação do pedido de desculpas ao usuário.

**Descrição:**  
Um pedido de desculpas deve obrigatoriamente pertencer a um usuário cadastrado.

**Origem:**  
Fluxo de criação de pedidos de desculpas do VazaApp.

**Stakeholders envolvidos:**  
Usuário.

**Condição:**  
Aplicada sempre que um novo pedido de desculpas for criado.

**Regra:**  
Um pedido de desculpas somente poderá ser criado quando estiver associado a um usuário cadastrado.

**Exceções:**  
Não identificadas no escopo atual.

**Dados envolvidos:**  
Usuário e pedido de desculpas.

**Prioridade:**  
Crítica.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-03.

**Observações:**  
A associação permite identificar o usuário responsável por cada pedido criado.

## RN-02 — Associação do pedido a uma situação

**Título:**  
Situação associada ao pedido de desculpas.

**Descrição:**  
Todo pedido de desculpas deve estar associado a uma situação antes que uma sugestão seja gerada.

**Origem:**  
Fluxo de geração de sugestões do VazaApp.

**Stakeholders envolvidos:**  
Usuário.

**Condição:**  
Aplicada antes da geração de uma sugestão de desculpa.

**Regra:**  
Uma sugestão somente poderá ser gerada quando o pedido de desculpas estiver associado a uma situação.

**Exceções:**  
Não identificadas no escopo atual.

**Dados envolvidos:**  
Pedido de desculpas e situação.

**Prioridade:**  
Crítica.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-04, RF-06.

**Observações:**  
A situação fornece o contexto inicial necessário para o processo de geração.

## RN-03 — Informações mínimas para geração

**Título:**  
Informações obrigatórias para geração da sugestão.

**Descrição:**  
Uma sugestão de desculpa somente poderá ser gerada quando houver informações mínimas sobre o contexto e o destinatário.

**Origem:**  
Processo de geração de sugestões do VazaApp.

**Stakeholders envolvidos:**  
Usuário.

**Condição:**  
Aplicada sempre que o usuário solicitar a geração de uma sugestão.

**Regra:**  
O processo de geração somente poderá ser iniciado quando as informações mínimas necessárias sobre o contexto da situação e o destinatário estiverem disponíveis.

**Exceções:**  
Não identificadas no escopo atual.

**Dados envolvidos:**  
Pedido de desculpas, situação, contexto e destinatário.

**Prioridade:**  
Crítica.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-05, RF-06.

**Observações:**  
A definição exata das informações consideradas mínimas poderá ser refinada durante a evolução do produto.

## RN-04 — Personalização da desculpa sugerida

**Título:**  
Personalização da sugestão conforme o contexto.

**Descrição:**  
A desculpa sugerida deve considerar a situação informada, o tipo de destinatário e o nível de proximidade existente entre o usuário e o destinatário.

**Origem:**  
Objetivo de personalização das sugestões do VazaApp.

**Stakeholders envolvidos:**  
Usuário e destinatário.

**Condição:**  
Aplicada durante a geração de uma sugestão de desculpa.

**Regra:**  
A sugestão gerada deve utilizar as informações disponíveis sobre a situação, o tipo de destinatário e o nível de proximidade entre usuário e destinatário.

**Exceções:**  
Não identificadas no escopo atual.

**Dados envolvidos:**  
Situação, destinatário, tipo de destinatário, contato e nível de proximidade.

**Prioridade:**  
Crítica.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-06.

**Observações:**  
Esta regra representa o caráter personalizado das sugestões oferecidas pelo VazaApp.

## RN-05 — Compatibilidade da categoria da desculpa

**Título:**  
Compatibilidade entre categoria e contexto.

**Descrição:**  
Cada sugestão gerada deve utilizar uma desculpa pertencente a uma categoria compatível com o contexto informado.

**Origem:**  
Processo de seleção de desculpas do VazaApp.

**Stakeholders envolvidos:**  
Usuário.

**Condição:**  
Aplicada durante a geração de uma sugestão.

**Regra:**  
A desculpa utilizada para compor uma sugestão deve pertencer a uma categoria considerada compatível com o contexto informado pelo usuário.

**Exceções:**  
Não identificadas no escopo atual.

**Dados envolvidos:**  
Situação, contexto, desculpa e categoria de desculpa.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-07.

**Observações:**  
A categorização permite selecionar desculpas mais adequadas para diferentes situações.

## RN-06 — Solicitação de nova sugestão

**Título:**  
Geração de alternativa para o mesmo pedido.

**Descrição:**  
O usuário poderá solicitar uma nova sugestão caso não esteja satisfeito com a sugestão apresentada.

**Origem:**  
Fluxo de utilização das sugestões do VazaApp.

**Stakeholders envolvidos:**  
Usuário.

**Condição:**  
Aplicada após a apresentação de uma sugestão de desculpa.

**Regra:**  
Após receber uma sugestão, o usuário poderá solicitar outra alternativa para o mesmo contexto.

**Exceções:**  
Não identificadas no escopo atual.

**Dados envolvidos:**  
Usuário, pedido de desculpas, situação e sugestão gerada.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-08.

**Observações:**  
A nova geração deve reutilizar as informações já existentes no pedido.

## RN-07 — Feedback sobre a sugestão

**Título:**  
Registro de feedback do usuário.

**Descrição:**  
O usuário poderá fornecer um feedback sobre uma sugestão gerada.

**Origem:**  
Fluxo de avaliação das sugestões do VazaApp.

**Stakeholders envolvidos:**  
Usuário.

**Condição:**  
Aplicada após a apresentação de uma sugestão.

**Regra:**  
O usuário poderá fornecer um feedback associado à sugestão apresentada.

**Exceções:**  
O fornecimento de feedback é opcional.

**Dados envolvidos:**  
Usuário, sugestão gerada, histórico de uso e feedback.

**Prioridade:**  
Média.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-10.

**Observações:**  
O feedback poderá futuramente ser utilizado para avaliar a qualidade das sugestões.

## RN-08 — Privacidade das informações do usuário

**Título:**  
Isolamento dos dados pessoais e de contexto.

**Descrição:**  
Informações pessoais e de contexto de um usuário não podem ser acessadas por outros usuários.

**Origem:**  
Necessidade de privacidade e proteção das informações armazenadas no VazaApp.

**Stakeholders envolvidos:**  
Todos os usuários.

**Condição:**  
Aplicada durante qualquer operação de consulta ou acesso a informações pessoais e de contexto.

**Regra:**  
Cada usuário somente poderá acessar suas próprias informações pessoais e de contexto.

**Exceções:**  
Não identificadas no escopo atual.

**Dados envolvidos:**  
Usuário, perfil de contexto, contatos, pedidos de desculpas e histórico de utilização.

**Prioridade:**  
Crítica.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RNF-01, RNF-02.

**Observações:**  
Caso futuramente existam outros perfis de acesso, esta regra deverá ser revisada.

## RN-09 — Rastreabilidade das sugestões

**Título:**  
Rastreabilidade das sugestões geradas.

**Descrição:**  
O sistema deve manter rastreabilidade das sugestões geradas, incluindo usuário, pedido e data/hora da geração.

**Origem:**  
Necessidade de acompanhamento das sugestões produzidas pelo VazaApp.

**Stakeholders envolvidos:**  
Usuário.

**Condição:**  
Aplicada sempre que uma sugestão for gerada e apresentada.

**Regra:**  
Cada sugestão registrada deve permitir identificar o usuário relacionado, o pedido que originou a sugestão e a data e hora da geração.

**Exceções:**  
Não identificadas no escopo atual.

**Dados envolvidos:**  
Usuário, pedido de desculpas, sugestão gerada, data e hora.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-09, RNF-03.

**Observações:**  
A rastreabilidade permite identificar a origem de cada sugestão e recuperar informações relacionadas à sua geração.