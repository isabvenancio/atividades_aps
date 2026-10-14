# Lista de Exercícios --- Análise e Projeto de Software

## Objetivo

Revisar e aplicar os conceitos trabalhados até o momento:

-   Regras de Negócio;
-   Requisitos Funcionais e Não Funcionais;
-   Casos de Uso;
-   validação e completude de Casos de Uso;
-   rastreabilidade;
-   fluxos principais, alternativos e de exceção;
-   Diagrama de Sequência;
-   distribuição de responsabilidades.

Progressão:

``` text
COMPREENDER → ANALISAR → CORRIGIR → MODELAR → INTEGRAR
```

------------------------------------------------------------------------

# Parte 1 --- Discussão e compreensão dos conceitos

## Exercício 1 --- Regra de Negócio × Requisito

Explique a diferença entre uma **Regra de Negócio** e um **Requisito de
Software**.

Classifique e justifique:

a)  Todo empréstimo deve possuir prazo máximo de 30 dias.\
R: Regra de negócio: é uma política/norma do domínio que limita a duração de um serviço, existindo mesmo sem um software
b)  O sistema deve permitir registrar um empréstimo.\
R: Requisito funcional: descreve uma funcionalidade /serviço que o software deve oferecer
c)  Usuários administradores devem utilizar autenticação em dois
    fatores.\
R: Requisito não funcional: define uma restrição de qualidade e segurança sobre a forma como o sistema realiza a autenticação
d)  Clientes com pagamentos vencidos não podem realizar novas compras.\
R: Regra de negócio: é uma diretriz financeira da empresa que restringe a operação para clientes não pagantes
e)  O sistema deve responder às consultas em até 2 segundos.
R: Requisito não funcional: define um critério de desempenho e tempo de resposta do software

------------------------------------------------------------------------

## Exercício 2 --- Requisitos Funcionais e Não Funcionais

Considere um sistema de biblioteca. Classifique os requisitos e, quando
forem não funcionais, indique sua categoria:

-   permitir empréstimo de livros; - Funcional
-   permitir consulta ao catálogo; - Funcional
-   suportar 500 usuários simultâneos; - Não funcional: escalabilidade/desempenho
-   exigir autenticação para operações administrativas; Não funcional: segurança
-   funcionar nos principais navegadores atuais; - Não funcional: portabilidade/compatibilidade
-   apresentar resultados de pesquisa em até 2 segundos; - Não funcional: desempenho

Depois discuta:

> Por que requisitos não funcionais não devem ser tratados como requisitos "menos importantes"?
Porque impactando diretamente o sistema e arquitetura, o RNF atua como uma restrição que atravessa diversas funcionalidade e molda toda a arquitetura, além da inviabilidade do produto, em que se for excessivamente lente, instável ou vulnerável torna inútil.

------------------------------------------------------------------------

## Exercício 3 --- Por que Casos de Uso?

Um desenvolvedor afirma:

> "Se já temos os requisitos funcionais, não precisamos de Casos de Uso."

Explique por que essa afirmação é problemática.

R: porque confunde declarar uma capacidade funciona do sistema com descrever o processo de interação necessário para realizar. O RF estabelece uma obrigação do software, mas nao explica a dinamica operacional (quem e o que).

> O que o Caso de Uso acrescenta à descrição de um requisito funcional?

R: acrescenta ator principal e objetivo, fluxo principal (happy path), pré e pós condições. fluxos alternativos e excessões, rastreabilidade e regras de negócio.

------------------------------------------------------------------------

## Exercício 4 --- Caso de Uso não é tela

Analise:

``` text
Abrir Tela de Cliente - Interface
Clicar em Salvar - Interface
Cadastrar Cliente - Caso de Uso
Digitar CPF - Interface
Registrar Pedido - Caso de Uso
Selecionar Produto - Interface
Cancelar Pedido - Caso de Uso
```

Identifique quais são bons candidatos a **Casos de Uso** e quais parecem
ações de interface ou passos internos. Justifique.

R: Cssos de uso = Representam objetivos ou metas de negócio completos de um ator que entrega um resultado para o usuário ou empresa. Interface = são detalhes tecnológicos, eventos de botão etc que não possuem valor de negócio e devem aparecer apenas como passos do fluxo de eventos dentro de um caso de uso completo.

------------------------------------------------------------------------

## Exercício 5 --- Atores

Em um sistema acadêmico existem estudantes, professores, coordenadores,
funcionários e integração com um serviço externo de autenticação.

Responda:

a)  Quais podem ser atores?\
R: estudantes, professores, coordenadores, funcionários e serviço externo de autenticação.
b)  Um sistema externo pode ser ator?\
R: Sim, plataformas que interagem e trocam dados com o software atuam como atores.
c)  Uma pessoa pode representar mais de um ator?\
R: Sim, o conceito de ator é representar um papel desempenhado no sistema, então pode ter papéis distintos (professor que também é estudante (<< exclude >>)).
d)  "Banco de Dados" deveria normalmente aparecer como ator? Por quê?
R: Não, o bd é um comportamento interno de infra do software, atores são entidades externas fora do sistema.

------------------------------------------------------------------------

# Parte 2 --- Identificação de Regras, Requisitos e Casos de Uso

## Exercício 6 --- Sistema de estacionamento

> Um estacionamento permite que clientes estacionem veículos. Na
> entrada, a placa e o horário são registrados. Na saída, o sistema
> calcula o valor de acordo com o período de permanência. Clientes
> conveniados recebem 20% de desconto. O atendente registra o pagamento
> e libera a saída. O sistema deve manter o histórico das operações.

Identifique:

-   regras de negócio;
-   requisitos funcionais;
-   possíveis requisitos não funcionais;
-   atores;
-   possíveis Casos de Uso.

Organize usando:

``` text
RN01, RN02...
RF01, RF02...
RNF01, RNF02...
UC01, UC02...
```

R: 
Atores = cliente e atendente;

RN01 = o valor da cobranca é determinado com base na diferença no período de permanencia (horário de entrada e saida);
RN02 = clientes conveniados recebem 20% de desconto sobre o valor total;
RN03 = a saída só é permitida quando é confirmada o pagamento;

RF01 = o sistema deve permitir registrar a entrada do veículo, armazenando placa e o horário de entrada;
RF02 = o sistema deve permitir registrar a saída do veículo e autorizar a liberação;
RF03 = o sistema deve permitir registrar o pagamento do período de permanencia;
RF04 = o sistema deve permitir calcular o valor com base no tempo e na aplicação do desconto do convenio;
RF05 = o sistema deve manter e permitir consultar o histórico das operações (entradas, saídas e pagamentos);

RNF01 = desempenho, o cálculo da tarifa e confirmação do pagamento devem responder em até 2 segundos para evitar filas
RNF02 = segurança, o histórico de operações deve ser armazenado de forma persistente e auditável, garantindo a integridade dos dados financeiros
RNF03 = usabilidade, a interface do atendente deve ser otimizada para navegação rápida via teclado no momento do registro

UC01 = registrar entrada de veículo, mapeia a identificação da placa e a gravação do horário de entrada
UC02 = processar saída e pagamento, abrange a identificação do veículo/comprovante, cálculo do valor (com desconto se for conveniado), registro da forma de pagamento e liberação.
UC03 = consultar histórico de operações, permite a busca e visualização das movimentações passadas e faturamento

------------------------------------------------------------------------

## Exercício 7 --- Sistema acadêmico

Considere:

``` text
RN01 — A nota deve estar entre 0 e 100.
RN02 — Somente o professor responsável pela turma pode alterar notas.
RN03 — Após o fechamento do período, notas não podem ser alteradas.
RN04 — Estudantes com frequência inferior a 75% são reprovados por frequência.
```

Derive os **Requisitos Funcionais** necessários e indique quais **Casos
de Uso** seriam afetados.

R:
RF01 = o sistema deve impedir o cadastro de notas menores que 0 ou maiores que 100.
RF02 = o sistema deve permitir que notas sejam registradas e alteradas para os estudantes da turma.
RF03 = o sistema deve verificar se o usuário é o professor responsável pela turma e se o período acadêmico está aberto antes de permitir a gravação/edição de notas.
RF04 = o sistema deve permitir o registro das presenças e faltas dos estudantes.
RF05 = o sistema deve calcular o percentual de frequência e determinar automaticamente a reprovação do estudante caso a frequência seja inferior a 75%.

UC01 = lançar/alterar notas, RN01 e RN02 e RN03
UC02 = registrar frequencia, RN04
UC03 = fechar período/consolidar turma, RN03 e RN04
UC04 = consultar histórico escolar, RN04

------------------------------------------------------------------------

# Parte 3 --- Analisando Casos de Uso

## Exercício 8 --- Encontre os problemas

``` text
UC01 — Cadastro

Ator: Usuário

1. Abrir a tela.
2. Digitar os dados.
3. Clicar no botão.
4. Sistema verifica.
5. Sistema salva.
6. Finaliza.
```

Identifique pelo menos **seis problemas** e reescreva o Caso de Uso.

R: 
1. Nome genérico: "Cadastro" não especifica o objeto de negócio (ex.: Cliente).
2. Ator vago: "Usuário" não define o papel exato (ex.: Atendente).
3. Foco em interface (GUI): Passos como "abrir tela" e "clicar no botão" são detalhes de tela.
4. Passos vagos do sistema: "Verifica" e "salva" não explicam o que é validado ou gravado.
5. Passo redundante: "Finaliza" não gera valor de negócio.
6. Falta de estrutura: Ovemetem-se objetivo, pré/pós-condições e fluxos de exceção.
 
UC01 — Cadastrar Cliente

1. Atendente solicita o cadastro e informa dados do cliente (Nome, CPF, E-mail).
2. Sistema valida o formato dos dados [RN01] e confirma que o CPF não é duplicado [RN02].
3. Sistema salva o registro e exibe mensagem de confirmação.

Exceção (FE01 - Dados Inválidos / FE02 - CPF Duplicado): Sistema exibe alerta do erro e solicita correção.

------------------------------------------------------------------------

## Exercício 9 --- Caso de Uso incompleto

``` text
UC05 — Realizar Empréstimo

Ator: Bibliotecário

1. Bibliotecário informa o aluno.
2. Sistema localiza o aluno.
3. Bibliotecário informa o livro.
4. Sistema registra o empréstimo.
```

Regras:

``` text
RN01 — Alunos com empréstimos vencidos não podem realizar novos empréstimos.
RN02 — Um aluno pode possuir no máximo 5 livros emprestados simultaneamente.
RN03 — Livros indisponíveis não podem ser emprestados.
RN04 — O prazo normal do empréstimo é de 14 dias.
```

Analise se o Caso de Uso respeita as regras, identifique o que falta e
produza uma versão corrigida.

R: 
Não valida o aluno (RN01 e RN02) = Não verifica se o aluno tem empréstimos em atraso ou se já atingiu o limite de 5 livros.
Não valida o livro (RN03) = Não confirma se o exemplar está disponível para empréstimo.
Não define prazos (RN04) = Não calcula nem registra a data limite de devolução de 14 dias.
Omitiu tratamento de erro = Não possui fluxos de exceção para tratar bloqueios ou indisponibilidades.

1. Bibliotecário informa a identificação do aluno.
2. Sistema localiza o aluno e valida que ele não possui débitos/atrasos [RN01] e possui menos de 5 livros emprestados [RN02].
3. Bibliotecário informa o código do livro.
4. Sistema localiza o livro e confirma que está disponível [RN03].
5. Sistema calcula a data de devolução para 14 dias a partir da data atual [RN04] e registra o empréstimo.
6. Sistema exibe a confirmação e o comprovante com a data de devolução.

FE01 — Aluno Impedido: Se o aluno possuir empréstimo vencido [RN01] ou 5 livros emprestados [RN02], o sistema exibe mensagem de bloqueio e cancela a operação.
FE02 — Livro Indisponível: Se o livro estiver emprestado ou reservado [RN03], o sistema exibe alerta e permite informar outro livro ou encerrar.

------------------------------------------------------------------------

# Parte 4 --- Fluxos Alternativos e Exceções

## Exercício 10 --- O happy path não é suficiente

Considere:

``` text
UC — Realizar Compra

1. Cliente seleciona os produtos.
2. Cliente informa os dados de entrega.
3. Sistema calcula o valor.
4. Cliente informa os dados de pagamento.
5. Sistema processa o pagamento.
6. Sistema registra o pedido.
```

Identifique:

-   3 fluxos alternativos;
R: aplicação de cupom de desconto (passo 3), seleção do pagamento via pix/boleto/cartão (passo 4), cliente seleciona um novo endereço cadastrado (passo 2).
-   3 fluxos de exceção;
R: pagamento recusado (passo 5), cep fora da área de entrega (passo 2), produto sem estoque informado na hora de calcular o valor total(passo 3).

Para cada um, indique em qual passo ele ocorre.

------------------------------------------------------------------------

## Exercício 11 --- Fluxo alternativo ou exceção?

Classifique e justifique:

a)  Cliente escolhe PIX em vez de cartão.\
R: fluxo alternativo = trata-se de outra opção válida de pagamento
b)  Cartão é recusado.\
R: fluxo exceção = condição de erro no processamento financeiro que interrompe o happy path, impedindo a finalização direta da compra
c)  Cliente adiciona outro produto.\
R: fluxo alternativo = variação da etapa de montagem do pedido, o usuário alterou o caminho do fluxo para ajustar a compra antes de concluir
d)  Produto fica sem estoque antes da confirmação.\
R: fluxo exceção = impedimento no momento da consolidação que interrompe a conclusão normal da compra
e)  Cliente informa cupom de desconto.\
R: fluxo alternativo = cliente pode optar para aplicar um benefício financeiro e, em seguida, concluir a compra novamente
f)  Cupom está vencido.
R: fluxo exceção = é uma falha de validação da regra de negócio do cupom, impedindo a finalização da compra por essa forma de pagamento

Depois discuta:

> Todas essas situações precisam estar documentadas no mesmo Caso de Uso?

R: Sim, em geral. O Caso de Uso (Realizar Compra) deve conter o fluxo principal (happy path) e listar todos os seus Fluxos Alternativos (ex.: uso de cupom, pagamento por PIX) e Fluxos de Exceção (ex.: cupom vencido, cartão recusado, falta de estoque).

------------------------------------------------------------------------

# Parte 5 --- Testando a qualidade de um Caso de Uso

## Exercício 12 --- Revisão por checklist

Escolha um Caso de Uso da equipe e aplique:

``` text
□ Identificador
□ Nome orientado a objetivo
□ Ator principal
□ Atores secundários
□ Objetivo
□ Gatilho
□ Pré-condições
□ Pós-condições
□ Fluxo principal
□ Fluxos alternativos
□ Exceções
□ Regras relacionadas
□ Requisitos relacionados
□ Resultado esperado
```

Registre:

  Problema   Por que é um problema?   Correção proposta
  ---------- ------------------------ -------------------
                                      
R:
Caso de Uso escolhido: UC-05 — Gerar sugestão personalizada.

| Item | Avaliação |
|---|---|
| Identificador | ✓ UC-05 |
| Nome orientado a objetivo | ✓ Gerar sugestão personalizada |
| Ator principal | ✓ Usuário |
| Atores secundários | ⚠ Não identificados |
| Objetivo | ✓ Definido |
| Gatilho | ⚠ Precisa ser explícito |
| Pré-condições | ✓ Definidas |
| Pós-condições | ⚠ Podem ser detalhadas |
| Fluxo principal | ✓ Definido |
| Fluxos alternativos | ✓ Definidos |
| Exceções | ⚠ Faltam alguns cenários |
| Regras relacionadas | ⚠ Falta relacionar a RN-08 |
| Requisitos relacionados | ✓ Identificados |
| Resultado esperado | ⚠ Precisa ser mais explícito |

| Problema | Por que é um problema? | Correção proposta |
|---|---|---|
| Gatilho pouco explícito | Deixa o início ambíguo. | Informar que o usuário solicita uma sugestão. |
| Dados obrigatórios indefinidos | Pode gerar dúvidas na validação. | Definir os campos obrigatórios. |
| Falhas pouco detalhadas | Pode deixar a operação inconsistente. | Especificar o tratamento de cada falha. |
| Privacidade pouco relacionada | Pode comprometer a proteção dos dados. | Relacionar a RN-08 ao caso de uso. | 

------------------------------------------------------------------------

## Exercício 13 --- Teste das perguntas

Para cada passo do fluxo principal, aplique:

``` text
QUEM?
O QUÊ?
SOBRE O QUÊ?
E SE NÃO DER CERTO?
QUAL REGRA SE APLICA?
O QUE ACONTECE DEPOIS?
```

Identifique quais perguntas revelaram informações ausentes.
R: 

| Passo do fluxo | Informação ausente identificada |
|---|---|
| 1. Solicitar sugestão | Condições exatas para iniciar a operação. |
| 2. Verificar informações | Lista completa dos campos obrigatórios. |
| 3. Identificar contexto | Tratamento de falhas ao recuperar dados. |
| 4. Identificar destinatário | Origem e validação dos dados. |
| 5. Identificar categorias | Critérios de compatibilidade. |
| 6. Selecionar desculpa | O que ocorre se não houver desculpas disponíveis. |
| 7. Gerar sugestão | Tratamento de demora ou falha. |
| 8. Associar ao pedido | Tratamento de falha na associação. |
| 9. Registrar histórico | O que fazer se o registro falhar. |
| 10. Apresentar sugestão | Tratamento de falha na apresentação. |

Quais perguntas revelaram informações ausentes?

- QUEM? — Esclarecer quem executa cada ação.
- O QUÊ? / SOBRE O QUÊ? — Definir dados obrigatórios e critérios.
- E SE NÃO DER CERTO? — Identificar falhas sem tratamento.
- QUAL REGRA SE APLICA? — Relacionar as regras de negócio.
- O QUE ACONTECE DEPOIS? — Esclarecer a sequência após cada etapa.

------------------------------------------------------------------------

# Parte 6 --- Rastreabilidade

## Exercício 14 --- Construa a cadeia

Considere:

``` text
RN07 — Descontos superiores a 15% devem ser autorizados pelo gerente.
```

Construa:

``` text
RN
 ↓
RF
 ↓
UC
 ↓
Fluxo Alternativo
 ↓
Critério de Aceitação
 ↓
Cenário de Teste
```
RN07: Descontos superiores a 15% devem ser autorizados pelo gerente.
 ↓
RF01: o sistema deve solicitar e validar a autorização de um perfil de gerente sempre que o desconto aplicado for superior a 15%
 ↓
UC01: realizar venda (FA01: aplicação de desconto superior a 15%)
1. Atendente solicita desconto de 20% no valor total.
2. Sistema identifica que o desconto excede 15% e solicita aprovação do Gerente [RN07].
3. Gerente informa suas credenciais de autorização.
4. Sistema valida as credenciais, aplica o desconto e retorna ao fluxo principal.
 ↓
CA01 (Critério de Aceitação): Dado que o desconto seja maior que 15%, quando o atendente tentar aplicar, o sistema deve bloquear a confirmação até a inserção de credenciais válidas de gerente.
 ↓
CT01: pedido de R$ 100,00 com desconto de R$ 20,00 (20%); Tenta confirmar a venda sem credenciais de gerente -> resultado esperado é que exiba mensagem de erro da RN07 e impeça até a liberação do gerente

Todos os elementos devem permanecer coerentes com a RN07.

------------------------------------------------------------------------

## Exercício 15 --- Matriz de rastreabilidade

Utilizando o projeto da equipe:

  Regra   Requisito   Caso de Uso   Fluxo/Cenário
  ------- ----------- ------------- ---------------
  RN01    RF??        UC??          ???
  RN02    RF??        UC??          ???

R: 
| Regra | Requisito | Caso de Uso | Fluxo/Cenário |
|---|---|---|---|
| RN-01 | RF-03 | UC-03 | Criar pedido |
| RN-02 | RF-04, RF-06 | UC-04, UC-05 | Informar situação e validar pedido |
| RN-03 | RF-05, RF-06 | UC-05 | Validar dados obrigatórios |
| RN-04 | RF-06 | UC-05 | Gerar sugestão personalizada |
| RN-05 | RF-07 | UC-05 | Selecionar desculpa compatível |
| RN-06 | RF-08 | UC-06 | Solicitar nova sugestão |
| RN-07 | RF-10 | UC-07 | Registrar feedback |
| RN-08 | RNF-01, RNF-02 | UC-02 a UC-07 | Proteger dados do usuário |
| RN-09 | RF-09, RNF-03 | UC-05, UC-06 | Registrar sugestões no histórico |

Depois responda:

-   Existem regras sem requisitos?
R: Não. Todas as regras possuem requisitos relacionados, considerando os requisitos funcionais e não funcionais.
-   Existem requisitos sem Casos de Uso?
R: Sim. O RF-11, que trata da associação de desculpas a categorias, não possui um caso de uso específico claramente identificado.
-   Existem comportamentos sem relação aparente com requisito ou regra?
R: Sim. A privacidade no UC-05 e algumas associações incorretas entre regras e casos de uso precisam ser revisadas.
-   Isso necessariamente representa um erro?
R: Não. Pode ser uma falha de documentação ou um comportamento interno. Porém, funcionalidades importantes precisam estar relacionadas aos requisitos e às regras correspondentes.

------------------------------------------------------------------------

