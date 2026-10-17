# Requisitos Funcionais — VazaApp

Este documento apresenta os requisitos funcionais definidos para o VazaApp.

Os requisitos funcionais descrevem os comportamentos e serviços que o sistema deve oferecer aos usuários.

## RF-01 — Cadastro de usuário

**Título:**  
Cadastro de usuário.

**Descrição:**  
O sistema deve permitir que o usuário realize seu cadastro informando seus dados pessoais.

**Objetivo:**  
Permitir que novos usuários tenham acesso às funcionalidades do VazaApp.

**Stakeholders:**  
Usuário.

**Ator principal:**  
Usuário.

**Pré-condições:**  
- O usuário ainda não deve possuir cadastro com os mesmos dados de identificação.

**Entradas:**  
- Nome.
- E-mail.
- Telefone.
- Foto de perfil, quando informada.

**Processamento esperado:**  
O sistema deve validar os dados informados e registrar o novo usuário.

**Saídas/Resultados:**  
Cadastro do usuário realizado com sucesso.

**Pós-condições:**  
O usuário passa a possuir uma conta cadastrada no sistema.

**Fluxos alternativos/exceções:**  
- Dados obrigatórios não preenchidos.
- E-mail já cadastrado.
- Dados informados em formato inválido.

**Regras de negócio relacionadas:**  
A definir.

**Prioridade:**  
Crítica.

**Status:**  
Proposto.

**Critérios de aceite:**  
- Permitir o cadastro quando todos os dados obrigatórios forem válidos.
- Impedir o cadastro quando houver dados obrigatórios ausentes.
- Informar ao usuário quando os dados fornecidos forem inválidos.
- Confirmar a criação da conta após o cadastro.

**Casos de uso relacionados:**  
A definir.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

## RF-02 — Manutenção do perfil de contexto

**Título:**  
Perfil de contexto do usuário.

**Descrição:**  
O sistema deve permitir que o usuário mantenha um perfil de contexto contendo informações profissionais, sociais e pessoais relevantes para a geração das sugestões.

**Objetivo:**  
Permitir que o sistema utilize informações adicionais do usuário durante a geração de sugestões.

**Stakeholders:**  
Usuário.

**Ator principal:**  
Usuário.

**Pré-condições:**  
- Usuário cadastrado.
- Usuário autenticado.

**Entradas:**  
- Profissão.
- Local de trabalho.
- Local de moradia.
- Informações sociais.
- Informações acadêmicas.
- Outras informações de contexto disponíveis no perfil.

**Processamento esperado:**  
O sistema deve permitir cadastrar e atualizar as informações do perfil de contexto do usuário.

**Saídas/Resultados:**  
Perfil de contexto atualizado.

**Pós-condições:**  
As informações ficam associadas ao usuário e disponíveis para utilização durante a geração de sugestões.

**Fluxos alternativos/exceções:**  
- Usuário cancela a alteração.
- Dados inválidos.

**Regras de negócio relacionadas:**  
RN-08.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Critérios de aceite:**  
- Permitir que o usuário cadastre informações de contexto.
- Permitir a atualização das informações cadastradas.
- Manter o perfil associado ao usuário correspondente.
- Salvar corretamente as alterações realizadas.

**Casos de uso relacionados:**  
A definir.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

## RF-03 — Criar pedido de desculpas

**Título:**  
Criação de pedido de desculpas.

**Descrição:**  
O sistema deve permitir que o usuário crie um pedido de desculpas.

**Objetivo:**  
Iniciar o processo de geração de uma sugestão de desculpa.

**Stakeholders:**  
Usuário.

**Ator principal:**  
Usuário.

**Pré-condições:**  
- Usuário cadastrado.
- Usuário autenticado.

**Entradas:**  
- Dados do novo pedido.

**Processamento esperado:**  
O sistema deve criar um pedido de desculpas e associá-lo ao usuário responsável.

**Saídas/Resultados:**  
Novo pedido de desculpas criado.

**Pós-condições:**  
O pedido passa a existir e pode receber informações de situação, destinatário e contexto.

**Fluxos alternativos/exceções:**  
- Usuário não autenticado.
- Falha ao registrar o pedido.

**Regras de negócio relacionadas:**  
RN-01.

**Prioridade:**  
Crítica.

**Status:**  
Proposto.

**Critérios de aceite:**  
- Permitir que um usuário autenticado crie um pedido.
- Associar o pedido ao usuário responsável.
- Impedir a criação do pedido para usuário não autenticado.

**Casos de uso relacionados:**  
A definir.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

## RF-04 — Informar situação do pedido

**Título:**  
Definição da situação do pedido.

**Descrição:**  
O sistema deve permitir que o usuário informe a situação que motivou o pedido de desculpas.

**Objetivo:**  
Fornecer o contexto necessário para a geração da sugestão.

**Stakeholders:**  
Usuário.

**Ator principal:**  
Usuário.

**Pré-condições:**  
- Usuário autenticado.
- Pedido de desculpas criado.

**Entradas:**  
- Situação.
- Descrição.
- Contexto relacionado.

**Processamento esperado:**  
O sistema deve registrar a situação informada e associá-la ao pedido de desculpas.

**Saídas/Resultados:**  
Situação vinculada ao pedido.

**Pós-condições:**  
O pedido passa a possuir uma situação associada.

**Fluxos alternativos/exceções:**  
- Situação não informada.
- Dados inválidos.

**Regras de negócio relacionadas:**  
RN-02.

**Prioridade:**  
Crítica.

**Status:**  
Proposto.

**Critérios de aceite:**  
- Permitir informar a situação do pedido.
- Associar corretamente a situação ao pedido.
- Não permitir geração de sugestão enquanto o pedido não possuir uma situação.

**Casos de uso relacionados:**  
A definir.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

## RF-05 — Validar informações obrigatórias

**Título:**  
Validação do pedido antes da geração.

**Descrição:**  
O sistema deve validar se as informações obrigatórias do pedido foram preenchidas antes da geração da sugestão.

**Objetivo:**  
Garantir que existam informações suficientes para gerar uma sugestão adequada.

**Stakeholders:**  
Usuário.

**Ator principal:**  
Sistema.

**Pré-condições:**  
- Pedido de desculpas criado.

**Entradas:**  
- Dados do pedido.
- Situação.
- Contexto.
- Destinatário.

**Processamento esperado:**  
O sistema deve verificar se todas as informações obrigatórias necessárias para a geração estão disponíveis.

**Saídas/Resultados:**  
Pedido aprovado para geração ou indicação das informações pendentes.

**Pós-condições:**  
Somente pedidos válidos podem seguir para a geração da sugestão.

**Fluxos alternativos/exceções:**  
- Situação não informada.
- Destinatário não informado.
- Contexto obrigatório ausente.

**Regras de negócio relacionadas:**  
RN-03.

**Prioridade:**  
Crítica.

**Status:**  
Proposto.

**Critérios de aceite:**  
- Validar todos os campos obrigatórios.
- Impedir a geração quando faltarem informações obrigatórias.
- Informar ao usuário quais dados precisam ser preenchidos.

**Casos de uso relacionados:**  
A definir.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

## RF-06 — Gerar sugestão personalizada

**Título:**  
Geração de sugestão de desculpa.

**Descrição:**  
O sistema deve gerar uma sugestão de desculpa considerando a situação, o contexto do usuário e as informações do destinatário.

**Objetivo:**  
Produzir uma sugestão compatível com a situação apresentada.

**Stakeholders:**  
Usuário.

**Ator principal:**  
Usuário.

**Pré-condições:**  
- Usuário autenticado.
- Pedido criado.
- Situação informada.
- Informações mínimas do contexto preenchidas.
- Destinatário definido.

**Entradas:**  
- Situação.
- Contexto do usuário.
- Tipo de destinatário.
- Nível de proximidade.
- Informações do pedido.

**Processamento esperado:**  
O sistema deve utilizar as informações disponíveis para gerar uma sugestão personalizada.

**Saídas/Resultados:**  
Sugestão de desculpa apresentada ao usuário.

**Pós-condições:**  
A sugestão fica vinculada ao pedido correspondente.

**Fluxos alternativos/exceções:**  
- Falha durante a geração.
- Informações insuficientes.
- Nenhuma sugestão adequada encontrada.

**Regras de negócio relacionadas:**  
RN-04.

**Prioridade:**  
Crítica.

**Status:**  
Proposto.

**Critérios de aceite:**  
- Considerar a situação informada.
- Considerar o contexto disponível do usuário.
- Considerar informações do destinatário.
- Apresentar uma sugestão ao usuário quando os dados necessários estiverem disponíveis.

**Casos de uso relacionados:**  
A definir.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

## RF-07 — Selecionar desculpa por categoria

**Título:**  
Seleção de desculpa compatível.

**Descrição:**  
O sistema deve selecionar desculpas pertencentes a categorias compatíveis com a situação informada.

**Objetivo:**  
Garantir maior adequação entre a sugestão e o contexto apresentado.

**Stakeholders:**  
Usuário.

**Ator principal:**  
Sistema.

**Pré-condições:**  
- Pedido válido.
- Situação definida.
- Categorias de desculpas disponíveis.

**Entradas:**  
- Situação.
- Contexto.
- Categorias de desculpas.

**Processamento esperado:**  
O sistema deve identificar categorias compatíveis e selecionar uma desculpa apropriada.

**Saídas/Resultados:**  
Desculpa selecionada para a composição da sugestão.

**Pós-condições:**  
A sugestão gerada utiliza uma desculpa de categoria compatível.

**Fluxos alternativos/exceções:**  
- Nenhuma categoria compatível encontrada.

**Regras de negócio relacionadas:**  
RN-05.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Critérios de aceite:**  
- Considerar o contexto informado.
- Selecionar apenas desculpas de categorias compatíveis.
- Não utilizar uma desculpa de categoria incompatível com a situação.

**Casos de uso relacionados:**  
A definir.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

## RF-08 — Solicitar nova sugestão

**Título:**  
Nova sugestão para o mesmo pedido.

**Descrição:**  
O sistema deve permitir que o usuário solicite outra sugestão para o mesmo pedido de desculpas.

**Objetivo:**  
Oferecer alternativas quando o usuário não estiver satisfeito com a sugestão apresentada.

**Stakeholders:**  
Usuário.

**Ator principal:**  
Usuário.

**Pré-condições:**  
- Pedido válido.
- Pelo menos uma sugestão já apresentada.

**Entradas:**  
- Solicitação de nova sugestão.
- Dados do pedido existente.

**Processamento esperado:**  
O sistema deve reutilizar as informações do pedido para gerar uma nova alternativa.

**Saídas/Resultados:**  
Nova sugestão apresentada ao usuário.

**Pós-condições:**  
Uma nova sugestão fica associada ao mesmo pedido.

**Fluxos alternativos/exceções:**  
- Falha durante a geração.

**Regras de negócio relacionadas:**  
RN-06.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Critérios de aceite:**  
- Permitir solicitar uma nova sugestão.
- Reutilizar os dados do pedido existente.
- Não exigir que o usuário preencha novamente todas as informações.
- Apresentar uma nova sugestão quando a geração for concluída.

**Casos de uso relacionados:**  
A definir.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

## RF-09 — Registrar sugestão no histórico

**Título:**  
Registro automático da sugestão gerada.

**Descrição:**  
O sistema deve registrar cada sugestão gerada no histórico de utilização do usuário, incluindo data e hora.

**Objetivo:**  
Manter rastreabilidade das sugestões apresentadas.

**Stakeholders:**  
Usuário.

**Ator principal:**  
Sistema.

**Pré-condições:**  
- Sugestão gerada e apresentada com sucesso.

**Entradas:**  
- Usuário.
- Pedido.
- Sugestão gerada.
- Data e hora.

**Processamento esperado:**  
O sistema deve registrar a utilização no histórico e associar o registro ao usuário e à sugestão correspondente.

**Saídas/Resultados:**  
Novo registro no histórico de utilização.

**Pós-condições:**  
A sugestão passa a estar disponível para consulta futura.

**Fluxos alternativos/exceções:**  
- Falha na geração não deve produzir registro de sugestão concluída.

**Regras de negócio relacionadas:**  
RN-09.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Critérios de aceite:**  
- Registrar cada sugestão apresentada.
- Registrar data e hora da geração.
- Associar o registro ao usuário.
- Associar o registro ao pedido correspondente.
- Associar o registro à sugestão gerada.

**Casos de uso relacionados:**  
A definir.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

## RF-10 — Fornecer feedback sobre sugestão

**Título:**  
Avaliação da sugestão.

**Descrição:**  
O sistema deve permitir que o usuário avalie ou forneça feedback sobre a sugestão apresentada.

**Objetivo:**  
Permitir que o usuário registre sua percepção sobre a qualidade da sugestão.

**Stakeholders:**  
Usuário.

**Ator principal:**  
Usuário.

**Pré-condições:**  
- Sugestão apresentada ao usuário.

**Entradas:**  
- Feedback do usuário.

**Processamento esperado:**  
O sistema deve receber e associar o feedback à utilização correspondente.

**Saídas/Resultados:**  
Feedback registrado.

**Pós-condições:**  
O feedback fica associado ao registro de uso da sugestão.

**Fluxos alternativos/exceções:**  
- O usuário pode optar por não fornecer feedback.

**Regras de negócio relacionadas:**  
RN-07.

**Prioridade:**  
Média.

**Status:**  
Proposto.

**Critérios de aceite:**  
- Permitir o envio de feedback.
- Associar o feedback à sugestão correta.
- Permitir que o usuário ignore essa etapa.
- Não tornar o feedback obrigatório para continuar utilizando o sistema.

**Casos de uso relacionados:**  
A definir.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

## RF-11 — Associar desculpa a categoria

**Título:**  
Categorização das desculpas disponíveis.

**Descrição:**  
O sistema deve associar cada desculpa disponível a uma categoria de desculpa.

**Objetivo:**  
Organizar as desculpas e permitir sua seleção conforme o contexto da situação.

**Stakeholders:**  
Usuário e responsáveis pela manutenção das desculpas.

**Ator principal:**  
Sistema.

**Pré-condições:**  
- Existência de uma desculpa.
- Existência de uma categoria válida.

**Entradas:**  
- Desculpa.
- Categoria de desculpa.

**Processamento esperado:**  
O sistema deve manter a associação entre a desculpa e sua categoria correspondente.

**Saídas/Resultados:**  
Desculpa categorizada.

**Pós-condições:**  
A desculpa passa a poder ser selecionada de acordo com sua categoria.

**Fluxos alternativos/exceções:**  
- Categoria inexistente.
- Associação inválida.

**Regras de negócio relacionadas:**  
RN-05.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Critérios de aceite:**  
- Toda desculpa disponível deve possuir uma categoria associada.
- Impedir associação com categoria inexistente.
- Permitir identificar a categoria de uma desculpa durante o processo de geração.

**Casos de uso relacionados:**  
A definir.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.