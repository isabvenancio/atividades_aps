# Casos de Uso — VazaApp

## Visão Geral

| Identificador | Caso de Uso | Ator principal | Requisitos relacionados |
|---|---|---|---|
| UC-01 | Cadastrar usuário | Usuário | RF-01 |
| UC-02 | Manter perfil de contexto | Usuário | RF-02 |
| UC-03 | Criar pedido de desculpa | Usuário | RF-03 |
| UC-04 | Informar situação do pedido | Usuário | RF-04 |
| UC-05 | Gerar sugestão personalizada | Usuário | RF-05, RF-06, RF-07, RF-09 |
| UC-06 | Solicitar nova sugestão | Usuário | RF-08 |
| UC-07 | Fornecer feedback sobre sugestão | Usuário | RF-10 |

## Atores - Usuário

Pessoa que utiliza o VazaApp para realizar cadastro, manter seu perfil de contexto, criar pedidos de desculpa, informar situações, solicitar sugestões e fornecer feedback.

## Visão Detalhada

### UC-01 — Cadastrar usuário

**Título:**  
Cadastro de usuário.

**Objetivo:**  
Permitir que um novo usuário crie uma conta para utilizar as funcionalidades do VazaApp.

**Ator principal:**  
Usuário.

**Pré-condições:**  
- O usuário ainda não deve possuir cadastro com os mesmos dados de identificação.

**Entradas:**  
- Nome.
- E-mail.
- Telefone.
- Foto de perfil, quando informada.

**Fluxo principal:**
1. O usuário solicita o cadastro.
2. O sistema apresenta os campos necessários para o cadastro.
3. O usuário informa seus dados.
4. O sistema valida os dados informados.
5. O sistema verifica se o e-mail já está cadastrado.
6. O sistema registra o novo usuário.
7. O sistema informa que o cadastro foi realizado com sucesso.

**Fluxos alternativos/exceções:**

**A1 — Dados obrigatórios não preenchidos**
1. O sistema identifica a ausência de um ou mais dados obrigatórios.
2. O sistema informa ao usuário os dados que precisam ser preenchidos.
3. O cadastro não é concluído.

**A2 — E-mail já cadastrado**
1. O sistema identifica que o e-mail informado já está cadastrado.
2. O sistema informa ao usuário que o e-mail já está em uso.
3. O cadastro não é concluído.

**A3 — Dados em formato inválido**
1. O sistema identifica que um ou mais dados estão em formato inválido.
2. O sistema informa o problema ao usuário.
3. O cadastro não é concluído até que os dados sejam corrigidos.

**A4 — Falha no registro**
1. O sistema identifica uma falha ao registrar o usuário.
2. O sistema informa que o cadastro não pôde ser concluído.

**Pós-condições:**  
O usuário passa a possuir uma conta cadastrada no sistema.

**Regras de negócio relacionadas:**  
RN-01.

**Requisitos relacionados:**  
RF-01.

**Critérios de aceite:**
- Permitir o cadastro quando todos os dados obrigatórios forem válidos.
- Impedir o cadastro quando houver dados obrigatórios ausentes.
- Informar ao usuário quando os dados fornecidos forem inválidos.
- Impedir o cadastro com e-mail já cadastrado.
- Confirmar a criação da conta após o cadastro.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

---

### UC-02 — Manter perfil de contexto

**Título:**  
Manutenção do perfil de contexto do usuário.

**Objetivo:**  
Permitir que o usuário cadastre e atualize informações profissionais, sociais e pessoais utilizadas durante a geração de sugestões.

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

**Fluxo principal:**
1. O usuário acessa seu perfil de contexto.
2. O sistema apresenta as informações atualmente cadastradas.
3. O usuário informa ou altera as informações de contexto.
4. O sistema valida os dados informados.
5. O sistema salva as alterações.
6. O sistema confirma a atualização do perfil.

**Fluxos alternativos/exceções:**

**A1 — Usuário cancela a alteração**
1. O usuário cancela a operação.
2. O sistema encerra a operação sem salvar as alterações realizadas.

**A2 — Dados inválidos**
1. O sistema identifica dados inválidos.
2. O sistema informa ao usuário os dados que precisam ser corrigidos.
3. O perfil não é atualizado enquanto houver dados inválidos.

**A3 — Falha ao salvar**
1. O sistema identifica uma falha ao salvar as alterações.
2. O sistema informa que não foi possível atualizar o perfil.

**Pós-condições:**  
As informações ficam associadas ao usuário e disponíveis para utilização durante a geração de sugestões.

**Regras de negócio relacionadas:**  
RN-01.

**Requisitos relacionados:**  
RF-02.

**Critérios de aceite:**
- Permitir que o usuário cadastre informações de contexto.
- Permitir a atualização das informações cadastradas.
- Manter o perfil associado ao usuário correspondente.
- Salvar corretamente as alterações realizadas.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

---

### UC-03 — Criar pedido de desculpa

**Título:**  
Criação de pedido de desculpa.

**Objetivo:**  
Iniciar o processo de criação de um pedido que poderá receber as informações necessárias para a geração de uma sugestão.

**Ator principal:**  
Usuário.

**Pré-condições:**  
- Usuário cadastrado.
- Usuário autenticado.

**Entradas:**  
- Dados do novo pedido.

**Fluxo principal:**
1. O usuário solicita a criação de um novo pedido de desculpa.
2. O sistema cria o pedido.
3. O sistema associa o pedido ao usuário autenticado.
4. O sistema disponibiliza o pedido para preenchimento das informações necessárias.

**Fluxos alternativos/exceções:**

**A1 — Usuário não autenticado**
1. O sistema identifica que o usuário não está autenticado.
2. O sistema impede a criação do pedido.
3. O sistema informa que a autenticação é necessária.

**A2 — Falha na criação do pedido**
1. O sistema identifica uma falha ao registrar o pedido.
2. O sistema informa que o pedido não pôde ser criado.

**Pós-condições:**  
O pedido passa a existir e fica associado ao usuário responsável, podendo receber informações de situação, destinatário e contexto.

**Regras de negócio relacionadas:**  
RN-02.

**Requisitos relacionados:**  
RF-03.

**Critérios de aceite:**
- Permitir que um usuário autenticado crie um pedido.
- Associar o pedido ao usuário responsável.
- Impedir a criação do pedido para usuário não autenticado.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

---

### UC-04 — Informar situação do pedido

**Título:**  
Definição da situação do pedido.

**Objetivo:**  
Permitir que o usuário informe a situação que motivou o pedido de desculpa.

**Ator principal:**  
Usuário.

**Pré-condições:**  
- Usuário autenticado.
- Pedido de desculpa criado.

**Entradas:**  
- Situação.
- Descrição.
- Contexto relacionado.

**Fluxo principal:**
1. O usuário seleciona um pedido de desculpa.
2. O sistema apresenta os campos para informar a situação.
3. O usuário informa a situação, a descrição e o contexto relacionado.
4. O sistema valida as informações fornecidas.
5. O sistema associa a situação ao pedido.
6. O sistema confirma o registro da situação.

**Fluxos alternativos/exceções:**

**A1 — Situação não informada**
1. O sistema identifica que a situação não foi informada.
2. O sistema solicita o preenchimento da informação obrigatória.
3. A situação não é registrada até que a informação seja fornecida.

**A2 — Dados inválidos**
1. O sistema identifica dados inválidos.
2. O sistema informa ao usuário quais dados precisam ser corrigidos.
3. O registro não é concluído enquanto houver dados inválidos.

**A3 — Falha ao registrar a situação**
1. O sistema identifica uma falha durante o registro.
2. O sistema informa que não foi possível salvar a situação.

**Pós-condições:**  
O pedido passa a possuir uma situação associada.

**Regras de negócio relacionadas:**  
RN-02.

**Requisitos relacionados:**  
RF-04.

**Critérios de aceite:**
- Permitir informar a situação do pedido.
- Associar corretamente a situação ao pedido.
- Não permitir geração de sugestão enquanto o pedido não possuir uma situação.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

---

### UC-05 — Gerar sugestão personalizada

**Título:**  
Geração de sugestão de desculpa.

**Objetivo:**  
Gerar uma sugestão de desculpa considerando a situação, o contexto do usuário e as informações do destinatário.

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

**Fluxo principal:**
1. O usuário solicita uma sugestão para o pedido.
2. O sistema verifica se as informações obrigatórias estão preenchidas.
3. O sistema identifica as informações de contexto disponíveis do usuário.
4. O sistema identifica as informações do destinatário.
5. O sistema identifica categorias de desculpas compatíveis com a situação informada.
6. O sistema seleciona uma desculpa adequada à categoria identificada.
7. O sistema gera a sugestão personalizada.
8. O sistema associa a sugestão ao pedido correspondente.
9. O sistema registra a sugestão no histórico de utilização.
10. O sistema apresenta a sugestão ao usuário.

**Fluxos alternativos/exceções:**

**A1 — Informações obrigatórias ausentes**
1. O sistema identifica que existem informações necessárias não preenchidas.
2. O sistema informa ao usuário quais dados precisam ser fornecidos.
3. A geração da sugestão não é realizada.

**A2 — Nenhuma categoria compatível encontrada**
1. O sistema verifica as categorias disponíveis.
2. O sistema não encontra categoria compatível com a situação informada.
3. O sistema informa ao usuário que não foi possível encontrar uma sugestão adequada.

**A3 — Falha durante a geração**
1. O sistema identifica uma falha durante a geração.
2. O sistema informa que a sugestão não pôde ser gerada.
3. A sugestão não é registrada como concluída.

**A4 — Falha ao registrar no histórico**
1. O sistema gera a sugestão.
2. O sistema identifica uma falha ao registrar o histórico.
3. O sistema informa que houve um problema no registro da utilização.

**Pós-condições:**  
A sugestão é apresentada ao usuário e fica vinculada ao pedido correspondente quando o processo é concluído com sucesso.

**Regras de negócio relacionadas:**  
RN-02, RN-03, RN-04, RN-05, RN-09.

**Requisitos relacionados:**  
RF-05, RF-06, RF-07, RF-09.

**Requisitos não funcionais relacionados:**  
RNF-03, RNF-04, RNF-06.

**Critérios de aceite:**
- Considerar a situação informada.
- Considerar o contexto disponível do usuário.
- Considerar as informações do destinatário.
- Validar as informações obrigatórias antes da geração.
- Selecionar apenas desculpas compatíveis com o contexto informado.
- Apresentar uma sugestão quando os dados necessários estiverem disponíveis.
- Registrar a sugestão gerada no histórico.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

---

### UC-06 — Solicitar nova sugestão

**Título:**  
Nova sugestão para o mesmo pedido.

**Objetivo:**  
Permitir que o usuário obtenha outra alternativa para o mesmo pedido de desculpa sem precisar preencher novamente todas as informações.

**Ator principal:**  
Usuário.

**Pré-condições:**  
- Pedido válido.
- Pelo menos uma sugestão já apresentada.

**Entradas:**  
- Solicitação de nova sugestão.
- Dados do pedido existente.

**Fluxo principal:**
1. O usuário solicita uma nova sugestão.
2. O sistema recupera as informações do pedido existente.
3. O sistema reutiliza os dados já preenchidos.
4. O sistema realiza uma nova geração.
5. O sistema registra a nova sugestão.
6. O sistema apresenta a nova sugestão ao usuário.

**Fluxos alternativos/exceções:**

**A1 — Falha durante a geração**
1. O sistema identifica uma falha durante a nova geração.
2. O sistema informa que não foi possível gerar uma nova sugestão.

**A2 — Não foi possível gerar alternativa adequada**
1. O sistema não consegue gerar uma nova alternativa adequada para o pedido.
2. O sistema informa o usuário sobre a indisponibilidade de uma nova sugestão.

**Pós-condições:**  
Uma nova sugestão fica associada ao mesmo pedido.

**Regras de negócio relacionadas:**  
RN-06.

**Requisitos relacionados:**  
RF-08.

**Requisitos não funcionais relacionados:**  
RNF-04, RNF-06.

**Critérios de aceite:**
- Permitir solicitar uma nova sugestão.
- Reutilizar os dados do pedido existente.
- Não exigir que o usuário preencha novamente todas as informações.
- Apresentar uma nova sugestão quando a geração for concluída.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

---

### UC-07 — Fornecer feedback sobre sugestão

**Título:**  
Avaliação da sugestão.

**Objetivo:**  
Permitir que o usuário registre sua percepção sobre a sugestão apresentada.

**Ator principal:**  
Usuário.

**Pré-condições:**  
- Sugestão apresentada ao usuário.

**Entradas:**  
- Feedback do usuário.

**Fluxo principal:**
1. O usuário decide fornecer um feedback.
2. O sistema apresenta a opção para registro da avaliação.
3. O usuário informa o feedback.
4. O sistema associa o feedback à sugestão correspondente.
5. O sistema registra o feedback.
6. O sistema confirma o registro.

**Fluxos alternativos/exceções:**

**A1 — Usuário não deseja fornecer feedback**
1. O usuário opta por não fornecer feedback.
2. O sistema ignora a etapa de avaliação.
3. O usuário pode continuar utilizando o sistema normalmente.

**A2 — Falha no registro do feedback**
1. O sistema identifica uma falha ao registrar o feedback.
2. O sistema informa que o feedback não pôde ser registrado.

**Pós-condições:**  
O feedback fica associado à utilização correspondente quando fornecido.

**Regras de negócio relacionadas:**  
RN-07.

**Requisitos relacionados:**  
RF-10.

**Critérios de aceite:**
- Permitir o envio de feedback.
- Associar o feedback à sugestão correta.
- Permitir que o usuário ignore essa etapa.
- Não tornar o feedback obrigatório para continuar utilizando o sistema.

**Tarefas relacionadas:**  
A definir.

**Casos de teste relacionados:**  
A definir.

## Matriz de rastreabilidade

| Caso de Uso | Requisitos Funcionais | Regras de Negócio |
|---|---|---|
| UC-01 | RF-01 | RN-01 |
| UC-02 | RF-02 | RN-01 |
| UC-03 | RF-03 | RN-02 |
| UC-04 | RF-04 | RN-02 |
| UC-05 | RF-05, RF-06, RF-07, RF-09 | RN-02, RN-03, RN-04, RN-05, RN-09 |
| UC-06 | RF-08 | RN-06 |
| UC-07 | RF-10 | RN-07 |