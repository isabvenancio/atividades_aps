# Parte 7 --- Introdução ao Diagrama de Sequência

## Exercício 16 --- Caso de Uso × Diagrama de Sequência

Explique:

``` text
Caso de Uso:
Como o ator alcança seu objetivo utilizando o sistema?
R: foca no O QUE o sistema faz do ponto de vista do ator, descrevendo as intenções, requisitos, objetivos e as variacões de fluxo (happy path, alternativo e exceções)

Diagrama de Sequência:
Como os participantes colaboram ao longo do tempo
para realizar determinado cenário?
R: foca no COMO a solução é realizada, detalhando troca de mensagens e distribuição de responsabilidades entre os componentes internos (interface, controladores, objetos de domínio e repositórios)
```

> Por que um Diagrama de Sequência não substitui um Caso de Uso?
R: o caso de uso engloba o objetivo completo do ator reunindo seus fluxos, já o diagrama refina e detalha apenas um cenário específico por vez. Além disso, o diagrama de sequencia deriva da especificação do caso de uso, não há como rastrear a origem das mensagens entre os objetos ou verificar se a implementação atende as regras e necessidades do usuário

------------------------------------------------------------------------

## Exercício 17 --- Identificando participantes

> Um cliente solicita uma transferência bancária. A interface envia a
> solicitação para o sistema. O sistema verifica a conta de origem,
> consulta o saldo, valida a transferência, registra a movimentação e
> informa o resultado ao cliente.

Identifique participantes considerando:

``` text
ATOR: cliente = entidade externa q inicia a solicitação de transferencia bancária e recebe o resultado final
INTERFACE / BOUNDARY: TelaTransferencia = captua os dados do cliente e envia a requisição ao sistema e, por fim exibe a mensagem do resultado final
CONTROLE / APLICAÇÃO: TransferenciaController = orquestra o fluxo do processo, recebendo a chamada da interface e dos dados, aciona as validações nas entidades de domínio e coordenando a gravação
DOMÍNIO: Transferencia = executa as regras e lógicas de negócio (verifica se a conta existe, consulta o saldo, e aplica a validação de transferencia)
PERSISTÊNCIA: ContaRepository = interage com o bando de dados para buscar os dados da conta envolvida e gravar o registro da movimentação bancária
```

Justifique a responsabilidade de cada participante.

------------------------------------------------------------------------

# Parte 8 --- Construção de Diagramas de Sequência

## Exercício 18 --- Da especificação para a sequência

``` text
UC03 — Reservar Sala

Ator: Professor

1. Professor solicita uma reserva.
2. Sistema solicita data e horário.
3. Professor informa data e horário.
4. Sistema verifica disponibilidade.
5. Sistema apresenta a sala disponível.
6. Professor confirma.
7. Sistema registra a reserva.
8. Sistema informa a confirmação.
```

Construa um Diagrama de Sequência contendo pelo menos:

``` text
Professor
TelaReserva
ReservaController
ReservaService
ReservaRepository
```

R: 
Maioria dos passos, eles ficam informando de um em um P -> T -> C -> S -> R, e vice versa para informa o resultado final encontrado
```
sequenceDiagram
    autonumber
    actor P como Professor
    participant T como TelaReserva
    participant C como ReservaController
    participant S como ReservaService
    participant R como ReservaRepository

    P->>T: 1. Solicita reserva
    T-->>P: 2. Solicita data e horário
    P->>T: 3. Informa data e horário
    
    T->>C: 4. consultarDisponibilidade(data, horario)
    C->>S: 4.1. verificarDisponibilidade(data, horario)
    S->>R: 4.2. buscarReservasPorDataHorario(data, horario)
    R-->>S: Reservas existentes
    S-->>C: Salas disponíveis
    C-->>T: Salas disponíveis
    T-->>P: 5. Apresenta salas disponíveis

    P->>T: 6. Confirma reserva da sala
    T->>C: 7. registrarReserva(salaId, data, horario)
    C->>S: 7.1. criarReserva(professorId, salaId, data, horario)
    S->>R: 7.2. salvar(reserva)
    R-->>S: Confirmação de salvamento
    S-->>C: Reserva realizada com sucesso
    C-->>T: Mensagem de confirmação
    T-->>P: 8. Exibe confirmação na tela
```

------------------------------------------------------------------------

## Exercício 19 --- Adicione uma decisão

Acrescente:

``` text
RN05 — Uma sala não pode possuir duas reservas para períodos conflitantes.
```

Modifique o Diagrama usando `alt` para:

``` text
[sala disponível]
[sala indisponível]
```
R:
        R-->>S: Reservas existentes
Note over S: Validação da RN05: Verifica se há conflito de horário nas reservas existentes
    alt sala disponível (sem conflito de horário)
        S->>R: 5a. salvar(novaReserva)
        R-->>S: Confirmação de persistência
        S-->>C: Reserva realizada com sucesso
        C-->>T: Mensagem de sucesso
        T-->>P: Exibe confirmação da reserva
    else sala indisponível (conflito detectado)
        S-->>C: Erro: Sala já reservada para este horário [RN05]
        C-->>T: Mensagem de indisponibilidade
        T-->>P: Exibe alerta de conflito e solicita nova data/horário
    end


Explique como a RN05 aparece no comportamento.
R: atua no componente ReservaService, comparando a data e o horário solicitados com a lista de agendamentos retornados pelo ReservaRepository.

------------------------------------------------------------------------

## Exercício 20 --- Adicione uma repetição

Considere um pedido com vários produtos.

Represente:

``` text
loop [para cada produto]
    verificar disponibilidade
    adicionar item
    calcular subtotal
```

R:
sequenceDiagram
    autonumber
    actor C as Cliente
    participant T as TelaPedido
    participant Ctrl as PedidoController
    participant S as PedidoService
    participant E as EstoqueRepository

    C->>T: 1. Informa a lista de produtos do pedido
    T->>Ctrl: 2. criarPedido(itens)
    Ctrl->>S: 3. processarItens(itens)

    loop para cada produto
        S->>E: 3.1. verificarDisponibilidade(produtoId, quantidade)
        E-->>S: Estoque disponível
        S->>S: 3.2. adicionarItemAoPedido(produtoId, quantidade)
        S->>S: 3.3. calcularSubtotalItem(preco, quantidade)
    end

    S-->>Ctrl: Pedido montado com subtotais
    Ctrl-->>T: Resumo do pedido
    T-->>C: 4. Exibe o resumo do pedido

Explique por que `loop` é mais adequado que repetir manualmente as
mensagens.
R: Atende a qualquer número de itens (0...N) sem fixar uma quantidade rígida no modelo. Evita a poluição do diagrama e a repetição desnecessária de setas. Mapeia diretamente as estruturas de repetição (`for`, `while`) da programação.

------------------------------------------------------------------------

# Parte 9 --- Encontrando problemas no projeto

## Exercício 21 --- Quem deveria fazer isso?

Considere:

``` text
TelaPedido
   ↓
validarCliente()
verificarEstoque()
calcularDesconto()
calcularTotal()
salvarPedido()
enviarEmail()
```

Discuta:

1.  Qual é o problema?
R: A classe de interface gráfica (`TelaPedido`) assume a responsabilidade de executar todo o processo do sistema. Isso gera alto acoplamento (dependentes), impossibilita a reusabilidade do código e dificulta a manutenção e os testes automatizados.
2.  Quais responsabilidades estão concentradas indevidamente?
R: 
Regras de Negócio e Cálculos: `calcularDesconto()` e `calcularTotal()` foram colocados na tela em vez do domínio.
Validações e Regras de Domínio: `validarCliente()` e `verificarEstoque()` foram atribuídos à camada visual.
Persistência de Dados: `salvarPedido()` faz com que a interface acesse o banco de dados diretamente.
Notificação/Integração Externa: `enviarEmail()` coloca lógica de infraestrutura dentro da tela.
1.  Como distribuí-las entre Interface, Controller/Aplicação, Domínio e
    Infraestrutura?
R:
Interface (Boundary): `TelaPedido` — Apenas captura os dados informados pelo usuário, repassa a requisição e exibe o resultado final.
Controller / Aplicação: `PedidoController` — Recebe as chamadas da interface e coordena a execução do fluxo de uso.
Domínio: `Pedido` (Entidade): Executa as regras de negócio puras como `calcularDesconto()` e `calcularTotal()`. `ClienteService` / `EstoqueService`: Executam `validarCliente()` e `verificarEstoque()`.
Infraestrutura:`PedidoRepository`: Executa a persistência (`salvarPedido()`). `EmailService`: Executa a integração para envio de mensagens (`enviarEmail()`).

Depois desenhe uma solução melhor.
R:
sequenceDiagram 
autonumber 
actor C as Cliente 
participant T as TelaPedido 
participant Ctrl as PedidoController 
participant S as PedidoService 
participant P as Pedido (Domínio) 
participant R as PedidoRepository 
participant E as EmailService 

C->>T: 1\. Solicita finalização do pedido 
T->>Ctrl: 2\. criarPedido(dadosPedido) 
Ctrl->>S: 3\. processarPedido(dadosPedido) 

S->>S: 3.1\. validarCliente() e verificarEstoque() 
S->>P: 3.2\. calcularDesconto() e calcularTotal() 
S->>R: 3.3\. salvarPedido(pedido) 
R-->>S: Pedido salvo 
S->>E: 3.4\. enviarEmailConfirmacao(cliente, pedido) 

S-->>Ctrl: Pedido processado com sucesso 
Ctrl-->>T: Resumo do pedido 
T-->>C: Exibe confirmação na tela

------------------------------------------------------------------------

## Exercício 22 --- Mensagens sem origem

Um Diagrama de Sequência contém:

``` text
PedidoService → ClienteService:
bloquearCliente()
```

Porém, nenhuma Regra de Negócio, requisito ou passo do Caso de Uso
menciona bloqueio.

Discuta:

1.  o diagrama está errado;
R: inclui um comportamento por conta própria(gold plating) que não foi solicitado nem autorizado pelo negócio
2.  o requisito está incompleto;
R: a necessidade de bloquear o cliente existia, mas o analista esqueceu de detalhar essa ação na especificação do Requisito Funcional (RF) ou no Caso de Uso (UC)
3.  uma Regra de Negócio não foi documentada;
R: existe uma norma(clientes inadimplentes devem ser bloquados), mas ela não foi elicitada como uma RN
4.  trata-se de uma decisão interna legítima de projeto.
R: é uma resposta técnica da arquitetura que não altera a RN principal do usuário

Explique como decidir entre as possibilidades.
R: consultar o negócio (PO/stakeholders) e avaliar se é uma decisão técnica, sempre atualizando a documentação de arquitetura e removendo mensagens desnecessárias

------------------------------------------------------------------------

# Parte 10 --- Exercício Integrador

## Exercício 23 --- Do problema ao Diagrama de Sequência

> Uma clínica permite que pacientes agendem consultas. O paciente
> escolhe uma especialidade, profissional, data e horário. Um
> profissional não pode possuir duas consultas no mesmo horário.
> Consultas somente podem ser agendadas em horários disponíveis. O
> paciente pode cancelar uma consulta até 24 horas antes do horário
> agendado. O sistema deve registrar todas as consultas e cancelamentos.

Realize:

1.  Identifique as Regras de Negócio.
2.  Especifique os Requisitos Funcionais.
3.  Proponha Requisitos Não Funcionais relevantes.
4.  Identifique os atores.
5.  Identifique os Casos de Uso.
6.  Escolha `Agendar Consulta`.
7.  Especifique:
    -   objetivo;
    -   ator;
    -   pré-condições;
    -   pós-condições;
    -   fluxo principal;
    -   fluxos alternativos;
    -   exceções.
8.  Relacione `RN ↔ RF/RNF ↔ UC`.
9.  Aplique o checklist.
10. Corrija os problemas.
11. Identifique os participantes do fluxo principal.
12. Construa o Diagrama de Sequência.
13. Utilize `alt` para horário disponível/indisponível.
14. Explique a responsabilidade de cada participante.

RN01 — Sem Conflito de Profissional: Um profissional não pode ter duas consultas agendadas no mesmo dia e horário.
RN02 — Janela de Horário Disponível: Consultas só podem ser marcadas em horários abertos para agendamento na agenda da clínica.
RN03 — Prazo Limite para Cancelamento: O cancelamento só é permitido se solicitado com no mínimo 24 horas de antecedência em relação ao horário agendado.

RF01: O sistema deve permitir que o paciente pesquise e escolha consultas por especialidade, profissional, data e horário.
RF02: O sistema deve validar a disponibilidade do profissional e do horário antes de efetivar o agendamento [RN01, RN02].
RF03: O sistema deve permitir ao paciente cancelar uma consulta agendada, validando o prazo de antecedência [RN03].
RF04: O sistema deve manter o histórico completo das consultas agendadas e canceladas.

RNF01 (Desempenho): A verificação de disponibilidade de horários deve responder em até 2 segundos.
RNF02 (Segurança): O sistema deve autenticar o paciente antes de permitir ações de agendamento ou cancelamento.

Paciente: Ator principal que realiza o agendamento e o cancelamento de suas consultas.
Profissional de Saúde: Ator passivo cuja disponibilidade de agenda é consultada.

UC01 — Agendar Consulta
UC02 — Cancelar Consulta
UC03 — Consultar Histórico de Consultas

UC01 — Agendar Consulta
Objetivo: Permitir que o paciente agende uma consulta médica na clínica.Ator Principal: Paciente.
Pré-condições: Paciente autenticado e grade do profissional cadastrada
Pós-condições: Consulta salva no sistema e horário bloqueado para novos agendamentos.
Fluxo Principal:Paciente solicita o agendamento e seleciona especialidade, profissional, data e horário. Sistema valida a disponibilidade do horário [RN01, RN02]. Sistema registra a consulta e gera o comprovante. Sistema exibe a mensagem de confirmação do agendamento.
Fluxos Alternativos: FA01 — Seleção por Próxima Data Livre: No passo 1, o paciente opta por visualizar automaticamente a primeira data com horários livres do profissional escolhido. Fluxos de Exceção:FE01 — Horário Indisponível / Conflito (no passo 2): Sistema identifica que o horário escolhido já foi ocupado ou está indisponível [RN01, RN02].Sistema exibe alerta de indisponibilidade e solicita ao paciente a seleção de um novo horário.

Rastreabilidade (RN -> RF/RNF -> UC)
RN01 / RN02 -> RF01, RF02 -> UC01 (Passo 2 e FE01) -> RNF01
RN03 -> RF03 -> UC02

Análise por Checklist: Verificou-se a presença de identificador, ator, pré/pós-condições, regras e tratamento de erros.
Problema Identificado: O fluxo original não deixava explícita a revalidação concorrente de disponibilidade antes de salvar.
Correção: Inclusão formal do FE01 (Horário Indisponível) para tratar concorrência e falha de validação.

Paciente (Ator)
TelaAgendamento (Interface / Boundary)
ConsultaController (Controle / Aplicação)
ConsultaService (Domínio / Serviço)
ConsultaRepository (Persistência)

Diagrama de Sequência (com alt)
    sequenceDiagram
    autonumber
    actor P as Paciente
    participant T as TelaAgendamento
    participant C as ConsultaController
    participant S as ConsultaService
    participant R as ConsultaRepository

    P->>T: 1. Seleciona especialidade, profissional, data e horário
    T->>C: 2. agendarConsulta(pacienteId, profissionalId, data, horario)
    C->>S: 3. processarAgendamento(pacienteId, profissionalId, data, horario)
    S->>R: 4. verificarDisponibilidade(profissionalId, data, horario)
    R-->>S: Agendamentos existentes no horário

    Note over S: Validação das regras RN01 e RN02

    alt [horário disponível]
        S->>R: 5a. salvarConsulta(novaConsulta)
        R-->>S: Confirmação de salvamento
        S-->>C: Consulta realizada com sucesso
        C-->>T: Mensagem de confirmação
        T-->>P: Exibe confirmação do agendamento
    else [horário indisponível / conflito]
        S-->>C: Erro: Horário ocupado ou indisponível [RN01, RN02]
        C-->>T: Mensagem de conflito
        T-->>P: Exibe alerta de erro e solicita nova escolha
    end

Paciente (Ator): Solicita o agendamento informando seus dados e preferências.
TelaAgendamento (Interface): Interage com o usuário, envia os dados para a camada de controle e apresenta as confirmações/erros.
ConsultaController (Aplicação): Recebe as requisições da tela e coordena a execução do serviço.
ConsultaService (Domínio): Garante o cumprimento das RN01 e RN02 antes de autorizar a gravação da consulta.
ConsultaRepository (Persistência): Acessa a base de dados para buscar os agendamentos atuais e gravar a nova consulta.

------------------------------------------------------------------------

# Parte 11 --- Desafio com o projeto da equipe

## Exercício 24 --- Da análise ao projeto

Utilizando **o projeto real da equipe**, escolha um Caso de Uso
importante e produza:

``` text
REGRA DE NEGÓCIO
        ↓
REQUISITO
        ↓
CASO DE USO
        ↓
FLUXO PRINCIPAL
   ↙           ↘
ALTERNATIVO   EXCEÇÃO
        ↓
CHECKLIST / REVISÃO
        ↓
CASO DE USO CORRIGIDO
        ↓
DIAGRAMA DE SEQUÊNCIA
        ↓
RESPONSABILIDADES
```

A equipe deverá justificar **cada elemento do Diagrama de Sequência a
partir da análise realizada anteriormente**.

R: arquivo no diretório atual

------------------------------------------------------------------------

# Questão final para discussão

> O Diagrama de Sequência apenas representa graficamente o Caso de Uso
> ou também ajuda a descobrir problemas e decisões de projeto que ainda
> não estavam explícitas?

Apresente pelo menos **dois exemplos encontrados durante os
exercícios**.

R: O Diagrama de Sequência não é apenas uma representação gráfica do Caso de Uso. Ele atua como uma ponte entre a análise do problema e o projeto da solução, ajudando a revelar problemas, omissões de requisitos, responsabilidades mal distribuídas e decisões técnicas que não estavam explícitas na especificação textual.

Enquanto o Caso de Uso descreve o comportamento pela perspectiva externa do ator (O QUE deve acontecer), o Diagrama de Sequência força a equipe a detalhar COMO os componentes internos (interface, controle, domínio e infraestrutura) colaboram no tempo para realizar aquele cenário.

1. Distribuição de Responsabilidades (Ex. 21): Revelou a `TelaPedido` acumulando funções (cálculos, banco, e-mails), forçando a separação correta em camadas (`Service`, `Repository`).
2. Detecção de Omissões (Ex. 22): A chamada `bloquearCliente()` no diagrama expôs uma regra de negócio não documentada, forçando a revisão e atualização dos requisitos.

------------------------------------------------------------------------
