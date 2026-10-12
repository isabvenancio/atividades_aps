# Requisitos Não Funcionais — VazaApp

## RNF-01 — Exigir autenticação para acesso aos dados do usuário

**Categoria:**  
Segurança.

**Descrição:**  
O sistema deve exigir autenticação para acesso aos dados pessoais, contatos, pedidos e histórico do usuário.

**Justificativa:**  
Garantir que apenas usuários autenticados possam acessar informações privadas armazenadas no sistema.

**Métrica/Critério mensurável:**  
100% das tentativas de acesso às funcionalidades privadas sem autenticação válida devem ser bloqueadas.

**Escopo:**  
Acesso a dados pessoais, perfil de contexto, contatos, pedidos de desculpas e histórico de utilização.

**Prioridade:**  
Crítica.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-02, RF-03, RF-04, RF-05, RF-06, RF-07, RF-08, RF-09, RF-10, RF-11.

**Casos de teste relacionados:**  
A definir.

## RNF-02 — Restringir acesso a dados de outros usuários

**Categoria:**  
Segurança.

**Descrição:**  
O sistema deve impedir que um usuário acesse pedidos, contatos, perfil ou histórico pertencentes a outro usuário.

**Justificativa:**  
Preservar a privacidade e o isolamento das informações entre diferentes usuários da plataforma.

**Métrica/Critério mensurável:**  
100% das tentativas de acesso a recursos pertencentes a outro usuário devem ser negadas nos testes de autorização.

**Escopo:**  
Pedidos de desculpas, contatos, perfil de contexto e histórico de utilização.

**Prioridade:**  
Crítica.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-02, RF-03, RF-10.

**Casos de teste relacionados:**  
A definir.

## RNF-03 — Registrar rastreabilidade das sugestões geradas

**Categoria:**  
Auditoria.

**Descrição:**  
O sistema deve registrar usuário, data, hora e pedido associado para cada sugestão gerada.

**Justificativa:**  
Permitir rastreabilidade das sugestões produzidas e facilitar acompanhamento e auditoria das interações realizadas.

**Métrica/Critério mensurável:**  
100% das sugestões geradas com sucesso devem possuir registro contendo usuário, pedido, data e hora.

**Escopo:**  
Processo de geração de sugestões e histórico de utilização.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-09.

**Casos de teste relacionados:**  
A definir.

## RNF-04 — Tempo de resposta para geração de sugestão

**Categoria:**  
Desempenho.

**Descrição:**  
O sistema deve apresentar uma sugestão de desculpa em até 5 segundos em pelo menos 95% das solicitações, desconsiderando indisponibilidade de serviços externos.

**Justificativa:**  
Garantir boa experiência ao usuário durante a principal funcionalidade do sistema.

**Métrica/Critério mensurável:**  
Pelo menos 95% das solicitações de geração de sugestão devem ser concluídas em até 5 segundos, em condições normais de operação.

**Escopo:**  
Geração de sugestões e solicitação de novas sugestões.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-06, RF-08, RF-09.

**Casos de teste relacionados:**  
A definir.

## RNF-05 — Disponibilidade mínima do sistema

**Categoria:**  
Disponibilidade.

**Descrição:**  
O sistema deve possuir disponibilidade mínima de 99,5% durante o período normal de utilização.

**Justificativa:**  
Garantir que o serviço esteja acessível de forma consistente aos usuários durante o uso esperado.

**Métrica/Critério mensurável:**  
Disponibilidade mínima de 99,5% no período mensal de operação, desconsiderando manutenções programadas.

**Escopo:**  
Todo o sistema.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-01, RF-02, RF-03, RF-04, RF-05, RF-06, RF-07, RF-08, RF-09, RF-10, RF-11.

**Casos de teste relacionados:**  
A definir.

## RNF-06 — Evitar registros parciais ou inconsistentes

**Categoria:**  
Confiabilidade.

**Descrição:**  
Caso ocorra uma falha durante a geração ou registro da sugestão, o sistema não deve armazenar registros parciais ou inconsistentes.

**Justificativa:**  
Preservar a confiabilidade dos dados e evitar incoerências entre sugestões, pedidos e histórico.

**Métrica/Critério mensurável:**  
Em 100% dos testes de falha simulada durante a geração ou registro da sugestão, nenhum dado parcial ou inconsistente deve permanecer armazenado como concluído.

**Escopo:**  
Geração de sugestões e registro no histórico.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-07, RF-09, RF-10.

**Casos de teste relacionados:**  
A definir.

## RNF-07 — Uso restrito das informações pessoais e contextuais

**Categoria:**  
Privacidade.

**Descrição:**  
Informações pessoais e contextuais fornecidas pelo usuário devem ser utilizadas somente para funcionalidades relacionadas ao seu próprio perfil e geração de sugestões.

**Justificativa:**  
Assegurar o uso adequado dos dados pessoais e contextuais fornecidos pelo usuário.

**Métrica/Critério mensurável:**  
100% das funcionalidades que utilizarem dados pessoais e contextuais devem estar relacionadas ao perfil do próprio usuário ou à geração de suas sugestões.

**Escopo:**  
Perfil de contexto, geração de sugestões, contatos e dados pessoais do usuário.

**Prioridade:**  
Alta.

**Status:**  
Proposto.

**Requisitos relacionados:**  
RF-02, RF-06.

**Casos de teste relacionados:**  
A definir.